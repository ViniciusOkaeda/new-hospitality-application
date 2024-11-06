import React from "react";
import './cards.css'

export const RenderCards = (item, idx, setFocusedContent, setHaveFocusedEvent, model) => {

    return (
        <div key={idx} className="cardsContainer ">
        <div className="cardsTitle paddingLeftDefault">
            <h3>{item.title}</h3>
        </div>

        <div id="bottom" className="cardsContent selectedContainer">
            {item.data.map((rows, idx) => {

                return(
                    <button 
                    key={idx} 
                    className="cardButton selectedCard"
                    onFocus={(() => {
                        if(model === 1) {
                            setFocusedContent(rows);
                            setHaveFocusedEvent(true)
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

export const RenderCardsWithBackground = (item, idx, setFocusedContent, setHaveFocusedEvent) => {
    return(
        <div key={idx} className="cardsContainerWithBackground">
            <div className="cardsContainerBgdImage" 
            style={{
                backgroundImage: `linear-gradient(to right, rgba(40, 40, 40, 0) 5%, rgba(40, 40, 40, 1) 100%) ,url(${item.background_image})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                borderRadius: "20px 0 0 20px"
            }}
            
            ></div>

            <div id="middle" className="cardsContainerRow selectedContainer">
                {item.data.map((item, idx) => {

                    return(
                        <button key={idx} className="cardRowButton selectedCard"
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

export const RenderChannelsCards = (item, idx, setFocusedContent, setHaveFocusedEvent) => {
    
    return(
        <div key={idx} className="cardsChannelContainer">

            <div id="middle" className="cardsChannelContent selectedContainer">
                {item.data.map((item, idx) => {
                    return(
                        <button key={idx} className="cardsChannelButton selectedCard" 
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