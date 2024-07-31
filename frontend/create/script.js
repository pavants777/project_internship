document.addEventListener('DOMContentLoaded', () => {
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const questionsContainer = document.getElementById('questionsContainer');
    const quizForm = document.getElementById('quizForm');
    let questionCount = 1;

    addQuestionBtn.addEventListener('click', () => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionInput = document.createElement('input');
        questionInput.setAttribute('type', 'text');
        questionInput.setAttribute('name', 'questionText[]');
        questionInput.setAttribute('placeholder', `${questionCount} Question`);
        questionInput.required = true;

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        ['A', 'B', 'C', 'D'].forEach(option => {
            const optionInput = document.createElement('input');
            optionInput.setAttribute('type', 'text');
            optionInput.setAttribute('name', `option${option}[]`);
            optionInput.setAttribute('placeholder', `Option ${option}`);
            optionInput.required = true;
            optionsDiv.appendChild(optionInput);
        });

        const correctAnswerLabel = document.createElement('label');
        correctAnswerLabel.textContent = 'Correct Answer:';
        optionsDiv.appendChild(correctAnswerLabel);

        const correctAnswerSelect = document.createElement('select');
        correctAnswerSelect.setAttribute('name', 'correctAnswer[]');
        ['A', 'B', 'C', 'D'].forEach(option => {
            const opt = document.createElement('option');
            opt.setAttribute('value', option);
            opt.textContent = option;
            correctAnswerSelect.appendChild(opt);
        });
        optionsDiv.appendChild(correctAnswerSelect);

        const removeQuestionBtn = document.createElement('button');
        removeQuestionBtn.setAttribute('type', 'button');
        removeQuestionBtn.classList.add('removeQuestionBtn');
        removeQuestionBtn.textContent = 'Remove';

        removeQuestionBtn.addEventListener('click', () => {
            questionDiv.remove();
            questionCount--;
            updatePlaceholders();
        });

        questionDiv.appendChild(questionInput);
        questionDiv.appendChild(optionsDiv);
        questionDiv.appendChild(removeQuestionBtn);

        questionsContainer.appendChild(questionDiv);
        questionCount++;
    });

    const updatePlaceholders = () => {
        const questionInputs = document.querySelectorAll('input[name="questionText[]"]');
        questionInputs.forEach((input, index) => {
            input.setAttribute('placeholder', `${index + 1} Question`);
        });
    };

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(quizForm);

        const quizData = {
            title: formData.get('title'),
            description: formData.get('description'),
            joincode: formData.get('joinCode'),
            createdAt: new Date().toISOString(),
            questions: []
        };

        const questionTexts = formData.getAll('questionText[]');
        const optionsA = formData.getAll('optionA[]');
        const optionsB = formData.getAll('optionB[]');
        const optionsC = formData.getAll('optionC[]');
        const optionsD = formData.getAll('optionD[]');
        const correctAnswers = formData.getAll('correctAnswer[]');

        questionTexts.forEach((questionText, index) => {
            quizData.questions.push({
                question: questionText,
                options: [
                    optionsA[index],
                    optionsB[index],
                    optionsC[index],
                    optionsD[index]
                ],
                answer: correctAnswers[index]
            });
        });

        console.log('Submitting Quiz Data:', JSON.stringify(quizData, null, 2));

        try {
            const response = await fetch('http://localhost:3000/quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quizData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Quiz successfully submitted:', result);
                alert('Quiz successfully submitted!');
                window.history.back(-2);
            } else {
                console.error('Failed to submit quiz:', response.statusText);
                alert('Failed to submit quiz. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Error submitting quiz. Please try again.');
        }
    });
});
