import { programmingQuiz as data } from "./data.js";

const startBtn = document.querySelector('.start-upBtn');
const next = document.querySelector('#next');
const questionContainer = document.querySelector('.quiz-question');
const choicesContainer = document.querySelector('.quiz-choices');
const quizCounter = document.querySelector('.quizCount');
const timeContainer = document.querySelector('#time');
const progress = document.querySelector('.progress');
const scoreBoard = document.querySelector('#score');
const leaderBoard = document.querySelector('.score-board');
const playAgain = document.querySelector('#again');

let isGuessed = false;
let timer;
let isPlaying = false;
let playerScore = 0;
let questionCounter = 0; 
let quizAnswered = 0;

startBtn.addEventListener('click',()=>{
    isPlaying = true;

    if(isPlaying){
        generateQuestion();
        startBtn.style.display = 'none';
        next.style.display = 'none';
        upDateScore(playerScore);
    }

})




next.addEventListener('click', () => {
    questionCounter+=1;

    if(questionCounter < data.length){
        next.style.display = 'none';
        leaderBoard.innerHTML = '';
        resetChoices();
        clearInterval(timer);
        generateQuestion();
    }else{
        isPlaying = false;
        questionContainer.innerHTML = '';
        choicesContainer.innerHTML = '';
        quizCounter.innerHTML = '';
        next.style.display = 'none';
        setScoreBoard()
        startBtn.style.display = 'none';
        playAgain.style.display = 'block';
    }
});

playAgain.addEventListener('click',()=> location.reload());


function generateQuestion() {
    try {
        const question = data[questionCounter];
        displayQuestion(question, questionCounter);
        startTimer(15,question.correctAnswer.toLowerCase());
    } catch (err) {
        console.log(err);
    }
}

function displayQuestion(quiz, questionNumber) {
    questionContainer.innerHTML = `<h1>${questionNumber + 1}: ${quiz.question}</h1>`;
    choicesContainer.innerHTML = `
        <div class="choice" value="A">${quiz.options.A}</div>
        <div class="choice" value="B">${quiz.options.B}</div>
        <div class="choice" value="C">${quiz.options.C}</div>
        <div class="choice" value="D">${quiz.options.D}</div>
    `;
    quizCounter.innerHTML = `${questionNumber + 1} of ${data.length} Questions`;

    checkAnswer(quiz);
}

function checkAnswer(quiz) {
    const choices = document.querySelectorAll('.choice');

    choices.forEach(ch => {
        ch.addEventListener('click', (e)=>{
            handleClickedItems(e.target, isGuessed,quiz)
        });
    });

    
}

function handleClickedItems(e,isGuessed,answer) {
    const choices = document.querySelectorAll('.choice');

    next.style.display = 'block';
    clearInterval(timer); // Stop the timer when the user clicks an answer
    let myGuess = e.getAttribute('value').toLowerCase();
    let myanswer = answer.correctAnswer.toLowerCase();

    if (myGuess === myanswer) {
        isGuessed = true;
    } else {
        isGuessed = false;
    }

    handleCorrectAnswer(e,isGuessed, answer.correctAnswer);

    // Disable all choices after the user makes a selection
    choices.forEach(choice => {
        choice.removeEventListener('click', handleClickedItems);
        choice.style.pointerEvents = 'none';
        choice.style.opacity = '0.5';
    });
}

function handleCorrectAnswer(choice,isGuessed, answer) {

    
    const correctChoice = document.querySelector(`.choice[value="${answer.toUpperCase()}"]`);

       
    if (!isGuessed) {
        choice.style.backgroundColor = '#EC7063';
        choice.innerHTML += '<i class="fa-regular fa-circle-xmark" id="wrong">';

        correctChoice.style.backgroundColor = '#2ECC71';
        correctChoice.innerHTML += '<i class="fa-regular fa-check-circle" id="correct">';
    } else {
        playerScore += 2;
        quizAnswered += 1;
        upDateScore(playerScore);

        correctChoice.style.backgroundColor = '#2ECC71';
        correctChoice.innerHTML += '<i class="fa-regular fa-check-circle" id="correct">';
    }

    
}


function startTimer(seconds,answer) {
    const choices = document.querySelectorAll('.choice');

    let timeLeft = seconds;
    let percentage = 100;
    timer = setInterval(function () {
        if (timeLeft <= 0) {
            revealCorrectAnswer(answer);
            clearInterval(timer);

            choices.forEach(ch =>{
                ch.removeEventListener('click', handleClickedItems);
                ch.style.pointerEvents = 'none';
                ch.style.opacity = '0.5';
            })

            next.style.display = 'block';
        } else {
            // Update the timer display
            timeContainer.innerHTML = `${timeLeft}`;
            timeLeft--;

            percentage = (timeLeft / seconds) * 100;
            progress.style.width = `${percentage}%`
        }
    }, 1000);
}

function revealCorrectAnswer(answer) {
    // Reveal the correct answer when the time runs out
    const correctChoice = document.querySelector(`.choice[value="${answer.toUpperCase()}"]`);
    correctChoice.style.backgroundColor = '#2ECC71';
    correctChoice.innerHTML += '<i class="fa-regular fa-check-circle" id="correct">';
}


function resetChoices() {
    const choices = document.querySelectorAll('.choice');

    choices.forEach(choice => {
        choice.style.backgroundColor = '';
        choice.innerHTML = choice.textContent; // Reset the content
        choice.style.pointerEvents = 'auto'; // Re-enable pointer events
        progress.style.width = '100%';
    });
}


function upDateScore(playerScore){
    scoreBoard.textContent = `${playerScore} / ${data.length * 2}`;
}


function setScoreBoard(){
    let scorePercentage = playerScore / (data.length * 2) * 100;
    let quizPercentage = quizAnswered / data.length * 100;
    

      leaderBoard.innerHTML =  `
        <div class="memory">
        <p>Memory: <span id="memory-percent">${Math.floor(scorePercentage)}%</span></p>
        <div class="progress-memory">
            <div class="progress-bar-memory"></div>
        </div>
         </div>
         <div class="quizCompleted">
        <p>Completion: <span>${quizAnswered}</span>/${data.length} Quizzes</p>
        <div class="progress-quiz">
            <div class="progress-bar-quiz"></div>
        </div>
         </div>
        `

      let progressMemory = document.querySelector('.progress-bar-memory') ;
      progressMemory.style.width = `${scorePercentage}%`; 
      let progressQuiz = document.querySelector('.progress-bar-quiz') ;
      progressQuiz.style.width = `${quizPercentage}%`; 
      
}