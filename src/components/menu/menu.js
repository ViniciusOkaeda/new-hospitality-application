import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { LoginMotvWithToken } from "../../services/calls";
import './menu.css';

import SearchIcon from '../../images/search3.png'
import HomeIcon from '../../images/home.png'
import ChannelIcon from '../../images/computer.png'
import GuideIcon from '../../images/checklist.png'
import VodIcon from '../../images/movie.png'
import SavedIcon from '../../images/saved.png'
import CatchupIcon from '../../images/left-arrow.png'
import ConfigIcon from '../../images/settings.png'
import LogoutIcon from '../../images/logout.png'

import { useNavigate } from "react-router-dom";

export const Menu = forwardRef(({ status, activePage, setUserData }, ref) => {

    //console.log("meu status é", status)
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const buttonsRef = useRef([]); // Armazenando as refs dos botões, como um array.
    useImperativeHandle(ref, () => ({
        focusButton(index) {
            if (buttonsRef.current[index]) {
                buttonsRef.current[index].focus(); // Focar no botão com o índice fornecido
            }
        },
        blurButton(index) {
            if (buttonsRef.current[index]) {
                buttonsRef.current[index].blur(); // Desfocar o botão com o índice fornecido
            }
        }
    }));


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await LoginMotvWithToken();
                if (result) {
                    if (result.status === 1) {
                        console.log("meu result", result)
                        setUserData(result.response)
                        setProfile(result.response.profiles[0])
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
    //console.log("o status é ", status.status)

    const buttonData = [
        { icon: localStorage.getItem('profileimage'), alt: localStorage.getItem('profilename'), ref: "profile" },
        { icon: SearchIcon, alt: "Pesquisar", ref: "search" },
        { icon: HomeIcon, alt: "Inicio", ref: "home" },
        { icon: ChannelIcon, alt: "Canais", ref: "channel" },
        { icon: GuideIcon, alt: "Programação", ref: "guide" },
        { icon: VodIcon, alt: "VOD", ref: "vod" },
        { icon: SavedIcon, alt: "Salvos", ref: "saved" },
        { icon: CatchupIcon, alt: "Arquivo de TV", ref: "catchup" },
        { icon: ConfigIcon, alt: "Configurações", ref: "config" },
        { icon: LogoutIcon, alt: "Sair", ref: "login" },
    ];

    return (
        <div className="menuContainer">

            <div
                className="menuLeftContainer"
                style={{
                    backgroundColor: status === true ? "rgba(17, 16, 20, 0.95)" : "none",
                    backgroundImage: status === true ? "none" : "linear-gradient(to left, rgba(17, 16, 20, 0) 0%, rgba(17, 16, 20, 0.3) 10%, rgba(17, 16, 20, 0.5) 20%, rgba(17, 16, 20, 0.7) 30%, rgba(17, 16, 20, 0.8) 40%)"
                }}
                ref={ref} // Passando a ref para o container
            >
                <div className="menuIconButtons">
                    {/* Mapeando os botões e atribuindo a ref a cada um */}
                    {buttonData.map((button, index) => (
                        <button
                            key={index}
                            style={{
                                backgroundColor: `${window.location.pathname === `/${button.ref}` ? "rgb(150, 150, 150)" : "rgba(0, 0, 0, 0)"}`
                            }}
                            onFocus={(() => {
                                activePage(button.ref)
                            })}
                            className=
                            {
                                index === 0 && status === false ? "iconButtonDisplayedNone" :
                                index === 8 && status === false ? "displayNone" :
                                index === 9 && status === false ? "displayNone" :
                                index === 0 ? "iconButtonProfile selectedMenuOption" : 
                                index === 8 ? "iconButton selectedMenuOption menuMarginTop" :
                                "iconButton selectedMenuOption" 
                            }
                            ref={(el) => buttonsRef.current[index] = el} // Atribuindo a ref ao botão
                        >
                            <img src={button.icon} alt={button.alt} 
                            className={index === 0 ? "iconButtonImgProfile" : "iconButtonImg" }
                            
                            />
                        </button>
                    ))}
                </div>
            </div>





            {status === true ?
                <div className="menuRightContainer">
                    <div className="menuIconTexts">
                        <div className="menuProfileText">
                            <h4>{localStorage.getItem('profilename')}</h4>
                            <h6>Trocar Perfil</h6>
                        </div>

                        <div className="menuOptionsButton">

                            <div className="menuText">
                                <h4>Pesquisar</h4>
                            </div>
                            <div className="menuText">
                                <h4>Inicio</h4>
                            </div>
                            <div className="menuText">
                                <h4>Canais</h4>
                            </div>
                            <div className="menuText">
                                <h4>Programação</h4>
                            </div>
                            <div className="menuText">
                                <h4>VOD</h4>
                            </div>
                            <div className="menuText">
                                <h4>Salvos</h4>
                            </div>
                            <div className="menuText">
                                <h4>Arquivo de TV</h4>
                            </div>
                            <div className="menuText menuMarginTop">
                                <h4>Configurações</h4>
                            </div>
                            <div className="menuText">
                                <h4>Sair do aplicativo</h4>
                            </div>
                        </div>

                    </div>
                </div>

                : ""}

        </div>
    )
});