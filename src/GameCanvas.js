import { useState, useEffect, useCallback } from "react";
import { isValidWord } from "./http/check-validity";
import { isMatch, resolveCharacterPlacement } from "./utils/compare-words";
import getWordList from "./http/fetch-word-list";
import GameContext from "./store/game-context";
import LetterGrid from "./LetterGrid";
import SubmitButton from "./SubmitButton";

export default function GameCanvas() {
    let [loadingError, setLoadingError] = useState(null);
    let [targetWord, setTargetWord] = useState([]);
    let [userGuessWord, setUserGuessWord] = useState([]);
    let [currentWordIndex, setCurrentWordIndex] = useState(0);
    let [currentRound, setCurrentRound] = useState(0);
    let [colorMaps, setColorMaps] = useState([]);
    let [score, setScore] = useState(0);
    let [submitBtnConfig, setSubmitBtnConfig] = useState({ 
        text: 'Submit',
        isDisabled: true
    });

    useEffect(() => {
        async function setPlayableWords() {
            try {
                let words = await getWordList();
                
                let playableList = words.map(item => item.word);
                let randomIndex = Math.round(Math.random() * 100);
                let word = playableList[randomIndex].split('');
                
                console.log('word: ', word.join(''));
                
                setTargetWord(word);
            } catch(error) {
                setTargetWord([]);
                setLoadingError(error);
            }
        }

        setPlayableWords();
    }, []);

    let charCountReached = function(charArray) {
        // 5 is the max number of characters allowed
        return charArray.length === 5 && charArray.every((char) => char !== '');
    }

    let resetGame = async function() {
        try {
            let words = await getWordList();
                
            let playableList = words.map(item => item.word);
            let randomIndex = Math.round(Math.random() * 100);
            let word = playableList[randomIndex].split('');
            
            console.log('word: ', word.join(''));
            
            setTargetWord(word);
            setUserGuessWord([]);
            setCurrentWordIndex(0);
            setColorMaps([]);
            setSubmitBtnConfig({
                text: 'Incomplete Word',
                isDisabled: true
            });
            setCurrentRound((prevRound) => prevRound + 1)
        } catch(error) {
            setLoadingError(error);
        }
    }

    let updateScore = useCallback(function() {
        const roundScore = 60 - (currentWordIndex * 10);

        setScore((prevScore) => prevScore + roundScore);
    }, [currentWordIndex]);
    
    let checkValidity = useCallback(async function(word) {
        if(!charCountReached(word)) {
            setSubmitBtnConfig({
                text: 'Incomplete Word',
                isDisabled: true
            });
            return;
        }
        try {
            let response = await isValidWord(word.join(''));
            let submitBtnConfig = {};
    
            if(response.status === 200) {
                // Valid word
                submitBtnConfig.text = 'Submit';
                submitBtnConfig.isDisabled = false;
                setUserGuessWord(word);
            } else if(response.status === 404) {
                // Invalid word
                submitBtnConfig.text = 'Invalid Word';
                submitBtnConfig.isDisabled = true;
            }
            setSubmitBtnConfig(submitBtnConfig);
        } catch(error) {
            setLoadingError(error);
        }
    }, []);

    let handleSubmit = useCallback(function() {
        if(isMatch(targetWord, userGuessWord)) {
            // Is a match so can end the round
            updateScore();
            resetGame();
            return;
        }

        let colorMap = resolveCharacterPlacement(targetWord, userGuessWord);

        setColorMaps((prevMaps) => {
            let newMaps = [...prevMaps];
            newMaps[currentWordIndex] = colorMap;
            
            return newMaps;
        });
        
        setUserGuessWord([]);   // Clear the user guess
        
        setCurrentWordIndex((prevIndex) => prevIndex + 1);  // Go to the next attempt
        
        setSubmitBtnConfig({
            text: 'Incomplete Word',
            isDisabled: true
        });
    }, [targetWord, userGuessWord, currentWordIndex, updateScore]);

    let gameContextValue = {
        currentWordIndex,
        colorMaps,
        checkValidity
    }
    return (
        <GameContext.Provider value={gameContextValue}>
            <div id="game-canvas">
                {
                    targetWord.length === 0 ? 
                        loadingError === null ? 
                            <p style={{ color: '#FFFFFF' }}>Loading Game...</p> :
                            <p style={{ color: "#FFFFFF" }}>Could not load game session, please try refreshing the page</p>
                    :
                    (<>
                        <LetterGrid shouldReset={currentRound} />
                        <SubmitButton 
                            clickHandler={handleSubmit}
                            isDisabled={submitBtnConfig.isDisabled}
                        >{submitBtnConfig.text}
                        </SubmitButton>
                        <p style={{ color: '#FFFFFF', fontSize: '3rem' }}>{`Score: ${score}`}</p>
                    </>)
                }
            </div>
        </GameContext.Provider>
    );
}