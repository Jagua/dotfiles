'use strict';

//
// Memo:
//   open `about:config` and set the `extensions.VimFx.config_file_directory`
//   option to `~/.config/vimfx`.
//
/* global Components */
const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

/* global __dirname */
const {localConfig} = Cu.import(`${__dirname}/local.js`, {});
localConfig(vimfx);

//
//
//

vimfx.set('prevent_autofocus', true);

//
// Map: {{{
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

// kill map.
// see https://github.com/akhodakivskiy/VimFx/raw/master/extension/lib/defaults.coffee

vimfx.set('mode.normal.paste_and_go', ''); // 'p'
vimfx.set('mode.normal.find_next', ''); // 'n'
vimfx.set('mode.normal.scroll_left', ''); // 'h'
vimfx.set('mode.normal.scroll_right', ''); // 'l'
vimfx.set('mode.normal.mark_scroll_position', ''); // 'm'
vimfx.set('mode.normal.history_back', ''); // 'H'
vimfx.set('mode.normal.history_forward', ''); // 'L'
vimfx.set('mode.normal.stop', ''); // 's'
vimfx.set('mode.normal.window_new', ''); // 's'
//}}}

// custom command:

const {commands} = vimfx.modes.normal;

// common {{{

vimfx.addCommand({
    name: 'restart',
    description: 'Restart Firefox'
  }, () => {
    const canceled = Cc['@mozilla.org/supports-PRBool;1']
    .createInstance(Ci.nsISupportsPRBool);

    /* global Services */
    Services.obs.notifyObservers(canceled, 'quit-application-requested', 'restart');

    if (canceled.data) return false; // somebody canceled our quit request

    // restart
    Cc['@mozilla.org/toolkit/app-startup;1'].getService(Ci.nsIAppStartup)
    .quit(Ci.nsIAppStartup.eAttemptQuit | Ci.nsIAppStartup.eRestart);

    return true;
});
vimfx.set('custom.mode.normal.restart', ',res');

vimfx.addCommand({
    name: 'search_tabs',
    description: 'Search tabs',
    category: 'tabs',
    order: commands.focus_location_bar.order + 1,
  }, (args) => {
    const {vim} = args;
    const {gURLBar} = vim.window;
    // gURLBar.value = '' + commands.focus_location_bar.run(args);
    // Change the `*` on the text line to a `%` to search tabs instead of bookmarks.
    gURLBar.value = '% ';
    gURLBar.onInput(new vim.window.KeyboardEvent('input'));
});
vimfx.set('custom.mode.normal.search_tabs', ',b');

//
//
//

vimfx.addCommand({
    name: 'goto_config',
    description: 'Config',
  }, ({vim}) => {
    vim.window.switchToTabHavingURI('about:config', true);
});
vimfx.set('custom.mode.normal.goto_config', ',c');

vimfx.addCommand({
    name: 'goto_downloads',
    description: 'Downloads',
  }, (args) => {
    const {vim} = args;
    vim.window.gBrowser.selectedTab = vim.window.gBrowser.addTab('about:downloads');
});
vimfx.set('custom.mode.normal.goto_downloads', ',dl');
//}}}

//
// Tree Style Tab {{{
//

function tst_getRootTab(vim) {
  return vim.window.TreeStyleTabService.getRootTab(vim.window.gBrowser.selectedTab);
}

function tabOpen(args, prefix) {
    const {vim} = args;
    const {gURLBar} = vim.window;
    vim.window.TreeStyleTabService.readyToOpenChildTab(vim.window.gBrowser.selectedTab, false);
    vim.window.switchToTabHavingURI('about:blank', true);
    gURLBar.value = `${prefix} `;
    gURLBar.onInput(new vim.window.KeyboardEvent('input'));
}

vimfx.addCommand({
    name: 'search_mdn',
    description: 'Search MDN',
    category: 'tabs',
    order: commands.focus_location_bar.order + 1,
  }, (args) => {
    tabOpen(args, 'mdn');
});
vimfx.set('custom.mode.normal.search_mdn', ',m');

vimfx.addCommand({
    name: 'search_google',
    description: 'Search google',
    category: 'tabs',
    order: commands.focus_location_bar.order + 1,
  }, (args) => {
    const {vim} = args;
    const {gURLBar} = vim.window;
    vim.window.TreeStyleTabService.readyToOpenChildTab(vim.window.gBrowser.selectedTab, false);
    vim.window.switchToTabHavingURI('about:blank', true);
    gURLBar.value = 'google ';
    gURLBar.onInput(new vim.window.KeyboardEvent('input'));
});
vimfx.set('custom.mode.normal.search_google', ',g');

vimfx.addCommand({
    name: 'tabopen_next_sibling',
    description: 'tabopen_next_sibling',
  }, (args) => {
    const {vim} = args;
    vim.window.TreeStyleTabService.readyToOpenNextSiblingTab(vim.window.gBrowser.selectedTab, false);
    vim.window.switchToTabHavingURI('about:blank', true);
});
vimfx.set('custom.mode.normal.tabopen_next_sibling', ',t');

vimfx.addCommand({
    name: 'tabopen_child',
    description: 'tabopen_child',
  }, (args) => {
    const {vim} = args;
    vim.window.TreeStyleTabService.readyToOpenChildTab(vim.window.gBrowser.selectedTab, false);
    vim.window.switchToTabHavingURI('about:blank', true);
});
vimfx.set('custom.mode.normal.tabopen_child', ',,t');

vimfx.addCommand({
    name: 'tst_collapse',
    description: 'tst_collapse',
  }, (args) => {
    const {vim} = args;
    vim.window.gBrowser.treeStyleTab.collapseExpandSubtree(tst_getRootTab(vim), true);
});
vimfx.set('custom.mode.normal.tst_collapse', 'zc');

vimfx.addCommand({
    name: 'tst_expand',
    description: 'tst_expand',
  }, (args) => {
    const {vim} = args;
    vim.window.gBrowser.treeStyleTab.collapseExpandSubtree(tst_getRootTab(vim), false);
});
vimfx.set('custom.mode.normal.tst_expand', 'zo');

vimfx.addCommand({
    name: 'tst_next_sibling_tab',
    description: 'tst_next_sibling_tab',
  }, (args) => {
    const {vim} = args;
    vim.window.gBrowser.selectedTab = vim.window.TreeStyleTabService.getNextSiblingTab(vim.window.gBrowser.selectedTab);
});
vimfx.set('custom.mode.normal.tst_next_sibling_tab', 'gsn');

vimfx.addCommand({
    name: 'tst_previous_sibling_tab',
    description: 'tst_previous_sibling_tab',
  }, (args) => {
    const {vim} = args;
    vim.window.gBrowser.selectedTab = vim.window.TreeStyleTabService.getPreviousSiblingTab(vim.window.gBrowser.selectedTab);
});
vimfx.set('custom.mode.normal.tst_previous_sibling_tab', 'gsp');

vimfx.addCommand({
    name: 'tst_first_child_tab',
    description: 'tst_first_child_tab',
  }, (args) => {
    const {vim} = args;
    vim.window.gBrowser.selectedTab = vim.window.TreeStyleTabService.getFirstChildTab(vim.window.gBrowser.selectedTab);
});
vimfx.set('custom.mode.normal.tst_first_child_tab', 'gsf');

vimfx.addCommand({
    name: 'tst_last_child_tab',
    description: 'tst_last_child_tab',
  }, (args) => {
    const {vim} = args;
    vim.window.gBrowser.selectedTab = vim.window.TreeStyleTabService.getLastChildTab(vim.window.gBrowser.selectedTab);
});
vimfx.set('custom.mode.normal.tst_last_child_tab', 'gsl');
//}}}

//
// Video {{{
//

//
// HTML5 Video / YouTube / Niconico
//

// utils

function getHost(vim) {
  return vim.window.gBrowser.selectedBrowser.currentURI.host;
}

function isHTML5VideoWebSite(vim) {
  const host = getHost(vim);
  switch (host) {
    case 'www.youtube.com':
    case 'www.nicovideo.jp':
    case 'vimeo.com':
      return true;
    default:
      return false;
  }
}

function isYoutube(vim) {
  return getHost(vim) === 'www.youtube.com';
}

//
// YouTube
//

vimfx.addCommand({
    name: 'key_p',
    description: 'prev',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_toggle_play');
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_toggle_play');
    } else if (getHost(vim) === 'www.slideshare.net') {
      vimfx.send(vim, 'slideshare_prev_slide');
    } else if (getHost(vim) === 'speakerdeck.com') {
      vimfx.send(vim, 'speakerdeck_prev_slide');
    } else {
      commands.paste_and_go.run(args);
    }
});
vimfx.set('custom.mode.normal.key_p', 'p');

vimfx.addCommand({
    name: 'key_n',
    description: 'next',
  }, (args) => {
    const {vim} = args;
    if (getHost(vim) === 'www.slideshare.net') {
      vimfx.send(vim, 'slideshare_next_slide');
    } else if (getHost(vim) === 'speakerdeck.com') {
      vimfx.send(vim, 'speakerdeck_next_slide');
    } else {
      commands.find_next.run(args);
    }
});
vimfx.set('custom.mode.normal.key_n', 'n');

vimfx.addCommand({
    name: 'key_s_up',
    description: 'HTML5 Video Volume Up',
  }, ({vim}) => {
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_volumeUpDown', 3);
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_volumeUpDown', 3);
    }
});
vimfx.set('custom.mode.normal.key_s_up', '<S-Up>');

vimfx.addCommand({
    name: 'key_s_down',
    description: 'HTML5 Video Volume Down',
  }, ({vim}) => {
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_volumeUpDown', -3);
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_volumeUpDown', -3);
    }
});
vimfx.set('custom.mode.normal.key_s_down', '<S-Down>');

vimfx.addCommand({
    name: 'video_go_back',
    description: 'video_go_back',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_go_skip', -10);
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_go_skip', -10);
    } else {
      commands.scroll_left.run(args);
    }
});
vimfx.set('custom.mode.normal.video_go_back', 'h');

vimfx.addCommand({
    name: 'video_go_back_short',
    description: 'video_go_back_short',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_go_skip', -5);
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_go_skip', -5);
    } else {
      commands.history_back.run(args);
    }
});
vimfx.set('custom.mode.normal.video_go_back_short', 'H');

vimfx.addCommand({
    name: 'video_go_forward',
    description: 'video_go_forward',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_go_skip', 10);
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_go_skip', 10);
    } else {
      commands.scroll_right.run(args);
    }
});
vimfx.set('custom.mode.normal.video_go_forward', 'l');

vimfx.addCommand({
    name: 'video_go_forward_short',
    description: 'video_go_forward_short',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_go_skip', 5);
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_go_skip', 5);
    } else {
      commands.history_forward.run(args);
    }
});
vimfx.set('custom.mode.normal.video_go_forward_short', 'L');

vimfx.addCommand({
    name: 'video_rate_toggle_slow',
    description: 'rate normal and slow toggle',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_rate_toggle', {normalRate: 1, targetRate: 0.25});
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_rate_toggle', {normalRate: 1.0, targetRate: 0.1});
    } else {
    }
});
vimfx.set('custom.mode.normal.video_rate_toggle_slow', 's');

vimfx.addCommand({
    name: 'video_rate_toggle_fast',
    description: 'rate normal and fast toggle',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_rate_toggle', {normalRate: 1, targetRate: 2});
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_rate_toggle', {normalRate: 1.0, targetRate: 2.2});
    } else {
    }
});
vimfx.set('custom.mode.normal.video_rate_toggle_fast', 'S');

vimfx.addCommand({
    name: 'video_mute',
    description: 'video_mute',
  }, (args) => {
    const {vim} = args;
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_toggle_mute');
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_toggle_mute');
    } else {
      commands.mark_scroll_position.run(args);
    }
});
vimfx.set('custom.mode.normal.video_mute', 'm');

vimfx.addCommand({
    name: 'video_fullscreen',
    description: 'video_fullscreen',
  }, ({vim}) => {
    if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_fullscreen');
    }
});
vimfx.set('custom.mode.normal.video_fullscreen', ',z');

vimfx.addCommand({
    name: 'video_wakeupcontrols',
    description: 'video_wakeupcontrols',
  }, ({vim}) => {
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_wakeUpControls');
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_wakeUpControls');
    }
});
vimfx.set('custom.mode.normal.video_wakeupcontrols', 'w');

vimfx.addCommand({
    name: 'youtube_loop_toggle',
    description: 'youtube_loop_toggle',
  }, ({vim}) => {
    if (isYoutube(vim)) {
      vimfx.send(vim, 'youtube_loop_toggle');
    } else if (isHTML5VideoWebSite(vim)) {
      vimfx.send(vim, 'html5video_loop_toggle');
    }
});
vimfx.set('custom.mode.normal.youtube_loop_toggle', 'Z');

for (let i = 1; i < 11; i++) {
  vimfx.addCommand({
      name: 'video_seek_to_' + String.fromCharCode('a'.charCodeAt(0) + i - 1),
      description: 'HTML5 Video seek ' + String.fromCharCode('a'.charCodeAt(0) + i - 1),
    }, ({vim}) => {
      if (isYoutube(vim)) {
        vim.notify('seek to ' + (i * 10));
        vimfx.send(vim, 'youtube_seek_to', i * 10);
      } else if (isHTML5VideoWebSite(vim)) {
        vim.notify('seek to ' + (i * 10));
        vimfx.send(vim, 'html5video_seekTo', i * 10);
      }
  });
  vimfx.set('custom.mode.normal.video_seek_to_' + String.fromCharCode('a'.charCodeAt(0) + i - 1), '<A-' + String(i).charAt(String(i).length - 1) + '>');
}
//}}}

//
// CSS: {{{
//

const css_prefix = 'data:text/css,@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);';
const css_body = `
@-moz-document url(chrome://browser/content/browser.xul) {
  #VimFxMarkersContainer .marker {
    padding: 3px !important;
    font-size: 20px !important;
    font-family: 'Consolas', 'Ubuntu Mono', 'Inconsolata', 'sans-serif' !important;
    text-transform: lowercase !important;
    border-radius: 4px !important;
    opacity: 0.8 !important;
  }
  #main-window[vimfx-mode="ignore"] #urlbar {
    background: red !important;
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
//}}}

//
//
//

console.log('vimfx: loaded config.js');

// vim:set ts=2 sw=2 et fdm=marker:
