import React, {useEffect, useState} from "react";
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

export const Menu = (status) => {

    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const navigate = useNavigate()


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await LoginMotvWithToken();
                if (result) {
                    if(result.status === 1) {
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
    console.log("o status é ", status.status)

    return(
        <div className="menuContainer">

            <div className="menuLeftContainer" style={{
                
                backgroundColor: status.status === true ? "rgba(17, 16, 20, 0.95)" : "none",
                backgroundImage: status.status === true ? "none" : "linear-gradient(to left, rgba(17, 16, 20, 0) 0%, rgba(17, 16, 20, 0.3) 10%, rgba(17, 16, 20, 0.5) 20%, rgba(17, 16, 20, 0.7) 30%, rgba(17, 16, 20, 0.8) 40%)"
            }}>
                <div className="menuIconButtons">
                    <div className="menuProfileButton">
                        {status.status === true ? 
                        <button className="iconButtonProfile">
                            <img src={profile.image} className="iconButtonImgProfile"></img>

                        </button>
                        
                        : ""}
                    </div>

                    <div className="menuOptionsButton">
                        <button className="iconButton1">
                            <img src={SearchIcon} className="iconButtonImg1"></img>
                        </button>
                        <button className="iconButton">
                            <img src={HomeIcon} className="iconButtonImg"></img>
                        </button>
                        <button className="iconButton">
                            <img src={ChannelIcon} className="iconButtonImg"></img>
                        </button>
                        <button className="iconButton">
                            <img src={GuideIcon} className="iconButtonImg"></img>
                        </button>
                        <button className="iconButton">
                            <img src={VodIcon} className="iconButtonImg"></img>
                        </button>
                        <button className="iconButton">
                            <img src={SavedIcon} className="iconButtonImg"></img>
                        </button>
                        <button className="iconButton">
                            <img src={CatchupIcon} className="iconButtonImg"></img>
                        </button>

                        {status.status === true ? 
                        
                        <>
                        <button className="iconButton menuMarginTop">
                            <img src={ConfigIcon} className="iconButtonImg"></img>
                        </button>
                        <button className="iconButton">
                            <img src={LogoutIcon} className="iconButtonImg"></img>
                        </button>
                        </>
                        :""}


                    </div>
                </div>
            </div>

            {status.status === true ? 
            <div className="menuRightContainer">
                <div className="menuIconTexts">
                    <div className="menuProfileText">
                        <h4>{profile.profiles_name}</h4>
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
}