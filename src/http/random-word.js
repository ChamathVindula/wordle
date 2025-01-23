export default function getRandomWord() {
    fetch("https://api.datamuse.com/words?sp=?????")
    .then((response) => response.json())
    .then((data) => console.log(data));
}