function validateEmail() {
    let email = document.getElementById('email').value;
    if (!email.endsWith('@vitstudent.ac.in')) {
        document.getElementById('error-msg').innerText = "Invalid VIT email ID!";
    } else {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('score', 0);
        window.location.href = 'round1.html';
    }
}

function startTimer(duration, display, nextPage) {
    let timer = duration, minutes, seconds;
    let interval = setInterval(function () {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            alert("Time's up! Moving to the next round.");
            goToNextRound(nextPage);
        }
    }, 1000);
}

function initTimer(round) {
    let timeLimit;
    let nextPage;

    if (round === "General Science") {
        timeLimit = 15 * 60;  
        nextPage = "round2.html";
    } else if (round === "General Knowledge") {
        timeLimit = 15 * 60;
        nextPage = "round4.html";
    } else if (round === "Logo Identification") {
        timeLimit = 8 * 60; 
        nextPage = "result.html";
    }

    let display = document.getElementById("time");
    startTimer(timeLimit, display, nextPage);
}

function goToNextRound(nextPage) {
    window.location.href = nextPage;
}

document.addEventListener("DOMContentLoaded", function () {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "round1.html") {
        initTimer("General Science");
    } else if (currentPage === "round2.html") {
        initTimer("General Knowledge");
    } else if (currentPage === "round4.html") {
        initTimer("Logo Identification");
    }
});

function loadQuestions(roundName) {
    fetch('questions.xml')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            let round = [...data.getElementsByTagName('round')].find(r => r.getAttribute('name') === roundName);
            let questionsDiv = document.getElementById('questions');
            questionsDiv.innerHTML = '';

            if (round) {
                let questions = round.getElementsByTagName('question');
                for (let question of questions) {
                    let questionText = question.getElementsByTagName('text')[0].textContent;
                    let options = question.getElementsByTagName('option');
                    let answer = question.getElementsByTagName('answer')[0].textContent;
                    let imageElement = question.getElementsByTagName('image')[0]; // Get the image tag

                    let questionHTML = `<div><p>${questionText}</p>`;

                  
                    if (imageElement) {
                        let imageSrc = imageElement.getAttribute("src");
                        questionHTML += `<img src="${imageSrc}" alt="Question Image"
                         style="width:200px; height:auto; display:block; margin-bottom:10px;"><br>`;
                    }

                 
                    for (let option of options) {
                        questionHTML += `<input type='radio' name='${questionText}' value='${option.textContent}'
                         onclick='updateScore(this, "${answer}", "${roundName}")'> ${option.textContent}<br>`;
                    }
                    questionHTML += `</div><hr>`;
                    questionsDiv.innerHTML += questionHTML;
                }
            }
        })
        .catch(error => console.error("Error loading questions:", error));
}
function updateScore(option, correctAnswer, round) {
    let score = parseFloat(localStorage.getItem('score')) || 0;
    let questionWeight = 0;

    if (round === "General Science") {
        questionWeight = 2; 
    } else if (round === "General Knowledge") {
        questionWeight = 2;  
    } else if (round === "Logo Identification") {
        questionWeight = 4;  
    }

    if (option.value === correctAnswer) {
        score += questionWeight;
    }

    localStorage.setItem('score', score);
}
function displayResult() {
    let score = parseFloat(localStorage.getItem('score')) || 0;
    let normalizedScore = (score / 50) * 10; 
    let resultText = "";

    if (normalizedScore > 9.5) {
        resultText = "Congratulations! You are eligible for Vellore Campus.";
    } else if (normalizedScore >= 7.5 && normalizedScore <= 9.4) {
        resultText = "You are eligible for Chennai Campus.";
    } else if (normalizedScore >= 6.5 && normalizedScore <= 7.4) {
        resultText = "You are eligible for Amravati Campus.";
    } else {
        resultText = "Unfortunately, you are not eligible for admission.";
    }

   
    document.getElementById('final-score').innerText = `Your final score: ${normalizedScore.toFixed(2)}`;
    document.getElementById('admission-result').innerText = resultText;
}


function calculateFinalScore() {
    let score = parseFloat(localStorage.getItem('score')) || 0;
    let normalizedScore = (score / 50) * 10; 

    let resultText = "";

    if (normalizedScore > 9.5) {
        resultText = "Congratulations! You are eligible for Vellore Campus.";
    } else if (normalizedScore >= 7.5 && normalizedScore <= 9.4) {
        resultText = "You are eligible for Chennai Campus.";
    } else if (normalizedScore >= 6.5 && normalizedScore <= 7.4) {
        resultText = "You are eligible for Amravati Campus.";
    } else {
        resultText = "Unfortunately, you are not eligible for admission.";
    }

    document.getElementById('final-score').innerText = `Your final score: ${normalizedScore.toFixed(2)}`;
    document.getElementById('admission-result').innerText = resultText;
}
function submitQuiz() {
    window.location.href = "result.html";

    
    setTimeout(() => {
        calculateFinalScore();
    }, 1000);
}
