import { Plugin } from 'obsidian';
/** @typedef {import().'obsidian'.Vault} Vault */

/* eslint-disable @typescript-eslint/no-explicit-any */

// Dataview provides their own API interface; let's just keep case consistent
import {DataviewApi as DataviewAPI, getAPI as getDataviewAPI} from 'obsidian-dataview';

// Plugin API /////////////////////////////////////////////////////////////////

// Stub interface, will provide a real one later
export interface NotewiseAPI {
  // No API for now, just a placeholder dummy method
  dummy(): void;
}

// Simple interface exposing the most common methods. Version 1.11.5
export interface QuickAddAPIv1_11_5 {
  inputPrompt(header: string, placeholder?: string, value?: string): Promise<string>;
  wideInputPrompt(header: string, placeholder?: string, value?: string): Promise<string>;
  yesNoPrompt(header: string, text?: string): Promise<boolean>;
  infoDialog(header: string, text: string[] | string): Promise<void>;
  suggester(displayItems: | string[] | ((value: string, index?: number, arr?: string[]) => string[]), actualItems: string[]): Promise<string>;
  checkboxPrompt(items: string[], selectedItems?: string[]): Promise<string[]>;
  executeChoice(choiceName: string, variables?: Record<string, unknown>): Promise<void>;
  format(input: string, variables?: { [key: string]: unknown }, shouldClearVariables?: boolean): Promise<string>;
}

interface KnownPluginAPI {
  dataview: DataviewAPI;
  notewise: NotewiseAPI;
  quickAdd: QuickAddAPIv1_11_5;
}

type KnownPluginKey = keyof KnownPluginAPI;
type KnownAPI = KnownPluginAPI[KnownPluginKey];

// Config /////////////////////////////////////////////////////////////////////

export interface KnownConfig {
    useMarkdownLinks: boolean;
}

export type KnownConfigKey = keyof KnownConfig;

// PluginDecorator ////////////////////////////////////////////////////////////

export class PluginDecorator {
  private _plugin: Plugin;

  constructor(plugin: Plugin) {
    this._plugin = plugin;
  }

  /**
   * Statically typed version of hidden method `getConfig` in {@link Vault}
   * @param key
   */
  configuration<K extends KnownConfigKey>(key: K): KnownConfig[K] {
    return (this._plugin.app.vault as any).getConfig(key) as KnownConfig[K];
  }

  private plugin(key: KnownPluginKey): any {
    return (this._plugin as any).plugins.plugins[key];
  }

  api<T extends KnownAPI, K extends KnownPluginKey & keyof T>(key: K): T[K] {
    switch (key) {
      case 'dataview':
        return getDataviewAPI(this._plugin.app);
      default:
        return this.plugin(key).api as T[K];
    }
  }
}

declare module "obsidian" {
  interface Plugin {
    nw(): PluginDecorator;
  }
}

Plugin.prototype.nw = function (this: Plugin): PluginDecorator {
  return new PluginDecorator(this);
};
