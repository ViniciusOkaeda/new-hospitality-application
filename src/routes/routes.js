import React from "react";
import { Routes, BrowserRouter, Route, Navigate} from "react-router-dom";
import Player from "../pages/player/player";
import Login from "../pages/login/login";
import Profile from "../pages/profile/profile";
import Home from "../pages/home/home";
import Event from "../pages/detailEvent/detailEvent";
import Channel from "../pages/channel/channel";
import Guide from "../pages/guide/guide";
import Vod from "../pages/vod/vod";
import Search from "../pages/search/search";
import Catchup from "../pages/catchup/catchup";
import DetailCatchup from "../pages/catchup/detailCatchup";
import Favorite from "../pages/favorite/favorite";

function AllRoutes() {

    const token = "";


    return(
        <BrowserRouter>
            <Routes>
                <Route exact path="/login" element={<Login />} />    
                <Route path="/profile" element={<Profile />} />
                <Route path="/guide" element={<Guide />} />    
                <Route path="/home" element={<Home />} />
                <Route path="/channel" element={<Channel />} />
                <Route path="/vod" element={<Vod />} />
                <Route path="/search" element={<Search />} />
                <Route path="/catchup" element={<Catchup />} />
                <Route path="/catchup/detail/:channel" element={<DetailCatchup />} />
                <Route path="/favorite" element={<Favorite />} />


                <Route path="/player/:type/:event/:channel?" element={<Player />} />

                {/* Rota especifica para lives */}
                <Route path="/player/:type/LIVE/:channel" element={<Player />} />

                <Route path="/event/:type/:event" element={<Event />}/>


                <Route path="*" element={<Navigate to ={token ? "/profile" : "/login"} />} /> 
 
            </Routes>
        </BrowserRouter>
    )
}

export default AllRoutes;