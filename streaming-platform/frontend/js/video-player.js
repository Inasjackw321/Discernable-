/**
 * StreamVibe Video Player
 * Enhanced video player functionality
 */

class VideoPlayer {
  constructor(videoElement) {
    this.video = videoElement;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1;
    this.playbackRate = 1;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupKeyboardControls();
  }

  setupEventListeners() {
    // Play/Pause
    this.video.addEventListener('play', () => {
      this.isPlaying = true;
      this.onPlayStateChange(true);
    });

    this.video.addEventListener('pause', () => {
      this.isPlaying = false;
      this.onPlayStateChange(false);
    });

    // Time update
    this.video.addEventListener('timeupdate', () => {
      this.currentTime = this.video.currentTime;
      this.onTimeUpdate(this.currentTime, this.duration);
    });

    // Duration change
    this.video.addEventListener('loadedmetadata', () => {
      this.duration = this.video.duration;
      this.onDurationChange(this.duration);
    });

    // Volume change
    this.video.addEventListener('volumechange', () => {
      this.volume = this.video.volume;
      this.onVolumeChange(this.volume);
    });

    // Ended
    this.video.addEventListener('ended', () => {
      this.onVideoEnded();
    });

    // Error
    this.video.addEventListener('error', (e) => {
      this.onError(e);
    });
  }

  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      // Only handle if video player is in focus/visible
      if (!this.video.paused || document.activeElement === this.video) {
        switch(e.key) {
          case ' ':
          case 'k':
            e.preventDefault();
            this.togglePlay();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            this.seek(this.currentTime - 5);
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.seek(this.currentTime + 5);
            break;
          case 'ArrowUp':
            e.preventDefault();
            this.setVolume(Math.min(1, this.volume + 0.1));
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.setVolume(Math.max(0, this.volume - 0.1));
            break;
          case 'm':
            e.preventDefault();
            this.toggleMute();
            break;
          case 'f':
            e.preventDefault();
            this.toggleFullscreen();
            break;
          case '0':
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            e.preventDefault();
            const percent = parseInt(e.key) / 10;
            this.seek(this.duration * percent);
            break;
        }
      }
    });
  }

  // Playback controls
  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time) {
    this.video.currentTime = Math.max(0, Math.min(time, this.duration));
  }

  setVolume(volume) {
    this.video.volume = Math.max(0, Math.min(1, volume));
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
  }

  setPlaybackRate(rate) {
    this.video.playbackRate = rate;
    this.playbackRate = rate;
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.video.requestFullscreen?.() ||
      this.video.webkitRequestFullscreen?.() ||
      this.video.mozRequestFullScreen?.() ||
      this.video.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
      document.webkitExitFullscreen?.() ||
      document.mozCancelFullScreen?.() ||
      document.msExitFullscreen?.();
    }
  }

  // Quality selection
  setQuality(quality) {
    const currentTime = this.currentTime;
    const wasPlaying = this.isPlaying;

    // Change video source based on quality
    // This would be implemented based on your video encoding setup
    this.video.src = this.getQualityUrl(quality);

    this.video.addEventListener('loadedmetadata', () => {
      this.seek(currentTime);
      if (wasPlaying) {
        this.play();
      }
    }, { once: true });
  }

  getQualityUrl(quality) {
    // Implement based on your video storage structure
    return this.video.src;
  }

  // Picture-in-Picture
  async togglePictureInPicture() {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await this.video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
  }

  // Event handlers (to be overridden)
  onPlayStateChange(isPlaying) {
    // Override this method to handle play state changes
  }

  onTimeUpdate(currentTime, duration) {
    // Override this method to handle time updates
  }

  onDurationChange(duration) {
    // Override this method to handle duration changes
  }

  onVolumeChange(volume) {
    // Override this method to handle volume changes
  }

  onVideoEnded() {
    // Override this method to handle video end
  }

  onError(error) {
    console.error('Video player error:', error);
  }

  // Analytics
  trackWatchTime() {
    let watchedSeconds = 0;
    const interval = setInterval(() => {
      if (this.isPlaying) {
        watchedSeconds++;

        // Send analytics every 30 seconds
        if (watchedSeconds % 30 === 0) {
          this.sendWatchTimeAnalytics(watchedSeconds);
        }
      }
    }, 1000);

    this.video.addEventListener('ended', () => {
      clearInterval(interval);
      this.sendWatchTimeAnalytics(watchedSeconds);
    }, { once: true });
  }

  async sendWatchTimeAnalytics(watchedSeconds) {
    const completionRate = (watchedSeconds / this.duration) * 100;

    try {
      await api.post(`/videos/${this.videoId}/analytics`, {
        watchTime: watchedSeconds,
        completionRate: completionRate,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  // Destroy
  destroy() {
    // Clean up event listeners
    this.video.removeEventListener('play', this.onPlayStateChange);
    this.video.removeEventListener('pause', this.onPlayStateChange);
    this.video.removeEventListener('timeupdate', this.onTimeUpdate);
    this.video.removeEventListener('loadedmetadata', this.onDurationChange);
    this.video.removeEventListener('volumechange', this.onVolumeChange);
    this.video.removeEventListener('ended', this.onVideoEnded);
    this.video.removeEventListener('error', this.onError);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VideoPlayer };
}
