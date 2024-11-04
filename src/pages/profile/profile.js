import React, { useEffect, useState } from "react";
import './profile.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { LoginMotvWithToken } from "../../services/calls";
import { Logout } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

function Profile() {
    const [containerCount, setContainerCount] = useState(-1);
    const [cardCount, setCardCount] = useState(0);
    const [selectableContainers, setSelectableContainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();

    const SaveProfileData = (profiles_name, profiles_id, profile_image) => {
        sessionStorage.setItem("profileid", btoa(profiles_id));
        localStorage.setItem("profileimage", profile_image);
        localStorage.setItem("profilename", profiles_name);
        navigate('/home');
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await LoginMotvWithToken();
                if (result && result.status === 1) {
                    setProfiles(result.response);
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente
    }, []); // Este useEffect será executado apenas uma vez

    useEffect(() => {
        const selectableContainer = document.querySelectorAll('.selectedContainer');
        setSelectableContainers(selectableContainer);
    }, []); // Executa apenas uma vez após a montagem

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (!loading) {
                handleKeyDown(event, {
                    enter: () => {
                        const focusedElement = document.activeElement;
                        if (focusedElement.classList.contains('profileButton')) {
                            const index = Array.from(document.querySelectorAll('.profileButton')).indexOf(focusedElement);
                            SaveProfileData(
                                profiles.profiles[index]?.profiles_name,
                                profiles.profiles[index]?.profiles_id,
                                profiles.profiles[index]?.image
                            );
                            console.log("Dados do perfil:", profiles.profiles[index]);
                        } else if (focusedElement.id === "logoutButton") {
                            Logout(navigate);
                        }
                    },
                    escape: () => {
                        console.log("Escape key pressed on Page 1");
                    },
                    up: () => {
                        if (containerCount > 0) {
                            setContainerCount(prev => {
                                const newCount = prev - 1;
                                setCardCount(0);
                                selectableContainers[newCount]?.getElementsByClassName('selectedCard')[0]?.focus();
                                return newCount;
                            });
                        }
                    },
                    down: () => {
                        if (containerCount < selectableContainers.length - 1) {
                            setContainerCount(prev => {
                                const newCount = prev + 1;
                                selectableContainers[newCount]?.getElementsByClassName('selectedCard')[0]?.focus();
                                return newCount;
                            });
                        }
                    },
                    left: () => {
                        if (containerCount === 0 && cardCount > 0) {
                            setCardCount(prev => {
                                const newCardCount = prev - 1;
                                selectableContainers[0]?.getElementsByClassName('selectedCard')[newCardCount]?.focus();
                                return newCardCount;
                            });
                        }
                    },
                    right: () => {
                        if (containerCount === 0 && cardCount < selectableContainers[0]?.getElementsByClassName('selectedCard').length - 1) {
                            setCardCount(prev => {
                                const newCardCount = prev + 1;
                                selectableContainers[0]?.getElementsByClassName('selectedCard')[newCardCount]?.focus();
                                return newCardCount;
                            });
                        }
                    },
                    home: () => {
                        console.log("Home key pressed on Page 1");
                    },
                    squares: () => {
                        console.log("Squares key pressed on Page 1");
                    },
                });
            }
        };

        document.addEventListener("keydown", keyDownHandler);
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [loading, containerCount, cardCount, profiles, selectableContainers]); // Dependências mantidas

    return (
        <>
            {loading ? (
                <Loader />
            ) : error ? (
                <div className="initialContainer"><h3>Erro: {error}</h3></div>
            ) : (
                <div className="flex container declaredHeight flexColumn">
                    <div className="headerContainer">
                        <h2>Quem está assistindo?</h2>
                    </div>

                    <div className="profileContainer selectedContainer">
                        {profiles.profiles.map((item, idx) => (
                            <div key={idx} className="profileContent">
                                <button className="profileButton selectedCard">
                                    <img src={item.image} alt={item.profiles_name} />
                                </button>
                                <h4>{item.profiles_name}</h4>
                            </div>
                        ))}
                    </div>

                    <div className="footerContainer selectedContainer">
                        <button id="logoutButton" className="footerButton selectedCard">Sair</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;
