import React, { useEffect, useState, useRef } from "react";
import './channel.css';
import { Loader } from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { GetChannelCategories, GetSubscribedAndLockedChannels, GetFavoriteChannels, GetLiveChannelEvents } from "../../services/calls";
import { GetTodayDate, FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages, GetProgressPercentage, FormatChannelTitleLength, FormatChannelDescriptionLength } from "../../utils/constants";
import { Menu } from "../../components/menu/menu";
import { useKeyNavigation } from "../../utils/newNavigation";

function Channel() {
    const [enableArrows, setEnableArrows] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento



    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState('');

    const navigate = useNavigate()

    const [categoryFocused, setCategoryFocused] = useState(null)
    const [categoryFilteredOnKeyPress, setCategoryFilteredOnKeyPress] = useState(null)
    const [channelFocused, setChannelFocused] = useState([])

    const [enableCountChannels, setEnableCountChannels] = useState(false)
    const [horizontalChannelCount, setHorizontalChannelCount] = useState(0)
    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [subcribedChannels, setSubscribedChannels] = useState([])
    const [channelCategories, setChannelCategories] = useState([])
    const [favoriteChannels, setFavoriteChannels] = useState([])
    const [liveEventChannels, setLiveEventChannels] = useState([])

    const divRef = useRef([]); // Ref para a div que você deseja medir
    const handleButtonRef = (index, index2, el) => {
        // Garantir que o array esteja inicializado
        if (!divRef.current[index]) {
            divRef.current[index] = [];
        }
        divRef.current[index][index2] = el;
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
                const result = await GetSubscribedAndLockedChannels();
                if (result) {
                    if (result.status === 1) {
                        setSubscribedChannels(result.response)
                        const resultCategories = await GetChannelCategories();
                        if (resultCategories) {
                            if (resultCategories.status === 1) {
                                //console.log("o result categories", resultCategories)
                                setChannelCategories(resultCategories.response)
                                const resultFavoriteChannels = await GetFavoriteChannels();
                                if (resultFavoriteChannels) {
                                    if (resultFavoriteChannels.status === 1) {
                                        setFavoriteChannels(resultFavoriteChannels.response)
                                        const resultLiveEvents = await GetLiveChannelEvents();
                                        if (resultLiveEvents) {
                                            setLiveEventChannels(resultLiveEvents.map(e => e.content))

                                        }
                                    }
                                }
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
        };

        loadData(); // Chama a função de carregamento ao montar o componente

    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez


    const [selectableContainers, setSelectableContainers] = useState([]);
    const [menuFocused, setMenuFocused] = useState(false);
    const [selectableMenus, setSelectableMenu] = useState([])
    const menuRef = useRef(null)

    // Funções de navegação
    const handleArrowDown = () => {
        console.log("Seta para baixo pressionada");

        if (menuFocused) {
            // Se o menu estiver focado, navega pelos itens do menu
            const nextCount = menuCount + 1;
            if (menuRef.current && nextCount <= 9) {
                setMenuCount(nextCount); // Atualiza containerCount
                menuRef.current.focusButton(nextCount); // Foca o próximo item
            }
        } else {
            if(containerCount < 1) {
                let nextItemIndex = containerCount + 1
                setContainerCount(nextItemIndex)
                if(nextItemIndex === 0){
                    setTimeout(() => {
                        // Certifique-se de que divRef.current[0][0] existe e focá-lo
                        if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][buttonCount]) {
                            console.log("Focando o primeiro item de divRef.current[0][0]");
                            window.scrollTo(0, 0)
                            divRef.current[nextItemIndex][buttonCount].focus();
                                            }
                    }, 10);
                }else if(nextItemIndex === 1) {
                    if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][cardCount]) {
                        //console.log("o next", nextItemIndex)
                        //console.log("meu ref", divRef.current[nextItemIndex])
                        //window.scrollTo(0, 0)
                        divRef.current[nextItemIndex][cardCount].focus();
                        setEnableCountChannels(true)
                    }
                    
                }
            }
            if(enableCountChannels === true) {
                console.log("virou true")
                if(cardCount < divRef.current[containerCount].length - 1) {
                    let nextChannelIndex = cardCount + 4
                    setCardCount(nextChannelIndex)
                    console.log("o cardCount", cardCount)
                    if(divRef.current[containerCount][nextChannelIndex]) {
                        divRef.current[containerCount][nextChannelIndex].focus()
                    }
                }
                
            }
            //console.log("meu buttonref el0", divRef.current[0])
            //console.log("meu buttonref el1", divRef.current[1])
            //logica da pagina em si

        }
    };

    const handleArrowUp = () => {
        console.log("Seta para cima pressionada");

        if (menuFocused) {
            // Se o menu estiver focado, navega para o item anterior
            const prevCount = menuCount - 1;
            if (menuRef.current && prevCount >= 0) {
                setMenuCount(prevCount); // Atualiza containerCount
                menuRef.current.focusButton(prevCount); // Foca o item anterior
            }
        } else {

            if (containerCount > 0) {
                if(cardCount < 4) {
                    let nextItemIndex = containerCount - 1;
                    setContainerCount(nextItemIndex);
                    if (nextItemIndex === 0) {
                        console.log("opa")
                        if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][buttonCount]) {
                            window.scrollTo(0, 0)
                            setEnableCountChannels(false)
                            divRef.current[nextItemIndex][buttonCount].focus();
                        }
                    }
                } else {
                        let nextChannelIndex = cardCount - 4
                        setCardCount(nextChannelIndex)
                        console.log("o cardCount", cardCount)
                        if(divRef.current[containerCount][nextChannelIndex]) {
                            divRef.current[containerCount][nextChannelIndex].focus()
                    }
                }
            }
            //logica da pagina
        }
    };

    const handleArrowLeft = () => {
        if (containerCount === -1 || cardCount === -1 || horizontalChannelCount === -1) {
            // Se estamos no menu ou se o card não está focado (cardCount === -1)
            setMenuFocused(true); // Ativa o foco no menu

            // Foca o primeiro item do menu
            if (menuRef.current) {
                menuRef.current.focusButton(menuCount);
            }
        } else {
            if(containerCount === 0) {
                let previousCardIndex = buttonCount - 1;
                if(previousCardIndex >= 0) {
                    setButtonCount(previousCardIndex)
                    if(divRef.current[containerCount] && divRef.current[containerCount][previousCardIndex]) {
                        divRef.current[containerCount][previousCardIndex].focus()
                    }
                } else {
                    setButtonCount(-1);
                    setMenuFocused(true);
                    if(menuRef.current) {
                        menuRef.current.focusButton(menuCount);
                    }
                }
            } else {

                if(horizontalChannelCount > -1) {
                    setHorizontalChannelCount(horizontalChannelCount -1)
                    if(horizontalChannelCount > 0) {
                        let previousCardIndex = cardCount - 1;
                        setCardCount(previousCardIndex);
                        if (divRef.current[containerCount] && divRef.current[containerCount][previousCardIndex]) {
                            divRef.current[containerCount][previousCardIndex].focus();
                            //divRef.current[containerCount][previousCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
                        }
                    }  
                }
                if(horizontalChannelCount === -1) {
                    console.log("cheguei aqui")
                }

                /*
                if (previousCardIndex >= 0) {
                    // Se houver um card anterior, atualizamos o cardCount e focamos no card
 
                } else {
                    // Se previousCardIndex for -1, desfocamos o card e focamos no menu
                    setCardCount(-1); // Atualiza o estado de cardCount para -1
                    setMenuFocused(true); // Desfoca o menu
                    if (menuRef.current) {
                        menuRef.current.focusButton(menuCount); // Foca o item do menu
                    }
            }
                
                
                */
                
            }
            // Se estamos em um card, decrementamos o cardCount para focar no card anterior


        }
    };

    const handleArrowRight = () => {
        if (menuFocused) {
            // Se o menu estiver focado, desfocamos o menu
            setMenuFocused(false); // Desfoca o menu

            // Desfoca o item de menu que estava com foco
            if (menuRef.current) {
                menuRef.current.blurButton(menuCount); // Desfoca o item do menu
            }

            // Agora, garantimos que o cardCount seja 0
            if (containerCount !== -1) {
                setButtonCount(0)

                //setHorizontalChannelCount(0)
                // Se o cardCount estiver -1, significa que não havia foco no card, então foca no primeiro card
                setCardCount(0); // Garantir que o foco vá para o primeiro card
            }

            // Foca no primeiro card
            if(containerCount === 0) {
                if (divRef.current[containerCount] && divRef.current[containerCount][0]) {
                    divRef.current[containerCount][0].focus(); // Foca no primeiro card
                    setButtonCount(0)
                }

            } else {
                if(cardCount > 3) {
                    if (divRef.current[containerCount] && divRef.current[containerCount][cardCount]) {
                        divRef.current[containerCount][cardCount].focus(); // Foca no primeiro card
                    }
                } else {
                    if (divRef.current[containerCount] && divRef.current[containerCount][0]) {
                        divRef.current[containerCount][0].focus(); // Foca no primeiro card
                        setCardCount(0)
                    }
                }
            }
        } else {

            if(containerCount === 0) {
                setCardCount(0)
                let nextItemIndex = buttonCount + 1;
                if (divRef.current[containerCount] && divRef.current[containerCount][nextItemIndex]) {
                    setButtonCount(nextItemIndex);
                    divRef.current[containerCount][nextItemIndex].focus();
                    //divRef.current[containerCount][nextCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
                }
            } else {
                if(horizontalChannelCount < 3) {
                    setHorizontalChannelCount(horizontalChannelCount + 1)
                    let nextCardIndex = cardCount + 1;
                        if (divRef.current[containerCount] && divRef.current[containerCount][nextCardIndex]) {
                            setCardCount(nextCardIndex);
                            divRef.current[containerCount][nextCardIndex].focus();
                            //divRef.current[containerCount][nextCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
                        }
                }
            }
            // Caso contrário, vamos para o próximo card dentro do mesmo array
        }
    }; 

    const handleEnter = () => {
        if (menuFocused && activePage.length > 0) {
            if (activePage === "profile") {
                sessionStorage.clear();
                navigate('/' + activePage)
            } else if (activePage === "logout") {
                localStorage.clear()
                sessionStorage.clear()
                navigate('/' + activePage)
            } else if (window.location.pathname === "/" + activePage) {
                window.location.reload()
            } else {
                console.log("to aqui", activePage)
                navigate(`/${activePage}`)
            }
        } else {
            if(containerCount === 0) {
                setCategoryFilteredOnKeyPress(categoryFocused)
            } else {
                window.location.href = `/player/TV/LIVE/${channelFocused.channels_id}`;
            }
        }
    };

    const handleEscape = () => {
        console.log("Escape pressionado");

        // Implemente a lógica para quando o usuário pressionar Escape (ex: sair do foco)
    };

    const {
        containerCount,
        cardCount,
        buttonCount,
        menuCount,
        setContainerCount,
        setCardCount,
        setButtonCount,
        setMenuCount,
    } = useKeyNavigation({
        menuFocused,
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
                    <Menu
                        status={menuFocused}
                        ref={menuRef}
                        activePage={setActivePage}
                    />


                    <div className="categoriesContainer">
                        <div className="categoriesContent">

                            <button className="categoriesButton"
                                ref={(el) => handleButtonRef(0, 0, el)}
                                onFocus={(() => {
                                    setCategoryFocused(null)
                                })}
                                style={{
                                    backgroundColor: categoryFilteredOnKeyPress === null ? "red" : "rgba(0, 0, 0, 0)"
                                }}
                            ><h4>Todos</h4></button>
                            {console.log("meu caterg", channelCategories)}
                            {channelCategories.map((category, idx) => {
                                return (
                                    <button
                                        className="categoriesButton"
                                        ref={(el) => handleButtonRef(0, idx + 1, el)}
                                        key={idx}
                                        onFocus={(() => {
                                            setCategoryFocused(category.channels_categories_id)
                                        })}
                                        style={{
                                            backgroundColor: category.channels_categories_id === categoryFilteredOnKeyPress 
                                            ? "red" : "rgba(0, 0, 0, 0)"
                                        }}
                                    >
                                        <h4>{category.channels_categories_name}</h4>
                                    </button>
                                )
                            })}

                        </div>
                    </div>

                    <div className="channelsContainer paddingLeftDefault">
                        {console.log("os canais", subcribedChannels)}
                        {
                            categoryFilteredOnKeyPress === null ?
                            subcribedChannels.map((channel, idx) => {
                                const channelEvent = liveEventChannels.filter(item => item.channels_id === channel.channels_id)
                                const progressPercentage = GetProgressPercentage(channelEvent[0].start, channelEvent[0].end)
                                const backgroundColor = `linear-gradient(to right, red ${progressPercentage}%, rgb(29, 29, 29) ${progressPercentage}%)`;
    
    
                                return (
                                    <button
                                        key={idx}
                                        ref={(el) => handleButtonRef(1, idx, el)}
                                        className="channelsButton"
                                        onFocus={(() => {
                                            setChannelFocused(channel)
                                        })}
                                    >
                                        <div className="channelDetails">
                                            <div className="channelDetailsLogo">
                                                <img src={channel.channels_logo} className="channelDetailsLogoImg"></img>
                                            </div>
                                            <div className="channelDetailsText">
                                                <h5>{FormatChannelTitleLength(channel.channels_name)}</h5>
                                                <h6>{FormatChannelDescriptionLength(channelEvent[0].title)}</h6>
                                            </div>
                                        </div>
    
                                        <div className="channelsTimeReproduced"
                                            style={{
                                                background: backgroundColor,  // Cor de fundo dinâmica com base no progresso
                                            }}
                                        ></div>
                                    </button>
                                )
                            })
                            : 
                            subcribedChannels.filter(item => item.channels_categories[0] === categoryFilteredOnKeyPress || 
                                item.channels_categories[1] === categoryFilteredOnKeyPress ||
                                item.channels_categories[2] === categoryFilteredOnKeyPress ||
                                item.channels_categories[3] === categoryFilteredOnKeyPress 

                            ).map((channel, idx) => {
                                const channelEvent = liveEventChannels.filter(item => item.channels_id === channel.channels_id)
                                const progressPercentage = GetProgressPercentage(channelEvent[0].start, channelEvent[0].end)
                                const backgroundColor = `linear-gradient(to right, red ${progressPercentage}%, rgb(29, 29, 29) ${progressPercentage}%)`;
    
    
                                return (
                                    <button
                                        key={idx}
                                        ref={(el) => handleButtonRef(1, idx, el)}
                                        className="channelsButton"
                                        onFocus={(() => {
                                            setChannelFocused(channel)
                                        })}
                                    >
                                        <div className="channelDetails">
                                            <div className="channelDetailsLogo">
                                                <img src={channel.channels_logo} className="channelDetailsLogoImg"></img>
                                            </div>
                                            <div className="channelDetailsText">
                                                <h5>{FormatChannelTitleLength(channel.channels_name)}</h5>
                                                <h6>{FormatChannelDescriptionLength(channelEvent[0].title)}</h6>
                                            </div>
                                        </div>
    
                                        <div className="channelsTimeReproduced"
                                            style={{
                                                background: backgroundColor,  // Cor de fundo dinâmica com base no progresso
                                            }}
                                        ></div>
                                    </button>
                                )
                            })
                        }
                    </div>


                </div>

            )

            }

        </>

    );
}


export default Channel;