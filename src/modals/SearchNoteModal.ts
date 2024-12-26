import { App, FuzzySuggestModal } from "obsidian";
import { NoteWisePluginSettings } from "../settings";

export interface SelectorListItem {
  name: string,
  path: string
}

export type MaybeSearchResult = string | undefined;
export type OnSearchSubmit = (result: MaybeSearchResult) => void;
export class SearchNoteModal extends FuzzySuggestModal<SelectorListItem> {
  private items: SelectorListItem[];
  private result: MaybeSearchResult;
  private onSubmit: OnSearchSubmit;

  constructor(app: App, items: SelectorListItem[], onSubmit: OnSearchSubmit) {
    super(app);

    this.items = items;
    this.onSubmit = onSubmit;
  }

  getItems = (): SelectorListItem[] => this.items;

  getItemText = (item: SelectorListItem): string => item.name

  onChooseItem = (item: SelectorListItem, _: MouseEvent | KeyboardEvent | undefined): void => {
    if (`${item.name}.md` === item.path) {
      this.result = item.name;
    } else {
      this.result = item.path;
    }

    this.onSubmit(this.result)
  }
}

export const obsidianSearch = async (app: App, localSettings: NoteWisePluginSettings, query: string) => {

  // Perform the search
  (app as any).internalPlugins.plugins['global-search'].instance.openGlobalSearch(query)
  const searchLeaf = app.workspace.getLeavesOfType('search')[0]
  const search = await searchLeaf.open(searchLeaf.view)
  const rawSearchResult = await new Promise(resolve => setTimeout(() => {
    resolve(search.dom.resultDomLookup)
  }, 300)) // the delay here was specified in 'obsidian-text-expand' plugin; I assume they had a reason

  const files = Array.from(rawSearchResult.keys())

  console.log(files.map(x => x.path))

}

export const searchNoteModal = async (app: App, localSettings: NoteWisePluginSettings, query: string, onSubmit: OnSearchSubmit) => {
  // TODO: hard dependency on omnisearch; should fallback to quickswitch if not available
  const omnisearch = await (app as any).plugins.getPlugin('omnisearch');
  console.log('query', query);
  const searchResult = await omnisearch.api.search('');
  console.log('searchResult', searchResult);
  console.log('hey');

  const selectorListItems: SelectorListItem[] = searchResult
    .map((it: { basename: string, score: number, path: string }) => <SelectorListItem>{
      name: it.basename,
      path: it.path
    });

  const searchNoteModal = new SearchNoteModal(app, selectorListItems, onSubmit);

  if (!localSettings.basic.alwaysShowSearchModal && selectorListItems.length <= 1) {
    searchNoteModal.onChooseItem(selectorListItems[0], undefined);
  } else {
    searchNoteModal.open();
  }
}

export const searchNoteQuickSwitcher = async (app: App, localSettings: NoteWisePluginSettings, query: string, onSubmit: OnSearchSubmit) => {
  const _app = app as any;

  const quickSwitcher = await _app.internalPlugins.getPluginById('switcher');
  console.log('quickSwitcher', quickSwitcher);

  if (quickSwitcher) {
    // Open the Quick Switcher
    _app.commands.executeCommandById('switcher:open');

    // Wait for the modal to load and set the query
    setTimeout(() => {
      const modal = _app.workspace.activeModal;
      if (modal && modal.inputEl) {
        modal.inputEl.value = query;
        modal.inputEl.dispatchEvent(new Event('input')); // Trigger search update
      }
    }, 50);

    // Listen for the active leaf change to detect the selected note
    const listener = _app.workspace.on('active-leaf-change', (leaf: any): void => {
      if (leaf.view.file) {
        const result = leaf.view.file.path;

        // Clean up the listener
        _app.workspace.offref(listener);

        onSubmit(result);
      }
    });
  } else {
    console.error('Quick Switcher plugin is not enabled.');
  }
}
