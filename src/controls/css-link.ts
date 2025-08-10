export type MatchTypes = 'exact' | 'contains' | 'startswith' | 'endswith' | 'whiteSpace';
export type SelectorTypes = 'attribute' | 'tag' | 'path';

export interface CSSLink {
    type: SelectorTypes
    name: string
    value: string
    matchCaseSensitive: boolean
    match: MatchTypes
    uid: string
    selectText: boolean
    selectBackground: boolean
    selectAppend: boolean
    selectPrepend: boolean
}

export const matchTypes: Record<MatchTypes, string> = {
    exact: 'Exact match',
    contains: 'Contains value',
    whiteSpace: 'Value within whitespace separated words',
    startswith: 'Starts with this value',
    endswith: 'Ends with this value'
}

export const matchSign: Record<MatchTypes, string> = {
    exact: '',
    contains: '*',
    startswith: '^',
    endswith: '$',
    whiteSpace: '~'
}

export const matchPreview: Record<MatchTypes, string> = {
    exact: 'with value',
    contains: 'containing',
    whiteSpace: 'containing',
    startswith: 'starting with',
    endswith: 'ending with'
}

export const matchPreviewPath: Record<MatchTypes, string> = {
    exact: 'is',
    contains: 'contains',
    whiteSpace: 'contains',
    startswith: 'starts with',
    endswith: 'ends with'
}

export const selectorType: Record<SelectorTypes, string> = {
    attribute: 'Attribute value',
    tag: 'Tag',
    path: 'Note path'
}

// Return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa':
const uid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const newCSSLink: CSSLink  = {
  type: 'attribute',
  name: '',
  value: '',
  matchCaseSensitive: false,
  match: 'exact',
  uid: uid(),
  selectText: true,
  selectAppend: true,
  selectPrepend: true,
  selectBackground: true,
}
