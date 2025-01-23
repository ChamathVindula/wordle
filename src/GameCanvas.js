import { useState, useCallback } from "react";
import GameContext from "./store/game-context";
import LetterGrid from "./LetterGrid";
import SubmitButton from "./SubmitButton";
import { isValidWord } from "./http/checkValidity";
import { isMatch, resolveCharacterPlacement } from "./utils/compare-words";

const NUMBER_OF_ATTEMPTS = 6;
const CHAR_COUNT = 5;

export default function GameCanvas() {
    let [targetWord, setTargetWord] = useState(['a', 'p', 'p', 'l', 'e']);
    let [userGuessWord, setUserGuessWord] = useState([]);
    let [currentWordIndex, setCurrentWordIndex] = useState(0);
    let [colorMaps, setColorMaps] = useState([]);
    let [score, setScore] = useState(0);
    let [submitBtnConfig, setSubmitBtnConfig] = useState({ 
        text: 'Submit',
        isDisabled: true
    });

    let charCountReached = function(charArray) {
        return charArray.length === CHAR_COUNT && charArray.every((char) => char !== '');
    }
    
    let checkValidity = useCallback(async function(word) {
        if(!charCountReached(word)) {
            setSubmitBtnConfig({
                text: 'Incomplete Word',
                isDisabled: true
            });
            return;
        }
        let response = await isValidWord(word.join(''));
        let submitBtnConfig = {};

        if(response.status === 200) {
            // valid word
            submitBtnConfig.text = 'Submit';
            submitBtnConfig.isDisabled = false;
            setUserGuessWord(word);
        } else if(response.status === 404) {
            // invalid word
            submitBtnConfig.text = 'Invalid Word';
            submitBtnConfig.isDisabled = true;
        }
        setSubmitBtnConfig(submitBtnConfig);
    }, [setUserGuessWord, setSubmitBtnConfig]);

    let handleSubmit = function() {
        if(isMatch(targetWord, userGuessWord)) {
            console.log('game ended, you won :)');
            return;
        }

        let colorMap = resolveCharacterPlacement(targetWord, userGuessWord);
        console.log('cm', colorMap);
        setColorMaps((prevMaps) => {
            let newMaps = [...prevMaps];
            newMaps[currentWordIndex] = colorMap;
            
            return newMaps;
        });
        
        setUserGuessWord([]);   // clear the user guess
        
        setCurrentWordIndex((prevIndex) => prevIndex + 1);  // go to the next guess
        
        setSubmitBtnConfig({
            text: 'Incomplete Word',
            isDisabled: true
        });
    }

    let gameContextValue = {
        targetWord,
        currentWordIndex,
        numberOfAttempts: NUMBER_OF_ATTEMPTS,
        charCount: CHAR_COUNT,
        colorMaps,
        checkValidity
    }
    return (
        <GameContext.Provider value={gameContextValue}>
            <div id="game-canvas">
                <LetterGrid />
                <SubmitButton 
                    clickHandler={handleSubmit}
                    isDisabled={submitBtnConfig.isDisabled}
                >{submitBtnConfig.text}
                </SubmitButton>
            </div>
        </GameContext.Provider>
    );
}