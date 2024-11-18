import { useState, useEffect } from 'react';

export const useKeyNavigation = ({
  menuFocused,
  selectableContainers,
  selectableMenus,
  loaded,
  enableArrows,
  divRef,
  onEnter = () => {},
  onEscape = () => {},
  onArrowUp = () => {},
  onArrowDown = () => {},
  onArrowLeft = () => {},
  onArrowRight = () => {},
  onHome = () => {},
  onSquares = () => {},
}) => {
  const [containerCount, setContainerCount] = useState(-1);
  const [buttonCount, setButtonCount] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [menuCount, setMenuCount] = useState(1);
  


  useEffect(() => {
    console.log("o enable é", enableArrows)
    const keyDownHandler = (event) => {
      //if (!menuFocused) return; // Se o menu não estiver focado, ignora os eventos
      if(enableArrows === true) {
          switch (event.keyCode) {
            case 38:
              onArrowUp();
              break;
            case 40:
              onArrowDown();
              break;
            case 37:
              onArrowLeft();
              break;
            case 39:
              onArrowRight();
              break;
            case 13:
              onEnter();
              break;
            case 27:
              onEscape();
              break;
            case 36:
              onHome();
              break;
            case 182:
              onSquares();
              break;
            default:
              break;
          }
      }


    };

    document.addEventListener('keydown', keyDownHandler);
    return () => document.removeEventListener('keydown', keyDownHandler);
  }, [menuFocused, selectableContainers, selectableMenus, containerCount, cardCount, buttonCount, menuCount, onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);

  return {
    containerCount,
    cardCount,
    buttonCount,
    menuCount,
    setContainerCount,
    setCardCount,
    setButtonCount,
    setMenuCount,
  };
};