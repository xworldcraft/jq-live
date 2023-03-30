import { QuickPickItem, Uri, ViewColumn, window, workspace } from "vscode";
import execjq from "./jq";

const initialChoices = ["."];
const generateItems = () => initialChoices.map((label) => ({ label }));

// QuickPick with history suggestion inspired by this issue: https://github.com/microsoft/vscode/issues/426
//  e.g.: https://github.com/ldd/vscode-jq/blob/cc4933bc4d3cd7ba5a92a72d0f18322a90227939/src/commands/showPreview.ts#L7 and
//        https://github.com/Microsoft/vscode-extension-samples/blob/main/quickinput-sample/src/quickOpen.ts
async function pickFilter(uri: Uri, histories: WeakMap<Uri, QuickPickItem[]>) {
  try {
    return await new Promise<string>((resolve, reject) => {

      const quickPick = window.createQuickPick();
      quickPick.placeholder = "Type a new command or select from history";
      // initial quickpick with histories items
      quickPick.items = histories.get(uri) ?? generateItems();

      let label = "";
      quickPick.onDidChangeValue(async (val) => {
        if (val) {
          label = val;

          const doc = await workspace.openTextDocument(uri);
          const ret = await execjq(doc.getText(), val);

          // encode result
          const encodedRet = Buffer.from(ret).toString("base64");

          // show content
          let nuri = Uri.parse(`jq:result.json`);

          // pass result to provicer
          nuri = nuri.with({query: encodedRet});
          console.log(nuri);
          
          const ndoc = await workspace.openTextDocument(nuri);
          await window.showTextDocument(ndoc, {
            preserveFocus: true,
            preview: true,
            viewColumn: ViewColumn.Beside,
          });
        }
      });
      quickPick.onDidAccept(() => {
        // if the user selects a no empty new command, add it to hsitories map
        const { selectedItems } = quickPick;
        if (label !== "") {
          const nHistories = [...quickPick.items];
          if (quickPick.selectedItems.length < 1) {
            nHistories.push({label});
          }
          histories.set(uri, nHistories);
        }

        resolve(selectedItems[0]?.label ?? label);
        quickPick.dispose();
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    });
  } finally {
    // probably reset history for current uri here if do not want to keep it
  } 
}

export default pickFilter;