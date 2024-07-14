// Function to load quiz questions from server
function loadQuiz() {
    fetch('http://localhost:3000/htmlQuestions')
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
                const questionHtml = `
                    <div class="question" id="${question._id}" data-correct-answer="${question.answer}">
                        <h5>${index + 1}) ${question.question}</h5>
                        ${question.options.map((option, optionIndex) => `
                            <p id="${question._id}-${optionIndex+1}-p">
                                <input id="${question._id}-${optionIndex + 1}" name="${question._id}" value="${String.fromCharCode(65 + optionIndex)}" type="radio">
                                <label for="${question._id}-${optionIndex + 1}">${String.fromCharCode(65 + optionIndex)}. ${option}</label>
                            </p>
                        `).join('')}
                    </div>
                    <hr>`;

                quizContainer.innerHTML += questionHtml;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    fetch('http://localhost:3000/htmlQuestions')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the server returns JSON data
        })
        .then(questions => {
            let score = 0;
            let Grade = ' ';

            questions.forEach(question => {
                const answer = userAnswers.find(ans => ans.questionId === question._id);
                const correctOptionIndex = question.answer.charCodeAt(0) - "A".charCodeAt(0) + 1;
                if (answer) {
                    if (answer.userAnswer === question.answer) {
                        score += 2;
                        // Highlight correct answer in green
                        const correctOptionElement = document.getElementById(`${question._id}-${correctOptionIndex}-p`);
                        if (correctOptionElement) {
                            correctOptionElement.style.backgroundColor = 'lightgreen';
                        }
                    } else {
                        // Highlight user's incorrect answer in red
                        const userOptionElement = document.getElementById(`${question._id}-${answer.userAnswer.charCodeAt(0) - "A".charCodeAt(0) + 1}-p`);
                        if (userOptionElement) {
                            userOptionElement.style.backgroundColor = 'lightcoral';
                        }
                        // Highlight correct answer in green
                        const correctOptionElement = document.getElementById(`${question._id}-${correctOptionIndex}-p`);
                        if (correctOptionElement) {
                            correctOptionElement.style.backgroundColor = 'lightgreen';
                        }
                    }
                }
            });

            switch (score) {
                case 20: Grade = 'A'; break;
                case 18: Grade = 'B'; break;
                case 16: Grade = 'C'; break;
                case 14: Grade = 'D'; break;
                case 12: Grade = 'E'; break;
                default: Grade = 'F'; break;
            }

            const mymodal = $('#myModal');
            mymodal.find('.modal-body').text(`Result is\nYour score is ${score}/20\nYour Grade is: ${Grade}`);
            mymodal.modal('show');
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('An error occurred while fetching questions. Please try again later.');
        });
}
