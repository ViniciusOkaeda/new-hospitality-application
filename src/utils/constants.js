export const GetDevicesType = () => {
    const devices = btoa("web player")

    return devices;
}

export const GetLanguage = () => {
    const language = btoa("pt")
}


export const Logout = (navigate) => {
localStorage.clear();
navigate('/login')
}



