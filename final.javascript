// Game State
const gameState = {
    currentSection: 'welcome-screen',
    quizAnswers: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
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
        lastMineTime: 0
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

// Dialog content
const dialogues = [
    {
        text: "So you must be the new recruit! Welcome aboard. It's good to have fresh faces joining our ranks.",
        options: [{ text: "Why did you join the Navy?", next: 1 }]
    },
    {
        text: "That's a great question! I went to the Navy Museum during my polytechnic days and was fascinated by the experiences shared there. I knew then that I wanted to be a Navy officer.",
        options: [{ text: "What motivated that decision?", next: 2 }]
    },
    {
        text: "I wanted to serve my country and see the world at the same time. After finishing poly, I applied for a scholarship and was accepted into the Navy. The training was challenging but incredibly rewarding.",
        options: [{ text: "What kind of training did you go through?", next: 3 }]
    },
    {
        text: "Oh, we go through extensive training - everything from firefighting and shipwreck patching to weapons systems and strategic planning. Teamwork is crucial in every aspect. We're trained to react quickly to any situation that could arise at sea.",
        options: [{ text: "Was it difficult for you?", next: 4 }]
    },
    {
        text: "It definitely had its challenges. I used to be claustrophobic, which made certain drills very difficult for me. But my bunkmates were incredibly supportive.",
        options: [{ text: "What's a typical day like for you now?", next: 5 }]
    },
    {
        text: "Every day is different! Morning begins with physical training, followed by briefings. Then, depending on my rotation, I might be monitoring radar systems, coordinating drills, or planning missions. Wait - I'm getting an alert. Pirates spotted off the coast! We need to intercept them.",
        options: [{ text: "Let's go!", next: 'game' }]
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
        button.addEventListener('click', function() {
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
    document.getElementById('male-officer').addEventListener('click', function() {
        gameState.selectedCharacter = 'male';
        gameState.characterName = 'Lieutenant Lim Wei Ming';
        gameState.characterGender = 'male';
        document.getElementById('officer-name').textContent = gameState.characterName;
        document.getElementById('officer-placeholder').textContent = '👨‍✈️';
        showSection('storySection');
        updateDialogue();
    });
    
    document.getElementById('female-officer').addEventListener('click', function() {
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
        
        button.addEventListener('click', function() {
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
            gameMessage.textContent = game.score >= 50 ? 
                'Mission Successful! Pirates defeated!' : 
                'Mission Failed! Ship critically damaged!';
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
    document.getElementById('restart-game').addEventListener('click', function() {
        clearInterval(gameLoop);
        initGame();
    });
    
    // Return to story button
    document.getElementById('return-story').addEventListener('click', function() {
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
        if (check
