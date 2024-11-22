import React, { useEffect, useState, useRef } from "react";
import './channel.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { GetSubscribedAndLockedChannels } from "../../services/calls";
import { GetTodayDate, FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages } from "../../utils/constants";
import { Menu } from "../../components/menu/menu";
import { useKeyNavigation } from "../../utils/newNavigation";
import { RenderCards, RenderCardsWithBackground, RenderChannelsCards, RenderTest } from "../../components/cards/cards";


function Channel() {
    const [enableArrows, setEnableArrows] = useState(false)

    console.log("o window", window.location)
    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento



    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [homepageContent, setHomepageContent] = useState([]);
    console.log("minha home", homepageContent)
    const [activePage, setActivePage] = useState('');

    const navigate = useNavigate()

    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [focusedContent, setFocusedContent] = useState([])

    const model = 1 //auxiliar para nao precisar focar e exibir cards


    const divRef = useRef(null); // Ref para a div que você deseja medir



    // Função para atualizar as dimensões da div


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetSubscribedAndLockedChannels();
                if (result) {
                    if (result.status === 1) {
                        setHomepageContent(result.response)
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

    const categoryRefs = useRef(homepageContent.map(() => React.createRef())); // Refs para categorias
    const itemRefs = useRef([]); // Refs para os itens dentro de cada categoria
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
            //logica da pagina
        }
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
                if (buttonRefs.current[containerCount] && buttonRefs.current[containerCount][previousCardIndex]) {
                    buttonRefs.current[containerCount][previousCardIndex].focus();
                    buttonRefs.current[containerCount][previousCardIndex].scrollIntoView({behavior: "auto", block: "nearest", inline: "center" })
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
            if (buttonRefs.current[containerCount] && buttonRefs.current[containerCount][0]) {
                buttonRefs.current[containerCount][0].focus(); // Foca no primeiro card
            }
        } else {
            // Caso contrário, vamos para o próximo card dentro do mesmo array
            let nextCardIndex = cardCount + 1;
            if (buttonRefs.current[containerCount] && buttonRefs.current[containerCount][nextCardIndex]) {
                setCardCount(nextCardIndex);
                buttonRefs.current[containerCount][nextCardIndex].focus();
                buttonRefs.current[containerCount][nextCardIndex].scrollIntoView({behavior: "auto", block: "nearest", inline: "center" })
            }
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

        }
    };

    const handleEscape = () => {
        console.log("Escape pressionado");

        // Implemente a lógica para quando o usuário pressionar Escape (ex: sair do foco)
    };

    const {
        containerCount,
        cardCount,
        menuCount,
        setContainerCount,
        setCardCount,
        setMenuCount,
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
                    />


                    <div
                        className="cardRows"
                        ref={divRef}

                        style={{
                            maxHeight: haveFocusedEvent === true ? "560px" : "1080px"
                        }}
                    >

                    </div>


                </div>

            )

            }

        </>

    );
}


export default Channel;