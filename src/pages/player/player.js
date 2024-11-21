import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './player.css';
import { VideoManager } from "../../components/senza-player/videoManager"
import { init, uiReady } from "senza-sdk";
import Monitor from "../../images/monitor.png";
import Checklist from "../../images/checklist.png";
import Moreinfo from "../../images/about-us.png";
import Back from "../../images/back.png";
import Next from "../../images/next.png";
import Reload from "../../images/go-back-arrow.png";
import Legend from "../../images/transcript.png";
import Highquality from "../../images/high-quality.png"
import { FormatDate, FormatDuration, FormatRating } from "../../utils/constants";
import { GetStreamChannelUrlV3, GetStreamVodUrlV3, GetEventRequestTv, GetEventRequestVod } from "../../services/calls";
import axios from "axios";
import { useKeyNavigation } from "../../utils/newNavigation";

function Player() {
  const { type } = useParams(); // Pega o ID da URL
  const { event } = useParams(); // Pega o ID da URL
  const { channel } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  const checkLive = window.location.pathname

  const [eventDetails, setEventDetails] = useState([])
  const [videoContent, setVideoContent] = useState([])
  const [enableArrows, setEnableArrows] = useState(false)
  const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
  const [error, setError] = useState('');

  const [bottomMenu, setBottomMenu] = useState(true)

  // Estado para o tempo total e o tempo atual do vídeo
  const [currentTime, setCurrentTime] = useState(0); // Inicializa o currentTime com 410 segundos
  const [duration, setDuration] = useState(0); // Inicializa a duração
//console.log("a duraçao", duration)
//console.log("a currentTime", currentTime)
  const videoRef = useRef(null); // Referência para o elemento <video>


  useEffect(() => {
    const loadData = async () => {
      if (type === "TV") {
        if (checkLive.includes("LIVE") === true) {
          const res = await GetEventRequestTv(event)
          if (res) {
            if (res.status === 1) {
              setEventDetails(res.response[0])
              const result = await GetStreamChannelUrlV3(channel, type, "LIVE", res.response[0].start);
              if (result) {
                if (result.status === 1) {
                  setVideoContent(result.response)
                  var video = document.getElementById('video');
                  const videoManager = new VideoManager(result.response);
                  await init();
                  videoManager.init(video);
                  await videoManager.load(result.response.url);
                  //await videoManager.load(TEST_VIDEO);
                  videoManager.play();
                  uiReady();
                  setDuration(res.response[0].duration); // Definir a duração do vídeo
                  video.addEventListener("timeupdate", () => {
                    setCurrentTime(video.currentTime);
                  });

                }
              }
            }
          }

        } else {
          try {
            const res = await GetEventRequestTv(event)
            if (res) {
              if (res.status === 1) {
                setEventDetails(res.response[0])
                const result = await GetStreamChannelUrlV3(channel, type, "NOT LIVE", res.response[0].start);
                if (result) {
                  if (result.status === 1) {
                    setVideoContent(result.response)
                    var video = document.getElementById('video');
                    const videoManager = new VideoManager(result.response);
                    await init();
                    videoManager.init(video);
                    /*
                    
                    */
                    await videoManager.load(result.response.url).then(function () {
                      /*
                      
                      video.currentTime = 410
                      */
                    })
                    //await videoManager.load(TEST_VIDEO);
                    videoManager.play();
                    uiReady();
                    setDuration(res.response[0].duration); // Definir a duração do vídeo
                    video.addEventListener("timeupdate", () => {
                      console.log("ta atualizando", video.currentTime)
                      setCurrentTime(video.currentTime);
                    });
                  }
                }
              }
            }

          } catch (err) {
            setError(err.message || 'An error occurred');
          } finally {
            setLoading(false); // Dados carregados, então setar como false
            setEnableArrows(true);
          }

        }

      } else {
        try {
          const res = await GetEventRequestVod(event)
          if (res) {
            if (res.status === 1) {
              console.log("meu res", res.response)
              setEventDetails(res.response)
              const result = await GetStreamVodUrlV3(event, type)
              if (result) {
                if (result.status === 1) {
                  setVideoContent(result.response)
                  var video = document.getElementById('video');
                  //const video = videoRef.current;
                  const videoManager = new VideoManager(result.response);
                  await init();
                  videoManager.init(video);
                  await videoManager.load(result.response.url)
                  //await videoManager.load(TEST_VIDEO);
                  videoManager.play();
                  uiReady();
                  //setDuration(res.response[0].duration); // Definir a duração do vídeo
                  video.addEventListener("timeupdate", () => {
                    console.log("ta atualizando", video.currentTime)

                    setCurrentTime(video.currentTime);
                  });
                  //handleSquares(videoManager)
                }
              }
            }
          }

        } catch (err) {
          setError(err.message || 'An error occurred');
        } finally {
          setLoading(false); // Dados carregados, então setar como false
          setEnableArrows(true);
        }
      }

    };

    loadData(); // Chama a função de carregamento ao montar o componente

  }, [type, event, channel]); // Dependência vazia para garantir que loadData só seja chamado uma vez

  useEffect(() => {
    const video = document.getElementById('video');
    video.onloadedmetadata = () => {
      const videoDuration = video.duration;  // Em segundos
      setCurrentTime(videoDuration);
      setDuration(videoDuration);  // Atualiza o estado com a duração correta
    };
  }, []);
  const progressPercentage = (currentTime / duration) * 100;

  const handleProgressClick = (e) => {
    const progressBar = e.target;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newCurrentTime = (clickPosition / progressBar.offsetWidth) * duration;
    videoRef.current.currentTime = newCurrentTime;
    setCurrentTime(newCurrentTime);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);

    // Formatar para 2 dígitos com zero à esquerda
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = sec < 10 ? `0${sec}` : `${sec}`;

    // Retornar no formato HH:MM:SS
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  const TEST_VIDEO = "https://storage.googleapis.com/wvmedia/cenc/h264/tears/tears.mpd";

  const handleArrowDown = () => {
    console.log("Seta para baixo pressionada");
  };

  const handleArrowUp = () => {
  };

  const handleArrowLeft = () => {
  };

  const handleArrowRight = () => {
  };

  const handleEnter = () => {

  };


  const handleEscape = () => {
    console.log("Escape pressionado");
    window.history.back()
    // Implemente a lógica para quando o usuário pressionar Escape (ex: sair do foco)
  };

  const handleSquares = (videoManager) => {
    console.log("Escape pressionado");
    videoManager.toggleLocalAndRemotePlayback();
    // Implemente a lógica para quando o usuário pressionar Escape (ex: sair do foco)
  };


  const {
    containerCount,
    cardCount,
    buttonCount,
    setContainerCount,
    setCardCount,
    setButtonCount,
  } = useKeyNavigation({
    loading,
    enableArrows,
    onArrowUp: () => handleArrowUp(),
    onArrowDown: () => handleArrowDown(),
    onArrowLeft: () => handleArrowLeft(),
    onArrowRight: () => handleArrowRight(),
    onEnter: () => handleEnter(),
    onEscape: () => handleEscape(),
  });

  return (
    <div id="main">
      <video id="video" ref={videoRef} width="1920" height="1080" muted="muted" className="videoContainer"></video>
      {/*
      
      
      */}

      {bottomMenu && (
        <div className="bottomMenuContainer">
          <div className="bottomMenuTitle">
            <div className="bottomMenuTitleRow">
              <h3>{eventDetails.title}</h3>
              <span
                style={{
                  backgroundColor: FormatRating(eventDetails.rating)
                }}
              ><h4>A{eventDetails.rating === 0 ? "L" : eventDetails.rating}</h4></span>
            </div>

            <div className="bottomMenuTitleRow">
              <img src={eventDetails.channels_logo}></img>
              <h4>{FormatDate(eventDetails.start)}</h4>
            </div>
          </div>

          <div className="bottomMenuTime">
            <div className="time-display">
              <span style={{ position: 'relative', left: `${progressPercentage}%` }}>
                {formatTime(currentTime)}
              </span>
            </div>

            <div className="progress-container">
              <div
                className="progress-bar-container"
                onClick={handleProgressClick}
                style={{ width: '100%' }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                ></div>

                <button
                  className="progress-button"
                  style={{
                    left: `${progressPercentage}%`,
                  }}
                />

              </div>

              <div className="duration-display">
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="bottomMenuOptions">
            <div className="bottomOptionsButtonContainer bottomMinWidth1">

              {/* REMOVER RESSE SE FOR VOD */}
              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Monitor}></img>
                </button>
                <p className="bottomButtonDivText displayNone">Canais</p>
              </div>

                {/* REMOVER RESSE SE FOR VOD */}
              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Checklist}></img>
                </button>
                <p className="bottomButtonDivText displayNone">Conteúdos</p>

              </div>

              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Moreinfo}></img>
                </button>
                <p className="bottomButtonDivText displayNone">Mais info</p>
              </div>

            </div>

            <div className="bottomOptionsButtonContainer bottomMinWidth2">
              
              {/* REMOVER RESSE SE FOR VOD */}
              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Back}></img>
                </button>

                <p className="bottomButtonDivText displayNone">Evento anterior</p>
              </div>


              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Reload}></img>
                </button>


                <p className="bottomButtonDivText displayNone">Assistir desde o inicio</p>
              </div>

{/* REMOVER RESSE SE FOR VOD */}
              <div className="bottomButtonDivLive">
                <button className="bottomOptionsButton bottomOptionsButtonWithText">
                  Ao vivo

                  <div className="bottomOptionsButtonLiveCircle bottomOptionsButtonImageMarginLeft">
                    <div className={`liveCircle liveCircleColor`}></div>
                  </div>
                </button>
                <p className="bottomButtonDivText displayNone">Assistir ao vivo</p>

              </div>

{/* REMOVER RESSE SE FOR VOD */}
              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Next}></img>
                </button>
                <p className="bottomButtonDivText displayNone">Próximo evento</p>

              </div>







            </div>

            <div className="bottomOptionsButtonContainer bottomMinWidth3">

              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Legend}></img>
                </button>
                <p className="bottomButtonDivText displayNone">Áudio/Legendas</p>
              </div>

              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Highquality}></img>
                </button>
                <p className="bottomButtonDivText displayNone">Qualidade de vídeo</p>
              </div>




            </div>

          </div>


        </div>
      )}

    </div>
  );
}

export default Player;









