import React, { useEffect, useState, useRef } from "react";
import './home.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { GetHomepageV2 } from "../../services/calls";
import { FormatDate, FormatDescriptionLength, FormatDuration, FormatRating } from "../../utils/constants";
import { Menu } from "../../components/menu/menu";
import { RenderCards, RenderCardsWithBackground, RenderChannelsCards } from "../../components/cards/cards";


function Home() {
    const [containerCount, setContainerCount] = useState(-1); // Começa em 0 para o primeiro elemento
    const [cardCount, setCardCount] = useState(0); // Começa em 0 para o primeiro elemento
    const [selectableContainers, setSelectableContainers] = useState([]);
    const [menuFocused, setMenuFocused] = useState(false);
    const [menuCount, setMenuCount] = useState(0)
    const [selectableMenus, setSelectableMenu] = useState([])



    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [homepageContent, setHomepageContent] = useState([]);
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

    const cardRef = useRef(null)


    const cardRowsRef = useRef(null); // Ref para a div cardRows

    const SaveProfileData = (profiles_name, token, profiles_id, profile_image) => {
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
            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente

        window.addEventListener('resize', updateDimensions);

        // Limpeza do listener de resize ao desmontar o componente
        return () => {
            window.removeEventListener('resize', updateDimensions);
        };

    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez

    useEffect(() => {
        const selectableContainer = document.querySelectorAll('.selectedContainer');
        const selectableMenu = document.querySelectorAll('.selectedMenuContainer')
        setSelectableContainers(selectableContainer);
        setSelectableMenu(selectableMenu);
        // Configuração do keyDownHandler
        const keyDownHandler = (event) => {
            if (!loading) { // Apenas permite navegação se não estiver carregando
                handleKeyDown(event, {
                    enter: () => {
                        const focusedElement = document.activeElement;
                        if (focusedElement.classList.contains('profileButton')) {
                            const index = Array.from(document.querySelectorAll('.profileButton')).indexOf(focusedElement);

                            //console.log("Dados do perfil:", profiles.profiles[index]);
                        } else if (focusedElement.id === "logoutButton") {
                            //Logout(navigate)
                        }
                    },
                    escape: () => {
                        console.log("Escape key pressed on Page 1");
                    },
                    up: () => {

                        if (containerCount >= 0) {
                            setContainerCount(prev => {
                                const newCount = prev - 1;
                                const focusedCard = selectableContainers[newCount]?.getElementsByClassName('selectedCard')[cardCount];
                                setCardCount(0)
                                // Focar no card anterior
                                if (focusedCard) {
                                    focusedCard.focus();
                                }                                
                                return newCount;
                            });

                            setTimeout(() => {
                                if (divRef.current) {
                                    const focusedCard = selectableContainers[containerCount - 1]?.getElementsByClassName('selectedCard')[cardCount];
                                    
                                    const lastElement = selectableContainers[containerCount - 1]?.getAttribute('id')

                                    if (focusedCard) {
                                        const elementRect = focusedCard.getBoundingClientRect();
                                        
                                        // Distância do topo da div até o topo do elemento focado no conteúdo total
                                        const distanceFromTopOfContent = (elementRect.top + divRef.current.scrollTop) - 580;                    
                    
                                        if(containerCount == -1) {
                                            //quando for o primeiro elemento da página irá vir pra cá

                                        }
                                        if(containerCount >= 0) { 
                                            if(lastElement === "bottom") {
                                                divRef.current.scrollTo({
                                                    top: distanceFromTopOfContent,  // Rola para cima 700px (ajuste conforme necessário)
                                                    behavior: 'smooth',  // Rolagem suave
                                                });
                                            }

                                        }
                                    }
                                }
                            }, 100); // Um pequeno delay para garantir que o foco seja aplicado antes da rolagem
                        

                            
                        }

                    },
                    down: () => {
                        console.log("opa", menuCount)

                        if(menuFocused === true) {
                            console.log("opa 2", menuCount)
                            if(menuCount < selectableMenus[0]?.getElementsByClassName('selectedMenuOption').length){
                                setMenuCount(prev => {
                                    const newMenuOptionCount = prev + 1;
                                    const focusedCard = selectableMenus[0]?.getElementsByClassName('selectedMenuOption')[newMenuOptionCount]
                                    if(focusedCard) {
                                        focusedCard.focus();
                                    }

                                    return newMenuOptionCount
                                })
                            }
                        } else {
                            if (containerCount < selectableContainers.length) {
                                // Focar no próximo item primeiro
                                setContainerCount(prev => {
                                    console.log("o prev", prev)
                                    const newCount = prev + 1;
                                    console.log("o new", newCount)
                                    const focusedCard = selectableContainers[newCount]?.getElementsByClassName('selectedCard')[cardCount];
                                    setCardCount(0)
                                    // Foco no próximo item
                                    if (focusedCard) {
                                        focusedCard.focus();
                                    }
    
                                    return newCount;
                                });
    
                                console.log("meu container no down", containerCount)
                                console.log("meu card no down", cardCount)
    
                                setTimeout(() => {
                                    if (divRef.current) {
                                        const focusedCard = selectableContainers[containerCount + 1]?.getElementsByClassName('selectedCard')[cardCount];
                                        
                                        const lastElement = selectableContainers[containerCount + 1]?.getAttribute('id')
    
                                        if (focusedCard) {
                                            const elementRect = focusedCard.getBoundingClientRect();
                                            
                                            // Distância do topo da div até o topo do elemento focado no conteúdo total
                                            const distanceFromTopOfContent = (elementRect.top + divRef.current.scrollTop) - 580;                    
                        
                                            if(containerCount == -1) {
                                                //quando for o primeiro elemento da página irá vir pra cá
    
                                            }
                                            if(containerCount >= 0) { 
                                                if(lastElement === "bottom") {
                                                    divRef.current.scrollTo({
                                                        top: distanceFromTopOfContent,  // Rola para cima 700px (ajuste conforme necessário)
                                                        behavior: 'smooth',  // Rolagem suave
                                                    });
                                                }
    
                                            }
                                        }
                                    }
                                }, 100); // Um pequeno delay para garantir que o foco seja aplicado antes da rolagem
                            
                            
                            
                            }
                        }

                    },
                    left: () => {
                        if(cardCount > -1) {
                            setCardCount(prev => prev - 1)
                            console.log("o card", cardCount)
                            if(cardCount > -1) {

                            } else {
                                
                            }
                        } else {
                            setMenuFocused(true)
                            //console.log("o menu option", menuCount)
                            selectableMenus[0]?.getElementsByClassName('selectedMenuOption')[menuCount]?.focus()
                        

                        }


                        /*
                        if(cardCount >= 0) {
                            setCardCount(prev => {
                                const newCardCount = prev - 1;
                                console.log("o card no left", newCardCount)
                                if(newCardCount > -1) {
                                    selectableContainer[containerCount]?.getElementsByClassName('selectedCard')[newCardCount]?.focus()

                                }
                                if(newCardCount === -1) {
                                    selectableContainer[containerCount]?.getElementsByClassName('selectedCard')[0]?.blur()
                                    setMenuFocused(true)
                                    console.log("o menu option", menuCount)
                                    selectableMenus[0]?.getElementsByClassName('selectedMenuOption')[menuCount]?.focus()
                                }
                                return newCardCount;
                            })

                        }
                        
                        */
                    },
                    right: () => {
                        if(menuFocused === true) {
                            selectableMenus[0]?.getElementsByClassName('selectedMenuOption')[menuCount]?.blur()
                            setCardCount(0);
                            setMenuFocused(false)

                        }

                        /*
                        if(cardCount >= -1) {
                            if (cardCount < selectableContainers[containerCount]?.getElementsByClassName('selectedCard').length - 1) {
                                setCardCount(prev => {
                                    if(cardCount === -1) {
                                        //aqui o blur pro menu
                                        //selectableContainer[containerCount]?.getElementsByClassName('selectedCard')[0]?.focus()
                                        setMenuFocused(false)
                                        selectableMenus[0]?.getElementsByClassName('selectedMenuOption')[menuCount]?.focus()
                                    }
                                    const newCardCount = prev + 1;
                                    selectableContainer[containerCount]?.getElementsByClassName('selectedCard')[newCardCount]?.focus()
                                    return newCardCount;
                                })
                                //terminar aqui
                                //console.log("VEJAMOS", )
                            }
                            

                        }
                        */

                        //console.log("Right key pressed on Page 1", selectableContainers[0]?.getElementsByClassName('selectedCard'));
                    },
                    home: () => {
                        console.log("Home key pressed on Page 1");
                    },
                    squares: () => {
                        console.log("Squares key pressed on Page 1");
                    },
                    // Outras teclas...
                });
            }
        };

        document.addEventListener("keydown", keyDownHandler);
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };

    }, [containerCount, cardCount, homepageContent, ]); // Dependência vazia para garantir que loadData só seja chamado uma vez
    
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


    const renderComponentByType = (item, idx, cardRef) => {
        switch (item.type) {
            case "category selection":
                return (
                    RenderCards(item, idx, setFocusedContent, setHaveFocusedEvent, cardRef, model)
                );
            case "most watched":
                return (
                    RenderCards(item, idx, setFocusedContent, setHaveFocusedEvent, cardRef, model)
                );
            case "channels":
                return (
                    RenderChannelsCards(item, idx, setFocusedContent, setHaveFocusedEvent, cardRef,)
                );
            case "playlist":
                switch (item.style) {
                    case "full_width_middle":
                        return (
                            RenderCardsWithBackground(item, idx, setFocusedContent, setHaveFocusedEvent, cardRef,)
                        );
                    case "normal":
                        return (
                            RenderCards(item, idx, setFocusedContent, setHaveFocusedEvent, cardRef, model)
                        );

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
                    <Menu status={menuFocused} />

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

                        {homepageContent.map((item, idx) => {
                            return renderComponentByType(item, idx, cardRef)
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