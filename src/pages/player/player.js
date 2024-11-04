import React from "react";
import { VideoManager } from "../../components/senza-player/videoManager"
import { init, uiReady } from "senza-sdk";
import axios from "axios";

function Player() {
    const TEST_VIDEO = "https://storage.googleapis.com/wvmedia/cenc/h264/tears/tears.mpd";

    function getStream() {
        try {
            const channelStreamRequest = axios.post('https://hospitality.youcast.tv.br/getStreamChannelUrlV3', {
              authorization: "Bearer r5aaiczabjz4g8qhu47ujv8ycl7ur4twir1lcpmu",
              channelsId: 121,
              devicesType: "webos",
              includeData: true,
              language: "pt",
              live: false,
              profileId: "103109",
              timestamp: 1729692600,
              type: "TV"
          }).then(async function (response) {
            var video = document.getElementById('video');
          const videoManager = new VideoManager(response.data.response);
          await init();
          videoManager.init(video);
          await videoManager.load(response.data.response.url);
          //await videoManager.load(TEST_VIDEO);
          videoManager.play();
          uiReady();
          
          document.addEventListener("keydown", async function (event) {
            switch (event.key) {
              case "Enter": await videoManager.toggleLocalAndRemotePlayback(); break;
              case "Escape": videoManager.playPause(); break;
              case "ArrowLeft": videoManager.skip(-30); break;
              case "ArrowRight": videoManager.skip(30); break;
              default: return;
            }
            event.preventDefault();
          });
          }).catch(function (response) {
            
          })
        
        
        
          } catch (error) {
            console.error(error);
          }
    }

    getStream()

    return(
        <div id="main">
        <video id="video" width="1920" height="1080" muted="muted"></video>
        <div id="banner">
          Welcome to Senza
        </div>
      </div>
    );
}

export default Player;









