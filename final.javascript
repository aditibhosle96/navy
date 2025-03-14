// Game State with enhanced features
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
        lastMineTime: 0,
        questionActive: false,
        currentQuestion: -1,
        questionsAnswered: 0,
        gameStartTime: 0
    }
};

// DOM Elements
const sections = {
    welcomeScreen: document.getElementById('welcome-screen'),
    quizSection: document.getElementById('quiz-section'),
    quizResults: document.getElementById('quiz-results'),
    characterSelection: document.getElementById('character-selection'),
    storySection: document.getElementById('story-section'),
    gameSection: document.getElementById('game-section'),
    ceremonySection: document.getElementById('ceremony-section')
};

// Enhanced dialog content with more depth about Naval life
const dialogues = [
    {
        text: "Welcome aboard! I'm looking forward to showing you around. Naval service is more than just a job - it's a lifestyle that combines discipline, technical expertise, and global perspective. What motivated you to consider joining our ranks?",
        options: [
            { text: "Why did you join the Navy?", next: 1 }
        ]
    },
    {
        text: "I joined the Navy for a few key reasons. After my polytechnic studies in electronics engineering, I was looking for a career that would challenge me both mentally and physically. The Navy offered me a scholarship that helped cover my university education, and it promised travel opportunities that I wouldn't get in a civilian job. There's something powerful about being part of a longstanding naval tradition that protects our shipping lanes and national interests.",
        options: [
            { text: "What kind of training did you go through?", next: 2 }
        ]
    },
    {
        text: "Naval training is comprehensive and quite intense. It starts with Basic Military Training where we develop discipline and physical fitness. Then at Officer Cadet School, we mastered navigation, tactics, and leadership skills. The specialized training is what truly sets us apart - from damage control and firefighting to ship handling and weapons systems. We train to handle everything from humanitarian missions to combat situations. The most challenging part was submarine escape training - we had to rise from 30 meters underwater without equipment.",
        options: [
            { text: "Tell me about naval technology and systems", next: 3 }
        ]
    },
    {
        text: "Our naval technology is cutting-edge. Modern warships are floating technology centers with advanced radar systems that can track multiple targets over 100 kilometers away. Our communications use encrypted satellite links that can't be intercepted. The weapons systems range from close-in defensive guns to long-range missiles with precision guidance. I specialize in the Combat Information Center, where we integrate all sensor data to create a complete tactical picture. It's like being in the nerve center of a floating city.",
        options: [
            { text: "What's life like when deployed at sea?", next: 4 }
        ]
    },
    {
        text: "Life at sea follows a structured routine, but no two days are identical. We operate in watches - typically 4 hours on, 8 hours off, around the clock. When not on watch, you're maintaining equipment, training, or getting necessary rest. Space is limited, so you learn to live efficiently. The food is surprisingly good though! The most rewarding aspects are port visits to different countries and the deep camaraderie that develops. You form bonds that last a lifetime when you've weathered storms together or navigated through challenging situations.",
        options: [
            { text: "What challenges do Naval officers face?", next: 5 }
        ]
    },
    {
        text: "The challenges are significant but rewarding. Being away from family for months at a time is probably the hardest part. Physically, adapting to constant ship movement in rough seas takes time. There's also the mental challenge of maintaining focus during long operations. We're responsible for millions of dollars worth of equipment and, more importantly, the lives of our crew members. Decision-making under pressure is critical - whether it's navigating through crowded shipping lanes or responding to a maritime emergency. That responsibility weighs on you, but it also develops incredible leadership skills.",
        options: [
            { text: "How does the Navy contribute to national security?", next: 6 }
        ]
    },
    {
        text: "The Navy is crucial to national security in ways many civilians don't realize. Beyond defense against direct threats, we secure vital shipping lanes that our economy depends on. About 90% of world trade moves by sea, so ensuring those routes stay open is essential. We conduct counter-piracy operations, particularly in high-risk areas. We also gather intelligence, project power through presence, and provide humanitarian assistance during natural disasters. Naval diplomacy is a key part of international relations - our port visits strengthen alliances and demonstrate commitment to regional stability.",
        options: [
            { text: "What career opportunities exist in the Navy?", next: 7 }
        ]
    },
    {
        text: "The Navy offers incredibly diverse career paths. Surface warfare officers like myself command ships and fleets. Naval aviators fly helicopters and maritime patrol aircraft. Submariners operate in one of the most challenging environments. Then there are specialized roles like intelligence officers, logistics specialists, engineers, and medical personnel. Each path offers advancement to command positions. The technical skills are highly transferable to civilian careers too. Many officers transition to maritime industries, aerospace, defense contractors, or management positions. The leadership experience is valued in virtually any industry.",
        options: [
            { text: "What kinds of missions have you been on?", next: 8 }
        ]
    },
    {
        text: "I've participated in a range of missions. We conducted counter-piracy operations in the Strait of Malacca, establishing presence and escorting merchant vessels through high-risk areas. I was part of a multinational exercise with five different navies, practicing complex maneuvers and interoperability. One of the most meaningful missions was providing humanitarian assistance after the tsunami in Indonesia - we delivered supplies, medical aid, and helped rebuild infrastructure. Recently, we've been conducting freedom of navigation operations to ensure international waters remain open to all nations according to maritime law.",
        options: [
            { text: "What new technologies are changing naval operations?", next: 9 }
        ]
    },
    {
        text: "Naval technology is evolving rapidly. Unmanned vessels are becoming more prominent for surveillance and potentially combat roles. Directed energy weapons like lasers are being deployed for defense against drones and small boats. AI systems are enhancing our ability to process sensor data and make tactical decisions faster. Autonomous systems for damage control can respond to emergencies without putting sailors at risk. Cyber capabilities are increasingly important as ships become more networked. The integration of all these systems presents both opportunities and challenges. Wait - I'm receiving an urgent alert. Pirates have been spotted off the coast! We need to intercept them immediately!",
        options: [
            { text: "Let's go!", next: 'game' }
        ]
    }
];

// Naval knowledge questions for the game
const gameQuestions = [
    {
        question: "What percentage of world trade moves by sea according to the officer?",
        options: ["50%", "75%", "90%", "60%"],
        correctAnswer: 2
    },
    {
        question: "What was mentioned as the most challenging part of naval training?",
        options: ["Physical fitness tests", "Submarine escape training", "Weapons systems training", "Navigation exams"],
        correctAnswer: 1
    },
    {
        question: "What is the typical watch rotation mentioned by the officer?",
        options: ["6 hours on, 6 hours off", "4 hours on, 8 hours off", "8 hours on, 4 hours off", "12 hours on, 12 hours off"],
        correctAnswer: 1
    },
    {
        question: "Which of these was NOT mentioned as a type of naval mission?",
        options: ["Counter-piracy operations", "Humanitarian assistance", "Nuclear deterrence patrols", "Freedom of navigation operations"],
        correctAnswer: 2
    },
    {
        question: "According to the officer, what is one of the hardest challenges naval officers face?",
        options: ["Technical complexity of equipment", "Being away from family for months", "Physical demands of the job", "Administrative paperwork"],
        correctAnswer: 1
    },
    {
        question: "What specialized area did the officer mention working in?",
        options: ["Engine room", "Combat Information Center", "Medical bay", "Bridge operations"],
        correctAnswer: 1
    },
    {
        question: "Which new technology was NOT mentioned as changing naval operations?",
        options: ["Unmanned vessels", "Directed energy weapons", "Quantum navigation", "Autonomous damage control systems"],
        correctAnswer: 2
    },
    {
        question: "What was mentioned as a benefit of naval officer experience in civilian careers?",
        options: ["Technical skills", "Leadership experience", "International connections", "Both A and B"],
        correctAnswer: 3
    },
    {
        question: "How far can modern naval radar systems track targets according to the officer?",
        options: ["Over 50 kilometers", "Over 100 kilometers", "Over 200 kilometers", "Over 500 kilometers"],
        correctAnswer: 1
    },
    {
        question: "In which strait did the officer mention conducting counter-piracy operations?",
        options: ["Strait of Gibraltar", "Strait of Hormuz", "Strait of Malacca", "Bering Strait"],
        correctAnswer: 2
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

// Achievement titles based on final score
const achievements = [
    { minScore: 10000, title: "Fleet Admiral", description: "You've demonstrated exceptional naval knowledge and combat prowess." },
    { minScore: 8000, title: "Rear Admiral", description: "Your command abilities and naval expertise are impressive." },
    { minScore: 6000, title: "Ship Captain", description: "You've shown the leadership skills needed to command a vessel." },
    { minScore: 4000, title: "Lieutenant Commander", description: "Your naval skills are developing well, showing promise for future command." },
    { minScore: 2000, title: "Lieutenant", description: "You're building solid naval knowledge and tactical skills." },
    { minScore: 0, title: "Ensign", description: "You've begun your naval journey with determination." }
];

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

// Create the quiz overlay for in-game questions
function createQuizOverlay() {
    // Create overlay if it doesn't exist
    if (!document.getElementById('quiz-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'quiz-overlay';
        overlay.style.position = 'absolute';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.backgroundColor = '#193a61';
        overlay.style.padding = '20px';
        overlay.style.borderRadius = '10px';
        overlay.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '100';
        overlay.style.width = '80%';
        overlay.style.maxWidth = '600px';
        overlay.style.textAlign = 'center';
        overlay.style.color = 'white';
        
        const gameSection = document.getElementById('game-section');
        gameSection.style.position = 'relative';
        gameSection.appendChild(overlay);
    }
    
    return document.getElementById('quiz-overlay');
}

// Display a naval knowledge question during gameplay
function showGameQuestion() {
    if (gameState.game.questionsAnswered >= gameQuestions.length) {
        return; // All questions have been asked
    }
    
    // Select a question that hasn't been asked
    gameState.game.currentQuestion++;
    if (gameState.game.currentQuestion >= gameQuestions.length) {
        gameState.game.currentQuestion = 0;
    }
    
    const question = gameQuestions[gameState.game.currentQuestion];
    gameState.game.questionActive = true;
    
    // Create and populate the overlay
    const overlay = createQuizOverlay();
    overlay.innerHTML = `
        <h3>Naval Knowledge Check</h3>
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
                // Correct answer
                gameState.game.score += 100;
                overlay.innerHTML = `
                    <h3>Correct!</h3>
                    <p>+100 points</p>
                    <button id="continue-game" class="btn" style="margin-top: 15px;">Continue Mission</button>
                `;
            } else {
                // Wrong answer
                gameState.game.score = Math.max(0, gameState.game.score - 100);
                overlay.innerHTML = `
                    <h3>Incorrect</h3>
                    <p>-100 points</p>
                    <p>The correct answer was: ${question.options[question.correctAnswer]}</p>
                    <button id="continue-game" class="btn" style="margin-top: 15px;">Continue Mission</button>
                `;
            }
            
            // Update the score display
            document.getElementById('game-score').textContent = gameState.game.score;
            
            // Continue button
            document.getElementById('continue-game').addEventListener('click', function() {
                overlay.style.display = 'none';
                gameState.game.questionActive = false;
                gameState.game.questionsAnswered++;
                
                // Check if game is complete (all questions answered and score target reached)
                if (gameState.game.questionsAnswered >= gameQuestions.length && gameState.game.score >= 10000) {
                    gameState.game.gameOver = true;
                    showCeremony();
                }
            });
        });
    });
    
    overlay.style.display = 'block';
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
    game.questionActive = false;
    game.currentQuestion = -1;
    game.questionsAnswered = 0;
    game.gameStartTime = Date.now();
    
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
            } else if (game.score >= 10000 && game.questionsAnswered >= gameQuestions.length) {
                gameMessage.textContent = 'Mission Complete! You\'ve achieved the rank of Fleet Admiral!';
                setTimeout(() => {
                    showCeremony();
                }, 2000);
            } else {
                gameMessage.textContent = 'Mission Successful! Pirates defeated!';
            }
            return;
        }
        
        // Only update game if no question is active
        if (!game.questionActive) {
            updateGame();
            
            // Check if it's time to show a question (every 60 seconds or after scoring 1000 points since last question)
            const currentTime = Date.now();
            const timeSinceStart = currentTime - game.gameStartTime;
            const scoreCheckpoint = Math.floor(game.score / 1000);
            
            if ((timeSinceStart > 60000 * (game.questionsAnswered + 1) || 
                 scoreCheckpoint > game.questionsAnswered) && 
                game.questionsAnswered < gameQuestions.length) {
                showGameQuestion();
            }
        }
        
        drawGame(ctx, canvas);
        
        // Check if game is won (score target reached and all questions answered)
        if (game.score >= 10000 && game.questionsAnswered >= gameQuestions.length) {
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
        document.removeEventListener('keydown', keyDownHandler);
        document.removeEventListener('keyup', keyUpHandler);
        canvas.removeEventListener('click', fireHandler);
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
        if (game.questionActive) return; // Disable controls during questions
        
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            game.rightPressed = true;
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            game.leftPressed = true;
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            fireBullet();
        }
    }
    
    function keyUpHandler(e) {
        if (game.questionActive) return;
        
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            game.rightPressed = false;
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            game.leftPressed = false;
        }
    }
    
    function fireHandler(e) {
        if (game.questionActive) return;
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
    if (currentTime - game.lastPirateTime > 1500) { // Spawn every 1.5 seconds
        game.pirates.push({
            x: Math.random() * (700 - 40),
            y: -40,
            width: 40,
            height: 30,
            speed: 1 + Math.random() * 2,
            value: Math.ceil(Math.random() * 10) * 10 // Random point value 10-100
        });
        game.lastPirateTime = currentTime;
    }
    
    // Spawn mines
    if (currentTime - game.lastMineTime > 4000) { // Spawn every 4 seconds
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
                game.score += game.pirates[j].value;
                game.bullets.splice(i, 1);
                game.pirates.splice(j, 1);
                i--;
                break;
            }
        }
    }
    
    // Check for bullet-mine collisions
    for (let i = 0; i < game.bullets.length; i++) {
        for (let j = 0; j < game.mines.length; j++) {
            if (checkCollision(game.bullets[i], game.mines[j])) {
                // Exploding mines give points but remove the bullet
                game.score += 50;
                game.bullets.splice(i, 1);
                game.mines.splice(j, 1);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (ocean with wave effect)
    ctx.fillStyle = '#0a3b66';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some wave patterns
    ctx.fillStyle = '#0c4980';
    const

