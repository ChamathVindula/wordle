let DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

export function isValidWord(word) {
    return new Promise((resolve, reject) => {
        let url = DICTIONARY_API_URL + word;

        fetch(url)
        .then(data => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    });


}