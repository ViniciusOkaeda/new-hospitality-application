import { remotePlayer, lifecycle } from "senza-sdk";
import shaka from "shaka-player";
/**
 * UnifiedPlayer class that handles both local and remote playback.
 * 
 * @class UnifiedPlayer
 * @property {boolean} isInRemotePlayback - Indicates whether the player is in remote playback.
 * @property {number} currentTime - Gets or sets the current playback time.
 * @property {number} duration - Gets the duration of the media.
 * @property {boolean} paused - Indicates whether the player is paused.
 * @property {number} playbackRate - Gets or sets the playback rate. NOTE currently supported only on local player.
 * @fires UnifiedPlayer#ended - Indicates that the media has ended.
 * @fires UnifiedPlayer#error - Indicates that an error occurred.
 * @fires UnifiedPlayer#timeupdate - Indicates that the current playback time has changed.
 * @fires UnifiedPlayer#canplay - Indicates that the media is ready to play. NOTE currently supported only via local player.
 * @fires UnifiedPlayer#seeking - Indicates that the player is seeking. NOTE currently supported only via local player.
 * @fires UnifiedPlayer#seeked - Indicates that the player has finished seeking. NOTE currently supported only via local player.
 * @fires UnifiedPlayer#loadedmetadata - Indicates that the player has loaded metadata. NOTE currently supported only via local player.
 * @fires UnifiedPlayer#waiting - Indicates that the player is waiting for data. NOTE currently supported only via local player.
 * 
 * @example
 * import { UnifiedPlayer } from "./unifiedPlayer.js";
 * 
 * try {
 *   const videoElement = document.getElementById("video");
 *   const unifiedPlayer = new UnifiedPlayer(videoElement);
 *   await unifiedPlayer.load("http://playable.url/file.mpd");
 *   await unifiedPlayer.play(); // Will start the playback on the local player
 *   document.addEventListener("keydown", async function (event) {
 *     switch (event.key) {
 *       case "ArrowLeft": {
 *         await unifiedPlayer.moveToLocalPlayback(); // Will move the playback to the local player
 *         break;
 *       }
 *       case "ArrowRight": {
 *         unifiedPlayer.moveToRemotePlayback(); // Will move the playback to the remote player
 *         break;
 *       }
 *       default: return;
 *     }
 *     event.preventDefault();
 *   });
 * 
 * } catch (err) {
 *   console.error("UnifiedPlayer failed with error", err);
 * }
 */
export class UnifiedPlayer extends EventTarget {
  /**
   * Creates an instance of UnifiedPlayer.
   * 
   * @param {HTMLVideoElement} videoElement - The video element to be used for local playback.
   */
  constructor(videoElement, videoParams) {
    super();
    shaka.polyfill.installAll();
    this.videoElement = videoElement;
    //console.log("meu video element", this.videoElement)
    this.localPlayer = new shaka.Player(this.videoElement);
    //console.log("meu local player", this.localPlayer)
    this.remotePlayer = remotePlayer;
    //console.log("meu remote player", this.remotePlayer)
    this.videoParams = videoParams;
    //console.log("o videoParams no Unified Class", this.videoParams)
    this.isInRemotePlayback = false;

    if (this.remotePlayer.attach) {
      this.remotePlayer.attach(this.videoElement);
    } else {
      this.remotePlayer.registerVideoElement(this.videoElement);
    }

    // Remote player events
    this.remotePlayer.addEventListener("ended", () => {
     // console.log("remotePlayer ended");
      lifecycle.moveToForeground();
      this.dispatchEvent(new Event("ended"));
    });

    this.remotePlayer.addEventListener("error", (event) => {
      //console.log("remotePlayer error:", event.detail.errorCode, event.detail.message);
      this.dispatchEvent(new CustomEvent("error", event));
    });

    this.remotePlayer.addEventListener("timeupdate", () => {
      if (!this.isInRemotePlayback) {
        return;
      }
      //console.log("remotePlayer timeupdate");
      this.videoElement.currentTime = this.remotePlayer.currentTime;
      this.dispatchEvent(new Event("timeupdate"));
    });


    // Local player events
    this.videoElement.addEventListener("ended", () => {
      //console.log("localPlayer ended");
      this.dispatchEvent(new Event("ended"));
    });

    this.localPlayer.addEventListener("error", (event) => {
      //console.log("localPlayer error:", event.detail.errorCode, event.detail.message);
      this.dispatchEvent(new CustomEvent("error", event));
    });

    this.videoElement.addEventListener("timeupdate", () => {
      if (this.isInRemotePlayback) {
        return;
      }
      //console.log("localPlayer timeupdate");
      this.remotePlayer.currentTime = this.videoElement.currentTime;
      this.dispatchEvent(new Event("timeupdate"));
    });

    this.videoElement.addEventListener("canplay", () => {
      //console.log("localPlayer canplay");
      this.dispatchEvent(new Event("canplay"));
    });

    this.videoElement.addEventListener("waiting", () => {
      //console.log("localPlayer waiting");
      this.dispatchEvent(new Event("waiting"));
    });

    this.videoElement.addEventListener("seeking", () => {
      //console.log("localPlayer seeking");
      this.dispatchEvent(new Event("seeking"));
    });

    this.videoElement.addEventListener("seeked", () => {
      //console.log("localPlayer seeked");
      this.dispatchEvent(new Event("seeked"));
    });

    this.videoElement.addEventListener("loadedmetadata", () => {
      //console.log("localPlayer loadedmetadata");
      this.dispatchEvent(new Event("loadedmetadata"));
    });


    // playback lifecycle handler
    lifecycle.addEventListener("onstatechange", (event) => {
      console.log("lifecycle state change", event.state);
      switch (event.state) {
        case "background":
          this._localPlayerPause();
        case "inTransitionToBackground":
          this.isInRemotePlayback = true;
          break;
        case "foreground":
        case "inTransitionToForeground":
          this.isInRemotePlayback = false;
          break;
      }
    });
  }

  get playbackRate() {
    if (this.isInRemotePlayback) {
      console.warn("playbackRate in remote playback is not supported yet.");
      return this.remotePlayer.playbackRate === undefined ? 1 : this.remotePlayer.playbackRate;
    } else {
      return this.videoElement.playbackRate;
    }
  }

  set playbackRate(rate) {
    if (this.isInRemotePlayback) {
      console.warn("playbackRate in remote playback is not supported yet.");
    }
    this.remotePlayer.playbackRate = this.videoElement.playbackRate = rate;

  }
  /**
   * Indicates whether the player is paused.
   * 
   * @readonly
   * @type {boolean}
   */
  get paused() {
    return this.isInRemotePlayback ? false : this.videoElement.paused;
  }

  /**
   * Gets the current playback time.
   * 
   * @type {number}
   */
  get currentTime() {
    return this.isInRemotePlayback ? remotePlayer.currentTime : this.videoElement.currentTime;
  }

  /**
   * Sets the current playback time.
   * NOTE: When in remote playback, this will not affect the remote player.
   * @param {number} time - The time to set the current playback to.
   */
  set currentTime(time) {
    if (this.isInRemotePlayback) {
      console.warn("Setting currentTime while in remote playback is not supported yet.");
    } else {
      remotePlayer.currentTime = this.videoElement.currentTime = time;
    }
  }

  /**
   * Gets the duration of the media.
   * 
   * @readonly
   * @type {number}
   */
  get duration() {
    return this.videoElement.duration;
  }

  /**
   * Loads a media URL into both local and remote players.
   * 
   * @param {string} url - The URL of the media to load.
   * @returns {Promise<void>}
   */
  async load(url) {
    try {
      await this._remotePlayerLoad(url);
    } catch (error) {
      console.log("Couldn't load remote player. Error:", error);
    }
    try {
      await this._localPlayerLoad(url);
    } catch (error) {
      console.log("Couldn't load local player. Error:", error);
    }
  }

  /**
   * Plays the media.
   * Will start the playback on the local player, to move the playback to the remote player call {@link moveToRemotePlayback}.
   * 
   * @returns {Promise<void>}
   */
  async play() {
    await this._localPlayerPlay();
    this._remotePlayerPlay();
  }

  /**
   * Pauses the media on both local and remote players.
   * NOTE: When in remote playback, this will not have any affect.
   */
  pause() {
    if (this.isInRemotePlayback) {
      console.warn("Pausing while in remote playback is not supported yet.");
    } else {
      this._localPlayerPause();
      this._remotePlayerPause();
    }
  }

  /**
   * Moves playback to local player.
   * 
   * @returns {Promise<void>}
   */
  async moveToLocalPlayback() {
    this._localPlayerPlay();
    lifecycle.moveToForeground();
  }

  /**
   * Moves playback to remote player.
   */
  moveToRemotePlayback() {
    lifecycle.moveToBackground();
  }

  /**
   * Configures DRM settings.
   * 
   * @param {string} server - The DRM server URL.
   * @param {(request: { body : ArrayBuffer | ArrayBufferView | null , headers : { [ key: string ]: string } , uris : string [] }) => void | null} requestFilter - Optional request filter function, allows you to add auth tokens and/or reformat the body.
   * @param {(response: { data : ArrayBuffer | ArrayBufferView , headers : { [ key: string ]: string } , originalUri : string , status ? : number , timeMs ? : number , uri : string }) => void | null} responseFilter - Optional response filter function.
   * 
   * @example
   * unifiedPlayer.configureDrm("https://proxy.uat.widevine.com/proxy", (request) => {
   *  console.log("Requesting license from Widevine server");
   *  request.headers["Authorization"] = "Bearer <...>";
   * });
   */
  configureDrm(
    server,
    devices_type, 
    devices_identification,
    devices_hash,
    customers_token,
    profiles_id,
    version,
    timestamp,
    offset,
    edges_id 
  ) {
    
    this.localPlayer.configure({
      drm: {
        servers: {
          'com.widevine.alpha': server,
        }
      }
    });

    const networkingEngine = this.localPlayer.getNetworkingEngine();
    //console.log("meu networkingEngine", networkingEngine)

    networkingEngine.registerRequestFilter((type, request) => {
      //console.log("meu type", type)
      //console.log("meu request", request)
      //console.log("meu shaka net", shaka.net.NetworkingEngine.RequestType.LICENSE)
      var StringUtils = shaka.util.StringUtils;
      var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
      
      if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
        request.headers['Authorization'] = 'Bearer ' + customers_token;
        request.headers['profilesId'] = btoa(profiles_id);
        request.headers['devicesType'] = btoa(devices_type);
        request.headers['version'] = btoa(version);
        request.headers['browserType'] = btoa('chrome');
        var wrapped = {};
        wrapped.timestamp = timestamp;
        wrapped.offset = offset;
        wrapped.edges_id = edges_id;
        wrapped.devices_identification = devices_identification;
        wrapped.devices_hash = devices_hash;
        wrapped.rawLicense =
            Uint8ArrayUtils.toBase64(new Uint8Array(request.body), false);

        var wrappedJson = JSON.stringify(wrapped);
        request.body = StringUtils.toUTF8(wrappedJson);
        //console.log("passei do if type e shaka")

      }
    });

    networkingEngine.registerResponseFilter((type, response) => {
      //console.log("o registro de resposta de filtro", type)
      //console.log("o registro de type de filtro", response)
      //console.log("o response de shaka", shaka.net.NetworkingEngine.RequestType.LICENSE)
      var StringUtils = shaka.util.StringUtils;
      var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
      if (type === shaka.net.NetworkingEngine.RequestType.LICENSE) {
        var wrappedString = StringUtils.fromUTF8(response.data);
        var wrapped = JSON.parse(wrappedString);
        var rawLicense = wrapped.rawLicense;
        response.data = Uint8ArrayUtils.fromBase64(rawLicense);

        //console.log("o response data dentro do register", response.data)
      }
    });

    this.remotePlayer.addEventListener("license-request", async (event) => {
      //console.log("remotePlayer", "license-request", "Got license-request event from remote player");

      // Extract license body from event
      const requestBuffer = event?.detail?.licenseRequest;
      const requestBufferStr = String.fromCharCode.apply(null, new Uint8Array(requestBuffer));
      const decodedLicenseRequest = window.atob(requestBufferStr); // Decode from base64
      const licenseRequestBytes = Uint8Array.from(decodedLicenseRequest, (l) => l.charCodeAt(0));

      var requestFilter = true;
      var responseFilter = true;
      // Get license from server
      const res = await getLicenseFromServer(
        server, 
        licenseRequestBytes.buffer, 
        requestFilter, 
        responseFilter
      
      );

      // Write response to remote player
      console.log("remotePlayer", "license-request", "Writing response to remote player", res.code);
      event.writeLicenseResponse(res.code, res.responseBody);
    });
  }
  /**
   * Loads a media URL into the local player.
   * 
   * @private
   * @param {string} url - The URL of the media to load.
   * @returns {Promise<void>}
   */
  _localPlayerLoad(url) {
    return this.localPlayer.load(url);
  }

  /**
   * Plays the media on the local player.
   * 
   * @private
   * @returns {Promise<void>}
   */
  _localPlayerPlay() {
    return this.videoElement.play();
  }

  /**
   * Pauses the media on the local player.
   * 
   * @private
   */
  _localPlayerPause() {
    this.videoElement.pause();
  }

  /**
   * Loads a media URL into the remote player.
   * 
   * @private
   * @param {string} url - The URL of the media to load.
   * @returns {Promise<void>}
   */
  _remotePlayerLoad(url) {
    return remotePlayer.load(url);
  }

  /**
   * Plays the media on the remote player.
   * 
   * @private
   */
  _remotePlayerPlay() {
    remotePlayer.play(false);
  }

  /**
   * Pauses the media on the remote player.
   * 
   * @private
   */
  _remotePlayerPause() {
    remotePlayer.pause();
  }
}

async function getLicenseFromServer(drmServer, licenseRequest, drmRequestFilter, drmResponseFilter) {
  var devices_type = 'webos';
  var devices_identification = 'Windows 10 pro, chrome';
  var devices_hash = '2545249073';
  var customers_token = 'r5aaiczabjz4g8qhu47ujv8ycl7ur4twir1lcpmu';
  var profiles_id = '103109'; // CHANGE ME
  var version = '1.0.12';
  var timestamp = '1729404900';
  var offset = 0;
  var edges_id = 2;
  
  console.log("remotePlayer", "license-request", "Requesting license From Widevine server");
  const request = {
    "uris": [drmServer],
    "method": "POST",
    "body": licenseRequest,
    "headers": {
      "Content-Type": "application/octet-stream"
    }
  };

  if (drmRequestFilter = true) {
    var StringUtils = shaka.util.StringUtils;
    var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
    request.headers['Authorization'] = 'Bearer ' + customers_token;
    request.headers['profilesId'] = btoa(profiles_id);
    request.headers['devicesType'] = btoa(devices_type);
    request.headers['version'] = btoa(version);
    request.headers['browserType'] = btoa('chrome');
    var wrapped = {};
    wrapped.timestamp = timestamp;
    wrapped.offset = offset;
    wrapped.edges_id = edges_id;
    wrapped.devices_identification = devices_identification;
    wrapped.devices_hash = devices_hash;
    wrapped.rawLicense =
        Uint8ArrayUtils.toBase64(new Uint8Array(request.body), false);

    var wrappedJson = JSON.stringify(wrapped);
    request.body = StringUtils.toUTF8(wrappedJson);
    
  }

  let response = await fetch(request.uris[0], request);

  response = {
    data: await response.arrayBuffer(),
    headers: response.headers,
    originalUri: response.url,
    status: response.status,
    timeMs: -1,
    uri: response.url
  };

  if (drmResponseFilter = true) {
    var StringUtils = shaka.util.StringUtils;
    var Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;
    var wrappedString = StringUtils.fromUTF8(response.data);
    var wrapped = JSON.parse(wrappedString);
    var rawLicense = wrapped.rawLicense;
    response.data = Uint8ArrayUtils.fromBase64(rawLicense);

  }

  const code = response.status;
  if (code !== 200) {
    const responseBody = response.data ? String.fromCharCode(new Uint8Array(response.data)) : undefined;
    console.error("remotePlayer", "license-request", "failed to to get response from widevine:", code, responseBody);
    return { code, responseBody };
  }

  return { code, responseBody: response.data };
}