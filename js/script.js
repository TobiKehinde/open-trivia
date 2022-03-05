//selecting all required elements
const playQuiz = document.querySelector(".play_quiz");
const infoBox = document.querySelector(".info_box");
const exitQuiz = infoBox.querySelector(".buttons .quit");
const continueQuiz = infoBox.querySelector(".buttons .continue");
const quizBox = document.querySelector(".quiz_box");
const app = quizBox;
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const finishCounter = document.querySelector(".total_questions");
const finishQuiz = document.querySelector(".finish");
const showScoreMsg = document.querySelector(".result_box");

// When play button is clicked
playQuiz.onclick = () => {
    playQuiz.classList.add("activeQuiz"); //show quiz styling
    infoBox.classList.add("activeInfo"); //show info box
    document.getElementById("quiz").classList.add("close"); //remove the play button on the load page
}

// When Exit Quiz button is clicked
exitQuiz.onclick = () => {
    // playQuiz.classList.remove("activeQuiz"); //hide quiz styling
    infoBox.classList.remove("activeInfo");//hide info box
    document.getElementById("quiz").classList.add("open"); //show the homepage and play button
}

// When continue quiz button is clicked
continueQuiz.onclick = () => {
    infoBox.classList.remove("activeInfo"); //hide info box
    quizBox.classList.add("activeQuiz"); //show quiz questions
}

// Load the game here
let currentQuestion = {};
let acceptingAnswers = false;
let gameScore = 0;
let questionCounter = 0;
let availableQuesions = [];
let gameQuestions = [];

// Load the game from opentdb.com API- using Web Fetch API (Check https://www.w3schools.com/js/js_api_fetch.asp)
fetch(
    'https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple'
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        gameQuestions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });

        gameStarts();
    })
    .catch(() => {
        // console.log('Sorry, cannot connect to the API. Check your Internet connection!');

        // Insert a scrolling area of text.
        const errorMessage = document.createElement('marquee')
        errorMessage.textContent = `Sorry, cannot connect to the API. Check your Internet connection!`
        app.appendChild(errorMessage)
    });

//CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 10;

gameStarts = () => {
    questionCounter = 0;
    gameScore = 0;
    availableQuesions = [...gameQuestions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        // shows the finish quiz button atthe end of the quiz
        return finishCounter.classList.add("open");

    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    gameScore += num;
    scoreText.innerText = gameScore;
};

// When Finish Quiz button is clicked
finishQuiz.onclick = () => {
    showResult();
}

// Show result message
function showResult() {
    infoBox.classList.remove("activeInfo"); //hide info box
    quizBox.classList.remove("activeQuiz"); //hide quiz box
    showScoreMsg.classList.add("activeResult"); //show result box

    const resultScore = showScoreMsg.querySelector(".score_text");

    if (gameScore > 7) { // if you score more than 7
        //This is a new span tag showing the game score number and total questions
        let scoreTag = '<span>Fantastic! 🎉, You got <p> ' + gameScore + ' </p> out of <p>' + MAX_QUESTIONS + ' </p></span>';
        resultScore.innerHTML = scoreTag;  //add new span tag inside score_text class
    }
    else if (gameScore >= 5) { // if you score 5 or more to 7
        let scoreTag = '<span>Nice 😎, You got <p> ' + gameScore + ' </p> out of <p>' + MAX_QUESTIONS + ' </p></span>';
        resultScore.innerHTML = scoreTag;
    }
    else { // if you score less than 5
        let scoreTag = '<span>Sorry 😐, You got only <p> ' + gameScore + ' </p> out of <p>' + MAX_QUESTIONS + ' </p></span>';
        resultScore.innerHTML = scoreTag;
    }
}

const quitQuiz = showScoreMsg.querySelector(".quit");

// When Quit Quiz button is clicked
quitQuiz.onclick = () => {
    window.location.reload(); //reload the current window
}