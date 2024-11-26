import React, {useEffect} from 'react';
import platform from 'platform';
import FingerprintJS from '@fingerprintjs/fingerprintjs';


export const GetDevicesType = () => {
    const devices = btoa("web player")

    return devices;
}
export const GetDevicesIdentification = async () => {
    const os = platform.os.family;
    const browser = platform.name;
    const version = platform.version;

    const identification = `${os} ${browser} ${version}`

    return identification
}

export const GetFingerPrint = async () => {
const fp = await FingerprintJS.load();

const result = await fp.get();

return result.visitorId
}

export const GetLanguage = () => {
    const language = btoa("pt")

    return language
}

export const GetTodayDate = () => {
// Ajusta a data para o fuso horário de São Paulo
const currentDateTime = new Date();
const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  
  const dateFormatter = new Intl.DateTimeFormat('en-GB', options);
  const formattedDate = dateFormatter.format(currentDateTime);
  
  // Convertendo para o formato ISO 8601 esperado (YYYY-MM-DDTHH:mm:ss)
  const isoDateTime = formattedDate.replace(',', '').replace(/\//g, '-').replace(' ', 'T');
  
    return isoDateTime
}

export const GetPastDate = () => {
    // Obtém a data atual
  const currentDateTime = new Date();

  // Subtrai 7 dias da data atual
  currentDateTime.setDate(currentDateTime.getDate() - 7);

  // Configurações para fuso horário de São Paulo
  const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  // Formata a data com base nas opções
  const dateFormatter = new Intl.DateTimeFormat('en-GB', options);
  const formattedDate = dateFormatter.format(currentDateTime);

  // Converte para o formato ISO 8601 (YYYY-MM-DDTHH:mm:ss)
  const isoDateTime = formattedDate
    .replace(',', '')
    .replace(/\//g, '-')
    .replace(' ', 'T');

  return isoDateTime;
}

export const GetProgressPercentage = (start, end) => {
    const startDate = new Date(start); // Data de início do evento
    const endDate = new Date(end);     // Data de término do evento
    const currentDate = new Date();    // Hora atual

    // Calcular a duração total do evento (em milissegundos)
    const totalDuration = endDate - startDate;
    
    // Se o evento ainda não começou, o progresso é 0%
    if (currentDate < startDate) {
      return 0;
    }

    // Se o evento já terminou, o progresso é 100%
    if (currentDate > endDate) {
      return 100;
    }

    // Calcular o tempo decorrido até o momento atual (em milissegundos)
    const elapsedTime = currentDate - startDate;

    // Calcular a porcentagem de progresso (tempo decorrido / duração total)
    const progress = (elapsedTime / totalDuration) * 100;

    // Retornar o valor de progresso entre 0 e 100
    return Math.min(100, Math.max(0, progress));
}

export const CheckIfHaveList = (myList, type, event) => {
    const checkTypeInList = myList.filter(item => item.type === type)
    const checkEventInList = checkTypeInList.filter(item => item.id === parseInt(event))
    if(checkEventInList.length > 0) {
        return true
    } else {
        return false
    }
}
export const CheckIfHaveRecording = (myRecordings, event) => {
    if(myRecordings.length > 1) {
        const checkEventInList = myRecordings.map(e => e.data.map(e => e)).flat()
        const checkEventInList2 = checkEventInList.filter(item => parseInt(item.id) === parseInt(event))
        if(checkEventInList2.length > 0) {
            return true
        } else {
            return false
        }

    } else if (myRecordings.length === 1) {
        const checkEventInList = myRecordings[0].data.filter(item => parseInt(item.id) === parseInt(event))
        if(checkEventInList.length > 0) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

export const FormatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    // Ajustar o horário de hoje para facilitar a comparação (ignorar a hora)
    today.setHours(0, 0, 0, 0);
    
    // Comparar a data recebida com hoje e ontem
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // Função para formatar hora
    const formatTime = (date) => {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    };
  
    // Formatar a data
    if (date >= today) {

        if(date == today) {
            return `hoje, ${formatTime(date)}`;

        } else if (date > today) {
            return `amanhã, ${formatTime(date)}`;

        }
    } else if (date >= yesterday) {
      return `ontem, ${formatTime(date)}`;
    } else {
      // Formatar o dia e o mês (Exemplo: 31 de out) e a hora
      const options = { day: 'numeric', month: 'short' };
      const formattedDate = date.toLocaleDateString('pt-BR', options).replace('.', ''); // Exemplo: 31 de out
      return `${formattedDate}, ${formatTime(date)}`;
    }
}

export const FormatDuration = (duration) => {
    const durationEvent = (duration / 60);

    const formatedDuration = durationEvent.toFixed(0);

    return formatedDuration;
}

export const FormatDescriptionLength = (description) => {
    const formatedDescription = description.length <= 175 ? description : description.substring(0, 175) + "...";

    return formatedDescription;
}

export const FormatChannelTitleLength = (title) => {
    const formatedDescription = title.length <= 19 ? title : title.substring(0, 19) + "";

    return formatedDescription;
}

export const FormatChannelDescriptionLength = (title) => {
    const formatedDescription = title.length <= 26 ? title : title.substring(0, 25) + "";

    return formatedDescription;
}

export const FormatRating = (rating) => {

    switch(rating){
        case 0:
            return "#569b49"
        case 10:
            return "#5891cd"
        case 12:
            return "#f0cc17"
        case 13:
            return "#f0cc17"
        case 14:
            return "#d67c1c"
        case 16:
            return "#c1131e"
        case 18:
            return "#1c1b19"
    }
}

export const SaveEvent = (eventData, destination, origin) => {


}

export const Logout = (navigate) => {
localStorage.clear();
sessionStorage.clear();
navigate('/login')
}



