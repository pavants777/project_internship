// Function to load quiz questions from server
function loadQuiz() {
    fetch('http://localhost:3000/cppQuestions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(data => {
            const quizContainer = document.getElementById('quiz-container');
            if (!quizContainer) {
                throw new Error('Quiz container not found in the DOM');
            }
            const shuffledQuestions = shuffleArray(data).slice(0, 10);
            quizContainer.innerHTML = ''; 

            shuffledQuestions.forEach((question, index) => {
                const questionElement = document.createElement('div');
                questionElement.className = 'question';
                questionElement.id = question._id;
                questionElement.dataset.correctAnswer = question.answer;

                const questionHtml = `
                    <h5>${index + 1}) ${question.question}</h5>
                    ${question.options.map((option, optionIndex) => `
                        <p id="${question._id}-${optionIndex + 1}-p">
                            <input id="${question._id}-${optionIndex + 1}" name="${question._id}" value="${String.fromCharCode(65 + optionIndex)}" type="radio">
                            <label for="${question._id}-${optionIndex + 1}">${String.fromCharCode(65 + optionIndex)}. ${option}</label>
                        </p>
                    `).join('')}
                    <hr>`;

                questionElement.innerHTML = questionHtml;
                quizContainer.appendChild(questionElement);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to submit the quiz with user answers
function submitQuiz() {
    const questions = document.querySelectorAll('.question');
    const answers = [];

    questions.forEach(question => {
        const selectedOption = question.querySelector('input[type="radio"]:checked');
        if (selectedOption) {
            const questionId = question.id;
            const userAnswer = selectedOption.value;
            answers.push({
                questionId,
                userAnswer
            });
        }
    });

    if (answers.length === questions.length) {
        checkAnswers(answers);
    } else {
        alert('Please answer all questions.');
    }
}

// Function to check answers against correct answers
function checkAnswers(userAnswers) {
    fetch('http://localhost:3000/cppQuestions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(questions => {
            let score = 0;
            let grade = '';

            questions.forEach(question => {
                const answer = userAnswers.find(ans => ans.questionId === question._id);
                const correctOptionIndex = question.answer.charCodeAt(0) - "A".charCodeAt(0) + 1;
                if (answer) {
                    const correctOptionElement = document.getElementById(`${question._id}-${correctOptionIndex}-p`);
                    const userOptionElement = document.getElementById(`${question._id}-${answer.userAnswer.charCodeAt(0) - "A".charCodeAt(0) + 1}-p`);
                    if (answer.userAnswer === question.answer) {
                        score += 2;
                        if (correctOptionElement) correctOptionElement.style.backgroundColor = 'lightgreen';
                    } else {
                        if (userOptionElement) userOptionElement.style.backgroundColor = 'lightcoral';
                        if (correctOptionElement) correctOptionElement.style.backgroundColor = 'lightgreen';
                    }
                }
            });

            if (score >= 18) {
                grade = 'A';
            } else if (score >= 16) {
                grade = 'B';
            } else if (score >= 14) {
                grade = 'C';
            } else if (score >= 12) {
                grade = 'D';
            } else if (score >= 10) {
                grade = 'E';
            } else {
                grade = 'F';
            }

            const mymodal = $('#myModal');
            mymodal.find('.modal-body').text(`Result is\nYour score is ${score}/20\nYour Grade is: ${grade}`);
            mymodal.modal('show');
        })
        .catch(error => {
            console.error('Error fetching questions during check:', error);
        });
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}