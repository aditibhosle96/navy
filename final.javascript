// Additional Naval knowledge questions for the game
const additionalQuestions = [
    {
        question: "What is the term for the right side of a ship?",
        options: ["Port", "Starboard", "Bow", "Stern"],
        correctAnswer: 1
    },
    {
        question: "What does 'SONAR' stand for?",
        options: ["Sound Navigation And Ranging", "Submarine Ocean Navigation and Reconnaissance", "Sonic Naval Acoustic Radar", "Systematic Observation of Naval Area Regions"],
        correctAnswer: 0
    },
    {
        question: "What is the primary purpose of a destroyer in a naval fleet?",
        options: ["Transporting troops", "Aircraft operations", "Escort and protection", "Amphibious assaults"],
        correctAnswer: 2
    },
    {
        question: "Which of these is NOT a naval rank?",
        options: ["Commander", "Lieutenant", "Colonel", "Admiral"],
        correctAnswer: 2
    },
    {
        question: "What is the term for the floor of a ship?",
        options: ["Ground", "Deck", "Base", "Floor"],
        correctAnswer: 1
    },
    {
        question: "What is the purpose of a ship's keel?",
        options: ["To store ballast", "To house the engine", "To provide structural support", "To hold the anchor"],
        correctAnswer: 2
    },
    {
        question: "What does 'Mayday' signify in naval communications?",
        options: ["End of day operations", "A scheduled maintenance check", "A life-threatening emergency", "Permission to dock"],
        correctAnswer: 2
    },
    {
        question: "Which naval formation is typically used for anti-submarine warfare?",
        options: ["Line formation", "Screen formation", "Diamond formation", "Column formation"],
        correctAnswer: 1
    },
    {
        question: "What is the 'bridge' of a naval vessel?",
        options: ["The walkway connecting two parts of the ship", "The command center where the vessel is controlled", "The deck connecting the bow and stern", "The communication center"],
        correctAnswer: 1
    },
    {
        question: "What is the traditional naval punishment that involves scraping the hull of a ship?",
        options: ["Keelhauling", "Flogging", "Walking the plank", "Bilging"],
        correctAnswer: 0
    }
];

// Promotion ceremony dialogue
const promotionDialogues = [
    {
        text: "Attention on deck! After your exceptional performance in the recent anti-piracy operation, we're gathered here today for a special ceremony. Your swift action and naval knowledge have earned you recognition from fleet command.",
        options: [
            { text: "I'm honored, sir/ma'am.", next: 1 }
        ]
    },
    {
        text: "You've demonstrated exceptional skill in naval warfare, tactical knowledge, and leadership under pressure. Your answers to our naval assessment questions were impressive - showing a deep understanding of naval operations, history, and protocol.",
        options: [
            { text: "Thank you for the recognition.", next: 2 }
        ]
    },
    {
        text: "By the authority vested in me, I hereby promote you to the rank of %RANK%. This promotion comes with increased responsibility and a new assignment. You'll be leading your own team on future operations. Congratulations!",
        options: [
            { text: "I'll serve with honor and dedication.", next: 3 }
        ]
    },
    {
        text: "Your performance has been noted in your service record. This is just the beginning of what I'm sure will be a distinguished naval career. The maritime security of our nation relies on officers like you. Continue to excel and you'll go far in the Navy.",
        options: [
            { text: "What will my new assignment be?", next: 4 }
        ]
    },
    {
        text: "Your new assignment will be as the %POSITION% aboard the %SHIP_CLASS% ship. You'll be responsible for a team of sailors and ensuring the combat readiness of your section. This is a significant step in your career and will prepare you for future command opportunities.",
        options: [
            { text: "When do I report for duty?", next: 5 }
        ]
    },
    {
        text: "You'll report to your new assignment in two weeks. In the meantime, you'll receive specialized training relevant to your new position. You've earned this promotion, but remember that with rank comes increased responsibility for the lives of those under your command and the missions you'll undertake.",
        options: [
            { text: "Thank you for this opportunity. I won't let you down.", next: 6 }
        ]
    },
    {
        text: "I have no doubt you'll excel in your new role. Remember the lessons you've learned here about leadership, technical expertise, and the importance of naval tradition. Dismissed - and congratulations once again, %RANK%!",
        options: [
            { text: "Continue your naval career", next: "end" }
        ]
    }
];

// Combine the original questions with the additional ones
const allGameQuestions = [...gameQuestions, ...additionalQuestions];

// Positions for different career paths
const careerPositions = {
    'path1': {
        rank: "Lieutenant Commander",
        position: "Special Operations Officer",
        ship: "Formidable-class frigate"
    },
    'path2': {
        rank: "Lieutenant Commander",
        position: "Combat Systems Officer",
        ship: "Endurance-class landing platform dock"
    },
    'path3': {
        rank: "Lieutenant Commander",
        position: "Executive Officer",
        ship: "Victory-class corvette"
    },
    'path4': {
        rank: "Lieutenant Commander",
        position: "Chief Engineer",
        ship: "Archer-class submarine"
    }
};

// Update the game initialization function to use the new questions
function initGame() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const gameMessage = document.getElementById('game-message');
    const gameScore = document.getElementById('game-score');
    const gameHealth = document.getElementById('game-health');
    
    // Reset game state
    const game = gameState.game;
    game.shipX = canvas.width / 2 - game.shipWidth / 2;
    game.shipY = canvas.height - game.shipHeight - 20;
    game.bullets = [];
    game.pirates = [];
    game.mines = [];
    game.score = 0;
    game.health = 100;
    game.gameOver = false;
    game.isOfficerHit = false;
    game.lastPirateTime = 0;
    game.lastMineTime = 0;
    game.questionActive = false;
    game.currentQuestion = -1;
    game.questionsAnswered = 0;
    game.gameStartTime = Date.now();
    game.questionsToAsk = allGameQuestions.slice(); // Use all questions
    game.totalQuestionsNeeded = 10; // Set to 10 questions for promotion
    
    // Shuffle questions array for randomization
    shuffleArray(game.questionsToAsk);
    
    // Update score and health display
    gameScore.textContent = game.score;
    gameHealth.textContent = game.health;
    gameMessage.textContent = '';
    
    // Ship controls
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    canvas.addEventListener('click', fireHandler);
    
    // Game loop
    const gameLoop = setInterval(() => {
        if (game.gameOver) {
            clearInterval(gameLoop);
            if (game.health <= 0) {
                gameMessage.textContent = 'Mission Failed! Ship critically damaged!';
            } else if (game.questionsAnswered >= game.totalQuestionsNeeded) {
                gameMessage.textContent = 'Mission Complete! Promotion Ceremony Awaits!';
                setTimeout(() => {
                    showPromotionCeremony();
                }, 2000);
            } else {
                gameMessage.textContent = 'Mission Successful! Pirates defeated!';
            }
            return;
        }
        
        // Only update game if no question is active
        if (!game.questionActive) {
            updateGame();
            
            // Check if it's time to show a question (every 45 seconds or after scoring 800 points since last question)
            const currentTime = Date.now();
            const timeSinceStart = currentTime - game.gameStartTime;
            const scoreCheckpoint = Math.floor(game.score / 800);
            
            if ((timeSinceStart > 45000 * (game.questionsAnswered + 1) || 
                 scoreCheckpoint > game.questionsAnswered) && 
                game.questionsAnswered < game.totalQuestionsNeeded) {
                showGameQuestion();
            }
        }
        
        drawGame(ctx, canvas);
        
        // Check if promotion requirements met (10 questions answered)
        if (game.questionsAnswered >= game.totalQuestionsNeeded) {
            game.gameOver = true;
        }
        
        // Check if game is lost
        if (game.health <= 0) {
            game.gameOver = true;
            game.health = 0;
        }
        
        // Update display
        gameScore.textContent = game.score;
        gameHealth.textContent = game.health;
    }, 1000 / 60); // 60 FPS
    
    // Other event listeners remain the same...
}

// Fisher-Yates shuffle algorithm for randomizing questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Updated question display function
function showGameQuestion() {
    const game = gameState.game;
    
    if (game.questionsAnswered >= game.totalQuestionsNeeded) {
        return; // All required questions have been asked
    }
    
    // Get the next question from the shuffled array
    const questionIndex = game.questionsAnswered % game.questionsToAsk.length;
    const question = game.questionsToAsk[questionIndex];
    game.questionActive = true;
    
    // Create and populate the overlay
    const overlay = createQuizOverlay();
    overlay.innerHTML = `
        <h3>Naval Knowledge Check (${game.questionsAnswered + 1}/${game.totalQuestionsNeeded})</h3>
        <p>${question.question}</p>
        <div id="quiz-options" style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
            ${question.options.map((option, index) => `
                <button class="quiz-option btn" data-index="${index}" style="text-align: left; padding: 10px; background-color: #2e5c8a;">
                    ${option}
                </button>
            `).join('')}
        </div>
    `;
    
    // Add event listeners to option buttons
    const optionButtons = overlay.querySelectorAll('.quiz-option');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedIndex = parseInt(this.getAttribute('data-index'));
            if (selectedIndex === question.correctAnswer) {
                // Correct answer - higher points for more difficult questions
                const pointsEarned = 100 + (game.questionsAnswered * 20);
                game.score += pointsEarned;
                overlay.innerHTML = `
                    <h3>Correct!</h3>
                    <p>+${pointsEarned} points</p>
                    <button id="continue-game" class="btn" style="margin-top: 15px;">Continue Mission</button>
                `;
            } else {
                // Wrong answer
                const pointsLost = 50;
                game.score = Math.max(0, game.score - pointsLost);
                overlay.innerHTML = `
                    <h3>Incorrect</h3>
                    <p>-${pointsLost} points</p>
                    <p>The correct answer was: ${question.options[question.correctAnswer]}</p>
                    <button id="continue-game" class="btn" style="margin-top: 15px;">Continue Mission</button>
                `;
            }
            
            // Update the score display
            document.getElementById('game-score').textContent = game.score;
            
            // Continue button
            document.getElementById('continue-game').addEventListener('click', function() {
                overlay.style.display = 'none';
                game.questionActive = false;
                game.questionsAnswered++;
                
                // Check if all required questions have been answered
                if (game.questionsAnswered >= game.totalQuestionsNeeded) {
                    game.gameOver = true;
                    showPromotionCeremony();
                }
            });
        });
    });
    
    overlay.style.display = 'block';
}

// Create promotion ceremony section
function createPromotionSection() {
    // Create the section if it doesn't exist
    if (!document.getElementById('promotion-section')) {
        const promotionSection = document.createElement('div');
        promotionSection.id = 'promotion-section';
        promotionSection.className = 'game-section';
        promotionSection.style.display = 'none';
        
        const container = document.querySelector('.container');
        container.appendChild(promotionSection);
        
        // Add to sections object
        sections.promotionSection = promotionSection;
    }
    
    // Populate the section
    const promotionSection = document.getElementById('promotion-section');
    promotionSection.innerHTML = `
        <h2>Promotion Ceremony</h2>
        <div class="dialogue-container">
            <div class="officer-img">
                <div class="character-placeholder" id="promotion-officer-placeholder">⚓</div>
            </div>
            <div id="promotion-officer-name" class="officer-name">Admiral Chen</div>
            <div id="promotion-dialogue-text" class="dialogue-text">
                <!-- Dialogue text will be inserted here -->
            </div>
            <div id="promotion-dialogue-options" class="dialogue-options">
                <!-- Options will be inserted here -->
            </div>
        </div>
    `;
    
    // Add section to sections object if not already there
    if (!sections.promotionSection) {
        sections.promotionSection = promotionSection;
    }
    
    return promotionSection;
}

// Show promotion ceremony
function showPromotionCeremony() {
    const promotionSection = createPromotionSection();
    showSection('promotionSection');
    
    // Initialize promotion dialogue
    gameState.promotionStage = 0;
    updatePromotionDialogue();
}

// Update promotion dialogue
function updatePromotionDialogue() {
    const dialogueText = document.getElementById('promotion-dialogue-text');
    const dialogueOptions = document.getElementById('promotion-dialogue-options');
    const currentDialogue = promotionDialogues[gameState.promotionStage];
    
    // Get career path details
    const careerPath = careerPositions[gameState.quizResult];
    
    // Replace placeholders in text
    let text = currentDialogue.text
        .replace('%RANK%', careerPath.rank)
        .replace('%POSITION%', careerPath.position)
        .replace('%SHIP_CLASS%', careerPath.ship);
    
    dialogueText.textContent = text;
    
    // Clear previous options
    dialogueOptions.innerHTML = '';
    
    // Add new options
    currentDialogue.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn dialogue-btn';
        button.textContent = option.text;
        
        button.addEventListener('

