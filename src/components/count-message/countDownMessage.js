import React, { useState, useEffect } from 'react';
import './countDownMessage.css'; // Importando o arquivo CSS para as animações

export const CountdownMessage = ({ message }) => {
  const [secondsLeft, setSecondsLeft] = useState(15);  // Inicializa com 15 segundos
  const [isVisible, setIsVisible] = useState(true);  // Controla a visibilidade do componente
  const [isFadingOut, setIsFadingOut] = useState(false); // Controla o estado de fade-out

  useEffect(() => {
    if (secondsLeft === 0) {
      setIsFadingOut(true);  // Inicia o fade-out quando o contador chega a 0
      setTimeout(() => setIsVisible(false), 500);  // Após o fade-out, torna o componente invisível
    }

    const timer = setInterval(() => {
      setSecondsLeft((prevSeconds) => prevSeconds - 1);
    }, 1000); // Atualiza a contagem regressiva a cada segundo

    // Limpar o intervalo quando o componente for desmontado ou quando o tempo acabar
    return () => clearInterval(timer);
  }, [secondsLeft]);  // Reexecuta o useEffect sempre que `secondsLeft` mudar

  return (
    isVisible && (
      <div
        className={`countdown-message countDownContainer ${isFadingOut ? 'fade-out' : 'fade-in'}`}      >
        <p>{message}</p>
        <p>Tempo restante: {secondsLeft} segundos</p>
      </div>
    )
  );
};
