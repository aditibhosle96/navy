// Game State
const gameState = {
    currentSection: 'welcome-screen',
    quizAnswers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    quizResult: '',
    selectedCharacter: '',
    dialogueStage: 0,
    characterName: '',
    characterGender: '',
    game: {
        shipX: 350,
        shipY: 400,
        shipWidth: 80,
        shipHeight: 50,
        speed: 5,
        bullets: [],
        pirates: [],
        mines: [],
        score: 0,
        health: 100,
        gameOver: false,
        isOfficerHit: false,
        leftPressed: false,
        rightPressed: false,
        lastPirateTime: 0,
        lastMineTime: 0,
        officerAlive: true, // Track if the officer is alive
        isGuiding: true, // Track if the officer is guiding the player
    }
};

// DOM Elements
const sections = {
    welcomeScreen: document.getElementById('welcome-screen'),
    quizSection: document.getElementById('quiz-section'),
    quizResults: document.getElementById('quiz-results'),
    characterSelection: document.getElementById('character-selection'),
    storySection: document.getElementById('story-section'),
    gameSection: document.getElementById('game-section')
};

// Navy Educational Content
const navyEducationalContent = {
    diplomaticRoles: [
        "The Navy plays a crucial role in maintaining international maritime security.",
        "Naval diplomacy helps build relationships between countries through joint exercises and humanitarian missions.",
        "Maritime trade routes are protected by naval operations, contributing to global economic stability."
    ],
    trainingInsights: [
        "Navy personnel spend 70% of their time on land-based training and skill development.",
        "Training includes physical preparation, technical skills, and mental resilience.",
        "Teamwork and adaptability are key components of naval training."
    ],
    missionTypes: [
        "Humanitarian aid during natural disasters",
        "Maritime rescue operations",
        "Protecting international shipping lanes",
        "Providing medical assistance to remote communities"
    ]
};

// Achievement System
const achievementSystem = {
    achievements: [
        {
            name: "Rookie Navigator",
            points: 500,
            badge: "🚢",
            description: "Completed initial naval training simulation"
        },
        {
            name: "Maritime Defender",
            points: 1000,
            badge: "⚓",
            description: "Successfully defended maritime routes"
        },
        {
            name: "Naval Excellence Award",
            points: 10000,
            badge: "🏅",
            description: "Demonstrated exceptional skills and leadership"
        }
    ],
    checkAchievement(currentScore) {
        return this.achievements.find(achievement => 
            currentScore >= achievement.points
        );
    },
    displayAchievement(achievement) {
        const achievementModal = document.createElement('div');
        achievementModal.className = 'achievement-modal';
        achievementModal.innerHTML = `
            <div class="achievement-content">
                <h2>Achievement Unlocked!</h2>
                <div class="badge">${achievement.badge}</div>
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
            </div>
        `;
        document.body.appendChild(achievementModal);

        // Remove modal after 5 seconds
        setTimeout(() => {
            document.body.removeChild(achievementModal);
        }, 5000);
    }
};

// Educational Popup System
function showEducationalPopup() {
    const educationalFacts = [
        ...navyEducationalContent.diplomaticRoles,
        ...navyEducationalContent.trainingInsights,
        ...navyEducationalContent.missionTypes
    ];

    const randomFact = educationalFacts[Math.floor(Math.random() * educationalFacts.length)];
    
    const popup = document.createElement('div');
    popup.className = 'educational-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>Navy Insight</h3>
            <p>${randomFact}</p>
        </div>
    `;
    
    document.body.appendChild(popup);

    // Remove popup after 5 seconds
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 5000);
}

// Modify the initGame function to include educational popups
function modifiedInitGame() {
    // Original initGame code...

    // Add educational popup at game start
    showEducationalPopup();

    // Add periodic educational popups during gameplay
    const educationInterval = setInterval(() => {
        if (!gameState.game.gameOver) {
            showEducationalPopup();
        } else {
            clearInterval(educationInterval);
        }
    }, 60000); // Show every minute

    // Modify the game loop to check for achievements
    const gameLoop = setInterval(() => {
        // Existing game loop code...

        // Check for achievements
        const achievement = achievementSystem.checkAchievement(gameState.game.score);
        if (achievement) {
            achievementSystem.displayAchievement(achievement);
        }
    }, 1000 / 60);
}

// Enhanced difficulty progression
function enhancedUpdateGame() {
    const game = gameState.game;

    // Dynamic difficulty increase
    if (game.score > 100) {
        // Increase ship speed
        game.speed = 6;
        
        // Increase pirate spawn rate
        if (Date.now() - game.lastPirateTime > 1500) {
            game.pirates.push({
                x: Math.random() * (700 - 40),
                y: -40,
                width: 40,
                height: 30,
                speed: 1.5 + Math.random() * 2.5
            });
            game.lastPirateTime = Date.now();
        }
    }

    // Add bonus points for strategic gameplay
    if (game.pirates.length === 0 && game.bullets.length === 0) {
        game.score += 10; // Bonus for clearing the screen
    }

    // Existing updateGame logic continues...
}

// Modify the existing initGame function to incorporate these changes
function initGame() {
    // Original initGame code...

    // Add educational popup at game start
    showEducationalPopup();

    // Add achievement tracking to game loop
    const gameLoop = setInterval(() => {
        if (gameState.game.gameOver) {
            clearInterval(gameLoop);
            
            // Check for final achievement
            const achievement = achievementSystem.checkAchievement(gameState.game.score);
            if (achievement) {
                achievementSystem.displayAchievement(achievement);
            }

            // Rest of the existing game over logic...
            return;
        }

        updateGame();
        drawGame(ctx, canvas);

        // Existing game loop logic...

        // Check for achievements during gameplay
        const achievement = achievementSystem.checkAchievement(gameState.game.score);
        if (achievement) {
            achievementSystem.displayAchievement(achievement);
        }
    }, 1000 / 60);
}


// Dialog content
const dialogues = [
    {
        text: "So you must be the new recruit! Welcome aboard. It's good to have fresh faces joining our ranks.",
        options: [{ text: "Why did you join the Navy?", next: 1 }]
    },
    {
        text: "I wanted to serve my country and see the world at the same time. After finishing poly, I applied for a scholarship and was accepted into the Navy. The training was challenging but incredibly rewarding.",
        options: [{ text: "What kind of training did you go through?", next: 2 }]
    },
    {
        text: "Oh, we go through extensive training - everything from firefighting and shipwreck patching to weapons systems and strategic planning. Teamwork is crucial in every aspect. We're trained to react quickly to any situation that could arise at sea.",
        options: [{ text: "Was it difficult for you?", next: 3 }, { text: "What's the most exciting part of your job?", next: 4 }]
    },
    {
        text: "It definitely had its challenges. I used to be claustrophobic, which made certain drills very difficult for me. But my bunkmates were incredibly supportive.",
        options: [{ text: "What's a typical day like for you now?", next: 5 }]
    },
    {
        text: "The most exciting part? Definitely the missions. Whether it's a rescue operation or a strategic deployment, every mission is different and keeps you on your toes.",
        options: [{ text: "What's a typical day like for you now?", next: 5 }]
    },
    {
        text: "Every day is different! Morning begins with physical training, followed by briefings. Then, depending on my rotation, I might be monitoring radar systems, coordinating drills, or planning missions. Wait - I'm getting an alert. Pirates spotted off the coast! We need to intercept them.",
        options: [{ text: "Let's go!", next: 'game' }]
    },
    {
        text: "Mission accomplished! You've successfully defended the ship and defeated the pirates. Your bravery and quick thinking have earned you a commendation.",
        options: [{ text: "What happens next?", next: 6 }]
    },
    {
        text: "You're invited to an award ceremony where you'll be recognized for your actions. It's a proud moment for any Naval officer.",
        options: [{ text: "Attend the ceremony", next: 7 }]
    },
    {
        text: "At the ceremony, you receive a medal for your bravery. The Admiral himself shakes your hand and commends your leadership under pressure.",
        options: [{ text: "Return to the ship", next: 'welcome-screen' }]
    }
];

// Career paths based on quiz results
const careerPaths = {
    'path1': {
        title: 'Navy SEALs / Naval Diving Unit',
        description: 'You have what it takes to join the elite special forces of the Navy! With your preference for physical challenges and high-intensity operations, the Naval Diving Unit or special operations would be your ideal path.',
        emoji: '🏊‍♂️'
    },
    'path2': {
        title: 'Tactical Systems Specialist',
        description: 'Your technical mindset and interest in naval systems make you perfect for operating advanced weapons, radar, and sonar equipment. You\'ll be the eyes and ears of the ship.',
        emoji: '🎯'
    },
    'path3': {
        title: 'Naval Command Officer',
        description: 'With your leadership qualities and strategic thinking, you\'re destined for command. Your career path leads to becoming a respected officer managing naval operations.',
        emoji: '⚓'
    },
    'path4': {
        title: 'Naval Engineer',
        description: 'Your problem-solving skills and technical interest make you perfect for designing, maintaining, and improving the Navy\'s vessels and equipment. You\'ll keep everything running smoothly.',
        emoji: '🔧'
    }
};

// Show a specific section and hide others
function showSection(sectionId) {
    Object.values(sections).forEach(section => {
        section.style.display = 'none';
    });

    sections[sectionId].style.display = 'block';
    gameState.currentSection = sectionId;
}

// Handle quiz navigation and scoring
function handleQuiz() {
    const quizQuestions = document.querySelectorAll('.quiz-question');
    let currentQuestion = 0;

    // Show first question
    quizQuestions[currentQuestion].style.display = 'block';

    // Add event listeners to all option buttons
    document.querySelectorAll('.option-btn').forEach(button => {
        button.addEventListener('click', function () {
            // Save answer
            const questionNumber = Math.floor(Array.from(quizQuestions).indexOf(this.closest('.quiz-question')) + 1);
            const answerValue = parseInt(this.getAttribute('data-value'));
            gameState.quizAnswers[questionNumber] = answerValue;

            // Hide current question
            quizQuestions[currentQuestion].style.display = 'none';

            // Move to next question or show results
            currentQuestion++;
            if (currentQuestion < quizQuestions.length) {
                quizQuestions[currentQuestion].style.display = 'block';
            } else {
                calculateQuizResults();
                showSection('quizResults');
            }
        });
    });
}

// Calculate quiz results
function calculateQuizResults() {
    // Count occurrences of each answer type
    const answerCounts = [0, 0, 0, 0, 0];

    for (const question in gameState.quizAnswers) {
        const answer = gameState.quizAnswers[question];
        answerCounts[answer]++;
    }

    // Find the most common answer (ignore 0 index)
    let maxCount = 0;
    let resultPath = 1;

    for (let i = 1; i < answerCounts.length; i++) {
        if (answerCounts[i] > maxCount) {
            maxCount = answerCounts[i];
            resultPath = i;
        }
    }

    gameState.quizResult = 'path' + resultPath;

    // Display result
    const resultDisplay = document.getElementById('result-display');
    const result = careerPaths[gameState.quizResult];

    resultDisplay.innerHTML = `
        <div class="emoji">${result.emoji}</div>
        <h3>${result.title}</h3>
        <p>${result.description}</p>
    `;
}

// Handle character selection
function handleCharacterSelection() {
    document.getElementById('male-officer').addEventListener('click', function () {
        gameState.selectedCharacter = 'male';
        gameState.characterName = 'Lieutenant Lim Wei Ming';
        gameState.characterGender = 'male';
        document.getElementById('officer-name').textContent = gameState.characterName;
        document.getElementById('officer-placeholder').textContent = '👨‍✈️';
        showSection('storySection');
        updateDialogue();
    });

    document.getElementById('female-officer').addEventListener('click', function () {
        gameState.selectedCharacter = 'female';
        gameState.characterName = 'Lieutenant Tan Mei Ling';
        gameState.characterGender = 'female';
        document.getElementById('officer-name').textContent = gameState.characterName;
        document.getElementById('officer-placeholder').textContent = '👩‍✈️';
        showSection('storySection');
        updateDialogue();
    });
}

// Update dialogue in story section
function updateDialogue() {
    const dialogueText = document.getElementById('dialogue-text');
    const dialogueOptions = document.getElementById('dialogue-options');
    const currentDialogue = dialogues[gameState.dialogueStage];

    dialogueText.textContent = currentDialogue.text;

    // Clear previous options
    dialogueOptions.innerHTML = '';

    // Add new options
    currentDialogue.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn dialogue-btn';
        button.textContent = option.text;

        button.addEventListener('click', function () {
            if (option.next === 'game') {
                showSection('gameSection');
                initGame();
            } else {
                gameState.dialogueStage = option.next;
                updateDialogue();
            }
        });

        dialogueOptions.appendChild(button);
    });
}

// Initialize the game canvas
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
    game.officerAlive = true;
    game.isGuiding = true;

    // Update score and health display
    gameScore.textContent = game.score;
    gameHealth.textContent = game.health;
    gameMessage.textContent = 'Officer: "Stay focused! Use the arrow keys to steer and spacebar to fire!"';

    // Ship controls
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    canvas.addEventListener('click', fireHandler);

    // Game loop
    const gameLoop = setInterval(() => {
        if (game.gameOver) {
            clearInterval(gameLoop);
            gameMessage.textContent = game.score >= 50 ?
                'Mission Successful! Pirates defeated!' :
                'Mission Failed! Ship critically damaged!';
            showSection('storySection');
            gameState.dialogueStage = 6; // Move to award ceremony dialogue
            updateDialogue();
            return;
        }

        updateGame();
        drawGame(ctx, canvas);

        // Check if game is won
        if (game.score >= 50) {
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

    // Restart button
    document.getElementById('restart-game').addEventListener('click', function () {
        clearInterval(gameLoop);
        initGame();
    });

    // Return to story button
    document.getElementById('return-story').addEventListener('click', function () {
        clearInterval(gameLoop);
        document.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('keyup', keyUpHandler);
        canvas.removeEventListener('click', fireHandler);
        showSection('storySection');
    });

    function keyDownHandler(e) {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            game.rightPressed = true;
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            game.leftPressed = true;
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            fireBullet();
        }
    }

    function keyUpHandler(e) {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            game.rightPressed = false;
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            game.leftPressed = false;
        }
    }

    function fireHandler(e) {
        fireBullet();
    }

    function fireBullet() {
        if (game.gameOver) return;

        game.bullets.push({
            x: game.shipX + game.shipWidth / 2 - 2,
            y: game.shipY,
            width: 4,
            height: 10,
            speed: 7
        });
    }
}

// Update game state
function updateGame() {
    const game = gameState.game;

    // Move ship
    if (game.rightPressed && game.shipX < 700 - game.shipWidth) {
        game.shipX += game.speed;
    } else if (game.leftPressed && game.shipX > 0) {
        game.shipX -= game.speed;
    }

    // Move bullets
    for (let i = 0; i < game.bullets.length; i++) {
        game.bullets[i].y -= game.bullets[i].speed;

        // Remove bullets that are off screen
        if (game.bullets[i].y < 0) {
            game.bullets.splice(i, 1);
            i--;
        }
    }

    // Spawn pirates
    const currentTime = Date.now();
    if (currentTime - game.lastPirateTime > 2000) { // Spawn every 2 seconds
        game.pirates.push({
            x: Math.random() * (700 - 40),
            y: -40,
            width: 40,
            height: 30,
            speed: 1 + Math.random() * 2
        });
        game.lastPirateTime = currentTime;
    }

    // Spawn mines
    if (currentTime - game.lastMineTime > 5000) { // Spawn every 5 seconds
        game.mines.push({
            x: Math.random() * (700 - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 1.5 + Math.random()
        });
        game.lastMineTime = currentTime;
    }

    // Move pirates
    for (let i = 0; i < game.pirates.length; i++) {
        game.pirates[i].y += game.pirates[i].speed;

        // Remove pirates that are off screen
        if (game.pirates[i].y > 500) {
            game.pirates.splice(i, 1);
            i--;

            // Penalty for letting pirates pass
            game.health -= 5;
        }
    }

    // Move mines
    for (let i = 0; i < game.mines.length; i++) {
        game.mines[i].y += game.mines[i].speed;

        // Remove mines that are off screen
        if (game.mines[i].y > 500) {
            game.mines.splice(i, 1);
            i--;
        }
    }

    // Check for bullet-pirate collisions
    for (let i = 0; i < game.bullets.length; i++) {
        for (let j = 0; j < game.pirates.length; j++) {
            if (checkCollision(game.bullets[i], game.pirates[j])) {
                game.score += 5;
                game.bullets.splice(i, 1);
                game.pirates.splice(j, 1);
                i--;
                break;
            }
        }
    }

    // Check for ship-pirate collisions
    for (let i = 0; i < game.pirates.length; i++) {
        if (checkCollision({
            x: game.shipX,
            y: game.shipY,
            width: game.shipWidth,
            height: game.shipHeight
        }, game.pirates[i])) {
            game.health -= 10;
            game.pirates.splice(i, 1);
            game.isOfficerHit = true;
            setTimeout(() => {
                game.isOfficerHit = false;
            }, 300);
            i--;

            // Officer gets shot after a certain number of hits
            if (game.health <= 70 && game.officerAlive) {
                officerShot();
            }
        }
    }

    // Check for ship-mine collisions
    for (let i = 0; i < game.mines.length; i++) {
        if (checkCollision({
            x: game.shipX,
            y: game.shipY,
            width: game.shipWidth,
            height: game.shipHeight
        }, game.mines[i])) {
            game.health -= 20;
            game.mines.splice(i, 1);
            game.isOfficerHit = true;
            setTimeout(() => {
                game.isOfficerHit = false;
            }, 300);
            i--;
        }
    }
}

// Check for collision between two objects
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y;
}

// Draw game elements
function drawGame(ctx, canvas) {
    const game = gameState.game;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Added missing parameters
    // Rest of the drawing code remains the same
    if (game.isOfficerHit) {
        ctx.fillStyle = 'red';
    } else {
        ctx.fillStyle = 'white';
    }
    ctx.beginPath();
    ctx.rect(game.shipX, game.shipY, game.shipWidth, game.shipHeight);
    ctx.fill();
    ctx.closePath();

    // Draw bullets
    ctx.fillStyle = 'yellow';
    game.bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.fill();
        ctx.closePath();
    });

    // Draw pirates
    ctx.fillStyle = 'red';
    game.pirates.forEach(pirate => {
        ctx.beginPath();
        ctx.rect(pirate.x, pirate.y, pirate.width, pirate.height);
        ctx.fill();
        ctx.closePath();
    });

    // Draw mines
    ctx.fillStyle = 'orange';
    game.mines.forEach(mine => {
        ctx.beginPath();
        ctx.arc(mine.x + mine.width / 2, mine.y + mine.height / 2, mine.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

// Handle officer being shot
function officerShot() {
    const game = gameState.game;
    game.officerAlive = false;
    game.isGuiding = false;
    document.getElementById('game-message').textContent = "Officer down! You're in command now. Steer the ship and launch missiles!";
}

// Event listeners for initial screens
document.addEventListener('DOMContentLoaded', function () {
    // Start button
    document.getElementById('start-btn').addEventListener('click', function () {
        showSection('quizSection');
        handleQuiz();
    });

    // Continue to character selection
    document.getElementById('continue-to-character').addEventListener('click', function () {
        showSection('characterSelection');
        handleCharacterSelection();
    });
});
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

if (option.next === 'end') {
                showEndScreen();
            } else {
                gameState.promotionStage = option.next;
                updatePromotionDialogue();
            }
        });
        
        dialogueOptions.appendChild(button);
    });
}

// Show end screen after promotion
function showEndScreen() {
    const endSection = createEndSection();
    showSection('endSection');
    
    // Get career path details
    const careerPath = careerPositions[gameState.quizResult || 'path1'];
    
    // Update end screen with career details
    document.getElementById('end-rank').textContent = careerPath.rank;
    document.getElementById('end-position').textContent = careerPath.position;
    document.getElementById('end-ship').textContent = careerPath.ship;
    document.getElementById('end-score').textContent = gameState.game.score;
    document.getElementById('end-questions').textContent = gameState.game.questionsAnswered;
}

// Create end screen section
function createEndSection() {
    // Create the section if it doesn't exist
    if (!document.getElementById('end-section')) {
        const endSection = document.createElement('div');
        endSection.id = 'end-section';
        endSection.className = 'game-section';
        endSection.style.display = 'none';
        
        const container = document.querySelector('.container');
        container.appendChild(endSection);
        
        // Add to sections object
        sections.endSection = endSection;
    }
    
    // Populate the section
    const endSection = document.getElementById('end-section');
    endSection.innerHTML = `
        <h2>Mission Complete</h2>
        <div class="end-container">
            <div class="end-info">
                <h3>Your Naval Career Path</h3>
                <p>Rank: <span id="end-rank"></span></p>
                <p>Position: <span id="end-position"></span></p>
                <p>Assignment: <span id="end-ship"></span></p>
                <h3>Performance</h3>
                <p>Final Score: <span id="end-score"></span></p>
                <p>Naval Knowledge Questions: <span id="end-questions"></span>/10</p>
            </div>
            <div class="end-actions">
                <button id="play-again" class="btn">New Mission</button>
                <button id="return-main" class="btn">Return to Main Menu</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('play-again').addEventListener('click', function() {
        initGame();
        showSection('gameSection');
    });
    
    document.getElementById('return-main').addEventListener('click', function() {
        showSection('mainMenuSection');
    });
    
    // Add section to sections object if not already there
    if (!sections.endSection) {
        sections.endSection = endSection;
    }
    
    return endSection;
}

// Create quiz overlay for questions
function createQuizOverlay() {
    let overlay = document.getElementById('quiz-overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'quiz-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.backgroundColor = 'rgba(0, 40, 80, 0.95)';
        overlay.style.padding = '20px';
        overlay.style.borderRadius = '8px';
        overlay.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '1000';
        overlay.style.width = '80%';
        overlay.style.maxWidth = '600px';
        overlay.style.color = 'white';
        overlay.style.display = 'none';
        
        document.body.appendChild(overlay);
    }
    
    return overlay;
}

// Update game state function
function updateGame() {
    const game = gameState.game;
    const canvas = document.getElementById('game-canvas');
    
    // Move ship based on key presses
    if (game.rightPressed && game.shipX < canvas.width - game.shipWidth) {
        game.shipX += game.shipSpeed;
    }
    if (game.leftPressed && game.shipX > 0) {
        game.shipX -= game.shipSpeed;
    }
    
    // Move bullets
    for (let i = 0; i < game.bullets.length; i++) {
        game.bullets[i].y -= game.bulletSpeed;
        
        // Remove bullets that go off screen
        if (game.bullets[i].y < 0) {
            game.bullets.splice(i, 1);
            i--;
        }
    }
    
    // Generate pirates
    const currentTime = Date.now();
    if (currentTime - game.lastPirateTime > 1500) {
        game.lastPirateTime = currentTime;
        
        const pirate = {
            x: Math.random() * (canvas.width - game.pirateWidth),
            y: -game.pirateHeight,
            width: game.pirateWidth,
            height: game.pirateHeight,
            speed: 1 + Math.random() * 2
        };
        
        game.pirates.push(pirate);
    }
    
    // Move pirates
    for (let i = 0; i < game.pirates.length; i++) {
        game.pirates[i].y += game.pirates[i].speed;
        
        // Check for collision with ship
        if (checkCollision(
            game.shipX, game.shipY, game.shipWidth, game.shipHeight,
            game.pirates[i].x, game.pirates[i].y, game.pirates[i].width, game.pirates[i].height
        )) {
            game.health -= 10;
            game.pirates.splice(i, 1);
            i--;
            continue;
        }
        
        // Check for collision with bullets
        for (let j = 0; j < game.bullets.length; j++) {
            if (checkCollision(
                game.bullets[j].x, game.bullets[j].y, game.bulletWidth, game.bulletHeight,
                game.pirates[i].x, game.pirates[i].y, game.pirates[i].width, game.pirates[i].height
            )) {
                game.score += 50;
                game.pirates.splice(i, 1);
                game.bullets.splice(j, 1);
                i--;
                break;
            }
        }
        
        // Remove pirates that go off screen
        if (game.pirates[i] && game.pirates[i].y > canvas.height) {
            game.pirates.splice(i, 1);
            i--;
        }
    }
    
    // Generate mines
    if (currentTime - game.lastMineTime > 3000) {
        game.lastMineTime = currentTime;
        
        const mine = {
            x: Math.random() * (canvas.width - game.mineWidth),
            y: -game.mineHeight,
            width: game.mineWidth,
            height: game.mineHeight,
            speed: 0.5 + Math.random() * 1
        };
        
        game.mines.push(mine);
    }
    
    // Move mines
    for (let i = 0; i < game.mines.length; i++) {
        game.mines[i].y += game.mines[i].speed;
        
        // Check for collision with ship
        if (checkCollision(
            game.shipX, game.shipY, game.shipWidth, game.shipHeight,
            game.mines[i].x, game.mines[i].y, game.mines[i].width, game.mines[i].height
        )) {
            game.health -= 20;
            game.mines.splice(i, 1);
            i--;
            continue;
        }
        
        // Check for collision with bullets
        for (let j = 0; j < game.bullets.length; j++) {
            if (checkCollision(
                game.bullets[j].x, game.bullets[j].y, game.bulletWidth, game.bulletHeight,
                game.mines[i].x, game.mines[i].y, game.mines[i].width, game.mines[i].height
            )) {
                game.score += 100;
                game.mines.splice(i, 1);
                game.bullets.splice(j, 1);
                i--;
                break;
            }
        }
        
        // Remove mines that go off screen
        if (game.mines[i] && game.mines[i].y > canvas.height) {
            game.mines.splice(i, 1);
            i--;
        }
    }
}

// Check collision between two rectangles
function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

// Draw game elements
function drawGame(ctx, canvas) {
    const game = gameState.game;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ship
    ctx.fillStyle = game.isOfficerHit ? 'red' : 'blue';
    ctx.fillRect(game.shipX, game.shipY, game.shipWidth, game.shipHeight);
    
    // Draw bullets
    ctx.fillStyle = 'yellow';
    for (let i = 0; i < game.bullets.length; i++) {
        ctx.fillRect(game.bullets[i].x, game.bullets[i].y, game.bulletWidth, game.bulletHeight);
    }
    
    // Draw pirates
    ctx.fillStyle = 'black';
    for (let i = 0; i < game.pirates.length; i++) {
        ctx.fillRect(game.pirates[i].x, game.pirates[i].y, game.pirates[i].width, game.pirates[i].height);
    }
    
    // Draw mines
    ctx.fillStyle = 'red';
    for (let i = 0; i < game.mines.length; i++) {
        ctx.fillRect(game.mines[i].x, game.mines[i].y, game.mines[i].width, game.mines[i].height);
    }
}

// Key handlers
function keyDownHandler(e) {
    if (!gameState.game.questionActive) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            gameState.game.rightPressed = true;
        }
        if (e.key === 'Left' || e.key === 'ArrowLeft') {
            gameState.game.leftPressed = true;
        }
        if (e.key === ' ' || e.key === 'Spacebar') {
            fireBullet();
        }
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        gameState.game.rightPressed = false;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        gameState.game.leftPressed = false;
    }
}

// Fire bullet
function fireBullet() {
    const game = gameState.game;
    if (game.bullets.length < game.maxBullets) {
        const bullet = {
            x: game.shipX + game.shipWidth / 2 - game.bulletWidth / 2,
            y: game.shipY,
            width: game.bulletWidth,
            height: game.bulletHeight
        };
        game.bullets.push(bullet);
    }
}

// Fire handler for mouse clicks
function fireHandler(e) {
    if (!gameState.game.questionActive) {
        fireBullet();
    }
}

// Initialize the game on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up game state
    gameState = {
        section: 'mainMenuSection',
        game: {
            shipX: 0,
            shipY: 0,
            shipWidth: 30,
            shipHeight: 30,
            shipSpeed: 5,
            bullets: [],
            bulletWidth: 5,
            bulletHeight: 10,
            bulletSpeed: 7,
            maxBullets: 5,
            pirates: [],
            pirateWidth: 25,
            pirateHeight: 25,
            mines: [],
            mineWidth: 20,
            mineHeight: 20,
            score: 0,
            health: 100,
            rightPressed: false,
            leftPressed: false,
            gameOver: false,
            isOfficerHit: false,
            lastPirateTime: 0,
            lastMineTime: 0,
            questionActive: false,
            currentQuestion: -1,
            questionsAnswered: 0,
            gameStartTime: 0,
            questionsToAsk: [],
            totalQuestionsNeeded: 10
        },
        quizResult: 'path1',
        promotionStage: 0
    };
    
    // Create sections
    sections = {
        mainMenuSection: document.getElementById('main-menu-section'),
        gameSection: document.getElementById('game-section'),
        // Other sections will be added dynamically
    };
    
    // Show main menu
    showSection('mainMenuSection');
    
    // Add event listeners for menu buttons
    document.getElementById('start-game').addEventListener('click', function() {
        initGame();
        showSection('gameSection');
    });
});

// Helper function to show a section
function showSection(sectionId) {
    // Hide all sections
    Object.values(sections).forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested section
    sections[sectionId].style.display = 'block';
    gameState.section = sectionId;
}
