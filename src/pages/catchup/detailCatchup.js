import React, { useEffect, useState, useRef } from "react";
import './catchup.css';
import { handleKeyDown } from "../../utils/navigation";
import { Loader } from "../../components/loader/loader";
import { useNavigate, useParams } from "react-router-dom";
import { GetTodayDate, FormatDate, FormatDescriptionLength, FormatDuration, FormatRating, NavigateToPages, GetProgressPercentage, FormatChannelTitleLength, FormatChannelDescriptionLength } from "../../utils/constants";
import { GetChannelCategories, GetSubscribedAndLockedChannels, GetFavoriteChannels, GetLiveChannelEvents, GetChannelEvents } from "../../services/calls";
import { Menu } from "../../components/menu/menu";
import { useKeyNavigation } from "../../utils/newNavigation";
import { RenderCards, RenderCardsWithBackground, RenderChannelsCards, RenderTest } from "../../components/cards/cards";


function DetailCatchup() {
    const [enableArrows, setEnableArrows] = useState(false)

    const [isLoaded, setIsLoaded] = useState(false); // Estado para controlar o carregamento
    const { channel } = useParams(); // Pega o ID da URL



    const [loading, setLoading] = useState(true); // Inicialmente, estamos carregando
    const [error, setError] = useState('');
    const [activePage, setActivePage] = useState('');

    const navigate = useNavigate()

    const [categoryFocused, setCategoryFocused] = useState(null)
    const [categoryFilteredOnKeyPress, setCategoryFilteredOnKeyPress] = useState(null)
    const [channelFocused, setChannelFocused] = useState([])

    const [haveFocusedEvent, setHaveFocusedEvent] = useState(false);
    const [eventChannels, setEventChannels] = useState([])
    const [channelCategories, setChannelCategories] = useState([])
    const [favoriteChannels, setFavoriteChannels] = useState([])
    const [liveEventChannels, setLiveEventChannels] = useState([])

    const divRef = useRef([]); // Ref para a div que você deseja medir
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


    // Função para atualizar as dimensões da div


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetChannelEvents(channel);
                if (result) {
                    console.log("o resultado", result)
                    if (result.status === 1) {
                        setEventChannels(result.response)
                    }
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false); // Dados carregados, então setar como false
                setEnableArrows(true);
            }
        };

        loadData(); // Chama a função de carregamento ao montar o componente

    }, []); // Dependência vazia para garantir que loadData só seja chamado uma vez



    // Funções de navegação
    const handleArrowDown = () => {
        console.log("Seta para baixo pressionada");
    };

    const handleArrowUp = () => {
        console.log("Seta para cima pressionada");
    };

    const handleArrowLeft = () => {

    };

    const handleArrowRight = () => {

    }; 

    const handleEnter = () => {

    //window.location.href = `/player/TV/LIVE/${channelFocused.channels_id}`;
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

                <div className="flex container flexColumn declaredOverflow" ref={divRef}
                >
                    <div className="categoriesContainer paddingLeftDefault">
                        <div className="categoriesContent">

                            <h3>DETALHES</h3>

                        </div>
                    </div>

                    <div className="channelsContainer paddingLeftDefault">

                    </div>


                </div>

            )

            }

        </>

    );
}


export default DetailCatchup;