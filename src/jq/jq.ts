import jqdash from "jqdash";

let jqDash = jqdash();

async function execjq(jsonText: string, query: string): Promise<string> {
  if (jqDash === undefined) {
    return "";
  }

  let ret = "";
  await jqDash.then((module: any) => {
    const { jq } = module;
    let rets = jq(jsonText, query, ["-M"]);
    ret = rets.stdout;
    console.log(ret);
  });

  return ret;
}

export default execjq;