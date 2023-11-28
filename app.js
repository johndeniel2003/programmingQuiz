const inputContainer = document.querySelector(".inputs"),
      hintDisplay = document.querySelector(".hint span"),
      guessesLeftDisplay = document.querySelector(".guess-left span"),
      wrongLettersDisplay = document.querySelector(".wrong-letter span"),
      resetButton = document.querySelector(".reset-btn"),
      inputField = document.querySelector(".typing-input");

let currentWord, maxAttempts, incorrectGuesses = [], correctGuesses = [];

function getRandomWord() {
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];

    currentWord = word;
    maxAttempts = currentWord.length >= 5 ? 8 : 6;
    correctGuesses = [];
    incorrectGuesses = [];

    hintDisplay.innerText = hint;
    guessesLeftDisplay.innerText = maxAttempts;
    wrongLettersDisplay.innerText = incorrectGuesses.join(" ");

    inputContainer.innerHTML = Array.from({ length: currentWord.length }, () => `<input type="text" disabled>`).join("");
}

function updateGameUI() {
    guessesLeftDisplay.innerText = maxAttempts;
    wrongLettersDisplay.innerText = incorrectGuesses.join(" ");
}

function handleInput(e) {
    const typedLetter = e.target.value.toLowerCase();

    if (typedLetter.match(/^[A-Za-z]+$/) && !incorrectGuesses.includes(` ${typedLetter}`) && !correctGuesses.includes(typedLetter)) {
        if (currentWord.includes(typedLetter)) {
            for (let i = 0; i < currentWord.length; i++) {
                if (currentWord[i] === typedLetter) {
                    correctGuesses.push(typedLetter);
                    inputContainer.querySelectorAll("input")[i].value = typedLetter;
                }
            }
        } else {
            maxAttempts--;
            incorrectGuesses.push(` ${typedLetter}`);
        }

        updateGameUI();
    }

    inputField.value = "";

    setTimeout(() => {
        if (correctGuesses.length === currentWord.length) {
            alert(`Congrats! You found the word ${currentWord.toUpperCase()}`);
            getRandomWord();
        } else if (maxAttempts < 1) {
            alert("Game over! You don't have remaining guesses");
            for (let i = 0; i < currentWord.length; i++) {
                inputContainer.querySelectorAll("input")[i].value = currentWord[i];
            }
        }
    }, 100);
}

function initializeGame() {
    inputField.addEventListener("input", handleInput);
    inputContainer.addEventListener("click", () => inputField.focus());
    document.addEventListener("keydown", () => inputField.focus());
}

resetButton.addEventListener("click", getRandomWord);
getRandomWord();
initializeGame();
