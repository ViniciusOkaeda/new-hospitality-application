export const GetDevicesType = () => {
    const devices = btoa("web player")

    return devices;
}

export const GetLanguage = () => {
    const language = btoa("pt")

    return language
}


export const Logout = (navigate) => {
localStorage.clear();
sessionStorage.clear();
navigate('/login')
}



