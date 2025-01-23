import { useContext } from "react";
import WordInput from "./WordInput";
import GameContext from "./store/game-context";

export default function LetterGrid() {
    let { numberOfAttempts } = useContext(GameContext);

    let wordInputs = [];

    for(let i = 0; i < numberOfAttempts; i++) {
        wordInputs.push(
            <WordInput wordIndex={i} key={`word-input${i}`} />
        );
    }

    return (
        <div id="letter-grid">
            {wordInputs}
        </div>
    );
}