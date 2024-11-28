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

    const [dateIndex, setDateIndex] = useState(0)
    const [dateFocused, setDateFocused] = useState(0)
    const [individualDataLength, setIndividualDataLength] = useState(0)
    console.log("vejamoso valor", dateFocused)


    const handleFocus = (idx) => {
        // Calcular o totalPreviousDataLength com base no índice atual
        const calculatedLength = eventChannels
          .slice(0, idx)  // Pega todos os itens antes do índice atual
          .reduce((acc, currentItem) => acc + currentItem.data.length, 0);
    
        // Atualiza o estado com o comprimento calculado
        setDateFocused(calculatedLength);
    
        // Define o índice do botão que recebeu o foco
        setDateIndex(idx);
      };

    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [eventChannels, setEventChannels] = useState([])
    const [hasFocused, setHasFocused] = useState(false);

    const divRef = useRef([[], []]);    
    const scrollRef = useRef([[], []])
    const dateFocusedRef = useRef(dateFocused);

    React.useEffect(() => {
        dateFocusedRef.current = dateFocused;
    }, [dateFocused]);

    const handleEventButtonRef = (el) => {
        if (el) {
          // Garante que divRef.current[1] esteja inicializado corretamente antes de usar 'push'
          if (!divRef.current[1]) {
            divRef.current[1] = []; // Inicializa o índice 1 se estiver undefined
          }
          if (!divRef.current[1].includes(el)) { // Adiciona a referência se não estiver presente
            divRef.current[1].push(el);
            //console.log('Referência adicionada ao índice 1:', el);

          }
          if (!scrollRef.current[0]) {
            scrollRef.current[0] = []; // Inicializa o índice 1 se estiver undefined
          }
          if (!scrollRef.current[0].includes(el)) { // Adiciona a referência se não estiver presente
            scrollRef.current[0].push(el);
            //console.log('Referência adicionada ao índice 1:', el);

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
            //console.log('Referência adicionada ao índice 0:', el);
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
        if (!scrollRef.current[0]) {
            scrollRef.current[0] = [];
        }

    }, []);

    useEffect(() => {
        // Só foca no primeiro elemento do índice 1 se ainda não tiver sido feito
        if (divRef.current[1].length > 0 && !hasFocused) {
            setContainerCount(1)
            setCardCount(0)
          const firstElement = divRef.current[1][0];
          firstElement.focus();
          console.log("Focado no primeiro elemento do índice 1:", firstElement);
          
          // Define a flag para garantir que o foco só aconteça uma vez
          setHasFocused(true);
        }
      }, [divRef.current[1], hasFocused]);

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


                    }
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                    setLoading(false); // Dados carregados, então setar como false
                    setEnableArrows(true);
                    setContainerCount(1)

            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente




    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez


    const transformData = (events) => {
        const groupedByDay = {};
    
        // Obter a data e hora atuais para comparação
        const now = new Date();
    
        events.forEach((event) => {
            const eventDate = new Date(event.start); // Converte a string "start" para um objeto Date
            const endDate = new Date(event.end); // Converte a string "end" para um objeto Date
    
            // Exclui eventos que terminam no futuro
            if (endDate > now) {
                return; // Não adiciona eventos que terminam no futuro
            }
    
            const day = eventDate.toLocaleDateString('en-GB'); // Exemplo: 'DD/MM/YYYY'
    
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
                end: event.end, // Inclui o "end" para poder compará-lo
                title: event.title
            });
        });
    
        // Formata o objeto final
        let transformed = Object.keys(groupedByDay).map(day => ({
            day: day,
            data: groupedByDay[day]
        }));
    
        // Inverte a ordem de todos os grupos
        transformed.forEach(group => {
            group.data.reverse();
        });
    
        return transformed;
    };

    const getDayLabel = (dateStr, completeDay) => {
        const today = new Date(); // Data atual
        const [day, month, year] = dateStr.split('/'); // Divide a data "dd/mm/yyyy"
        const dayDate = new Date(`${year}-${month}-${day}`); // Cria a data no formato yyyy-mm-dd para comparação
    
        // Zera as horas, minutos, segundos e milissegundos para comparar apenas a data
        today.setHours(0, 0, 0, 0);
        dayDate.setHours(0, 0, 0, 0);
    
        const diffTime = today - dayDate; // Diferença em milissegundos
        const diffDays = diffTime / (1000 * 60 * 60 * 24); // Converte a diferença para dias
    
        // Se a diferença for 0, significa que é hoje
        if (diffDays === 1) {
            return 'Hoje';
        }
    
        // Se a diferença for 1, significa que é ontem
        if (diffDays === 2) {
            return 'Ontem';
        }
    
        // Se for outro dia, retorna o nome do dia da semana
        const daysOfWeek = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
        const daysOfWeekAbbr = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']; // Abreviado
    
        const dayOfWeek = dayDate.getDay(); // Pega o dia da semana (0 - 6)
        const dayOfMonth = dayDate.getDate(); // Pega o dia do mês
    
        if (completeDay) {
            // Se completeDay for true, retorna o nome completo do dia (ex: "Segunda-feira 25")
            return `${daysOfWeek[dayOfWeek]} ${dayOfMonth + 1}`;
        } else {
            // Caso contrário, retorna o nome abreviado do dia (ex: "Seg 25")
            return `${daysOfWeekAbbr[dayOfWeek]} ${dayOfMonth + 1}`;
        }
    };

    const getHourLabel = (dateStr) => {
        const dayDate = new Date(dateStr); // Data recebida
    
        const hourOfDay = dayDate.getHours(); // Pega a hora
        const minutesOfDay = dayDate.getMinutes(); // Pega os minutos
    
        // Adiciona um zero à esquerda caso a hora ou os minutos sejam menores que 10
        const formattedHour = hourOfDay < 10 ? `0${hourOfDay}` : hourOfDay;
        const formattedMinutes = minutesOfDay < 10 ? `0${minutesOfDay}` : minutesOfDay;
    
        return `${formattedHour}:${formattedMinutes}`;
    };

    // Funções de navegação
    const handleArrowDown = () => {
        console.log("Seta para baixo pressionada");

        if(containerCount === 0) {
            let nextCardIndex = buttonCount + 1
            
            if(divRef.current[containerCount] && divRef.current[containerCount][nextCardIndex]) {
                setButtonCount(nextCardIndex);
                divRef.current[containerCount][nextCardIndex].focus()

                setTimeout(() => {
                    const scrollStep = 150 * dateFocusedRef.current; // Usa o valor mais recente de dateFocused
                    const refButtonFocused = scrollRef.current[0][dateFocusedRef.current -1]
    
                    if (refButtonFocused) {
                        const elementRect = refButtonFocused.getBoundingClientRect();
                        const distanceFromTopOfContent = (elementRect.top + scrollRef.current.scrollTop);
                        scrollRef.current.scrollBy({
                            top: distanceFromTopOfContent, // Rola a div para baixo no valor calculado de scrollStep
                            behavior: 'smooth' // Adiciona rolagem suave
                        });
                    }
                        //const lastElement = buttonRefs.current[containerCount + 1].getAttribute('id')

                        // Distância do topo da div até o topo do elemento focado no conteúdo total

                }, 100);
            }


        

        }else if (containerCount === 1) {
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
        if(containerCount === 0){
            let previousCardIndex = buttonCount - 1;

            if(divRef.current[containerCount] && divRef.current[containerCount][previousCardIndex]) {
                setButtonCount(previousCardIndex)
                divRef.current[containerCount][previousCardIndex].focus()
            }
        }else if(containerCount === 1) {
            let previousCardIndex = cardCount - 1;
            if (divRef.current[containerCount] && divRef.current[containerCount][previousCardIndex]) {
                setCardCount(previousCardIndex);
                divRef.current[containerCount][previousCardIndex].focus();
            }
        }
    };

    const handleArrowLeft = () => {
        if(containerCount > 0) {
            let previousCardIndex = containerCount - 1
            setContainerCount(previousCardIndex)
            if(divRef.current[previousCardIndex] && divRef.current[previousCardIndex][buttonCount]) {
                
                divRef.current[previousCardIndex][buttonCount].focus()
            }
        }
    };

    const handleArrowRight = () => {
        if(containerCount < 1) {
            let nextCardIndex = containerCount + 1
            setContainerCount(nextCardIndex)
            if(divRef.current[nextCardIndex] && divRef.current[nextCardIndex][cardCount]) {
                divRef.current[nextCardIndex][cardCount].focus()
            }
        }
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
                                            const totalPreviousDataLength = eventChannels
                                            .slice(0, idx)  // Pega todos os itens antes do índice atual
                                            .reduce((acc, currentItem) => acc + currentItem.data.length, 0);
                                    
                                    return (
                                        <button
                                        ref={handleOtherButtonRef}
                                            key={idx}
                                            className="fixedDateButton"
                                            onFocus={(() => {
                                                handleFocus(idx)
                                                //setIndividualDataLength(item.data.length)
                                                //setDateIndex(idx)
                                            })}

                                            style={{
                                                backgroundColor: dateIndex === idx  ? "red" : "rgba(0, 0, 0, 0)"
                                            }}
                                        >
                                            <h3>{getDayLabel(item.day, false)}</h3>
                                        </button>
                                    )
                                })}
                                <h3></h3>
                            </div>

                            <div className="fixedEventDetail" ref={scrollRef}>
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
                                                                setDateIndex(idx)
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