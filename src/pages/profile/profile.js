import React, { useEffect, useState, useRef } from "react";
import './profile.css';
import { handleKeyDown } from "../../utils/navigation";
import { useKeyNavigation } from "../../utils/newNavigation";
import { Loader } from "../../components/loader/loader";
import { LoginMotvWithToken } from "../../services/calls";
import { Logout } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [enableArrows, setEnableArrows] = useState(false)

    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate()
    const [saveProfileData, setSaveProfileData] = useState([])
    const divRef = useRef([])
    const handleButtonRef = (index, index2, el) => {
        // Garantir que o array esteja inicializado
        if (!divRef.current[index]) {
            divRef.current[index] = [];
        }
        divRef.current[index][index2] = el;
    };

    useEffect(() => {
        if (!divRef.current[0]) {
            divRef.current[0] = [];
        }
        if (!divRef.current[1]) {
            divRef.current[1] = [];
        }
    }, []);

    const SaveProfileData = (profiles_name, token, profiles_id, profile_image) => {
        sessionStorage.setItem("profileid", btoa(profiles_id));
        localStorage.setItem("profileimage", profile_image);
        localStorage.setItem("profilename", profiles_name);
        //navigate('/home');
        window.location.href = `/home`;
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await LoginMotvWithToken();
                if (result) {
                    if(result.status === 1) {
                        setProfiles(result.response)
                    }
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false); // Dados carregados, então setar como false
                setEnableArrows(true)
            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente

    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez

    const handleArrowDown = () => {
            if(containerCount < 1) {
                let nextItemIndex = containerCount + 1
                setContainerCount(nextItemIndex)
                if(nextItemIndex === 0){
                    setTimeout(() => {
                        if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][buttonCount]) {
                            console.log("Focando o primeiro item de divRef.current[0][0]");
                            window.scrollTo(0, 0)
                            divRef.current[nextItemIndex][buttonCount].focus();
                                            }
                    }, 10);
                }else if(nextItemIndex === 1) {
                    if (divRef.current[nextItemIndex] && divRef.current[nextItemIndex][cardCount]) {

                        divRef.current[nextItemIndex][cardCount].focus();
                    }
                    
                }
            }


    };

    const handleArrowUp = () => {
        if(containerCount > 0) {
            let previousItemIndex = containerCount - 1
            setContainerCount(previousItemIndex)
            if(divRef.current[previousItemIndex] && divRef.current[previousItemIndex][buttonCount]) {
                divRef.current[previousItemIndex][buttonCount].focus();
            }
        }
    };

    const handleArrowLeft = () => {
        if(containerCount === 0) {
            let previousItemIndex = buttonCount - 1;
            if (divRef.current[containerCount] && divRef.current[containerCount][previousItemIndex]) {
                setButtonCount(previousItemIndex);
                divRef.current[containerCount][previousItemIndex].focus();
                //divRef.current[containerCount][nextCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
            }
        }
    };

    const handleArrowRight = () => {
        if(containerCount === 0) {
            let nextItemIndex = buttonCount + 1;
            if (divRef.current[containerCount] && divRef.current[containerCount][nextItemIndex]) {
                setButtonCount(nextItemIndex);
                divRef.current[containerCount][nextItemIndex].focus();
                //divRef.current[containerCount][nextCardIndex].scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" })
            }
        }
    }; 

    const handleEnter = () => {
            if(containerCount === 0) {
                console.log("save", saveProfileData)
                sessionStorage.setItem("profileid", btoa(saveProfileData.profiles_id));
                localStorage.setItem("profileimage", saveProfileData.image);
                localStorage.setItem("profilename", saveProfileData.profiles_name);
                window.location.href = `/home`;
            } else {
                Logout(navigate);
            }
    };

    const handleEscape = () => {
        console.log("Escape pressionado");

        // Implemente a lógica para quando o usuário pressionar Escape (ex: sair do foco)
    };

    const {
        containerCount,
        cardCount,
        buttonCount,
        setContainerCount,
        setCardCount,
        setButtonCount,
    } = useKeyNavigation({
        loading,
        enableArrows,
        onArrowUp: () => handleArrowUp(),
        onArrowDown: () => handleArrowDown(),
        onArrowLeft: () => handleArrowLeft(),
        onArrowRight: () => handleArrowRight(),
        onEnter: () => handleEnter(),
        onEscape: () => handleEscape(),
    });
    return (
        <>
        {loading ? (
            <Loader /> // Exibe o Loader enquanto carrega
        ) : error ? (
            <div className="initialContainer"><h3>Erro: {error}</h3></div> // Exibindo mensagem de erro, se houver


        ) : (
            <div className="flex container declaredHeight flexColumn">
                <div className="headerContainer">
                    <h2>Quem está assistindo?</h2>
                </div>

                <div className="profileContainer selectedContainer">

                    {profiles.profiles.map((item, idx) => {

                        return(

                    <div key={idx} className="profileContent">
                        <button
                        ref={(el) => handleButtonRef(0, idx, el)}

                        onFocus={(() => {
                            setSaveProfileData(item)
                        })} 
                        className="profileButton selectedCard"
                        
                        >
                            <img src={item.image}></img>
                        </button>

                        <h4>{item.profiles_name}</h4>
                    </div>

                        )
                    })}



                </div>

                <div className="footerContainer selectedContainer">
                    <button 
                    id="logoutButton" 
                    className="footerButton selectedCard"
                    ref={(el) => handleButtonRef(1, 0, el)}
                    >Sair</button>
                </div>
            </div>
        )
    
    }
        
        </>

    );
}

export default Profile;
