export default function getWordList() {
    return new Promise((resolve, reject) => {
        // Use a different api to generate random words
        fetch("https://api.datamuse.com/words?sp=?????")
        .then(response => response.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
}