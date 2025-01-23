import { useState, useRef, useEffect, useContext } from "react";
import GameContext from "./store/game-context";

export default function WordInput({ wordIndex }) {
    let { currentWordIndex, charCount, colorMaps, checkValidity } = useContext(GameContext);
    
    let [word, setWord] = useState(new Array(charCount).fill(''));

    let inputs = useRef([]);

    let handleInputChange = function(index, value) {
        setWord(prevWord => {
            let newWord = [...prevWord];
            
            newWord[index] = value;

            return newWord;
        });

        if(value !== '' && index < charCount-1) {
            inputs.current[index+1].focus();
        }
    }

    useEffect(() => {
        checkValidity(word);
    }, [word, checkValidity]);

    let InputCurrentlyInUse = currentWordIndex === wordIndex;

    let charInputs = [];

    for(let i = 0; i < charCount; i++) {
        let element = (
            <div className="char-wrapper" key={`word-${wordIndex}-char-${i}`}>
                <input
                    key={`word-${wordIndex}-char-input-${i}`}
                    className={colorMaps[wordIndex] !== undefined ? colorMaps[wordIndex][i] : ''} 
                    type="text"
                    onChange={(e) => handleInputChange(i, e.target.value)} 
                    maxLength={1}
                    ref={(el) => { inputs.current[i] = el }}
                    disabled={!InputCurrentlyInUse}
                    value={word[i] ?? ''}
                ></input>
            </div>
        );
        charInputs.push(element);
    }

    return (
        <div className="word-input" >{charInputs}</div>
    );
}