import {App, LinkCache, MarkdownView, TFile, WorkspaceLeaf} from 'obsidian';
import NotewisePlugin from '../../notewise-plugin';

export default class ExHtmlLink {
  private readonly app: App;
  private readonly plugin: NotewisePlugin;

  constructor(app: App, plugin: NotewisePlugin) {
    this.app = app;
    this.plugin = plugin;
  }

  async registerEditorExtension(): Promise<void> {


  }

  async updateLinks() {
    this.updateVisibleLinks(this.app, this.plugin);

    for (const [_observer, type, ownClass] of this.plugin.observers) {
      const leaves = this.app.workspace.getLeavesOfType(type);

      for (const leaf of leaves) {
        this.plugin.updateContainer(leaf.view.containerEl, ownClass);
      }
    }
  }

  async updateVisibleLinks() {
    const settings = await this.plugin.loadPluginSettings();
    this.app.workspace.iterateRootLeaves((leaf: WorkspaceLeaf) => {
      if (leaf.view instanceof MarkdownView && leaf.view.file) {
        const file: TFile = leaf.view.file;
        const cachedFile = this.app.metadataCache.getFileCache(file);

        /** 20250117: no property pane
        const metadata = leaf.view?.metadataEditor?.contentEl;
        if (metadata) {
          updatePropertiesPane(metadata, file);
        }
        */

        //@ts-ignore
        const tabHeader: HTMLElement = leaf.tabHeaderInnerTitleEl;

        if (settings.enableTabHeader) {
          // Supercharge tab headers
          this.plugin.updateDivExtraAttributes(tabHeader, '', file.path);
        }
        else {
          clearExtraAttributes(tabHeader);
        }

        for (const link of (cachedFile?.links || [])) {
          const fileName = file.path.replace(/(.*).md/, '$1');
          const dest = app.metadataCache.getFirstLinkpathDest(link.link, fileName);

          if (!dest) {
            continue;
          }

          const newAttributes = this.plugin.fetchTargetAttributesSync(dest, false);
          const nodes: NodeListOf<Element> = leaf.view.containerEl.querySelectorAll(`a.internal-link[href="${link.link}"]`)
          const internalLinks: Element[] = Array.from(nodes);

          for (const internalLink of internalLinks) {
            this.plugin.updateLinkAttributes(internalLink, newAttributes);
          }
        }
      }
    })
  }


}
