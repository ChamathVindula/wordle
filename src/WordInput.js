import { useState, useRef, useEffect, useContext } from "react";
import GameContext from "./store/game-context";

export default function WordInput({ wordIndex, shouldReset }) {
    let { currentWordIndex, colorMaps, checkValidity } = useContext(GameContext);
    console.log('word number ' + wordIndex + ' was refreshed for \n' + currentWordIndex + ' \n' + colorMaps + ' \n' + checkValidity);
    
    let [word, setWord] = useState([]);

    let inputs = useRef([]);

    let handleInputChange = function(index, value) {
        setWord(prevWord => {
            let newWord = [...prevWord];
            
            newWord[index] = value;

            return newWord;
        });

        if(value !== '' && index < 4) {
            inputs.current[index+1].focus();
        }
    }

    useEffect(() => {
        setWord(new Array(5).fill(''));
    }, [shouldReset]);

    useEffect(() => {
        checkValidity(word);
    }, [word, checkValidity]);

    let InputCurrentlyInUse = currentWordIndex === wordIndex;

    return (
        <div className="word-input" >
            {
                Array.from({ length: 5 }).map((_, i) => {
                    return (
                        <div className="char-wrapper" key={`word-${wordIndex}-char-${i}`}>
                            <input
                                className={colorMaps[wordIndex] !== undefined ? colorMaps[wordIndex][i] : ''} 
                                disabled={!InputCurrentlyInUse}
                                key={`word-${wordIndex}-char-input-${i}`}
                                maxLength={1}
                                onChange={(e) => handleInputChange(i, e.target.value)} 
                                ref={(el) => { inputs.current[i] = el }}
                                type="text"
                                value={word[i] ?? ''}
                            ></input>
                        </div>
                    )
                })
            }
        </div>
    );
}