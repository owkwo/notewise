import * as sls from "./supercharged-link-settings";

export interface NotewisePluginSettings {
  basic: {
    fuzzySearch: boolean,
    alwaysShowSearchModal: boolean
  },
  supercharged: sls.SuperchargedLinksSettings
}

export const DEFAULT_SETTINGS: NotewisePluginSettings = {
  basic: {
    fuzzySearch: true,
    alwaysShowSearchModal: false
  },
  supercharged: sls.DEFAULT_SETTINGS
};
