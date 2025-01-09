const questions = [
    { guideline: "Simplicity", question: "Would keeping the pieces of information together lead to a simpler data model and code?", embedOnYes: true },
    { guideline: "Go Together", question: "Do the pieces of information have a \"has-a,\" \"contains,\" or similar relationship?", embedOnYes: true },
    { guideline: "Query Atomicity", question: "Does the application query the pieces of information together?", embedOnYes: true },
    { guideline: "Update Complexity", question: "Are the pieces of information updated together?", embedOnYes: true },
    { guideline: "Archival", question: "Should the pieces of information be archived at the same time?", embedOnYes: true },
    { guideline: "Cardinality", question: "Is there a high cardinality (current or growing) in the child side of the relationship?", embedOnYes: false },
    { guideline: "Data Duplication", question: "Would data duplication be too complicated to manage and undesired?", embedOnYes: false },
    { guideline: "Document Size", question: "Would the combined size of the pieces of information take too much memory or transfer bandwidth for the application?", embedOnYes: false },
    { guideline: "Document Growth", question: "Would the embedded piece grow without bound?", embedOnYes: false },
    { guideline: "Workload", question: "Are the pieces of information written at different times in a write-heavy workload?", embedOnYes: false },
    { guideline: "Individuality", question: "For the children side of the relationship, can the pieces exist by themselves without a parent?", embedOnYes: false }
];

let currentScreen = 0;
let embedScore = 0;
let referenceScore = 0;
let answers = new Array(questions.length).fill(null);

window.handleAnswer = function(isYes) {
    const currentAnswer = answers[currentScreen];
    answers[currentScreen] = isYes;
    calculateScores();
    if (currentScreen < questions.length - 1) {
        if (currentAnswer === null) {
            currentScreen++;
        }
    } else {
        currentScreen = questions.length;
    }
    renderScreen();
};

function calculateScores() {
    embedScore = 0;
    referenceScore = 0;
    answers.forEach((answer, index) => {
        if (answer === null) {
            return;
        }
        const question = questions[index];
        if (answer === question.embedOnYes) {
            embedScore++;
        } else {
            referenceScore++;
        }
    });
}

window.navigateBack = function() {
    if (currentScreen > 0) {
        currentScreen--;
        renderScreen();
    }
};

window.navigateForward = function() {
    if (currentScreen < questions.length && answers[currentScreen] !== null) {
        currentScreen++;
        renderScreen();
    }
};

window.resetGuide = function() {
    currentScreen = 0;
    embedScore = 0;
    referenceScore = 0;
    answers = new Array(questions.length).fill(null);
    renderScreen();
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        navigateBack();
    }
    if (e.key === 'ArrowRight' && answers[currentScreen] !== null) {
        navigateForward();
    }
    if (currentScreen < questions.length) {
        if (e.key === 'y' || e.key === 'Y') {
            handleAnswer(true);
        }
        if (e.key === 'n' || e.key === 'N') {
            handleAnswer(false);
        }
    }
});

function renderScreen() {
    const screen = document.getElementById('screen');

    if (currentScreen < questions.length) {
        const question = questions[currentScreen];
        const currentAnswer = answers[currentScreen];

        screen.innerHTML = `
                    <div class="guide__header">
                        <div class="guide__actions">
                            <div class="scores">
                                <span class="score score--embed">Embed: <span class="score__value">${embedScore}</span></span>
                                <span class="score score--reference">Reference: <span class="score__value">${referenceScore}</span></span>
                            </div>
                            <button class="button" onclick="resetGuide()">Reset</button>
                        </div>
                        <div class="guide__nav">
                            <button class="button" onclick="navigateBack()" ${currentScreen === 0 ? 'disabled' : ''}>Back</button>
                            <button class="button" onclick="navigateForward()" ${answers[currentScreen] === null ? 'disabled' : ''}>Forward</button>
                        </div>
                    </div>
                    <div class="guide__progress">Guideline ${currentScreen + 1} of ${questions.length}</div>
                    <h2 class="guide__title">${question.guideline}</h2>
                    <div class="guide__question">${question.question}</div>
                    <div class="guide__options">
                        <button class="option option--yes ${currentAnswer === true ? 'is-selected' : ''}" onclick="handleAnswer(true)">YES</button>
                        <button class="option option--no ${currentAnswer === false ? 'is-selected' : ''}" onclick="handleAnswer(false)">NO</button>
                    </div>
                `;
    } else {
        screen.innerHTML = `
                    <div class="guide__header">
                        <div class="guide__actions">
                            <div class="scores">
                                <span class="score score--embed">Embed: <span class="score__value">${embedScore}</span></span>
                                <span class="score score--reference">Reference: <span class="score__value">${referenceScore}</span></span>
                            </div>
                            <button class="button" onclick="resetGuide()">Reset</button>
                        </div>
                        <div class="guide__nav">
                            <button class="button" onclick="navigateBack()">Back</button>
                            <button class="button" disabled>Forward</button>
                        </div>
                    </div>
                    <div class="guide__result">${embedScore > referenceScore ? 'Embed' : 'Reference'}</div>
                `;
    }
}

renderScreen();