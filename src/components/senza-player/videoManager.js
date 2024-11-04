import { UnifiedPlayer } from "./unifiedPlayer.js";

export class VideoManager {

  constructor(videoParams) {
    this.videoParams = videoParams
  }
  
  init(videoElement, drmServer) {
    this.player = new UnifiedPlayer(videoElement, this.videoParams);
    //console.log("meu video params no construtor da class VideoManager", this.videoParams)
    console.log("meu player", this.player)
    var drmServer = 'https://mw.yplay.com.br/widevine_proxy'
    if (drmServer) {
      var devices_type = 'webos';
      var devices_identification = 'Windows 10 pro, chrome';
      var devices_hash = '2545249073';
      var customers_token = 'r5aaiczabjz4g8qhu47ujv8ycl7ur4twir1lcpmu';
      var profiles_id = '103109'; // CHANGE ME
      var version = '1.0.12';
      var timestamp = '1729404900';
      var offset = this.videoParams.offset;
      var edges_id = this.videoParams.edgesId;
      // this will allow you to manipulate the request to the drm server including addind authorization headers and changing the body format
      this.player.configureDrm(
        drmServer, 
        devices_type, 
        devices_identification,
        devices_hash,
        customers_token,
        profiles_id,
        version,
        timestamp,
        offset,
        edges_id 


      );
    }
  }

  async load(url) {
    await this.player.load(url);
  }

  play() {
    this.player.play().catch(error => {
      console.error("Unable to play video. Possibly the browser will not autoplay video with sound. Error:", error);
    });
  }

  pause() {
    this.player.pause();
  }

  playPause() {
    if (this.player.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  skip(seconds) {
    this.player.currentTime = this.player.currentTime + seconds;
  }

  async toggleLocalAndRemotePlayback() {
    if (this.player.isInRemotePlayback) {
      this.player.moveToLocalPlayback();
    } else {
      this.player.moveToRemotePlayback();
    }
  }
}
