import React, { useEffect, useState, useRef } from "react";
import './detailCatchup.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate, useParams } from "react-router-dom";
import { GetTodayDate, FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages, GetProgressPercentage, FormatChannelTitleLength, FormatChannelDescriptionLength } from "../../utils/constants";
import { GetChannelCategories, GetSubscribedAndLockedChannels, GetFavoriteChannels, GetLiveChannelEvents, GetChannelEvents } from "../../services/calls";
import { Menu } from "../../components/menu/menu";
import { useKeyNavigation } from "../../utils/newNavigation";
import { RenderCards, RenderCardsWithBackground, RenderChannelsCards, RenderTest } from "../../components/cards/cards";


function DetailCatchup() {
    const [enableArrows, setEnableArrows] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento
    const { channel } = useParams(); // Pega o ID da URL



    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState('');

    const navigate = useNavigate()

    const [channelsName, setChannelsName] = useState('')
    const [channelsImage, setChannelsImage] = useState('')
    const [focusedContent, setFocusedContent] = useState([])
    const [channelFocused, setChannelFocused] = useState([])

    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [eventChannels, setEventChannels] = useState([])

    const divRef = useRef([[], []]);    const handleButtonRef = (index, index2, el) => {
        // Garantir que o array esteja inicializado
        if (!divRef.current[index]) {
            divRef.current[index] = [];
        }
        divRef.current[index][index2] = el;
    };

    const handleEventButtonRef = (el) => {
        if (el) {
          // Garante que divRef.current[1] esteja inicializado corretamente antes de usar 'push'
          if (!divRef.current[1]) {
            divRef.current[1] = []; // Inicializa o índice 1 se estiver undefined
          }
          if (!divRef.current[1].includes(el)) { // Adiciona a referência se não estiver presente
            divRef.current[1].push(el);
          }
        }
      };

      const handleOtherButtonRef = (el) => {
        if (el) {
          // Garante que divRef.current[0] esteja inicializado corretamente antes de usar 'push'
          if (!divRef.current[0]) {
            divRef.current[0] = []; // Inicializa o índice 0 se estiver undefined
          }
          if (!divRef.current[0].includes(el)) { // Adiciona a referência se não estiver presente
            divRef.current[0].push(el);
            console.log('Referência adicionada ao índice 0:', el);
          }
        }
      };

    useEffect(() => {
        if (!divRef.current[0]) {
            divRef.current[0] = [];
        }
        if (!divRef.current[1]) {
            divRef.current[1] = [];
        }
    }, []);


    // Função para atualizar as dimensões da div


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetChannelEvents(channel);
                if (result) {
                    if (result.status === 1) {
                        setChannelsName(result.response[0].channels_name)
                        setChannelsImage(result.response[0].channels_logo)
                        const transformedData = transformData(result.response);
                        console.log("o transforfm", transformedData)
                        setEventChannels(transformedData.reverse())
                        setContainerCount(1)
                        setCardCount(-1)

                    }
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setTimeout(() => {
                    setLoading(false); // Dados carregados, então setar como false
                    setEnableArrows(true);
                    setContainerCount(1)

                }, 1000)


            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente




    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez


    const transformData = (events) => {
        const groupedByDay = {};

        events.forEach((event) => {
            const eventDate = new Date(event.start);  // Converte a string "start" para um objeto Date
            const day = eventDate.toISOString().split('T')[0];  // Extrai a data sem o horário (ex: '2024-11-20')

            if (!groupedByDay[day]) {
                groupedByDay[day] = [];  // Inicializa um array para o dia, se não existir
            }

            // Adiciona o evento ao dia correspondente
            groupedByDay[day].push({
                channels_id: event.channels_id,
                channels_name: event.channels_name,
                description: event.description,
                duration: event.duration,
                genres: event.genres,
                id: event.id,
                image: event.image,
                image_widescreen: event.image_widescreen,
                rating: event.rating,
                start: event.start,
                title: event.title

            });
        });

        // Formata o objeto final
        const transformed = Object.keys(groupedByDay).map(day => ({
            day: day,
            data: groupedByDay[day]
        }));

        return transformed;
    };

    const getDayLabel = (dateStr, completeDay) => {
        const today = new Date(); // Data atual
        const dayDate = new Date(dateStr); // Data recebida

        // Zera as horas, minutos, segundos e milissegundos para comparar as datas sem o horário
        today.setHours(0, 0, 0, 0);
        dayDate.setHours(0, 0, 0, 0);

        const diffTime = today - dayDate; // Diferença em milissegundos
        const daysAgo = diffTime / (1000 * 60 * 60 * 24); // Converte a diferença para dias
        // Se for hoje
        if (daysAgo === 1) {
            return 'Hoje';
        }

        // Se for ontem
        if (daysAgo === 2) {
            return 'Ontem';
        }

        if (completeDay === true) {

            // Caso contrário, retorna o dia da semana (Seg, Ter, Qua, etc)
            const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
            const dayOfWeek = dayDate.getDay(); // Pega o índice do dia da semana (0 - 6)
            const dayOfMonth = dayDate.getDate(); // Pega o dia do mês

            return `${daysOfWeek[dayOfWeek]} ${dayOfMonth + 1}`; // Exemplo: "Seg 25", "Dom 24", etc.

        } else {

            // Caso contrário, retorna o dia da semana (Seg, Ter, Qua, etc)
            const daysOfWeek = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
            const dayOfWeek = dayDate.getDay(); // Pega o índice do dia da semana (0 - 6)
            const dayOfMonth = dayDate.getDate(); // Pega o dia do mês

            return `${daysOfWeek[dayOfWeek]} ${dayOfMonth + 1}`; // Exemplo: "Seg 25", "Dom 24", etc.

        }
    };

    const getHourLabel = (dateStr) => {
        const dayDate = new Date(dateStr); // Data recebida

        const hourOfDay = dayDate.getHours() // Pega o índice do dia da semana (0 - 6)
        const minutesOfDay = dayDate.getMinutes()
        return `${hourOfDay}:${minutesOfDay}`
    }
    // Funções de navegação
    const handleArrowDown = () => {
        console.log("Seta para baixo pressionada");
        console.log("meu difre", divRef.current[1])

        if (containerCount === 1) {
            console.log("opa")
                let nextCardIndex = cardCount + 1;
                if (divRef.current[containerCount] && divRef.current[containerCount][nextCardIndex]) {
                    setCardCount(nextCardIndex);
                    divRef.current[containerCount][nextCardIndex].focus();
                    //divRef.current[containerCount][nextCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
                }
        }
    };

    const handleArrowUp = () => {
        console.log("Seta para cima pressionada");
    };

    const handleArrowLeft = () => {

    };

    const handleArrowRight = () => {

    };

    const handleEnter = () => {

        //window.location.href = `/player/TV/LIVE/${channelFocused.channels_id}`;
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

                <div className="flex container flexColumn declaredOverflow" ref={divRef}
                >

                    {console.log("meu focused", focusedContent)}
                    <div
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(17, 16, 20, 1) 0%, rgba(17, 16, 20, 0.9) 30%, rgba(17, 16, 20, 0.1) 100%), url(${focusedContent.image_widescreen !== null ? focusedContent.image_widescreen : focusedContent.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                        className="fixedBgdEvent">

                        <div className="fixedBgdContent">
                            <div className="fixedBgdTitle">
                                <h2>{focusedContent.title}</h2>
                            </div>
                            <div className="fixedBgdDetails">
                                {focusedContent.duration !== null ?
                                    <>
                                        <div className="focusedDuration"><h6>{FormatDuration(focusedContent.duration) + " min"}</h6></div>
                                        <span className="focusedBasicSpacement">●</span>
                                    </>
                                    : ""}

                                {focusedContent.genres !== null ?
                                    <div className="focusedGenres"><h6>{focusedContent.genres}</h6></div>
                                    : ""}

                                {focusedContent.rating !== null ?
                                    <div
                                        className="focusedRating ratingBase"
                                        style={{
                                            backgroundColor: FormatRating(focusedContent.rating)
                                        }}
                                    >A{focusedContent.rating === 0 ? "L" : focusedContent.rating}</div>
                                    : ""}

                            </div>
                            <div className="fixedBgdDescription">
                                <h4>{FormatDescriptionLength(focusedContent.description)}</h4>
                            </div>
                        </div>

                    </div>

                    <div className="fixedContainer paddingLeftDefault">
                        <div className="fixedChannelDetail">
                            <h2>{channelsName}</h2>
                            <img src={channelsImage}></img>
                        </div>
                        <div className="fixedEventsContainer" ref={divRef}>
                            <div className="fixedDate">
                                {eventChannels.map((item, idx) => {

                                    return (
                                        <button
                                        ref={handleOtherButtonRef}
                                            key={idx}
                                            className="fixedDateButton"
                                        >
                                            <h3>{getDayLabel(item.day, false)}</h3>
                                        </button>
                                    )
                                })}
                                <h3></h3>
                            </div>

                            <div className="fixedEventDetail">
                                {eventChannels.map((eventChannel, idx) => {

                                    return (
                                        <div
                                            className="fixedEvent"
                                            key={idx}
                                        >
                                            <h3>{getDayLabel(eventChannel.day, true)}</h3>

                                            {eventChannel.data.map((eventInfo, index) => {

                                                return (
                                                    <div
                                                        key={index}
                                                        className="eventInfoContainer"
                                                    >
                                                        <button
                                                            ref={handleEventButtonRef}                                                            
                                                            className="eventInfoBgdButton"
                                                            onFocus={(() => {
                                                                setFocusedContent(eventInfo)
                                                            })}
                                                        >
                                                            <img src={eventInfo.image_widescreen !== null ? eventInfo.image_widescreen : eventInfo.image}></img>

                                                        </button>

                                                        <div className="eventInfoDescription">
                                                            <h5>{eventInfo.title}</h5>
                                                            <h5>{getHourLabel(eventInfo.start)}</h5>
                                                        </div>

                                                    </div>
                                                )
                                            })}
                                        </div>

                                    )
                                })}
                            </div>
                        </div>
                    </div>


                </div>

            )

            }

        </>

    );
}


export default DetailCatchup;