import React, { useEffect, useState } from "react";
import './home.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate } from "react-router-dom";
import { GetHomepageV2 } from "../../services/calls";


function Home() {
    const [containerCount, setContainerCount] = useState(-1); // Começa em 0 para o primeiro elemento
    const [cardCount, setCardCount] = useState(0); // Começa em 0 para o primeiro elemento
    const [selectableContainers, setSelectableContainers] = useState([]);
    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [homepageContent, setHomepageContent] = useState([]);
    const navigate = useNavigate()

    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [focusedContent, setFocusedContent] = useState([])

    const SaveProfileData = (profiles_name, token, profiles_id, profile_image) => {
        sessionStorage.setItem("profileid", btoa(profiles_id));
        localStorage.setItem("profileimage", profile_image);
        localStorage.setItem("profilename", profiles_name);
        navigate('/home');
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetHomepageV2();
                if (result) {
                    if (result.status === 1) {
                        setHomepageContent(result.response)
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

    useEffect(() => {
        const selectableContainer = document.querySelectorAll('.selectedContainer');
        setSelectableContainers(selectableContainer);
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
                        if (containerCount > 0) {
                            setContainerCount(prev => {
                                const newCount = prev - 1;
                                setCardCount(0)
                                // Focar no card anterior
                                selectableContainers[newCount]?.getElementsByClassName('selectedCard')[cardCount]?.focus();
                                return newCount;
                            });
                        }
                    },
                    down: () => {
                        const focusedElement = document.activeElement;

                        if (containerCount < selectableContainers.length - 1) {
                            if (focusedElement.classList.contains('cardButton')) {
                                console.log("o meu focused", focusedElement)

                                const index = Array.from(document.querySelectorAll('.cardButton')).indexOf(focusedElement);
    
                                //console.log("Dados do perfil:", profiles.profiles[index]);
                            } 
                            setContainerCount(prev => {
                                const newCount = prev + 1;
                                // Focar no próximo card (resetando cardCount se necessário)
                                selectableContainers[newCount]?.getElementsByClassName('selectedCard')[cardCount]?.focus();
                                return newCount;
                            });
                        }
                    },
                    left: () => {
                            if (cardCount > 0) {
                                setCardCount(prev => {
                                    const newCardCount = prev - 1;
                                    selectableContainer[containerCount]?.getElementsByClassName('selectedCard')[newCardCount]?.focus()
                                    return newCardCount;
                                })
                        }
                    },
                    right: () => {
                            if (cardCount < selectableContainers[containerCount]?.getElementsByClassName('selectedCard').length - 1) {
                                setCardCount(prev => {
                                    const newCardCount = prev + 1;
                                    selectableContainer[containerCount]?.getElementsByClassName('selectedCard')[newCardCount]?.focus()
                                    return newCardCount;
                                })
                                //terminar aqui
                            //console.log("VEJAMOS", )
                        }
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

    }, [containerCount, cardCount, homepageContent]); // Dependência vazia para garantir que loadData só seja chamado uma vez

    const renderComponentByType = (item, idx) => {
        switch (item.type) {
            case "category selection":
                return (
                    <div key={idx} className="cardsContainer ">
                        <div className="cardsTitle paddingLeftDefault">
                            <h3>{item.title}</h3>
                        </div>

                        <div className="cardsContent selectedContainer">
                            {item.data.map((rows, idx) => {

                                return(
                                    <button 
                                    key={idx} 
                                    className="cardButton selectedCard"
                                    onFocus={(() => {
                                        setFocusedContent(item);
                                        setHaveFocusedEvent(true)
                                    })}
                                    >
                                        <img src={rows.image} className="cardImage"></img>
                                    </button>
                                )
                            })}

                            <div className="cardsFinalMargin"></div>
                        </div>
                    </div>
                );
            case "channels":
                return (
                    <div className="channels">
                        <h3>{item.title}</h3>
                        {/* Adicione o conteúdo dos canais aqui */}
                    </div>
                );
            case "banner":
                return (
                    <div className="banner">
                        <h3>{item.title}</h3>
                        {/* Adicione o conteúdo do banner aqui */}
                    </div>
                );
            default:
                return null; // Retorna nada se o tipo não for reconhecido
        }};

    
    return (
        <>
            {loading ? (
                <Loader /> // Exibe o Loader enquanto carrega
            ) : error ? (
                <div className="initialContainer"><h3>Erro: {error}</h3></div> // Exibindo mensagem de erro, se houver


            ) : (
                <div className="flex container flexColumn">

                    {haveFocusedEvent === true ? 
                        <div className="focusedContent">
                            {console.log("opa", focusedContent)}
                            <div className="focusedContentText"></div>
                            <div 
                            className="focusedContentImage" 
                            style={{
                                display: 'block',
                                transition: '800ms ease-out',
                                backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 1) 100%), linear-gradient(to left, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 1) 100%), url(${focusedContent.image_widescreen !== "null" ? focusedContent.image_widescreen : focusedContent.image})`,
                                backgroundSize: 'cover'
                 
                
                            }}
                            >

                            </div>
                        </div>
                    : ""}


                    {homepageContent.map((item, idx) => {
                        return renderComponentByType(item, idx)
                    })}



                </div>
            )

            }

        </>

    );
}


export default Home;