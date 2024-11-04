import api from "./api"
import { useNavigate, useParams } from "react-router-dom";





export const LoginMotv = async (navigate) => {

    //var login = document.getElementById("input-username").value;
    //var password = document.getElementById("input-password").value;

    var login = "developer.youcast";
    var password = "12345";
    var vendors_id = 2;


    try {
        const response = await api.post('loginMoTV', {login, password, vendors_id});
        if(response.data.status === 1) {
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
        const response = await api.post('loginMoTVWithToken', {token, customers_token});
        return response.data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}

