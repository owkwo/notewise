import {Editor, getAllTags, getLinkpath, MarkdownView, Plugin, TFile} from 'obsidian';
import {NotewiseSettingTab} from './notewise-setting-tab';
import {editLink, makeLink} from './commands';
import {ObsidianSettings} from './settings/obsidian-settings';
import {HasSettings} from './settings/has-settings';
import {DEFAULT_SETTINGS, NotewisePluginSettings} from './settings/notewise-plugin-settings';

// REMEMBER to run during development: npm run dev

interface DataViewApi {
  page(path: string): Record<string, string>
}

export default class NotewisePlugin extends Plugin implements HasSettings {
  private _settings: NotewisePluginSettings;
  private _observers: [MutationObserver, string, string][];
  private _modalObservers: MutationObserver[] = [];

  get observers(): [MutationObserver, string, string][] {
    return this._observers;
  }

  onload = async () => {
    await this.loadPluginSettings();

    /**
    // 2025-01-16: Maybe useful later
    // // This creates an icon in the left ribbon.
    // const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
    //   // Called when the user clicks the icon.
    //   new Notice('This is a notice!');
    // });
    //
    // // Perform additional things with the ribbon
    // ribbonIconEl.addClass('my-plugin-ribbon-class');
    //
    // // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    // const statusBarItemEl = this.addStatusBarItem();
    // statusBarItemEl.setText('Status Bar Text');
      */

    this.addCommand({
      id: 'notewise-make-link',
      name: 'Make link: Turn selection / word at cursor into a link, or edit link at cursor',
      // @ts-ignore
      editorCheckCallback: async (checking: boolean, editor: Editor, _view: MarkdownView) =>
        await makeLink(this.app, editor, this.obsidianSettings, this._settings, checking)
    });

    this.addCommand({
      id: 'notewise-edit-link',
      name: 'Edit link modal',
      editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) =>
        editLink(this.app, editor, view, this._settings, checking)
    });

    this.addCommand({
      id: 'notewise-dwim',
      name: 'Edit link modal',
      editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) =>
        editLink(this.app, editor, view, this._settings, checking)
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new NotewiseSettingTab(this.app, this));

    /**
    // 2025-01-16: Maybe useful later
    // // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // // Using this function will automatically remove the event listener when this plugin is disabled.
    // this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
    //   console.log('click', evt);
    // });

    // 2025-01-16: Maybe useful later
    // // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    // this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
      */


  }

  onunload = () => {
    // TODO
  }

  get obsidianSettings(): ObsidianSettings {
    // @ts-ignore
    const userMarkdownLinks = this.app.vault.getConfig('useMarkdownLinks') as boolean

    return {
      useMarkdownLinks: userMarkdownLinks
    }
  }

  loadPluginSettings = async (): Promise<NotewisePluginSettings> => {
    return this._settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  savePluginSettings = async (settings: NotewisePluginSettings) => {
    this._settings = settings
    await this.saveData(this._settings);
  }

  updateContainer(container: HTMLElement, selector: string) {
    // if (!plugin.settings.enableBacklinks && container.getAttribute('data-type') !== 'file-explorer') return;
    // if (!plugin.settings.enableFileList && container.getAttribute('data-type') === 'file-explorer') return;
    const nodes = container.findAll(selector);
    for (const item of nodes) {
      this.updateDivExtraAttributes(item as HTMLElement, '');
    }
  }

  updateDivExtraAttributes(link: HTMLElement, destName: string, linkName?: string) {
    if (link.parentElement?.getAttribute('class')?.contains('mod-collapsible')) return; // Bookmarks Folder

    if (!linkName) {
      linkName = link.textContent || '';
    }

    if (link.parentElement?.getAttribute('data-path')) {
      // File Browser
      linkName = link.parentElement.getAttribute('data-path') || '';
    } else if (link.parentElement?.getAttribute('class') == 'suggestion-content' && !!link.nextElementSibling) {
      // Auto complete
      linkName = link.nextElementSibling.textContent + linkName;
    }

    const dest = this.app.metadataCache.getFirstLinkpathDest(getLinkpath(linkName), destName)

    if (dest) {
      const newAttributes = this.fetchTargetAttributesSync(dest, true);
      this.updateLinkAttributes(link, newAttributes);
    }
  }

  fetchTargetAttributesSync(dest: TFile, addDataHref: boolean): Record<string, string> {
    const newAttributes: Record<string, string> = { tags: '' }
    const cache = this.app.metadataCache.getFileCache(dest)

    if (!cache || !cache.frontmatter) {
      return newAttributes;
    }

    for (const attribute of this._settings.supercharged.targetAttributes) {
      if (!Object.keys(cache.frontmatter).includes(attribute)) {
        continue;
      }

      if (attribute === 'tag' || attribute === 'tags') {
        newAttributes['tags'] += (cache.frontmatter)[attribute];
      } else {
        newAttributes[attribute] = (cache.frontmatter)[attribute]
      }
    }

    if (this._settings.supercharged.targetTags) {
      newAttributes['tags'] += getAllTags(cache)?.join(' ');
    }

    if (addDataHref) {
      newAttributes['data-href'] = dest.basename;
    }

    newAttributes['path'] = dest.path;

    if (!(this._settings.supercharged.getFromInlineField && this.app.plugins.enabledPlugins.has('dataview'))) {
      return newAttributes;
    }

    // @ts-ignore
    this.getResults( this.app['plugins']?.plugins?.dataview?.api as DataViewApi | undefined );

    return newAttributes
  }

  private getResults = (api?: DataViewApi, eventCall: boolean = false) => {

    if (!api) {

      if (eventCall) {
        console.log('obsidian-notewise: Could not access DataView API');
      } else {
        this.registerEvent( this.app.metadataCache.on('dataview:api-ready',
          (api: DataViewApi) => this.getResults(api, true)) );
      }

      return;
    }

    const page = api.page(dest.path);

    if (!page) {
      return;
    }

    for (const field of this._settings.targetAttributes) {
      const value = page[field];

      if (value) {
        newAttributes[field] = value;
      }
    }
  }

  // SuperchargedLinks: setLinkNewProps
  updateLinkAttributes(link: Element, newAttributes: Record<string, string>) {
    for (const a of Array.from(link.attributes)) {
      if (a.name.includes('data-link') && !(a.name in newAttributes)) {
        link.removeAttribute(a.name);
      }
    }

    for (const key of Object.keys(newAttributes)) {
      const name = 'data-link-' + key;
      const newValue = newAttributes[key];
      const curValue = link.getAttribute(name);

      if (!newValue || curValue != newValue) {
        const isUri = this.isUri(newAttributes, key);

        link.setAttribute('data-link-' + key, newAttributes[key]);
        (link as HTMLElement)?.style.setProperty(
          `--data-link-${key}`,
          isUri ? `url(${newAttributes[key]})` : newAttributes[key]);
      }
    }

    this.addMissingClasses(link, ['data-link-icon', 'data-link-icon-after', 'data-link-text']);
  }

  private addMissingClasses(link: Element, classes: string[]) {
    for (const clazz of classes) {
      if (!link.hasClass(clazz)) {
        link.addClass(clazz);
      }
    }
  }
  private isUri = (newAttributes: Record<string, string>, key: string): boolean =>
     newAttributes[key]?.startsWith('http') || newAttributes[key]?.startsWith('data:') || false
}
