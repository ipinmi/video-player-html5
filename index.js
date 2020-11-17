// select elements 
// Select elements here
const video = document.getElementById('video');
const videoControls = document.getElementById('video-controls');
const playButton = document.getElementById('play');
const playbackIcons = document.querySelectorAll('.playback-icons use');
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');

const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use');
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');
const playbackAnimation = document.getElementById('playback-animation');
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');
const fullscreenIcons = fullscreenButton.querySelectorAll('use');
const pipButton = document.getElementById('pip-button')

// to detect video format support
const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
    video.controls = false;
    videoControls.classList.remove('hidden');
};

function togglePlay() {
    if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
    }
}

function updatePlayBtn() {
    // updatePlayButton updates the playback icon and tooltip
    // depending on the playback state
    playbackIcons.forEach(icon => icon.classList.toggle('hidden'));

    if (video.paused) {
        playButton.setAttribute('data-title', 'Play (k)');
    } else {
        playButton.setAttribute('data-title', 'Pause (k)');
    }
}

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
    var dateobj = new Date(timeInSeconds * 1000);
    const result = dateobj.toISOString().substr(11, 8);
  
    return {
      minutes: result.substr(3, 2),
      seconds: result.substr(6, 2),
    };
};
  

// initializeVideo sets the video duration, and maximum value of the
// progressBar
function initializeVideo() {
    const videoDuration = Math.round(video.duration);
    seek.setAttribute('max', videoDuration);
    progressBar.setAttribute('max', videoDuration);

    const time = formatTime(videoDuration);
    duration.innerText = `${time.minutes}:${time.seconds}`;
    duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}

function updateTimeElapsed() {
    const time = formatTime(Math.round(video.currentTime));
    timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute('datetime', `${time.minutes}m:${time.seconds}s`)
}

function updateProgress() {
    // floor returns the largest interger rounded up based on a given value
    seek.value = Math.floor(video.currentTime);
    progressBar.value = Math.floor(video.currentTime);

}
// function updateSeekToolTip(event) {
//     const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
//     seek.setAttribute('data-seek', skipTo);

//     const t = formatTime(skipTo);
//     // popup to show the time to skipp to 
//     seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
//     // information about the size of an element and its position relative to the viewport
//     const rect = video.getBoundingClientRect();
//     seekTooltip.style.left = `${event.pageX - rect.left}px`;
// }

// function skipAhead(event) {
//     const skipTo = event.target.dataset.seek ? event.target.dataset.seek : event.target.value;
//     video.currentTime = skipTo;
//     progressBar.value = skipTo;
//     seek.value = skipTo;
// }

// updateVolume updates the video's volume
// and disables the muted state if active
function updateVolume() {
    if (video.muted) {
        video.muted = false;
    }

    video.volume = volume.value;
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
    volumeIcons.forEach(icon => {
        // add hidden because volume is still needed
        icon.classList.add('hidden');
    });

    volumeButton.setAttribute('data-title', 'Mute (m)')

    if (video.muted || video.volume === 0) {
        volumeMute.classList.remove('hidden');
        volumeButton.setAttribute('data-title', 'Unmute (m)')
    } else if (video.volume > 0 && video.volume <= 0.5) {
        volumeLow.classList.remove('hidden');
    } else {
        volumeHigh.classList.remove('hidden');
    }
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
    video.muted = !video.muted;
    // When the video is muted, the volume is stored in a data-volume attribute
    //  on the volume element, so that when the video is unmuted, 
    //  we can restore the state of the volume to its previous value
    if (video.muted) {
        volume.setAttribute('data-volume', volume.value);
        volume.value = 0;
    } else {
        volume.value = volume.dataset.volume;
    }
}

function animatePlayback() {
    playbackAnimation.animate([
        {
          opacity: 1,
          transform: "scale(1)",
        },
        {
          opacity: 0,
          transform: "scale(1.3)",
        }], {
        duration: 500,
    });
}

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        videoContainer.requestFullscreen();
    }
}

function updateFullScreenButton() {
    fullscreenIcons.forEach(icon.classList.toggle('hidden'));

    if (document.fullscreenElement) {
        fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')
    } else {
      fullscreenButton.setAttribute('data-title', 'Full screen (f)')
    }
}

// it is an async function to catch erros in case the request
// method is rejected
async function togglePip() {
    try {
        if (video !== document.pictureInPictureElement) {
            pipButton.disabled = true;
            await video.requestPictureInPicture();
        } else {
            await document.exitPictureInPicture();
        }
    } catch (error) {
        console.error(error)
    } finally {
        pipButton.disabled = false;
    }
}

function hideControls() {
    // to show the controls when video is paused
    if (video.paused) {
      return;
    }
  
    videoControls.classList.add('hide');
}
  

function showControls() {
    videoControls.classList.remove('hide');
}
  
// keyboard shortcuts 
function keyboardShortcuts(event) {
    const { key } = event;
    switch(key) {
        // for play and pause
        case 'k' :
            togglePlay();
            animatePlayback();
            if (video.paused) {
                showControls();
            } else {
                setTimeout( () => {
                    hideControls();
                }, 2000); 
            }
        break;

        case 'm': 
            toggleMute();
            break;
        case 'f':
            toggleFullScreen();
        break;
        case 'p':
            togglePip();
        break;
    }
}

playButton.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayBtn);
video.addEventListener('pause', updatePlayBtn);
video.addEventListener('click', togglePlay);
// updating the duration when metadata has loaded
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);

// video.addEventListener('mousemove', updateSeekToolTip);
// seek.addEventListener('input', skipAhead);

volume.addEventListener('input', updateVolume);
video.addEventListener('volumechange', updateVolumeIcon);
volumeButton.addEventListener('click', toggleMute);
video.addEventListener('click', animatePlayback);
fullscreenButton.onclick = toggleFullScreen;
videoContainer.addEventListener('fullscreenchange', updateFullScreenButton);

document.addEventListener('DOMContentLoaded', () => {
    if (!('pictureInPictureEnabled' in document)) {
      pipButton.classList.add('hidden');
    }
});
  
pipButton.addEventListener('click', togglePip);

video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);
document.addEventListener('keyup', keyboardShortcuts);
