import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams, useNavigate, Redirect } from 'react-router-dom';
import './detailEvent.css';
import { Loader } from "../../components/loader/loader";
import { FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages, CheckIfHaveList, CheckIfHaveRecording } from "../../utils/constants";
import { GetEventRecomendationRequest, GetEventRequestTv, GetEventRequestVod, GetMyListFull, GetRecordingsByProfileV2, AddToMyList, RemoveFromMyList, AddRecordingV2, RemoveRecording } from "../../services/calls";
import { useKeyNavigation } from "../../utils/newNavigation";
import FutureIcon from "../../images/future.png";
import AddList from "../../images/list-add.png"
import RemoveList from "../../images/list-remove.png"
import AddRecordingImage from "../../images/button-rec.png"
import RemoveRecordingImage from "../../images/button-norec.png"
import Play from "../../images/play-button.png"
import { RenderRecomendationCards } from "../../components/cards/cards";
import { CountdownMessage } from "../../components/count-message/countDownMessage"



function Event() {
    const { type } = useParams(); // Pega o ID da URL
    const { event } = useParams(); // Pega o ID da URL
    const navigate = useNavigate();

    const [enableArrows, setEnableArrows] = useState(false)
    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [eventContent, setEventContent] = useState([]);
    const [recomendationEvent, setRecomendationEvent] = useState([]);
    const [myList, setMyList] = useState([]);
    const [myRecordings, setMyRecordings] = useState([])
    const [visible, setVisible] = useState(false)
    const [focusedRecomendation, setFocusedRecomendation] = useState([])

    const [resultDate, setResultDate] = useState(null);
    const divRef = useRef([])
    const buttonsRef = useRef([])
    const recomendationsRef = useRef([])

    const isFutureDate = (dateString) => {
        // Cria um objeto Date a partir da string
        const targetDate = new Date(dateString);
        
        // Cria um objeto Date com a data e hora atual
        const currentDate = new Date();
    
        // Compara a data fornecida com a data atual
        return targetDate > currentDate;
      };
    
      const checkDate = (start) => {
        const dateToCheck = start;  // Exemplo de data fornecida
        const result = isFutureDate(dateToCheck);
        console.log("o resultado do check é", result)
        setResultDate(result);  // Atualiza o estado com o resultado
      };

    const handleSendToList = async (event, type) => {
        const response = await AddToMyList(event, type)

        if (response) {
            if (response.status === 1) {
                const resultMyList = await GetMyListFull();
                if (resultMyList) {
                    if (resultMyList.status === 1) {
                        setMyList(resultMyList.response)
                    }
                }
            }
        }

    };

    const handleRemoveToList = async (event, type) => {
        const response = await RemoveFromMyList(event, type)

        if (response) {
            if (response.status === 1) {
                const resultMyList = await GetMyListFull();
                if (resultMyList) {
                    if (resultMyList.status === 1) {
                        setMyList(resultMyList.response)
                    }
                }
            }
        }

    };


    const handleSendToRecording = async (id) => {
        const response = await AddRecordingV2(id)

        if (response) {
            if (response.status === 1) {
                const resultMyRecording = await GetRecordingsByProfileV2();
                if (resultMyRecording) {
                    if (resultMyRecording.status === 1) {
                        setMyRecordings(resultMyRecording.response)
                    }
                }
            } else {

            }
        }

    };

    const handleRemoveToRecording = async (id) => {
        const response = await RemoveRecording(id)

        if (response) {
            if (response.status === 1) {
                const resultMyRecording = await GetRecordingsByProfileV2();
                if (resultMyRecording) {
                    if (resultMyRecording.status === 1) {
                        setMyRecordings(resultMyRecording.response)
                    }
                }
            }
        }

    };

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
                            console.log("nos temos", resultEventRequest.response[0].start)
                            checkDate(resultEventRequest.response[0].start)
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
                setEnableArrows(true);
            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente

    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez

    const handleArrowDown = () => {
        console.log("Seta para baixo pressionada");


        if (containerCount < 1) {
            let nextItemIndex = containerCount + 1;
            setContainerCount(nextItemIndex);
            if (nextItemIndex === 0) {
                console.log("opa")
                if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][buttonCount]) {
                    divRef.current[nextItemIndex][buttonCount].focus();
                }
            } else if (nextItemIndex === 1) {

                if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][cardCount]) {
                    console.log("o next", nextItemIndex)
                    console.log("meu ref", divRef.current[nextItemIndex])
                    window.scrollTo(0, 800)
                    divRef.current[nextItemIndex][cardCount].focus();
                }
            }

        }


        //divRef.current[1].focus()

    };

    const handleArrowUp = () => {
        console.log("Seta para cima pressionada");
        if (containerCount > 0) {
            let nextItemIndex = containerCount - 1;
            setContainerCount(nextItemIndex);
            if (nextItemIndex === 0) {
                console.log("opa")
                if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][buttonCount]) {
                    window.scrollTo(0, 0)
                    divRef.current[nextItemIndex][buttonCount].focus();
                }
            }
        }
    };

    const handleArrowLeft = () => {
        if (containerCount === 0) {
            if (buttonCount > 0) {
                let nextItemIndex = buttonCount - 1;
                setButtonCount(nextItemIndex)
                if (divRef.current[0][nextItemIndex]) {
                    divRef.current[0][nextItemIndex].focus();
                }
            }
        } else if (containerCount === 1) {
            if (cardCount > 0) {
                let nextItemIndex = cardCount - 1
                setCardCount(nextItemIndex);
                if (divRef.current[1][nextItemIndex]) {
                    divRef.current[1][nextItemIndex].focus();
                }
            }
        }
    };

    const handleArrowRight = () => {
        if (containerCount === 0) {
            console.log("to aqui", divRef.current[0].length)
            if (buttonCount < divRef.current[0].length - 1) {
                let nextItemIndex = buttonCount + 1;
                setButtonCount(nextItemIndex)
                console.log("o next", nextItemIndex)
                if (divRef.current[0][nextItemIndex]) {
                    divRef.current[0][nextItemIndex].focus();
                }
            }
        } else if (containerCount === 1) {
            console.log("o width é", divRef.current.scrollWidth)
            if (cardCount < divRef.current[1].length - 1) {
                let nextItemIndex = cardCount + 1;
                setCardCount(nextItemIndex)
                console.log("o next", nextItemIndex)
                if (divRef.current[1][nextItemIndex]) {
                    divRef.current[1][nextItemIndex].focus();
                }
            }

            setTimeout(() => {
                if (divRef.current) {
                    const refButtonFocusedX = divRef.current[1][cardCount]

                    if (refButtonFocusedX) {
                        const elementRect = refButtonFocusedX.getBoundingClientRect();
                        console.log("o element", elementRect)

                        const distanceFromLeftOfContent = elementRect.left - divRef.current.getBoundingClientRect().left + divRef.current.scrollLeft
                        console.log("o dist", distanceFromLeftOfContent)

                        divRef.current.scrollTo({
                            left: distanceFromLeftOfContent,  // Rola para cima 700px (ajuste conforme necessário)
                            behavior: 'smooth',  // Rolagem suave
                        });


                    }
                }
            }, 100)

        }
    };

    const handleEnter = () => {

        if (containerCount === 0) {
            if (buttonCount === 0) {
                if(type === "TV") {
                    if(resultDate === false) {
                        navigate(`/player/${type}/${event}/${eventContent.channels_id}`)
                    }
                } else {
                    //navigate(`/player/${type}/${event}/`)

                }

            } else if (buttonCount === 1) {
                const myCheck = CheckIfHaveList(myList, type, event)
                //CheckIfHaveList(myList, type, event)
                console.log("mycheck", myCheck)
                if (myCheck === true) {
                    handleRemoveToList(event, type)
                    //remover da lista
                } else {
                    //adicionar na lista
                    handleSendToList(event, type)


                    //AddToMyList(event, type)
                }
            } else if (buttonCount === 2) {
                const myCheck = CheckIfHaveRecording(myRecordings, event)
                //CheckIfHaveList(myList, type, event)
                console.log("mycheck", myCheck)
                if (myCheck === true) {
                    handleRemoveToRecording(event)
                    //remover da lista
                } else {
                    //adicionar na lista
                    handleSendToRecording(event)
                }

            }
            console.log("meu buttonCont é", buttonCount)

        } else if (containerCount === 1) {
            console.log("o recomendado com foco", focusedRecomendation)
            navigate(`/event/${focusedRecomendation.type}/${focusedRecomendation.id}`, { replace: true });
            window.location.reload()
            //handleRedirect(focusedRecomendation.type, focusedRecomendation.id)
            //navigate(`/event/${focusedRecomendation.type}/${focusedRecomendation.id}`)


        }
    };

    const handleEscape = () => {
        console.log("Escape pressionado");
        window.history.back()
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

                                {type === "TV" ?
                                    resultDate === true ? 
                                <button
                                    className="buttonWithImage"
                                    ref={(el) => {
                                        // Armazena a referência de cada botão
                                        if (!divRef.current[0]) {
                                            divRef.current[0] = [];
                                        }
                                        divRef.current[0][0] = el;
                                    }}
                                >
                                    <img className="buttonWithImageSize2" src={FutureIcon}></img>

                                    <p className="displayNoneText">Disponível em breve</p>
                                </button>

                                    :

                                <button
                                    className="buttonWithImage"
                                    ref={(el) => {
                                        // Armazena a referência de cada botão
                                        if (!divRef.current[0]) {
                                            divRef.current[0] = [];
                                        }
                                        divRef.current[0][0] = el;
                                    }}
                                >
                                    <img className="buttonWithImageSize" src={Play}></img>

                                    <p className="displayNoneText">Assistir Agora</p>
                                </button>
                                :
                                <button
                                    className="buttonWithImage"
                                    ref={(el) => {
                                        // Armazena a referência de cada botão
                                        if (!divRef.current[0]) {
                                            divRef.current[0] = [];
                                        }
                                        divRef.current[0][0] = el;
                                    }}
                                >
                                    <img className="buttonWithImageSize" src={Play}></img>

                                    <p className="displayNoneText">Assistir Agora</p>
                                </button>
                                
                                }




                                <button className="buttonWithImage"
                                    ref={(el) => {
                                        // Armazena a referência de cada botão
                                        if (!divRef.current[0]) {
                                            divRef.current[0] = [];
                                        }
                                        divRef.current[0][1] = el;
                                    }}

                                >
                                    {CheckIfHaveList(myList, type, event) === true ?
                                        <>
                                            <img className="buttonWithImageSize2" src={RemoveList}></img>

                                            <p className="displayNoneText">Remover da minha lista</p>

                                        </>
                                        :
                                        <>
                                            <img className="buttonWithImageSize2" src={AddList}></img>

                                            <p className="displayNoneText">Adicionar para minha lista</p>

                                        </>
                                    }
                                </button>

                                {type === "TV" && (
                                    <button className="buttonWithImage"
                                        ref={(el) => {
                                            // Armazena a referência de cada botão
                                            if (!divRef.current[0]) {
                                                divRef.current[0] = [];
                                            }
                                            divRef.current[0][2] = el;
                                        }}
                                    >
                                        {CheckIfHaveRecording(myRecordings, event) === true
                                            ?
                                            <>
                                                <img className="buttonWithImageSize3" src={RemoveRecordingImage}></img>

                                                <p className="displayNoneText">Remover das gravações</p>

                                            </>
                                            :
                                            <>
                                                <img className="buttonWithImageSize3" src={AddRecordingImage}></img>

                                                <p className="displayNoneText">Gravar</p>

                                            </>}
                                    </button>


                                )}

                            </div>

                            <div className="recomendationContainer">
                                <div className="recomendationTitle paddingLeftDefault">
                                    <h2>{recomendationEvent.title}</h2>
                                </div>

                                <RenderRecomendationCards item={recomendationEvent} setFocusedRecomendation={setFocusedRecomendation} divRef={divRef} />
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