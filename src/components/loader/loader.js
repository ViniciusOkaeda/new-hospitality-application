import React from "react";
import './loader.css';

export const Loader = () => {

    return (
        <div className="loaderContent">
            <div className="loader">
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__bar"></div>
                <div className="loader__ball"></div>
            </div>

            <div><h3>Carregando...</h3></div>
        </div>
    )
}