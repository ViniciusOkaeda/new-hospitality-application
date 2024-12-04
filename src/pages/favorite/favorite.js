import React, { useEffect, useState, useRef } from "react";
import './favorite.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { GetHomepageV2, GetRecordingsByProfileV2, GetMyListFull } from "../../services/calls";
import { FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages } from "../../utils/constants";
import { Menu } from "../../components/menu/menu";
import { useKeyNavigation } from "../../utils/newNavigation";
import { RenderCards, RenderRecordingCards, RenderMyListCards, RenderCardsWithBackground, RenderChannelsCards, RenderTest } from "../../components/cards/cards";


function Favorite() {
    const [enableArrows, setEnableArrows] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento



    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [recordingContent, setRecordingContent] = useState([])
    const [myListContent, setMyListContent] = useState([])
    const [userData, setUserData] = useState([])
    console.log("meu user é ", userData)
    const [activePage, setActivePage] = useState('');

    const navigate = useNavigate()

    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [focusedContent, setFocusedContent] = useState([])

    const model = 1 //auxiliar para nao precisar focar e exibir cards


    const divRef = useRef([])



    // Função para atualizar as dimensões da div


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetRecordingsByProfileV2();
                if (result) {
                    if (result.status === 1) {
                        setRecordingContent(result.response)

                        const resultMyList = await GetMyListFull();
                        if (resultMyList) {
                            if (resultMyList.status === 1) {
                                setMyListContent(resultMyList.response)

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


    const buttonRefs = useRef([]);  // Vai armazenar as referências dos botões

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
            //logica da pagina em si
            console.log("o divref", divRef.current[0])
            console.log("o divref", divRef.current[1])
            if(containerCount < 1) {
                let nextItemIndex = containerCount + 1;
                setContainerCount(nextItemIndex);
                if (nextItemIndex === 0) {
                    setTimeout(() => {
                        // Certifique-se de que divRef.current[0][0] existe e focá-lo
                        if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][buttonCount]) {
                            divRef.current[nextItemIndex][buttonCount].focus();
                                            }
                    }, 10);
                } else if (nextItemIndex === 1) {

                    if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][cardCount]) {
                        divRef.current[nextItemIndex][cardCount].focus();
                    }
                }
            }


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
                let nextItemIndex = containerCount - 1;
                setContainerCount(nextItemIndex);
                if (nextItemIndex === 0) {
                    if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][buttonCount]) {
                        divRef.current[nextItemIndex][buttonCount].focus();
                    }
                }
            }        }
    };

    const handleArrowLeft = () => {
        if (containerCount === -1 || cardCount === -1) {
            // Se estamos no menu ou se o card não está focado (cardCount === -1)
            setMenuFocused(true); // Ativa o foco no menu

            // Foca o primeiro item do menu
            if (menuRef.current) {
                menuRef.current.focusButton(menuCount);
            }
        } else {
            // Se estamos em um card, decrementamos o cardCount para focar no card anterior
            let previousCardIndex = cardCount - 1;

            if (previousCardIndex >= 0) {
                // Se houver um card anterior, atualizamos o cardCount e focamos no card
                setCardCount(previousCardIndex);
                if (divRef.current[containerCount] && divRef.current[containerCount][previousCardIndex]) {
                    divRef.current[containerCount][previousCardIndex].focus();
                    divRef.current[containerCount][previousCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
                }
            } else {
                // Se previousCardIndex for -1, desfocamos o card e focamos no menu
                setCardCount(-1); // Atualiza o estado de cardCount para -1
                setMenuFocused(true); // Desfoca o menu
                if (menuRef.current) {
                    menuRef.current.focusButton(menuCount); // Foca o item do menu
                }
            }
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
                // Se o cardCount estiver -1, significa que não havia foco no card, então foca no primeiro card
                setCardCount(0); // Garantir que o foco vá para o primeiro card
            }

            // Foca no primeiro card
            if (divRef.current[containerCount] && divRef.current[containerCount][0]) {
                divRef.current[containerCount][0].focus(); // Foca no primeiro card
            }
        } else {
            // Caso contrário, vamos para o próximo card dentro do mesmo array
            let nextCardIndex = cardCount + 1;
            if (divRef.current[containerCount] && divRef.current[containerCount][nextCardIndex]) {
                setCardCount(nextCardIndex);
                divRef.current[containerCount][nextCardIndex].focus();
                //divRef.current[containerCount][nextCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
            }
        }
    };

    const handleEnter = () => {
        if (menuFocused && activePage.length > 0) {
            if (activePage === "profile") {
                sessionStorage.clear();
                window.location.href = '/' + activePage
            } else if (activePage === "logout") {
                localStorage.clear()
                sessionStorage.clear()
                window.location.href ='/' + activePage
            } else if (window.location.pathname === "/" + activePage) {
                window.location.reload()
            } else {
                console.log("to aqui", activePage)
                window.location.href =`/${activePage}`
            }
        } else {
            if(haveFocusedEvent) {
                if(focusedContent.type === "VOD") {
                    console.log("o focused é", focusedContent)
                    window.location.href = `/event/${focusedContent.type + "/" + focusedContent.id}`
                    //event/VOD/id
                } else {
                    window.location.href = `/event/${"TV/" + focusedContent.id}`
                    //event/TV/165623461
                }
            }
        }
    };

    const handleEscape = () => {
        window.history.back();
        console.log("Escape pressionado");

        // Implemente a lógica para quando o usuário pressionar Escape (ex: sair do foco)
    };

    const {
        containerCount,
        cardCount,
        menuCount,
        buttonCount,
        setContainerCount,
        setCardCount,
        setMenuCount,
        setButtonCount,
    } = useKeyNavigation({
        menuFocused,
        selectableContainers,
        selectableMenus,
        loading,
        enableArrows,
        divRef,
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

                <div className="flex container flexColumn declaredOverflow"
                >
                    <Menu
                        status={menuFocused}
                        ref={menuRef}
                        activePage={setActivePage}
                        setUserData={setUserData}
                    />


                    <div className="favoriteContainer">

                        <div className="recordingContainer">
                            <h3 className="paddingLeftDefault">Gravações</h3>
                            <div className="recordingAvailable paddingLeftDefault">
                                <div className="recordingAvailablePercentual"></div>
                                <div className="recordingAvailableInfo">
                                    <h5>Espaço de gravação</h5>
                                    <h4>Você tem {userData.customers_recording_length - userData.customers_recording_used} de minutos {userData.customers_recording_length} restantes</h4>
                                </div>
                            </div>

                            {recordingContent.length > 0
                                ?
                                <RenderRecordingCards item={recordingContent} setFocusedContent={setFocusedContent} divRef={divRef} setHaveFocusedEvent={setHaveFocusedEvent}/>
                                :
                                <h4 className="paddingLeftDefault">Você não tem nenhum conteúdo gravado</h4>
                            }
                        </div>

                        <div className="myListContainer">
                            <h3 className="paddingLeftDefault">Minha Lista</h3>

                            {myListContent.length > 0
                                ?
                                <RenderMyListCards item={myListContent} setFocusedContent={setFocusedContent} divRef={divRef} recordingLength={recordingContent.length} setHaveFocusedEvent={setHaveFocusedEvent}/>
                                :
                                <h4 className="paddingLeftDefault">Você não tem nenhum conteúdo na sua lista</h4>
                            }
                        </div>


                    </div>


                </div>

            )

            }

        </>

    );
}


export default Favorite;