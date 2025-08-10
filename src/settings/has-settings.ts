import {ObsidianSettings} from "./obsidian-settings";
import {NotewisePluginSettings} from "./notewise-plugin-settings";

export interface HasSettings {
  get obsidianSettings(): ObsidianSettings

  loadPluginSettings(): Promise<NotewisePluginSettings>
  savePluginSettings(settings: NotewisePluginSettings): Promise<void>
}
