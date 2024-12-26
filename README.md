---
tags:
  - type/note
  - locale/en/gb
  - status/wip
aliases:
  - 
created: 2023-11-08T10:44:57+02:00
updated: 2024-03-09T22:13:32+01:00
---
> [!danger] Note to myself: README.md IS A HARD LINK TO AN OBSIDIAN NOTE!
## Description

NoteWise: Aliases and links

## Current Goal

- [x] First step: create new repo from template ✅ 2023-10-30
- [x] Add a link to word, selection or link ✅ 2024-03-09
- [/] Make Link: Search link address, allow user to replace it if there are many matching pages 🛫 2024-03-09

## Features

- [/] Create or Update link
    - [x] Search by title (default) ✅ 2024-03-09
    - [ ] Add command to also search by alias
        - *Create or Update link* (default, search by title); *Update link, search by alias*
        - *Update link by alias* should be shown iff token is a link with alias
        - Use `checking` to make sure only valid commands are presented
    - [x] Should work for plain words ✅ 2024-03-09
    - [x] Should work for a current markdown link as well ✅ 2024-03-09
    - [x] Should work for a current wiki-link as well ✅ 2024-03-09
    - [x] If there is only 1 hit, use it ✅ 2024-03-09
    - [x] If there are more, make user choose ✅ 2024-03-09
    - [x] Same for selection (multiple/partial words) ✅ 2024-03-09
        - [x] Condition: Cannot have line breaks ✅ 2024-03-09
    - [x] Use [[OmniSearch]] if it's available ✅ 2024-03-09
        - [ ] Use default search notewise
        - [ ] Fuzzy search with setting
            - 2024-03-09: currently fuzzy search is always enabled; setting is already available
    - [ ] Add setting to show _Edit link_ dialog before applying changes
- [ ] Remove link
    - 2 commands
        - [ ] _Remove link, keep title_ 
        - [ ] _Remove link, keep alias_
    - Use `checking` to make sure only valid commands are presented
- [/] Edit link
    - [/] Dialog with link text, link address
    - [ ] Toggle between wiki-link and markdown link
    - [ ] Remove link (keep title/alias)
    - [ ] What else...?
- [ ] Find all aliases in use for a page
    - [ ] Option to add all of them to frontmatter 
- [ ] All links in page
    - [ ] See all links in page | all selected links in a dialog
    - [ ] Options to open all links, or open them individually
- [ ] Find broken wiki links/local markdown links
- [ ] Redirect/Alias Notes!
    - [ ] Support pages with only a title, a link, and (maybe) frontmatter
    - [ ] Ideally these pages should *not* be open by default, they should open their target page instead
    - They would work very similarly to [[Logseq]] aliases
    - [ ] Consider creating Alias Notes as a different file type (not .md)
        - That could make it easier to implement the redirect
        - See [MeepTech/obsidian-custom-file-extensions-plugin](https://github.com/MeepTech/obsidian-custom-file-extensions-plugin)
    - [ ] Check impact on other NoteWise proposed features
        - Something similar could be used to *[[#^cache|cache]]* external links! But then they would have content
- [ ] Batch update links with alias
    - [ ] From a note A, user can choose which alias should be used for A, in each note referencing A
        - Batch change all references to A
    - [ ] Also choose a different alias for each link
- [ ] Default alias
    - [ ] Mark one alias as the default on Note A, which will be used whenever a link is created to Note A
        - Might be limited only to NoteWise commands
- [ ] Archive external link(s)
    - See legacy plugin [GitHub - tomzorz/obsidian-link-archive: Link Archive plugin for Obsidian](https://github.com/tomzorz/obsidian-link-archive)
    - [ ] Add commands to
        - [ ] archive 1 link
        - [ ] all links in page
        - [ ] all links in folder
        - [ ] all links in vault
    - Use a smarter method - maybe an internal link ^cache
- 2024-03-01T10:26:40+01:00 
- [ ] VIM Surround support!
    - Can be used WITH or WITHOUT vim bindings
    - Should support everything that vim surround does, including removing surrounds
    - Be aware of Obsidian peculiarities, specially the wiki-link format
    - [!] 2024-03-01T10:25:54+01:00 I don't think this has much to do with [[NoteWise]] though... Should be in a separate plugin

## Similar Plugins

- Check out [Metadata Menu](https://mdelobelle.github.io/metadatamenu/), pay attention about opportunities/feature conflicts
- 

## References
<!-- Links to pages not referenced in the content -->
- 
