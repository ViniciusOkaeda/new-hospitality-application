import api from "./api"
import { useNavigate, useParams } from "react-router-dom";
import { GetDevicesType, GetLanguage } from "../utils/constants";

export const auth = localStorage.getItem("authorization");
export const profile = sessionStorage.getItem("profileid");
export const language = await GetLanguage();
export const devicesType = await GetDevicesType();


export const LoginMotv = async (navigate) => {

    //var login = document.getElementById("input-username").value;
    //var password = document.getElementById("input-password").value;

    var login = "developer.demo";
    var password = "12345";
    var vendors_id = 2;


    try {
        const response = await api.post('loginMoTV', { login, password, vendors_id });
        if (response.data.status === 1) {
            console.log("deu 1")
            localStorage.setItem("authorization", response.data.response.customers_token);
            navigate('/profile')
        }
        console.log("o response é", response)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }



}

export const LoginMotvWithToken = async (navigate) => {

    const token = localStorage.getItem("authorization");
    const customers_token = token;

    try {
        const response = await api.post('loginMoTVWithToken', { token, customers_token });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}

//call para retornar todos os eventos da homepage
export const GetHomepageV2 = async () => {

    try {
        const response = await api.post('getHomepageV2',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                devicesType: devicesType
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }

}

//call para retornar detalhes específicos de um evento único (VOD)
export const GetEventRequestVod = async (eventId) => {

    try {
        const response = await api.post('getDataV2',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                devicesType: devicesType,
                vodsId: parseInt(eventId),
                timestamp: 0
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
//call para retornar detalhes específicos de um evento único (TV)
export const GetEventRequestTv = async (eventId) => {

    try {
        const response = await api.post('getUpdatedEventsV2',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                devicesType: devicesType,
                ids: [parseInt(eventId)],
                timestamp: 0
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
//call para retornar recomendações de eventos similares ao getEventRequest (VOD E TV)
export const GetEventRecomendationRequest = async (eventId, type) => {

    try {
        const response = await api.post('getEventRecommendationRows',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                devicesType: devicesType,
                id: parseInt(eventId),
                type: type
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}


//call para eventos gravados (opção disponivel apenas para eventos TV)
export const GetRecordingsByProfileV2 = async () => {

    try {
        const response = await api.post('getRecordingsByProfileV2',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                devicesType: devicesType,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
//call para gravar eventos (opção disponivel apenas para eventos TV)
export const AddRecordingV2 = async (eventId) => {

    try {
        const response = await api.post('addRecordingV2',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                epgEventsId: parseInt(eventId),
                devicesType: devicesType,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
//call para remover eventos gravados (opção disponivel apenas para eventos TV)
export const RemoveRecording = async (eventId) => {

    try {
        const response = await api.post('removeRecording',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                epgEventsId: parseInt(eventId),
                devicesType: devicesType,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}


//call para lista de eventos salvos
export const GetMyListFull = async () => {

    try {
        const response = await api.post('getMyListFull',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                devicesType: devicesType,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
//call para adicionar eventos em uma lista de reprodução (TV E VOD)
export const AddToMyList = async (eventId, type) => {
    try {
        const response = await api.post('addToMyList',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                type: type,
                id: parseInt(eventId),
                devicesType: devicesType,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
//call para remover eventos em uma lista de reprodução (TV E VOD)
export const RemoveFromMyList = async (eventId, type) => {

    try {
        const response = await api.post('removeFromMyList',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                type: type,
                id: parseInt(eventId),
                devicesType: devicesType,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}


export const GetStreamChannelUrlV3 = async (channels_id, type, type_rep, eventTimestamp) => {
    try {
        if (type_rep === "LIVE") {

        } else {
            const response = await api.post('getStreamChannelUrlV3',
                {
                    authorization: 'Bearer ' + auth,
                    channelsId: parseInt(channels_id),
                    profileId: profile,
                    devicesType: devicesType,
                    includeData: true,
                    language: language,
                    live: false,
                    timestamp: Date.parse(eventTimestamp) / 1000,
                    type: type
                }
            );
            return response.data;
        }

    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}

export const GetStreamVodUrlV3 = async (vods_id, type) => {
    try {
        const response = await api.post('getStreamVodUrlV3',
            {
                authorization: 'Bearer ' + auth,
                includeData: true,
                profileId: profile,
                language: language,
                devicesType: devicesType,
                vodsId: parseInt(vods_id),
                type: type
            }
        );
        return response.data;

    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}


export const GetSubscribedAndLockedChannels = async () => {


    return auth

}



