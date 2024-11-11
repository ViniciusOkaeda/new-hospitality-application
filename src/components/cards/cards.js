import React, { forwardRef } from "react";
import './cards.css'

export const RenderCards = (item, idx1, setFocusedContent, setHaveFocusedEvent, model, buttonRefs) => {

    return (
        <div key={idx1} className="cardsContainer ">
        <div className="cardsTitle paddingLeftDefault">
            <h3>{item.title}</h3>
        </div>

        <div id="bottom" className="cardsContent selectedContainer">
            {item.data.map((rows, idx2) => {
                return(
                    <button 
                    key={idx2}
                    ref={(el) => {
                        // Armazena a referência de cada botão
                        if (!buttonRefs.current[idx1]) {
                          buttonRefs.current[idx1] = [];
                        }
                        buttonRefs.current[idx1][idx2] = el;
                      }}
                    className="cardButton selectedCard"

                    onFocus={(() => {
                        if(model === 1) {
                            setFocusedContent([]);
                            setHaveFocusedEvent(false)
                        }

                    })}
                    >
                        <img src={rows.image} className="cardImage"></img>
                    </button>
                )
            })}

            <div className="cardsFinalMarginScrollX"></div>
        </div>
    </div>
    );
}

export const RenderCardsWithBackground = (item, idx1, setFocusedContent, setHaveFocusedEvent, buttonRefs) => {
    console.log("meu item", item)
    return(
        <div key={idx1} className="cardsContainerWithBackground">
            <div className="cardsContainerBgdImage" 
            style={{
                backgroundImage: `linear-gradient(to right, rgba(40, 40, 40, 0) 5%, rgba(40, 40, 40, 1) 100%) ,url(${item.background_image})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                borderRadius: "20px 0 0 20px"
            }}
            
            ></div>

            <div id="middle" className="cardsContainerRow selectedContainer">
                {item.data.map((item, idx2) => {

                    return(
                        <button key={idx2} className="cardRowButton selectedCard"
                        ref={(el) => {
                            // Armazena a referência de cada botão
                            if (!buttonRefs.current[idx1]) {
                              buttonRefs.current[idx1] = [];
                            }
                            buttonRefs.current[idx1][idx2] = el;
                          }}
                            onFocus={(() => {
                            setFocusedContent([]);
                            setHaveFocusedEvent(false)
                        })}
                        >
                            <img src={item.image} className="cardRowButtonImage"></img>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export const RenderChannelsCards = (item, idx1, setFocusedContent, setHaveFocusedEvent, buttonRefs) => {

    return(
        <div key={idx1} className="cardsChannelContainer">

            <div id="channel" className="cardsChannelContent selectedContainer">
                {item.data.map((item, idx2) => {
                    return(
                        <button key={idx2} className="cardsChannelButton selectedCard" 
                        ref={(el) => {
                            // Armazena a referência de cada botão
                            if (!buttonRefs.current[idx1]) {
                              buttonRefs.current[idx1] = [];
                            }
                            buttonRefs.current[idx1][idx2] = el;
                          }}
                        style={{
                            backgroundImage: `url(${item.channels_logo})`,
                            backgroundSize: "150px",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center"
                        }}
                        onFocus={(() => {
                            setFocusedContent([]);
                            setHaveFocusedEvent(false)
                        })}
                        >
                            <div className="displayNone">
                                <div className="cardsChannelButtonTextContainer">
                                    <h6>{item.channels_name}</h6>
                                </div>
                            </div>

                        </button>
                    )
                })}
                <div className="cardsFinalMarginScrollX"></div>

            </div>
        </div>
    )
}