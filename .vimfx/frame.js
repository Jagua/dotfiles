'use strict';

// SlideShare {{{
vimfx.listen('slideshare_next_slide', () => {
  const btn = content.document.getElementById('btnNext');
  if (btn) {
    btn.click();
  }
});

vimfx.listen('slideshare_prev_slide', () => {
  const btn = content.document.getElementById('btnPrevious');
  if (btn) {
    btn.click();
  }
});
//}}}

// SpeakerDeck {{{
vimfx.listen('speakerdeck_next_slide', () => {
  const iframe = content.document.querySelector('.speakerdeck-iframe');
  if (iframe) {
    iframe.contentWindow.wrappedJSObject.player.nextSlide();
  }
});

vimfx.listen('speakerdeck_prev_slide', () => {
  const iframe = content.document.querySelector('.speakerdeck-iframe');
  if (iframe) {
    iframe.contentWindow.wrappedJSObject.player.previousSlide();
  }
});
//}}}

//
// Video
//

// helper {{{
function getVideoPlayer() {
  return content.document.getElementsByTagName('video')[0].wrappedJSObject;
}

function getYoutubePlayer() {
  return content.document.getElementById('movie_player').wrappedJSObject;
}

function youtube_wakeUpControls() {
  getYoutubePlayer().wakeUpControls();
}
//}}}

// Youtube Player {{{
vimfx.listen('youtube_toggle_play', () => {
    const player = getYoutubePlayer();
    if (player.getPlayerState() === 2) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
    youtube_wakeUpControls();
});

vimfx.listen('youtube_volumeUpDown', (data) => {
    const player = getYoutubePlayer();
    player.setVolume(player.getVolume() + data);
});

vimfx.listen('youtube_wakeUpControls', () => {
    youtube_wakeUpControls();
});

vimfx.listen('youtube_rate_toggle', (data) => {
    const player = getYoutubePlayer();
    const rate = (player.getPlaybackRate() === data.normalRate) ? data.targetRate : data.normalRate;
    player.setPlaybackRate(rate);
});

vimfx.listen('youtube_toggle_mute', () => {
    const player = getYoutubePlayer();
    if (player.isMuted()) {
      player.unMute();
    } else {
      player.mute();
    }
});

vimfx.listen('youtube_go_skip', (data) => {
    const player = getVideoPlayer();
    player.fastSeek(player.currentTime + data);
    youtube_wakeUpControls();
});

vimfx.listen('youtube_seek_to', (data) => {
    const player = getYoutubePlayer();
    player.seekTo(player.getDuration() * data / 100);
    youtube_wakeUpControls();
});

vimfx.listen('youtube_loop_toggle', () => {
    const player = getVideoPlayer();
    //player.loop = !(player.loop);
    //player.setLoop(!(player.loop));
    player.setLoop(true);
});
//}}}

// HTML5 Video Player {{{
vimfx.listen('html5video_toggle_play', () => {
    const player = getVideoPlayer();
    if (player.paused || player.ended) {
      player.play();
    } else {
      player.pause();
    }
});

vimfx.listen('html5video_volumeUpDown', (data) => {
    const player = getVideoPlayer();
    player.volume += data;
});

vimfx.listen('html5video_wakeUpControls', () => {
    const player = getVideoPlayer();
    if (player.hasAttribute('controls')) {
      player.removeAttribute('controls');
    } else {
      player.controls = 'controls';
    }
});

vimfx.listen('html5video_rate_toggle', (data) => {
    const player = getVideoPlayer();
    player.playbackRate = (player.playbackRate === data.normalRate) ? data.targetRate : data.normalRate;
});

vimfx.listen('html5video_toggle_mute', () => {
    const player = getVideoPlayer();
    player.muted = !player.muted;
});

vimfx.listen('html5video_go_skip', (data) => {
    const player = getVideoPlayer();
    player.fastSeek(player.currentTime + data);
});

vimfx.listen('html5video_seekTo', (data) => {
    const player = getVideoPlayer();
    player.fastSeek(player.duration * data / 100);
    //player.currentTime = player.duration * data / 100;
});

vimfx.listen('html5video_fullscreen', () => {
    const player = getVideoPlayer();
    player.mozRequestFullScreen();
});

vimfx.listen('html5video_loop_toggle', () => {
    const player = getVideoPlayer();
    player.loop = !(player.loop);
});
//}}}

//
//
//

console.log('vimfx: loaded frame.js');

// vim:set ts=2 sw=2 et fdm=marker:
