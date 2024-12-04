import React, { forwardRef, useState, useEffect } from "react";
import { FormatDate } from "../../utils/constants";
import './cards.css'

export const RenderCards = ({ item, idx1, setFocusedContent, setHaveFocusedEvent, model, buttonRefs }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    // Função chamada quando a imagem termina de carregar
    const handleImageLoad = () => {
        setIsLoaded(true); // Marca a imagem como carregada
    };

    const setButtonRef = (el, idx2) => {
        if (!buttonRefs.current[idx1]) {
            buttonRefs.current[idx1] = []; // Inicializa o array de referências se não existir
        }
        buttonRefs.current[idx1][idx2] = el; // Atribui a referência para o botão específico
    };
    // Função chamada quando a imagem termina de carregar


    return (
        <div key={idx1} className="cardsContainer ">
            <div className="cardsTitle paddingLeftDefault">
                <h3>{item.title}</h3>
            </div>

            <div id="bottom" className="cardsContent selectedContainer">
                {item.data.map((rows, idx2) => {
                    return (
                        <button
                            key={idx2}
                            ref={(el) => setButtonRef(el, idx2)}
                            className="cardButton selectedCard"
                            onFocus={() => {
                                if (model === 1) {  // Se for o modelo 1, faz a atualização
                                  setFocusedContent(rows);  // Atualiza o conteúdo focado
                                  setHaveFocusedEvent(true);  // Marca que houve um evento de foco
                                }
                              }}
                        >
                            <img
                                src={rows.image}
                                className="cardImage"
                                onLoad={handleImageLoad}
                                style={{
                                    opacity: isLoaded ? 1 : 0,
                                    transition: 'opacity 0.5s ease-in-out', // Efeito de transição
                                }}
                                loading="lazy" // Lazy loading nativo do navegador
                            ></img>
                        </button>
                    )
                })}

                <div className="cardsFinalMarginScrollX"></div>
            </div>
        </div>
    );
}

export const RenderCardsWithBackground = ({ item, idx1, setFocusedContent, setHaveFocusedEvent, buttonRefs }) => {


    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento da imagem

    useEffect(() => {
        // Criar um novo objeto Image para carregar a imagem de fundo
        const img = new Image();
        img.src = item.background_image;

        // Quando a imagem for carregada, mudar o estado para indicar que a imagem está pronta
        img.onload = () => {
            setIsLoaded(true);
        };
    }, [item.background_image]); // Recarregar se o URL da imagem mudar

    return (
        <div key={idx1} className="cardsContainerWithBackground"
            style={{
                opacity: isLoaded ? 1 : 0,  // Controla a visibilidade
                transition: 'opacity 1s ease-in-out',  // Efeito de transição suave
            }}
        >
            <div className="cardsContainerBgdImage"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(40, 40, 40, 0) 5%, rgba(40, 40, 40, 1) 100%) ,url(${item.background_image})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "20px 0 0 20px"
                }}

            ></div>

            <div id="middle" className="cardsContainerRow selectedContainer">
                {item.data.map((row, idx2) => {

                    return (
                        <button key={idx2} className="cardRowButton selectedCard"
                            ref={(el) => {
                                // Armazena a referência de cada botão
                                if (!buttonRefs.current[idx1]) {
                                    buttonRefs.current[idx1] = [];
                                }
                                buttonRefs.current[idx1][idx2] = el;
                            }}
                            onFocus={(() => {
                                setFocusedContent(row);
                                setHaveFocusedEvent(false)
                            })}
                        >
                            <img
                                src={row.image}
                                className="cardRowButtonImage"
                                style={{

                                }}
                                loading="lazy" // Lazy loading nativo do navegador
                            ></img>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

//card que requer implementação ainda
export const RenderCardsWithBackgroundImage = ({ item, idx1, setFocusedContent, setHaveFocusedEvent, buttonRefs }) => {


    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento da imagem

    useEffect(() => {
        // Criar um novo objeto Image para carregar a imagem de fundo
        const img = new Image();
        img.src = item.background_image;

        // Quando a imagem for carregada, mudar o estado para indicar que a imagem está pronta
        img.onload = () => {
            setIsLoaded(true);
        };
    }, [item.background_image]); // Recarregar se o URL da imagem mudar

    return (
        <div key={idx1} className="cardsContainerWithBackground"
            style={{
                opacity: isLoaded ? 1 : 0,  // Controla a visibilidade
                transition: 'opacity 1s ease-in-out',  // Efeito de transição suave
            }}
        >
            <div className="cardsContainerBgdImage"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(40, 40, 40, 0) 5%, rgba(40, 40, 40, 1) 100%) ,url(${item.background_image})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    borderRadius: "20px 0 0 20px"
                }}

            ></div>

            <div id="middle" className="cardsContainerRow selectedContainer">
                {item.data.map((row, idx2) => {

                    return (
                        <button key={idx2} className="cardRowButton selectedCard"
                            ref={(el) => {
                                // Armazena a referência de cada botão
                                if (!buttonRefs.current[idx1]) {
                                    buttonRefs.current[idx1] = [];
                                }
                                buttonRefs.current[idx1][idx2] = el;
                            }}
                            onFocus={(() => {
                                setFocusedContent(row);
                                setHaveFocusedEvent(false)
                            })}
                        >
                            <img
                                src={row.image}
                                className="cardRowButtonImage"
                                style={{

                                }}
                                loading="lazy" // Lazy loading nativo do navegador
                            ></img>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export const RenderChannelsCards = ({ item, idx1, setFocusedContent, setHaveFocusedEvent, buttonRefs }) => {
    const [isLoaded, setIsLoaded] = useState(new Array(item.data.length).fill(false)); // Estado para controlar o carregamento das imagens de fundo
    
    // Função para carregar a imagem de fundo manualmente
    const loadBackgroundImage = (idx2, imageUrl) => {
      const img = new Image(); // Criamos um novo objeto de imagem
      img.src = imageUrl; // Definimos a URL da imagem
      
      img.onload = () => {
        // Quando a imagem for carregada, definimos o estado 'isLoaded' para true
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = true; // Marca como carregada para o botão específico
          return updatedState;
        });
      };
      
      img.onerror = () => {
        // Caso haja um erro no carregamento da imagem (exemplo: imagem não encontrada)
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = false; // Marca como false se a imagem não carregar
          return updatedState;
        });
      };
    };
  
    // Usamos useEffect para carregar as imagens assim que o componente for montado
    useEffect(() => {
      // Para cada item no array de dados, carregamos a imagem
      item.data.forEach((item, idx2) => {
        loadBackgroundImage(idx2, item.channels_logo);
      });
    }, [item.data]); // Roda quando o array 'item.data' mudar
  
    return (
      <div key={idx1} className="cardsChannelContainer">
        <div id="channel" className="cardsChannelContent selectedContainer">
          {item.data.map((item, idx2) => {
            return (
              <button
                key={idx2}
                className="cardsChannelButton selectedCard"
                ref={(el) => {
                  // Armazena a referência de cada botão
                  if (!buttonRefs.current[idx1]) {
                    buttonRefs.current[idx1] = [];
                  }
                  buttonRefs.current[idx1][idx2] = el;
                }}
                style={{
                  backgroundImage: isLoaded[idx2] ? `url(${item.channels_logo})` : 'none', // Aplica a imagem de fundo quando carregada
                  backgroundSize: '150px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  opacity: isLoaded[idx2] ? 1 : 0, // Aplica a transição de opacidade
                  transition: 'opacity 0.5s ease-in-out', // Transição suave
                }}
                onFocus={() => {
                  setFocusedContent(item);
                  setHaveFocusedEvent(false);
                }}
              >
                <div className="displayNone">
                  <div className="cardsChannelButtonTextContainer">
                    <h6>{item.channels_name}</h6>
                  </div>
                </div>
              </button>
            );
          })}
          <div className="cardsFinalMarginScrollX"></div>
        </div>
      </div>
    );
};

export const RenderRecomendationCards = ({ item, setFocusedRecomendation, divRef }) => {

    const [isLoaded, setIsLoaded] = useState(new Array(item.data.length).fill(false)); // Estado para controlar o carregamento das imagens de fundo
    
    // Função para carregar a imagem de fundo manualmente
    const loadBackgroundImage = (idx2, imageUrl) => {
      const img = new Image(); // Criamos um novo objeto de imagem
      img.src = imageUrl; // Definimos a URL da imagem
      
      img.onload = () => {
        // Quando a imagem for carregada, definimos o estado 'isLoaded' para true
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = true; // Marca como carregada para o botão específico
          return updatedState;
        });
      };
      
      img.onerror = () => {
        // Caso haja um erro no carregamento da imagem (exemplo: imagem não encontrada)
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = false; // Marca como false se a imagem não carregar
          return updatedState;
        });
      };
    };
  
    // Usamos useEffect para carregar as imagens assim que o componente for montado
    useEffect(() => {
      // Para cada item no array de dados, carregamos a imagem
      item.data.forEach((item, idx2) => {
        loadBackgroundImage(idx2, item.image);
      });
    }, [item.data]); // Roda quando o array 'item.data' mudar

  // Função chamada quando a imagem termina de carregar


  return (
      <div className="cardsContainer ">
          <div id="bottom" className="cardsContent selectedContainer">
              {item.data.map((rows, idx2) => {
                  return (
                      <button
                          key={idx2}
                          ref={(el) => {
                            // Armazena a referência de cada botão
                            if (!divRef.current[1]) {
                                divRef.current[1] = [];
                            }
                            divRef.current[1][idx2] = el;
                        }}
                          className="cardButton selectedCard"
                          style={{
                            backgroundImage: isLoaded[idx2] ? `url(${rows.image})` : 'none', // Aplica a imagem de fundo quando carregada
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            opacity: isLoaded[idx2] ? 1 : 0, // Aplica a transição de opacidade
                            transition: 'opacity 0.5s ease-in-out', // Transição suave
                          }}
                          onFocus={() => {
                            setFocusedRecomendation(rows)

                            }}
                          
                            onClick={(() => {
                            })}
                      >
                      <div className="displayNone">
                        <div className="cardsRecomendationButtonTextContainer">
                          <h5>{rows.title}</h5>
                          {rows.type !== "VOD" ? 
                            <h6>{FormatDate(rows.start)}</h6>
                          
                          : ""} 
                        </div>
                      </div>

                      </button>
                  )
              })}

              <div className="cardsFinalMarginScrollX"></div>
          </div>
      </div>
  );
}

export const RenderRecordingCards = ({ item, setFocusedContent, divRef, setHaveFocusedEvent }) => {
    const [isLoaded, setIsLoaded] = useState(new Array(item[0].data.length).fill(false)); // Estado para controlar o carregamento das imagens de fundo
    
    // Função para carregar a imagem de fundo manualmente
    const loadBackgroundImage = (idx2, imageUrl) => {
      const img = new Image(); // Criamos um novo objeto de imagem
      img.src = imageUrl; // Definimos a URL da imagem
      
      img.onload = () => {
        // Quando a imagem for carregada, definimos o estado 'isLoaded' para true
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = true; // Marca como carregada para o botão específico
          return updatedState;
        });
      };
      
      img.onerror = () => {
        // Caso haja um erro no carregamento da imagem (exemplo: imagem não encontrada)
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = false; // Marca como false se a imagem não carregar
          return updatedState;
        });
      };
    };
  
    // Usamos useEffect para carregar as imagens assim que o componente for montado
    useEffect(() => {
      // Para cada item no array de dados, carregamos a imagem
      item[0].data.forEach((item, idx2) => {
        loadBackgroundImage(idx2, item.image);
      });
    }, [item.data]); // Roda quando o array 'item.data' mudar

  // Função chamada quando a imagem termina de carregar


  return (
      <div className="cardsContainer ">
          <div id="bottom" className="cardsContent selectedContainer">
              {item[0].data.map((rows, idx2) => {
                  return (
                      <button
                          key={idx2}
                          ref={(el) => {
                            // Armazena a referência de cada botão
                            if (!divRef.current[0]) {
                                divRef.current[0] = [];
                            }
                            divRef.current[0][idx2] = el;
                        }}
                          className="cardButton selectedCard"
                          style={{
                            backgroundImage: isLoaded[idx2] ? `url(${rows.image})` : 'none', // Aplica a imagem de fundo quando carregada
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            opacity: isLoaded[idx2] ? 1 : 0, // Aplica a transição de opacidade
                            transition: 'opacity 0.5s ease-in-out', // Transição suave
                          }}
                          onFocus={() => {
                            setFocusedContent(rows)
                            setHaveFocusedEvent(true)
                            }}
                          
                            onClick={(() => {
                            })}
                      >
                      <div className="displayNone">
                        <div className="cardsRecomendationButtonTextContainer">
                          <h5>{rows.title}</h5>
                          {rows.type !== "VOD" ? 
                            <h6>{FormatDate(rows.start)}</h6>
                          
                          : ""} 
                        </div>
                      </div>

                      </button>
                  )
              })}

              <div className="cardsFinalMarginScrollX"></div>
          </div>
      </div>
  );
}

export const RenderMyListCards = ({ item, setFocusedContent, divRef, recordingLength, setHaveFocusedEvent }) => {
    const [isLoaded, setIsLoaded] = useState(new Array(item.length).fill(false)); // Estado para controlar o carregamento das imagens de fundo
    
    // Função para carregar a imagem de fundo manualmente
    const loadBackgroundImage = (idx2, imageUrl) => {
      const img = new Image(); // Criamos um novo objeto de imagem
      img.src = imageUrl; // Definimos a URL da imagem
      
      img.onload = () => {
        // Quando a imagem for carregada, definimos o estado 'isLoaded' para true
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = true; // Marca como carregada para o botão específico
          return updatedState;
        });
      };
      
      img.onerror = () => {
        // Caso haja um erro no carregamento da imagem (exemplo: imagem não encontrada)
        setIsLoaded((prevState) => {
          const updatedState = [...prevState];
          updatedState[idx2] = false; // Marca como false se a imagem não carregar
          return updatedState;
        });
      };
    };
  
    // Usamos useEffect para carregar as imagens assim que o componente for montado
    useEffect(() => {
      // Para cada item no array de dados, carregamos a imagem
      item.forEach((item, idx2) => {
        loadBackgroundImage(idx2, item.image);
      });
    }, [item]); // Roda quando o array 'item.data' mudar

  // Função chamada quando a imagem termina de carregar


  return (
      <div className="cardsContainer ">
          <div id="bottom" className="cardsContent selectedContainer">
              {item.map((rows, idx2) => {
                  return (
                      <button
                          key={idx2}
                          ref={(el) => {
                            // Armazena a referência de cada botão
                            if(recordingLength < 1) {
                              if (!divRef.current[0]) {
                                divRef.current[0] = [];
                            }
                            divRef.current[0][idx2] = el;
                            } else {
                              if (!divRef.current[1]) {
                                divRef.current[1] = [];
                            }
                            divRef.current[1][idx2] = el;
                            }
                        }}
                          className="cardButton selectedCard"
                          style={{
                            backgroundImage: isLoaded[idx2] ? `url(${rows.image})` : 'none', // Aplica a imagem de fundo quando carregada
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            opacity: isLoaded[idx2] ? 1 : 0, // Aplica a transição de opacidade
                            transition: 'opacity 0.5s ease-in-out', // Transição suave
                          }}
                          onFocus={() => {
                            setFocusedContent(rows)
                            setHaveFocusedEvent(true)
                            }}
                          
                            onClick={(() => {
                            })}
                      >
                      <div className="displayNone">
                        <div className="cardsRecomendationButtonTextContainer">
                          <h5>{rows.title}</h5>
                          {rows.type !== "VOD" ? 
                            <h6>{FormatDate(rows.start)}</h6>
                          
                          : ""} 
                        </div>
                      </div>

                      </button>
                  )
              })}

              <div className="cardsFinalMarginScrollX"></div>
          </div>
      </div>
  );
}