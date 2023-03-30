import { CancellationToken, EventEmitter, ProviderResult, TextDocumentContentProvider, Uri } from "vscode";

// register a provider on workspace
export class JQProvider implements TextDocumentContentProvider {
  
  public onDidChangeEmitter = new EventEmitter<Uri>();
  public onDidChange = this.onDidChangeEmitter.event;

  provideTextDocumentContent(uri: Uri): string {
    return Buffer.from(uri.query, "base64").toString("utf-8");
  }

}