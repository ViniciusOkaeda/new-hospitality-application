
export const handleKeyDown = (event, callbacks) => {
    switch (event.keyCode) {
        case 13: return callbacks.enter ? callbacks.enter() : undefined; 
        case 27: return callbacks.escape ? callbacks.escape() : undefined; 
        case 38: return callbacks.up ? callbacks.up() : undefined; 
        case 40: return callbacks.down ? callbacks.down() : undefined; 
        case 37: return callbacks.left ? callbacks.left() : undefined; 
        case 39: return callbacks.right ? callbacks.right() : undefined; 
        case 36: return callbacks.home ? callbacks.home() : undefined; 
        case 182: return callbacks.squares ? callbacks.squares() : undefined; 
        default: return;
    }
};

