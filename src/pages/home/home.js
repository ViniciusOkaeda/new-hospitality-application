import React, { useEffect, useState, useRef } from "react";
import './home.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { GetHomepageV2 } from "../../services/calls";
import { FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages } from "../../utils/constants";
import { Menu } from "../../components/menu/menu";
import { useKeyNavigation } from "../../utils/newNavigation";
import { RenderCards, RenderCardsWithBackground, RenderChannelsCards, RenderTest } from "../../components/cards/cards";


function Home() {
    const [enableArrows, setEnableArrows] = useState(false)

    console.log("o window", window.location)
    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento



    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [homepageContent, setHomepageContent] = useState([]);

    const [activePage, setActivePage] = useState('');

    const navigate = useNavigate()

    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [focusedContent, setFocusedContent] = useState([])

    const model = 1 //auxiliar para nao precisar focar e exibir cards


    const [divDimensions, setDivDimensions] = useState({
        visibleWidth: 0,
        visibleHeight: 0,
        totalWidth: 0,
        totalHeight: 0,
    });
    const divRef = useRef(null); // Ref para a div que você deseja medir


    const SaveEventData = (profiles_name, token, profiles_id, profile_image) => {
        sessionStorage.setItem("profileid", btoa(profiles_id));
        localStorage.setItem("profileimage", profile_image);
        localStorage.setItem("profilename", profiles_name);
        navigate('/home');
    }

    // Função para atualizar as dimensões da div


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetHomepageV2();
                if (result) {
                    if (result.status === 1) {
                        setHomepageContent(result.response)
                        updateDimensions();
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

        window.addEventListener('resize', updateDimensions);

        // Limpeza do listener de resize ao desmontar o componente
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };

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
            // Se houver um próximo item
            let nextItemIndex = containerCount + 1;
            if (homepageContent[nextItemIndex]) {
                // Se o próximo item existir, move o foco para o próximo item
                setContainerCount(nextItemIndex);
                // Tenta manter o foco no mesmo índice de cartão dentro do item
                console.log("buttonrefs", buttonRefs.current)
                if (buttonRefs.current[nextItemIndex] && buttonRefs.current[nextItemIndex][cardCount]) {
                    buttonRefs.current[nextItemIndex][cardCount].focus();
                } else {
                    // Se o próximo item não tiver o mesmo número de cartões, foca no primeiro cartão
                    setCardCount(0);
                    buttonRefs.current[nextItemIndex] && buttonRefs.current[nextItemIndex][0].focus();
                }

                setTimeout(() => {
                    if (divRef.current) {
                        const refButtonFocused = buttonRefs.current[containerCount + 1][cardCount]

                        if (refButtonFocused) {
                            //const lastElement = buttonRefs.current[containerCount + 1].getAttribute('id')
                            const elementRect = refButtonFocused.getBoundingClientRect();

                            // Distância do topo da div até o topo do elemento focado no conteúdo total
                            const distanceFromTopOfContent = (elementRect.top + divRef.current.scrollTop) - 580;

                            if (containerCount == -1) {
                                //quando for o primeiro elemento da página irá vir pra cá

                            }
                            if (containerCount >= 0) {
                                divRef.current.scrollTo({
                                    top: distanceFromTopOfContent,  // Rola para cima 700px (ajuste conforme necessário)
                                    behavior: 'smooth',  // Rolagem suave
                                });

                            }
                        }
                    }
                }, 100); // Um pequeno delay para garantir que o foco seja aplicado antes da rolagem

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
            let prevItemIndex = containerCount - 1;
            if (homepageContent[prevItemIndex]) {
                // Se o item anterior existir, move o foco para o item anterior
                setContainerCount(prevItemIndex);
                // Tenta manter o foco no mesmo índice de cartão dentro do item
                if (buttonRefs.current[prevItemIndex] && buttonRefs.current[prevItemIndex][cardCount]) {
                    buttonRefs.current[prevItemIndex][cardCount].focus();
                } else {
                    // Se o item anterior não tiver o mesmo número de cartões, foca no primeiro cartão
                    setCardCount(0);
                    buttonRefs.current[prevItemIndex] && buttonRefs.current[prevItemIndex][0].focus();
                }

                setTimeout(() => {
                    if (divRef.current) {
                        const refButtonFocused = buttonRefs.current[containerCount - 1][cardCount]


                        if (refButtonFocused) {
                            const elementRect = refButtonFocused.getBoundingClientRect();

                            // Distância do topo da div até o topo do elemento focado no conteúdo total
                            const distanceFromTopOfContent = (elementRect.top + divRef.current.scrollTop) - 580;

                            if (containerCount == -1) {
                                //quando for o primeiro elemento da página irá vir pra cá

                            }
                            if (containerCount >= 0) {
                                divRef.current.scrollTo({
                                    top: distanceFromTopOfContent,  // Rola para cima 700px (ajuste conforme necessário)
                                    behavior: 'smooth',  // Rolagem suave
                                });

                            }
                        }
                    }
                }, 100); // Um pequeno delay para garantir que o foco seja aplicado antes da rolagem

            }
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
            if (focusedContent) {

                console.log("oq temos", focusedContent)
                if (focusedContent.type === "TV") {
                    //aqui vai pro event
                    navigate(`/event/${focusedContent.type + "/" + focusedContent.id}`)

                } else if (focusedContent.type === "Channel") {
                    //aqui vai pro player

                } else if (focusedContent.type === "VOD") {
                    //aqui vai pro event
                    navigate(`/event/${focusedContent.type + "/" + focusedContent.id}`)

                }


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
        menuCount,
        setContainerCount,
        setCardCount,
        setMenuCount,
    } = useKeyNavigation({
        menuFocused,
        selectableContainers,
        selectableMenus,
        divRef,
        loading,
        onArrowUp: () => handleArrowUp(),
        onArrowDown: () => handleArrowDown(),
        onArrowLeft: () => handleArrowLeft(),
        onArrowRight: () => handleArrowRight(),
        onEnter: () => handleEnter(),
        onEscape: () => handleEscape(),
    });

    const updateDimensions = () => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect(); // Pega o tamanho visível da div
            const visibleWidth = rect.width;
            const visibleHeight = rect.height;

            // Pega o tamanho total do conteúdo, incluindo overflow
            const totalWidth = divRef.current.scrollWidth;
            const totalHeight = divRef.current.scrollHeight;

            // Atualiza o estado com as novas dimensões
            const newDimensions = {
                visibleWidth,
                visibleHeight,
                totalWidth,
                totalHeight,
            };

            // Atualiza o estado
            setDivDimensions(newDimensions);

            // Debug: exibe as dimensões no console
            //console.log('Dimensões atualizadas da div:', newDimensions);
        }
    };




    const renderComponentByType = (item, idx1, buttonRefs) => {
        switch (item.type) {
            case "category selection":
                return <RenderCards item={item} idx1={idx1} setFocusedContent={setFocusedContent} setHaveFocusedEvent={setHaveFocusedEvent} model={1} buttonRefs={buttonRefs} />
            case "most watched":
                return <RenderCards item={item} idx1={idx1} setFocusedContent={setFocusedContent} setHaveFocusedEvent={setHaveFocusedEvent} model={1} buttonRefs={buttonRefs} />
            case "channels":
                return <RenderChannelsCards item={item} idx1={idx1} setFocusedContent={setFocusedContent} setHaveFocusedEvent={setHaveFocusedEvent} buttonRefs={buttonRefs} />
            case "playlist":
                switch (item.style) {
                    case "full_width_middle":
                        return <RenderCardsWithBackground item={item} idx1={idx1} setFocusedContent={setFocusedContent} setHaveFocusedEvent={setHaveFocusedEvent} buttonRefs={buttonRefs} />
                    case "normal":
                        return <RenderCards item={item} idx1={idx1} setFocusedContent={setFocusedContent} setHaveFocusedEvent={setHaveFocusedEvent} model={1} buttonRefs={buttonRefs} />
                }
            default:
                return null; // Retorna nada se o tipo não for reconhecido
        }
    };


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

                    {haveFocusedEvent === true ?
                        <div className="focusedContent">
                            <div className="focusedContentText" style={{ minHeight: focusedContent.name_image !== null ? "75%" : "50%" }}>
                                {focusedContent.title !== null || focusedContent.name_image !== null ?
                                    focusedContent.name_image !== null ?
                                        <div className="focusedImageTitle paddingLeftDefault focusedMaxWidth">
                                            <img src={focusedContent.name_image} className="focusedImageTitleImg"></img>
                                        </div>
                                        :
                                        <div className="focusedTitle paddingLeftDefault focusedMaxWidth">
                                            <h2>{focusedContent.title}</h2>
                                        </div>

                                    : ""}

                                {focusedContent.episode !== null ?
                                    <div className="focusedSeasonAndEpisode paddingLeftDefault">
                                        <h5>{focusedContent.subtitle !== null ? focusedContent.subtitle : focusedContent.episode} ({focusedContent.episode}) </h5>
                                    </div>

                                    : ""}

                                {
                                    focusedContent.channels_logo !== null ||
                                        focusedContent.start !== null ||
                                        focusedContent.duration !== null ||
                                        focusedContent.genres !== null ||
                                        focusedContent.rating !== null ?
                                        <div className="focusedDetails paddingLeftDefault">

                                            {focusedContent.channels_logo !== null ?
                                                <div className="focusedChannelImage">
                                                    <img src={
                                                        focusedContent.channels_logo_widescreen !== null ?
                                                            focusedContent.channels_logo_widescreen :
                                                            focusedContent.channels_logo
                                                    }></img>
                                                </div>
                                                : ""}

                                            {focusedContent.start !== null && focusedContent.type !== "VOD" ?
                                                <>
                                                    <div className="focusedStartAt"><h6>{FormatDate(focusedContent.start)}</h6></div>
                                                    <span className="focusedBasicSpacement">●</span>
                                                </>
                                                : ""}




                                            {focusedContent.duration !== null ?
                                                <>
                                                    <div className="focusedDuration"><h6>{FormatDuration(focusedContent.duration) + " min"}</h6></div>
                                                    <span className="focusedBasicSpacement">●</span>
                                                </>
                                                : ""}

                                            {focusedContent.genres !== null ?
                                                <div className="focusedGenres"><h6>{focusedContent.genres}</h6></div>
                                                : ""}

                                            {focusedContent.released !== null && focusedContent.type === "VOD" ?
                                                <>
                                                    <span className="focusedBasicSpacement">●</span>
                                                    <div className="focusedReleased"><h6>{focusedContent.released}</h6></div>
                                                </>
                                                : ""}

                                            {focusedContent.imdb_rating !== null && focusedContent.type === "VOD" ?
                                                <>
                                                    <span className="focusedImdbBackground"><h6>IMDb</h6></span>
                                                    <span className="focusedImdbTextSpan1"><h6>{focusedContent.imdb_rating}<span className="focusedImdbTextSpan2">/10</span></h6> </span>

                                                </>
                                                : ""}

                                            {focusedContent.rating !== null ?
                                                <div
                                                    className="focusedRating ratingBase"
                                                    style={{
                                                        backgroundColor: FormatRating(focusedContent.rating)
                                                    }}
                                                >A{focusedContent.rating}</div>
                                                : ""}


                                        </div>
                                        : ""
                                }




                                {focusedContent.description !== null ?
                                    <div className="focusedDescription paddingLeftDefault focusedMaxWidth">
                                        <p>{FormatDescriptionLength(focusedContent.description)}</p>
                                    </div>

                                    : ""}
                            </div>

                            <div
                                className="focusedContentImage"
                                style={{
                                    display: 'block',
                                    transition: '800ms ease-out',
                                    backgroundImage: `linear-gradient(to bottom, rgba(17, 16, 20, 0) 75%, rgba(17, 16, 20, 1) 100%), linear-gradient(to left, rgba(17, 16, 20, 0) 75%, rgba(17, 16, 20, 1) 100%), url(${focusedContent.image_widescreen !== null ? focusedContent.image_widescreen : focusedContent.image})`,
                                    backgroundSize: 'cover'


                                }}
                            >

                            </div>
                        </div>
                        : ""}


                    <div
                        className="cardRows"
                        ref={divRef}

                        style={{
                            maxHeight: haveFocusedEvent === true ? "560px" : "1080px"
                        }}
                    >

                        {homepageContent.map((item, idx1) => {
                            return renderComponentByType(item, idx1, buttonRefs)
                        })}

                        <div className="cardsFinalMarginScrollY"></div>

                    </div>


                </div>

            )

            }

        </>

    );
}


export default Home;