import { createContext } from "react";

const GameContext = createContext({
    targetWord: [],
    currentWordIndex: 0,
    numberOfAttempts: 6,
    charCount: 5,
    colorMaps: [],
    checkValidity: () => {}
});

export default GameContext;