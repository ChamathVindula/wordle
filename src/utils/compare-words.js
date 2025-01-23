export function isMatch(target, guess) {
    return target.join('').toLowerCase() === guess.join('').toLowerCase();
}

export function resolveCharacterPlacement(target, guess) {
    let charMap = { };

    target.forEach(char => {
        if(!charMap[char]) {
            charMap[char] = 1;
        } else {
            charMap[char]++;
        }
    });

    let result = [];

    for(let i = 0; i < target.length; i++) {
        if(target[i] === guess[i]) {
            result[i] = 'green';
            charMap[target[i]]--;
        } else {
            result[i] = '';
        }  
    }

    for(let j = 0; j < target.length; j++) {
        if(result[j] === '') {
            if(charMap[guess[j]] > 0) {
                result[j] = 'yellow';
                charMap[guess[j]]--;
            }
        }
    }

    return result;
}