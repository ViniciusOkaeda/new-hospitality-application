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
import { FormatDate, FormatRating } from "../../utils/constants";
import { GetStreamChannelUrlV3, GetStreamVodUrlV3, GetEventRequestTv, GetEventRequestVod } from "../../services/calls";
import axios from "axios";
import { useKeyNavigation } from "../../utils/newNavigation";

function Player() {
  const { type } = useParams(); // Pega o ID da URL
  const { event } = useParams(); // Pega o ID da URL
  const { channel } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();
  const location = useLocation();
  const message = location
  console.log("sera q tem algo", message)
  console.log("meu window", window.location.pathname)
  const checkLive = window.location.pathname

  const [eventDetails, setEventDetails] = useState([])
  const [videoContent, setVideoContent] = useState([])
  const [enableArrows, setEnableArrows] = useState(false)
  const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
  const [error, setError] = useState('');

  const [bottomMenu, setBottomMenu] = useState(true)


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
                    await videoManager.load(result.response.url).then(function() {
                      video.currentTime = 410
                  })
                    //await videoManager.load(TEST_VIDEO);
                    videoManager.play();
                    uiReady();

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
            if(res) {
              if(res.status === 1) {
                console.log("meu res", res.response)
                setEventDetails(res.response)
                const result = await GetStreamVodUrlV3(event, type)
                if(result) {
                  if(result.status === 1 ) {
                    setVideoContent(result.response)
                    var video = document.getElementById('video');
                    const videoManager = new VideoManager(result.response);
                    await init();
                    videoManager.init(video);
                    await videoManager.load(result.response.url)
                    //await videoManager.load(TEST_VIDEO);
                    videoManager.play();
                    uiReady();

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
      <video id="video" width="1920" height="1080" muted="muted" className="videoContainer"></video>
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

          </div>

          <div className="bottomMenuOptions">
            <div className="bottomOptionsButtonContainer bottomMinWidth1">
              <div className="bottomButtonDiv">
                <button className="bottomOptionsButton bottomOptionsButtonAdditional">
                  <img className="bottomOptionsButtonImage" src={Monitor}></img>
                </button>
                <p className="bottomButtonDivText displayNone">Canais</p>
              </div>
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

              <div className="bottomButtonDivLive">
                <button className="bottomOptionsButton bottomOptionsButtonWithText">
                  Ao vivo

                  <div className="bottomOptionsButtonLiveCircle bottomOptionsButtonImageMarginLeft">
                    <div className={`liveCircle liveCircleColor`}></div>
                  </div>
                </button>
                <p className="bottomButtonDivText displayNone">Assistir ao vivo</p>

              </div>


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









