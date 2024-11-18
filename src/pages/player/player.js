import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './player.css';
import { VideoManager } from "../../components/senza-player/videoManager"
import { init, uiReady } from "senza-sdk";
import axios from "axios";

function Player() {
  const { type } = useParams(); // Pega o ID da URL
  const { event } = useParams(); // Pega o ID da URL
  const { channel } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  const [enableArrows, setEnableArrows] = useState(false)
  const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
  const [error, setError] = useState('');

  const [bottomMenu, setBottomMenu] = useState(true)


  useEffect(() => {
    const loadData = async () => {
      try {


      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false); // Dados carregados, então setar como false
        setEnableArrows(true);
      }
    };

    loadData(); // Chama a função de carregamento ao montar o componente

  }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez

  const TEST_VIDEO = "https://storage.googleapis.com/wvmedia/cenc/h264/tears/tears.mpd";
  /*
  
  
  
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
  */


  return (
    <div id="main">
      <video id="video" width="1920" height="1080" muted="muted" className="videoContainer"></video>
      {/*
      
      
      */}

      {bottomMenu && (
        <div className="bottomMenuContainer">
          <div className="bottomMenuTitle"></div>
          <div className="bottomMenuTime"></div>

          <div className="bottomMenuOptions">
            <div className="bottomOptionsButtonContainer1"></div>
            <div className="bottomOptionsButtonContainer2"></div>
            <div className="bottomOptionsButtonContainer2"></div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Player;









