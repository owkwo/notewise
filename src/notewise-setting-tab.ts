import NotewisePlugin from 'src/notewise-plugin';
import {App, PluginSettingTab, Setting} from "obsidian";

export class NotewiseSettingTab extends PluginSettingTab {
  plugin: NotewisePlugin;

  constructor(app: App, plugin: NotewisePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  async display(): Promise<void> {
    const {containerEl} = this;
    containerEl.empty();

    const createHeader = (text: string, desc?: string) => {
      const header = this.containerEl.createDiv({cls: 'setting-item setting-item-heading'});
      header.createDiv({text, cls: 'setting-item-name'})
      header.ariaLabel = desc ?? null
    };

    const pluginSettings = await this.plugin.loadPluginSettings();

    createHeader('NoteWise', 'Required NoteWise settings');

    new Setting(containerEl)
      .setName('Fuzzy Search')
      .setDesc('If link address searches should be fuzzy or not')
      .addToggle(it => it
        .setValue(this.plugin.loadPluginSettings().basic.fuzzySearch)
        .onChange(async (value: boolean): Promise<void> => {
          pluginSettings.basic.fuzzySearch = value;
          await this.plugin.savePluginSettings();
        }));

    new Setting(containerEl)
      .setName('Always Show Search Modal')
      .setDesc('If queries with 1 or no results should still be presented to the user; if false, first query result is chosen by default')
      .addToggle(it => it
        .setValue(this.plugin.loadPluginSettings().basic.alwaysShowSearchModal)
        .onChange(async (value: boolean): Promise<void> => {
          this.plugin.loadPluginSettings().basic.alwaysShowSearchModal = value;
          await this.plugin.savePluginSettings();
        }));
  }
}
