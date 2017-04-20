'use strict';

//
// Memo:
//   open `about:config` and set the `extensions.VimFx.config_file_directory`
//   option to `~/.config/vimfx`.
//

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

//
//
//

vimfx.set('prevent_autofocus', true);

//
// Map:
//

vimfx.set('mode.normal.tab_select_previous', 'gT <Left>');
vimfx.set('mode.normal.tab_select_next', 'gt <Right>');
vimfx.set('mode.normal.tab_close', 'd');
vimfx.set('mode.normal.tab_restore', 'u');
vimfx.set('mode.normal.scroll_half_page_down', '<C-d>');
vimfx.set('mode.normal.scroll_half_page_up', '<C-u>');
vimfx.set('mode.normal.scroll_page_down', '<Space> <C-f>');
vimfx.set('mode.normal.scroll_page_up', '<S-Space> <C-b>');
vimfx.set('mode.hints.exit', '<Escape> <C-[> <Space> <C-c>');

//
// CSS:
//

const css_prefix = `data:text/css,@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);`;
const css_body = `
@-moz-document url('chrome://browser/content/browser.xul') {
  #VimFxMarkersContainer .marker {
    padding: 3px !important;
    font-size: 20px !important;
    font-family: 'Consolas', 'Ubuntu Mono', 'Inconsolata', 'sans-serif' !important;
    text-transform: lowercase !important;
    border-radius: 4px !important;
    opacity: 0.8 !important;
  }
}
`;
const css = css_prefix + encodeURIComponent(css_body);

const sss = Cc['@mozilla.org/content/style-sheet-service;1']
              .getService(Ci.nsIStyleSheetService);
const ios = Cc['@mozilla.org/network/io-service;1']
              .getService(Ci.nsIIOService);
const uri = ios.newURI(css, null, null);

if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
  sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
  vimfx.on('shutdown', () => {
    sss.unregisterSheet(uri, sss.USER_SHEET);
  });
}

//
//
//

console.log('vimfx: loaded config.js');

// (EOF)
