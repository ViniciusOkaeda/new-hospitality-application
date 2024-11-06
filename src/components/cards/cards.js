import React from "react";
import './cards.css'

export const RenderCards = (item, idx, setFocusedContent, setHaveFocusedEvent) => {

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
                        setFocusedContent(rows);
                        setHaveFocusedEvent(true)
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
        <div className="cardsContainerWithBackground">
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
        <div className="">
            <div className=""></div>
            <div className=""></div>
        </div>
    )
}