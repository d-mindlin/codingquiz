var questionList = [
  {
    question: "Commonly used data types DO Not Include:",
    choices: ["1. strings", "2. booleans", "3. alerts", "4. numbers"],
    answer: 3
  },
  {
    question: "The condition in an if / else statement is enclosed with ________.",
    choices: ["div.appendChild(h3)", "div.append(h3)", "h3.appendChild(div)", "h3.appead(div)"],
    answer: 3
  },
  {
    question: "Arrays in JavaScript can be used to store _______",
    choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
    answer: 3
  },
  {
    question: "String values must be enclosed within ________ when being assigned to variables.",
    choices: ["1. commas", "2. curly brackets", "3. quotes", "4. parenthesis"],
    answer: 3
  },
  {
    question: "A very useful tool used during development and debugging for printing content to the debugger is:",
    choices: ["array.age[2]", "array(1).age", "array[1].age", "array.age[1]"],
    answer: 4
  },
];

var promptAreaEl = document.querySelector("#question-prompt");
var answerAreaEl = document.querySelector("#responses");
var answerCheckEl = document.createElement("h3");

var savedScores = [];
var quizTime = 75;
var questionIndex = 0;
var userScore = 0;

//setInterval using 100 milliseconds so using 5 for .5 seconds to show correct/incorrect
var promptTime = 5;

var startQuiz = function() {
  //set variables to start
  questionIndex = 0;
  userScore = 0;
  quizTime = 75;

  startTimer(); 
  createQuestions();

  //after start, remove start button
  var startButton = document.querySelector("#start");
  if (startButton) {  
    startButton.remove();
  }
};

var startTimer = function() {
  //find id of countdown-timer in html, declare as variable
  var pageElement = document.querySelector("#countdown-timer");
  
  //start timer with setInterval. Use text content to show time on page
  var quizCountdown = setInterval(function() {
    quizTime--;
    pageElement.textContent = "You have " + quizTime + " seconds left!";
    if (quizTime < 0) {
      quizTime = 0;
    }
    //end quiz when time reaches zero
    if (quizTime === 0) {
      clearInterval(quizCountdown);
      //only run endQuiz if time expires. If questionIndex is same length as array, user has cycled through all questions and already run endQuiz
      if (questionIndex !== questionList.length) {
        endQuiz();
      }  
    } 
  }, 1000);
};

//print question to page
var createQuestions = function () {
  promptAreaEl.textContent = questionList[questionIndex].question;
  createAnswers();
};

//create answer buttons
var createAnswers = function () {
  //clear answerAreaEl for next set of questions on loop
  answerAreaEl.innerHTML = "";
  for (var i = 0; i < questionList[questionIndex].choices.length; i++) {
    var answerButtonsEl = document.createElement("button");
    answerButtonsEl.setAttribute('answerIndex', i);
    answerButtonsEl.className = 'btn answer-btn';
    answerButtonsEl.innerHTML = questionList[questionIndex].choices[i];
    answerAreaEl.appendChild(answerButtonsEl);
  }
  answerAreaEl.addEventListener("click", checkAnswer);
};

//check answer for correct or incorrect as well as quiz end
var checkAnswer = function () {
  //does the answerIndex value we set match with answer in array?
  if (event.target.getAttribute('answerIndex') == questionList[questionIndex].answer) {
    promptTime = 5;
    printCheck(true);
    questionIndex++;
    if (questionIndex < questionList.length) {
      createQuestions();
    }
    else {
      endQuiz();
    }
  }
  else if (event.target.innerHTML === 'Try again?') {
    return;
  }
  else {
    promptTime = 5;
    printCheck(false);
    quizTime = quizTime - 5;
  } 
};

var printCheck = function (trueOrFalse) {
  var checkAreaEl = document.createElement("div");
  checkAreaEl.setAttribute('id', 'true-or-false');
  var wrapper = document.querySelector(".wrapper");

  clearInterval(printTrueOrFalse);

  var printTrueOrFalse = setInterval(function () {
    if (trueOrFalse === true) {
      answerCheckEl.textContent = 'Correct!';
      checkAreaEl.appendChild(answerCheckEl);
      wrapper.appendChild(checkAreaEl);
    }
    else {
      answerCheckEl.textContent = 'Incorrect';
      checkAreaEl.appendChild(answerCheckEl);
      wrapper.appendChild(checkAreaEl);
    }
    if (promptTime < 1) {
      answerCheckEl.textContent = '';
      clearInterval(printTrueOrFalse);
    }
    promptTime--;
  }, 100);
};

var endQuiz = function () {
  //remove answer buttons as quiz
  var answerButtonsEl = document.querySelectorAll(".answer-btn");
  for (var i = 0; i < answerButtonsEl.length; i++) {
    answerButtonsEl[i].remove();
  }

  //if index and array length match, user has got through all questions
  if (questionIndex == questionList.length) {
    userScore = quizTime;
    quizTime = 0;
    checkSavedScores();
  }
  else {
    promptAreaEl.textContent = 'You ran out of time. Better luck next time!';
    
    //add try again button
    tryAgain();
  }
};

var checkSavedScores = function () {
  if (savedScores && savedScores.length == 3) {
    var topThree = false;
    for (var i = 0; i < 3; i++) {
      savedScoreInt = parseInt(savedScores[i].score);
      if (savedScoreInt < userScore) {
        topThree = true;
        saveUserScore();
        break;
      }
    }
    if (!topThree) {
      //need to say sorry not high enough
      promptAreaEl.textContent = "Congratulations on making it through the quiz! Keep trying to get your score in the top three so you can save your highscore!";
      tryAgain();
    }
  }
  else {
    saveUserScore();
  }
};

// create try again button that clears existing user score, question index
var tryAgain = function () {
  //create button for try again
  var tryAgainAreaEl = document.querySelector(".answer-area");
  var tryAgainEl = document.createElement("button");
  tryAgainEl.className = 'btn';
  tryAgainEl.textContent = 'Try again?';
  tryAgainAreaEl.appendChild(tryAgainEl);

  //call start function on click, remove try again button
  tryAgainEl.addEventListener("click", function() {
    tryAgainEl.remove();
    startQuiz();
  });
};

var saveUserScore = function () {
  var userScoreDivEl = document.querySelector("#responses");

  promptAreaEl.textContent = "Congratulations on making it all the way through! Your score of " + userScore + " puts you in the top three. Enter your initials below.";

  //create input field for initials
  var userScoreInputEl = document.createElement("input");
  userScoreInputEl.setAttribute('type', 'text');
  userScoreInputEl.setAttribute('id', 'initials');
  userScoreInputEl.setAttribute('class', 'text-input');
  userScoreInputEl.setAttribute('placeholder', 'Enter initials here');
  userScoreDivEl.appendChild(userScoreInputEl);

  //create button for submitting scores
  var userScoreButtonEl = document.createElement("button");
  userScoreButtonEl.className = "btn score-button";
  userScoreButtonEl.setAttribute('value', 'submit');
  userScoreButtonEl.setAttribute('id', 'save-score');
  userScoreButtonEl.textContent = 'Submit Score!';
  userScoreDivEl.appendChild(userScoreButtonEl);
  
  //assistance on this code, need to analyze
  var userInitialInput = document.querySelector("#initials").value;
  console.log(userInitialInput);
  var currentScore = {
    score: userScore, id : savedScores.length
  };

  //if we already have three scores, replace the lowest with current
  if (savedScores && savedScores.length == 3) {

    //create array with current scores, sort by lowest first, find out if current score is higher
    var arrayForSorting = [savedScores[0].score, savedScores[1].score, savedScores[2].score];
    sortedArray = arrayForSorting.sort(function(a, b){return a-b});
    if (sortedArray[0] < userScore) {
      //since current score is higher, find out which current array item needs to be replaced
      if (savedScores[0].score < savedScores[1].score && savedScores[0].score < savedScores[2].score) {
        savedScores.splice(0, 1, currentScore);
      }
      else if (savedScores[1].score < savedScores[0].score && savedScores[1].score < savedScores[2].score) {
        savedScores.splice(1, 1, currentScore);
      }
      else {
        savedScores.splice(2, 1, currentScore);
      }
      
    }
  }
  //if we don't have three saved scores, safe to save current with no other criteria checks
  else {
    savedScores.push(currentScore);
  }

  //assistance on this from TA, need to run through multiple times with debugger to understand what is going on
  var submitButtonEl = document.querySelector("#save-score");
  submitButtonEl.addEventListener("click", function() {
    var userInitialInput = document.querySelector("#initials").value;
    var current = savedScores.find((element)=> element['id'] == currentScore['id']);
    current['initials'] = userInitialInput;
    localStorage.setItem("scores", JSON.stringify(savedScores));
    userScoreInputEl.remove();
    userScoreButtonEl.remove();
    promptAreaEl.innerHTML = 'Thank you for playing!';
    tryAgain();
  });
};

var loadScores = function () {
    //load scored only if array is not a null value, otherwise function breaks
    var isArrayNull = localStorage.getItem("scores");
    if (isArrayNull) {
      savedScores = localStorage.getItem("scores");
      savedScores = JSON.parse(savedScores);
    }
};

// Add event listener to generate button
start.addEventListener("click", startQuiz);

loadScores();