import { App, Editor, MarkdownView } from "obsidian";
import { GlobalSettings, NoteWisePluginSettings } from "./settings";
import { EditLinkModal } from "./modals/EditLinkModal";
import { getAnyLinkUnderCursor, getSelection, getWordUnderCursor, Link, LinkType, MaybeEditorToken } from "./link";
import { searchNoteModal, searchNoteQuickSwitcher } from "./modals/SearchNoteModal";

export const makeLink = async (
  app: App,
  editor: Editor,
  globalSettings: () => GlobalSettings,
  localSettings: NoteWisePluginSettings,
  checking: boolean
) => {
  const globalLinkType: LinkType = globalSettings().useMarkdownLinks ? 'markdown' : 'wikilink'

  const token: MaybeEditorToken =
    getAnyLinkUnderCursor(editor) ||
    getSelection(editor) ||
    getWordUnderCursor(editor)

  if (!token || !token.range) {
    return false;
  }

  if (!checking) {
    const link = new Link(token.text, globalLinkType)
    link.linkType = globalLinkType; // replace link type

    // searchNoteModal(app, localSettings, link.address, result => {
    searchNoteQuickSwitcher(app, localSettings, link.address, result => {
      if (result) {
        link.address = result;
      }

      // @ts-ignore | Replace token with new link:
      editor.replaceRange(link.text, token.range.from, token.range.to);
    });
  }

  return true;
};

export const editLink = (
  app: App,
  editor: Editor,
  view: MarkdownView,
  localSettings: NoteWisePluginSettings,
  checking: boolean
) => {
  const result = true;

  if (checking) {
    return result;
  }

  const editLinkModal = new EditLinkModal(app, editor, () => { });
  editLinkModal.open();

  return result;
};
