import React from "react";
import { Routes, BrowserRouter, Route, Navigate} from "react-router-dom";
import Player from "../pages/player/player";
import Login from "../pages/login/login";
import Profile from "../pages/profile/profile";
import Home from "../pages/home/home";

function AllRoutes() {

    const token = "";


    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/login" element={<Login />} />    
                <Route path="/profile" element={<Profile />} />    
                <Route path="/home" element={<Home />} />    
                <Route path="/player" element={<Player />} />   


                <Route path="*" element={<Navigate to ={token ? "/profile" : "/login"} />} /> 
 
            </Routes>
        </BrowserRouter>
    )
}

export default AllRoutes;