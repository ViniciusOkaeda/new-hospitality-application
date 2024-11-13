import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './detailEvent.css';
import { Loader } from "../../components/loader/loader";
import { FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages } from "../../utils/constants";
import { GetEventRecomendationRequest, GetEventRequestTv, GetEventRequestVod, GetMyListFull, GetRecordingsByProfileV2 } from "../../services/calls";
import { useKeyNavigation } from "../../utils/newNavigation";
import AddList from "../../images/list-add.png"
import RemoveList from "../../images/list-remove.png"
import AddRecording from "../../images/button-rec.png"
import RemoveRecording from "../../images/button-norec.png"
import Play from "../../images/play-button.png"
import { RenderRecomendationCards } from "../../components/cards/cards";



function Event() {
    const { type } = useParams(); // Pega o ID da URL
    const { event } = useParams(); // Pega o ID da URL
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [eventContent, setEventContent] = useState([]);
    const [recomendationEvent, setRecomendationEvent] = useState([]);
    const [myList, setMyList] = useState([]);
    const [myRecordings, setMyRecordings] = useState([])
    const [visible, setVisible] = useState(false)
    const [focusedRecomendation, setFocusedRecomendation] = useState([])
    //console.log("vejamos", focusedRecomendation)

    //console.log("oq temos de event", eventContent)
    //console.log("oq temos de recomendation event", recomendationEvent)

    const divRef = useRef([])
    const buttonsRef = useRef([])
    const recomendationsRef = useRef([])

    useEffect(() => {
        const loadData = async () => {
            try {
                if (type === "TV") {
                    const resultEventRequest = await GetEventRequestTv(event);
                    const resultRecomendationRequest = await GetEventRecomendationRequest(event, type)
                    const resultMyList = await GetMyListFull();
                    const resultMyRecordings = await GetRecordingsByProfileV2();
                    if (resultEventRequest && resultRecomendationRequest && resultMyList && resultMyRecordings) {
                        if (resultEventRequest.status === 1 &&
                            resultRecomendationRequest.status === 1 &&
                            resultMyList.status === 1 &&
                            resultMyRecordings.status === 1
                        ) {
                            setEventContent(resultEventRequest.response[0])
                            setRecomendationEvent(resultRecomendationRequest.response[0])
                            setMyList(resultMyList.response)
                            setMyRecordings(resultMyRecordings.response)
                        }
                    }



                } else {
                    const resultEventRequest = await GetEventRequestVod(event);
                    const resultRecomendationRequest = await GetEventRecomendationRequest(event, type)
                    const resultMyList = await GetMyListFull();
                    if (resultEventRequest && resultRecomendationRequest && resultMyList) {
                        if (resultEventRequest.status === 1 &&
                            resultRecomendationRequest.status === 1 &&
                            resultMyList.status === 1
                        ) {
                            setEventContent(resultEventRequest.response)
                            setRecomendationEvent(resultRecomendationRequest.response[0])
                            setMyList(resultMyList.response)
                        }
                    }
                }

            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false); // Dados carregados, então setar como false
            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente

    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez

    const handleArrowDown = () => {
        console.log("Seta para baixo pressionada");
        console.log("meu ref", divRef.current[0])
        divRef.current[1].focus()
        window.scrollTo(0, 500)
    };

    const handleArrowUp = () => {
        console.log("Seta para cima pressionada");
        window.scrollTo(0, 0)
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


    const {
        containerCount,
        cardCount,
        setContainerCount,
        setCardCount,
    } = useKeyNavigation({
        loading,
        onArrowUp: () => handleArrowUp(),
        onArrowDown: () => handleArrowDown(),
        onArrowLeft: () => handleArrowLeft(),
        onArrowRight: () => handleArrowRight(),
        onEnter: () => handleEnter(),
        onEscape: () => handleEscape(),
    });
    return (
        <>
            {loading ? (
                <Loader /> // Exibe o Loader enquanto carrega
            ) : error ? (
                <div className="initialContainer"><h3>Erro: {error}</h3></div> // Exibindo mensagem de erro, se houver


            ) : (

                <div className="flex container flexColumn declaredOverflow">
                    <div className="initialImageWithPositionAbsolute">
                        <img
                            className={eventContent.image_widescreen !== null ? "initialImage" : "initialImage blurImage"}
                            src={eventContent.image_widescreen !== null ? eventContent.image_widescreen : eventContent.image}></img>

                        <div className="initialCardImage">
                            {eventContent.image_widescreen !== null ?
                                ""
                                :
                                <img src={eventContent.image}></img>}
                        </div>

                    </div>

                    <div className="initialContentOptions">

                        <div className="initialContentText">
                            {eventContent.title !== null || eventContent.name_image !== null ?
                                eventContent.name_image !== null ?
                                    <div className="initialImageTitle paddingLeftDefault initialMaxWidth2">
                                        <img src={eventContent.name_image} className="initialImageTitleImg"></img>
                                    </div>
                                    :
                                    <div className="initialTitle paddingLeftDefault initialMaxWidth">
                                        <h1>{eventContent.title}</h1>
                                    </div>

                                : ""}

                            {eventContent.episode !== null ?
                                <div className="initialSeasonAndEpisode paddingLeftDefault">
                                    <h5>{eventContent.subtitle !== null ? eventContent.subtitle : eventContent.episode} ({eventContent.episode}) </h5>
                                </div>

                                : ""}

                            {
                                eventContent.channels_logo !== null ||
                                    eventContent.start !== null ||
                                    eventContent.duration !== null ||
                                    eventContent.genres !== null ||
                                    eventContent.rating !== null ?
                                    <div className="initialDetails paddingLeftDefault">

                                        {eventContent.channels_logo !== null ?
                                            <div className="initialChannelImage">
                                                <img src={
                                                    eventContent.channels_logo_widescreen !== null ?
                                                        eventContent.channels_logo_widescreen :
                                                        eventContent.channels_logo
                                                }></img>
                                            </div>
                                            : ""}

                                        {eventContent.start !== null && eventContent.type !== "VOD" ?
                                            <>
                                                <div className="initialStartAt"><h6>{FormatDate(eventContent.start)}</h6></div>
                                                <span className="initialBasicSpacement">●</span>
                                            </>
                                            : ""}




                                        {eventContent.duration !== null ?
                                            <>
                                                <div className="initialDuration"><h6>{FormatDuration(eventContent.duration) + " min"}</h6></div>
                                                <span className="initialBasicSpacement">●</span>
                                            </>
                                            : ""}

                                        {eventContent.genres !== null ?
                                            <div className="initialGenres"><h6>{eventContent.genres}</h6></div>
                                            : ""}

                                        {eventContent.released !== null && eventContent.type === "VOD" ?
                                            <>
                                                <span className="initialBasicSpacement">●</span>
                                                <div className="initialReleased"><h6>{eventContent.released}</h6></div>
                                            </>
                                            : ""}

                                        {eventContent.imdb_rating !== null && eventContent.type === "VOD" ?
                                            <>
                                                <span className="initialImdbBackground"><h6>IMDb</h6></span>
                                                <span className="initialImdbTextSpan1"><h6>{eventContent.imdb_rating}<span className="initialImdbTextSpan2">/10</span></h6> </span>

                                            </>
                                            : ""}

                                        {eventContent.rating !== null ?
                                            <div
                                                className="initialRating ratingBase"
                                                style={{
                                                    backgroundColor: FormatRating(eventContent.rating)
                                                }}
                                            >A{eventContent.rating}</div>
                                            : ""}


                                    </div>
                                    : ""
                            }






                            {eventContent.description !== null ?
                                <div className="initialDescription paddingLeftDefault initialMaxWidth2">
                                    <p>{FormatDescriptionLength(eventContent.description)}</p>
                                </div>

                                : ""}

                            {eventContent.actors !== null ?
                                <div className="initialActors paddingLeftDefault initialMaxWidth2">
                                    <h5>Atores: {eventContent.actors}</h5>
                                </div>

                                : ""}
                        </div>

                        <div ref={divRef}>
                            <div className="buttonOptionsContainer paddingLeftDefault">
                                <button
                                    className={visible === true ? "buttonWithImage buttonPadding" : "buttonWithImage"}
                                    ref={(el) => {
                                        // Armazena a referência de cada botão
                                        if (!divRef.current[0]) {
                                            divRef.current[0] = [];
                                        }
                                        divRef.current[0] = el;
                                    }}
                                    onClick={(() => {
                                        setVisible(!visible)
                                    })}>
                                    <img className="buttonWithImageSize" src={Play}></img>

                                    {visible &&
                                        <p>Assistir Agora</p>

                                    }
                                </button>

                                <button className={visible === true ? "buttonWithImage buttonPadding" : "buttonWithImage"}
                                    ref={(el) => {
                                        // Armazena a referência de cada botão
                                        if (!divRef.current[1]) {
                                            divRef.current[1] = [];
                                        }
                                        divRef.current[1] = el;
                                    }}
                                    onClick={(() => {
                                        setVisible(!visible)
                                    })}>
                                    <img className="buttonWithImageSize2" src={AddList}></img>

                                    {visible &&
                                        <p>Adicionar para minha lista</p>

                                    }
                                </button>

                                <button className={visible === true ? "buttonWithImage buttonPadding" : "buttonWithImage"}
                                    ref={(el) => {
                                        // Armazena a referência de cada botão
                                        if (!divRef.current[2]) {
                                            divRef.current[2] = [];
                                        }
                                        divRef.current[2] = el;
                                    }}
                                    onClick={(() => {
                                        setVisible(!visible)
                                    })}>
                                    <img className="buttonWithImageSize3" src={AddRecording}></img>

                                    {visible &&
                                        <p>Gravar</p>

                                    }
                                </button>

                            </div>

                            <div className="recomendationContainer">
                                <div className="recomendationTitle paddingLeftDefault">
                                    <h2>{recomendationEvent.title}</h2>
                                </div>


                                <RenderRecomendationCards item={recomendationEvent} setFocusedRecomendation={setFocusedRecomendation} />
                            </div>

                        </div>

                    </div>


                </div>

            )

            }

        </>
    )
}

export default Event