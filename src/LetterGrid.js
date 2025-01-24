import WordInput from "./WordInput";

export default function LetterGrid({ shouldReset }) {
    let numberOfAttempts = 6;

    return (
        <div id="letter-grid">
            {
                Array.from({ length: numberOfAttempts }).map((_, index) => {
                    return <WordInput 
                        wordIndex={index} 
                        key={`word-input${index}`} 
                        shouldReset={shouldReset} 
                    />;
                })
            }
        </div>
    );
}