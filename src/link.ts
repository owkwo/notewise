import { Editor, EditorPosition, EditorRange } from "obsidian";

export type LinkType = 'wikilink' | 'markdown';
export const WIKILINK_REGEX = /\[\[(?<address>[^\]|]+)(?:\|(?<alias>[^\]|]*))?\]\]/gu;
export const MARKDOWN_LINK_REGEX = /\[(?<alias>[^\]]+)\]\((?<address>[^)]+)\)/gu;

// token = word or link
export interface EditorToken {
  text: string,
  range?: EditorRange
}

export type MaybeEditorToken = EditorToken | undefined
const EMPTY_EDITOR_TOKEN: MaybeEditorToken = undefined

export class Link {
  _linkType?: LinkType;
  _alias: string;
  _address: string;

  constructor(text: string, defaultLinkType: LinkType) {
    const setLink = (regex: RegExp, linkType: LinkType) => {
      regex.lastIndex = 0
      console.log('text', text)

      try {
        const regexResult: any = regex.exec(text)

        const alias = regexResult.groups['alias']
        const address = regexResult.groups['address']

        console.log('alias', alias)
        console.log('address', address)

        this._linkType = linkType;
        this._alias = alias && alias != address ? alias : ''
        this._address = address

      } finally {
        regex.lastIndex = 0
      }
    }

    if (WIKILINK_REGEX.test(text)) {
      setLink(WIKILINK_REGEX, 'wikilink')

    } else if (MARKDOWN_LINK_REGEX.test(text)) {
      setLink(MARKDOWN_LINK_REGEX, 'markdown')

    } else {
      this._linkType = defaultLinkType
      this._alias = '';
      this._address = text;
    }
  }

  get linkType(): LinkType | undefined {
    return this._linkType;
  }

  set linkType(linkType: LinkType | undefined) {
    this._linkType = linkType;
  }

  get alias(): string {
    return this._alias;
  }

  set alias(alias: string) {
    this._alias = alias;
  }

  get address(): string {
    return this._address;
  }

  set address(address: string) {
    if (this._alias === '') {
      this._alias = this._address;
    }

    this._address = address;

    if (this._alias === this._address) {
      this._alias = '';
    }
  }

  get text(): string {
    return this._linkType === 'wikilink'
      ? this._alias
        ? `[[${this._address}|${this._alias}]]`
        : `[[${this._address}]]`
      : this._linkType === 'markdown'
        ? this._alias
          ? `[${this._alias}](${this._address})`
          : `[${this._address}](${this._address})`
        : '';
  }
}

export const getAnyLinkUnderCursor = (editor: Editor): MaybeEditorToken =>
  getLinkUnderCursor(editor, 'wikilink') ||
  getLinkUnderCursor(editor, 'markdown')

export const getLinkUnderCursor = (editor: Editor, linkType: LinkType): MaybeEditorToken => {
  const head: EditorPosition = editor.getCursor('head')

  const currentLine = editor.getLine(head.line);
  const regex = linkType == 'wikilink' ? WIKILINK_REGEX : MARKDOWN_LINK_REGEX;
  const allMatches = currentLine.matchAll(regex);

  try {
    for (const thisMatch of allMatches) {
      const start = thisMatch.index ?? -1;
      const end = start + thisMatch[0].length

      if (start <= head.ch && head.ch <= end) {
        return {
          text: thisMatch[0],
          range: {
            from: {
              line: head.line,
              ch: start
            },
            to: {
              line: head.line,
              ch: end
            }
          }
        };
      }
    }
  } finally {
    regex.lastIndex = 0;
  }

  return EMPTY_EDITOR_TOKEN;
}

export const getSelection = (editor: Editor): MaybeEditorToken => {
  if (!editor.somethingSelected()) {
    return EMPTY_EDITOR_TOKEN;
  }

  const text = editor.getSelection();
  const from = editor.getCursor('from');
  const to = editor.getCursor('to');

  return {
    text: text,
    // Note; A multiline range is invalid
    range: from.line == to.line ? {
      from: from,
      to: to
    } : undefined
  };
}

export const getWordUnderCursor = (editor: Editor): MaybeEditorToken => {
  const head: EditorPosition = editor.getCursor('head');
  const wordRange = editor.wordAt(head);

  if (!wordRange) {
    return EMPTY_EDITOR_TOKEN;
  }

  const text = editor.getRange(wordRange.from, wordRange.to);
  return {
    text: text,
    range: wordRange
  };
}
