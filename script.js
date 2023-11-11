document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('languageSelect');
    const testWord = document.getElementById('testWord');
    const answerInput = document.getElementById('answerInput');
    const submitButton = document.getElementById('submitAnswer');
    const scorePercent = document.getElementById('scorePercent');
    const feedbackArea = document.getElementById('feedbackArea');
    const englishWordInput = document.getElementById('englishWord');
    const targetWordInput = document.getElementById('targetWord');
    const addWordPairButton = document.getElementById('addWordPair');
    const startTestButton = document.getElementById('startTest');

    const vocabulary = [];
    let currentWord = {};
    let score = 0;
    let totalAttempts = 0;
    let attempts = 0;
    let testedWords = new Set();
    let isTestRunning = false;

    addWordPairButton.addEventListener('click', function() {
        const englishWord = englishWordInput.value.trim();
        const targetWord = targetWordInput.value.trim();
        if (englishWord && targetWord) {
            vocabulary.push({ en: englishWord, target: targetWord });
            englishWordInput.value = '';
            targetWordInput.value = '';
            alert('Word pair added!');
        } else {
            alert('Please enter both words.');
        }
    });

    startTestButton.addEventListener('click', function() {
        if (vocabulary.length === 0) {
            alert('Please add some word pairs first.');
        } else {
            isTestRunning = true;
            submitButton.disabled = false;
            testedWords.clear();
            totalAttempts = 0;
            score = 0;
            updateScore();
            selectWord();
        }
    });

    function selectWord() {
        if (testedWords.size >= vocabulary.length) {
            endTest();
            return;
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * vocabulary.length);
        } while (testedWords.has(randomIndex));

        testedWords.add(randomIndex);
        currentWord = vocabulary[randomIndex];
        testWord.textContent = languageSelect.value === 'ENtoTarget' ? currentWord.en : currentWord.target;
        answerInput.value = '';
        attempts = 0;
        feedbackArea.textContent = '';
        submitButton.className = '';
    }

    function checkAnswer() {
        let correctAnswer = languageSelect.value === 'ENtoTarget' ? currentWord.target : currentWord.en;
        if (answerInput.value.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            score++;
            submitButton.className = 'correct';
            feedbackArea.textContent = 'Correct!';
            setTimeout(selectWord, 1000); // Wait for 1 second before selecting the next word
        } else {
            attempts++;
            submitButton.className = 'incorrect';
            feedbackArea.textContent = attempts < 2 ? 'Try again' : 'Incorrect. The correct answer was: ' + correctAnswer;
            if (attempts >= 2) {
                setTimeout(selectWord, 2000); // Wait for 2 seconds before selecting the next word if the answer was wrong
            }
        }
        totalAttempts++;
        updateScore();
    }

    function updateScore() {
        let scorePercentage = (score / totalAttempts) * 100;
        scorePercent.textContent = scorePercentage.toFixed(2) + '%';
    }

    function endTest() {
        feedbackArea.textContent = 'Congratulations - you have completed the test!';
        isTestRunning = false;
        testedWords.clear();
        submitButton.disabled = true;
    }

    submitButton.addEventListener('click', function() {
        if (isTestRunning) {
            checkAnswer();
        } else {
            alert('The test has not started yet. Please click "Start Test" to begin.');
        }
    });
});

