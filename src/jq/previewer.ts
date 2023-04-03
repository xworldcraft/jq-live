import { Uri, QuickPickItem, window, ViewColumn, workspace } from "vscode";
import pickFilter from "./filter";

const showPreview = (
  queries: WeakMap<Uri, string>,
  histories: WeakMap<Uri, QuickPickItem[]>
) => async (uri: Uri) => {
  if (!window.activeTextEditor) {
    return;
  }


  const { document } = window.activeTextEditor;
  const { languageId, uri: documentUri } = document;

  if (languageId !== "json") {
    return;
  }

  const cmd = await pickFilter(documentUri, histories);
};

export default showPreview;
