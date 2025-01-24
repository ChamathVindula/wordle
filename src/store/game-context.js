import { createContext } from "react";

const GameContext = createContext({
    targetWord: [],
    currentWordIndex: 0,
    colorMaps: [],
    checkValidity: () => {}
});

export default GameContext;