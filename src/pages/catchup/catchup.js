import React, { useEffect, useState, useRef } from "react";
import './catchup.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { GetTodayDate, FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages, GetProgressPercentage, FormatChannelTitleLength, FormatChannelDescriptionLength } from "../../utils/constants";
import { GetChannelCategories, GetSubscribedAndLockedChannels, GetFavoriteChannels, GetLiveChannelEvents } from "../../services/calls";
import { Menu } from "../../components/menu/menu";
import { useKeyNavigation } from "../../utils/newNavigation";
import { RenderCards, RenderCardsWithBackground, RenderChannelsCards, RenderTest } from "../../components/cards/cards";


function Catchup() {
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
            if (containerCount < 0) {
                let nextItemIndex = containerCount + 1
                setContainerCount(nextItemIndex)
                setTimeout(() => {
                    if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][cardCount]) {
                        //console.log("o next", nextItemIndex)
                        //console.log("meu ref", divRef.current[nextItemIndex])
                        //window.scrollTo(0, 0)
                        divRef.current[nextItemIndex][cardCount].focus();
                        setEnableCountChannels(true)
                    }

                }, 10);
            }
            if (enableCountChannels === true) {
                console.log("virou true")
                var checkCount = cardCount + 3
                if(checkCount < divRef.current[containerCount].length - 1) {
                    if (cardCount < divRef.current[containerCount].length - 1) {
                        let nextChannelIndex = cardCount + 4
                        setCardCount(nextChannelIndex)
                        console.log("o cardCount", cardCount)
                        if (divRef.current[containerCount][nextChannelIndex]) {
                            divRef.current[containerCount][nextChannelIndex].focus()
                        }
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
            if (enableCountChannels === true) {
                if (cardCount > 3) {
                    let nextChannelIndex = cardCount - 4
                    setCardCount(nextChannelIndex)
                    if (divRef.current[containerCount][nextChannelIndex]) {
                        divRef.current[containerCount][nextChannelIndex].focus()
                    }
                }
            }
            //logica da pagina
        }
    };

    const handleArrowLeft = () => {
        if (containerCount === -1 || horizontalChannelCount === -1) {
            // Se estamos no menu ou se o card não está focado (cardCount === -1)
            setMenuFocused(true); // Ativa o foco no menu

            // Foca o primeiro item do menu
            if (menuRef.current) {
                menuRef.current.focusButton(menuCount);
            }
        } else {
            if (containerCount === 0) {
                if (horizontalChannelCount > -1) {
                    setHorizontalChannelCount(horizontalChannelCount - 1)
                    if (horizontalChannelCount > 0) {
                        let previousCardIndex = cardCount - 1;
                        setCardCount(previousCardIndex);
                        if (divRef.current[containerCount] && divRef.current[containerCount][previousCardIndex]) {
                            divRef.current[containerCount][previousCardIndex].focus();
                            //divRef.current[containerCount][previousCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
                        }
                    }
                }
                if (horizontalChannelCount === -1) {
                    console.log("cheguei aqui")
                }

            } else {


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
                //setCardCount(0); // Garantir que o foco vá para o primeiro card
            }

            // Foca no primeiro card
            if (containerCount === 0) {
                if (cardCount > 3) {
                    if (divRef.current[containerCount] && divRef.current[containerCount][cardCount]) {
                        divRef.current[containerCount][cardCount].focus(); // Foca no primeiro card
                        setHorizontalChannelCount(0);
                    }
                } else {
                    if (divRef.current[containerCount] && divRef.current[containerCount][0]) {
                        divRef.current[containerCount][0].focus(); // Foca no primeiro card
                        setCardCount(0)
                        setHorizontalChannelCount(0)
                    }
                }

            }
        } else {

            if (containerCount === 0) {
                if (horizontalChannelCount < 3) {
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
                //navigate('/' + activePage)
                window.location.href = `/${activePage}`;
            } else if (activePage === "logout") {
                localStorage.clear()
                sessionStorage.clear()
                //navigate('/' + activePage)
                window.location.href = `/${activePage}`;
            } else if (window.location.pathname === "/" + activePage) {
                window.location.reload()
            } else {
                console.log("to aqui", activePage)
                window.location.href = `/${activePage}`;
                //navigate(`/${activePage}`)
            }
        } else {
            if (containerCount === 0) {
                window.location.href = `/catchup/detail/${channelFocused.channels_id}`;
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


                    <div className="categoriesContainerCatchup paddingLeftDefault">
                        <div className="categoriesContentCatchup">

                            <h3>Arquivo de TV</h3>

                        </div>
                    </div>

                    <div className="channelsContainerCatchup paddingLeftDefault">
                        {subcribedChannels.map((channel, idx) => {


                            return (
                                <button
                                    key={idx}
                                    ref={(el) => handleButtonRef(0, idx, el)}
                                    className="channelsButtonCatchup channelsButtonColor"
                                    onFocus={(() => {
                                        setChannelFocused(channel)
                                    })}
                                >
                                    <div className="channelDetailsCatchup">
                                        <div className="channelDetailsLogoCatchup">
                                            <img src={channel.channels_logo} className="channelDetailsLogoImgCatchup"></img>
                                        </div>
                                        <div className="channelDetailsTextCatchup">
                                            <h5>{FormatChannelTitleLength(channel.channels_name)}</h5>
                                        </div>
                                    </div>

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


export default Catchup;