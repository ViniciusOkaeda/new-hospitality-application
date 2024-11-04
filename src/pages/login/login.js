import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImgLogo from '../../images/logo_Yplay-01.png';
import ImgBgd from '../../images/bgd5.jpg';
import ImgQr from '../../images/qr-code.png';
import './login.css';
import { LoginMotv } from '../../services/calls';
import { handleKeyDown } from "../../utils/navigation";

function Login() {
    const [containerCount, setContainerCount] = useState(-1); // Começa em 0 para o primeiro elemento
    const [selectableContainers, setSelectableContainers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const selectableContainer = document.querySelectorAll('.selectedCard');
        setSelectableContainers(selectableContainer);

        const keyDownHandler = (event) => {
            handleKeyDown(event, {
                enter: () => {
                    const focusedElement = document.activeElement;
                    if (focusedElement.id === "loginButton") {
                        LoginMotv(navigate);
                    }
                },
                escape: () => {
                    console.log("Escape key pressed on Page 1");
                },
                up: () => {
                    if (containerCount > 0) {
                        setContainerCount(prev => prev - 1);
                        selectableContainer[containerCount - 1].focus();
                    }
                },
                down: () => {
                    if (containerCount < selectableContainer.length - 1) {
                        setContainerCount(prev => prev + 1);
                        selectableContainer[containerCount + 1].focus(); // Muda para o próximo elemento
                    }
                },
                // Outras teclas...
            });
        };

        document.addEventListener("keydown", keyDownHandler);
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [containerCount]); // Adiciona containerCount como dependência para atualizar o estado corretamente

    return (
        <div className="flex container declaredHeight declaredOverflow">
            <div className="banner">
                <div className="logoContent">
                    <img src={ImgLogo} className="logoImg" alt="Logo" />
                </div>
                <img src={ImgBgd} className="bgdImg" alt="Background" />
            </div>

            <div className="formContainer declaredHeight">
                <div id="campo1" className="formTitle formSizes">
                    <h1>Entrar</h1>
                </div>

                <div className="formInputs formSizes">
                    <input id="input-username" className="form-field selectedCard" type="text" placeholder="Usuario" />
                    <input id="input-password" className="form-field selectedCard" type="password" placeholder="Senha" />
                    <button id="loginButton" className="selectedCard">Entrar</button>
                    <p id="result1"></p>
                    <p id="result2"></p>
                </div>

                <div id="unavailable" className="formLine formSizes">
                    <div className="line"></div>
                    <p>OU</p>
                    <div className="line"></div>
                </div>

                <div id="campo6" className="formQrCode formSizes">
                    <button className="selectedCard cfg">
                        <div className="buttonQr">
                            <div className="formQrCodeIcon">
                                <img src={ImgQr} className="imgQr" alt="QR Code" />
                            </div>
                            <h4>Login via QR Code</h4>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
