import { createContext } from "react";

const GameContext = createContext({
    currentWordIndex: 0,
    colorMaps: [],
    checkValidity: () => {}
});

export default GameContext;