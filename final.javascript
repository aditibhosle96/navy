// =============================================
// CONSTANTS AND CONFIGURATION
// =============================================
const GAME_CONFIG = {
  CANVAS_WIDTH: 700,
  CANVAS_HEIGHT: 500,
  FPS: 60,
  EDUCATIONAL_POPUP_DURATION: 5000,
  EDUCATIONAL_POPUP_INTERVAL: 60000,
  QUESTION_INTERVAL: 45000,
  SCORE_CHECKPOINT: 800
};

const SHIP_CONFIG = {
  WIDTH: 80,
  HEIGHT: 50,
  SPEED: 5,
  ENHANCED_SPEED: 6
};

const BULLET_CONFIG = {
  WIDTH: 4,
  HEIGHT: 10,
  SPEED: 7,
  MAX_BULLETS: 5
};

const ENEMY_CONFIG = {
  PIRATE_WIDTH: 40,
  PIRATE_HEIGHT: 30,
  PIRATE_SPAWN_INTERVAL: 2000,
  ENHANCED_PIRATE_SPAWN_INTERVAL: 1500,
  MINE_WIDTH: 30,
  MINE_HEIGHT: 30,
  MINE_SPAWN_INTERVAL: 5000
};

const SCORE_CONFIG = {
  PIRATE_SCORE: 5,
  MINE_SCORE: 10,
  SCREEN_CLEAR_BONUS: 10,
  QUESTION_CORRECT_BASE: 100,
  QUESTION_CORRECT_MULTIPLIER: 20,
  QUESTION_INCORRECT_PENALTY: 50
};

const DAMAGE_CONFIG = {
  PIRATE_PASS_DAMAGE: 5,
  PIRATE_COLLISION_DAMAGE: 10,
  MINE_COLLISION_DAMAGE: 20,
  OFFICER_HIT_THRESHOLD: 70
};

// =============================================
// GAME STATE
// =============================================
const gameState = {
  currentSection: 'welcome-screen',
  quizAnswers: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  quizResult: '',
  selectedCharacter: '',
  dialogueStage: 0,
  characterName: '',
  characterGender: '',
  promotionStage: 0,
  game: {
    shipX: 350,
    shipY: 400,
    shipWidth: SHIP_CONFIG.WIDTH,
    shipHeight: SHIP_CONFIG.HEIGHT,
    speed: SHIP_CONFIG.SPEED,
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
    officerAlive: true,
    isGuiding: true,
    questionActive: false,
    currentQuestion: -1,
    questionsAnswered: 0,
    gameStartTime: 0,
    questionsToAsk: [],
    totalQuestionsNeeded: 10
  }
};

// =============================================
// DOM ELEMENTS
// =============================================
const sections = {
  welcomeScreen: document.getElementById('welcome-screen'),
  quizSection: document.getElementById('quiz-section'),
  quizResults: document.getElementById('quiz-results'),
  characterSelection: document.getElementById('character-selection'),
  storySection: document.getElementById('story-section'),
  gameSection: document.getElementById('game-section')
};

// =============================================
// EDUCATIONAL CONTENT
// =============================================
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

// =============================================
// ACHIEVEMENT SYSTEM
// =============================================
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
    }, GAME_CONFIG.EDUCATIONAL_POPUP_DURATION);
  }
};

// =============================================
// QUIZ AND CAREER PATHS
// =============================================
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

// Career positions for different paths
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

// =============================================
// NAVAL QUESTIONS
// =============================================
const gameQuestions = [
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

// =============================================
// DIALOGUE CONTENT
// =============================================
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

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Show a specific section and hide others
function showSection(sectionId) {
  Object.values(sections).forEach(section => {
    if (section) section.style.display = 'none';
  });

  if (sections[sectionId]) {
    sections[sectionId].style.display = 'block';
    gameState.currentSection = sectionId;
  }
}

// Fisher-Yates shuffle algorithm for randomizing questions
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Display educational popup
function showEducationalPopup() {
  if (gameState.game.gameOver) return;
  
  // Select a random category
  const categories = Object.keys(navyEducationalContent);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  // Select a random fact from that category
  const facts = navyEducationalContent[randomCategory];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  
  // Create and display the popup
  const popup = document.createElement('div');
  popup.className = 'educational-popup';
  popup.innerHTML = `
    <div class="popup-content">
      <h3>Navy Fact</h3>
      <p>${randomFact}</p>
    </div>
  `;
  
  document.getElementById('game-section').appendChild(popup);
  
  // Remove popup after the specified duration
  setTimeout(() => {
    if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  }, GAME_CONFIG.EDUCATIONAL_POPUP_DURATION);
}

// Display a question during gameplay
function showGameQuestion() {
  if (gameState.game.gameOver || gameState.game.questionActive) return;
  
  // Get a question from the shuffled list
  if (gameState.game.questionsToAsk.length === 0) {
    gameState.game.questionsToAsk = shuffleArray([...gameQuestions]);
  }
  
  gameState.game.currentQuestion = gameState.game.questionsToAsk.pop();
  gameState.game.questionActive = true;
  
  // Pause game
  const previousSpeed = gameState.game.speed;
  gameState.game.speed = 0;
  
  // Create question UI
  const questionContainer = document.createElement('div');
  questionContainer.className = 'game-question-container';
  questionContainer.innerHTML = `
    <div class="game-question">
      <h3>${gameState.game.currentQuestion.question}</h3>
      <div class="options">
        ${gameState.game.currentQuestion.options.map((option, index) => 
          `<button class="option-btn" data-index="${index}">${option}</button>`
        ).join('')}
      </div>
    </div>
  `;
  
  document.getElementById('game-section').appendChild(questionContainer);
  
  // Add event listeners to options
  const optionButtons = questionContainer.querySelectorAll('.option-btn');
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedIndex = parseInt(button.getAttribute('data-index'));
      const isCorrect = selectedIndex === gameState.game.currentQuestion.correctAnswer;
      
      // Update score based on answer
      if (isCorrect) {
        const bonus = SCORE_CONFIG.QUESTION_CORRECT_BASE + 
                     (SCORE_CONFIG.QUESTION_CORRECT_MULTIPLIER * gameState.game.questionsAnswered);
        gameState.game.score += bonus;
        
        // Show feedback
        button.classList.add('correct');
      } else {
        gameState.game.score = Math.max(0, gameState.game.score - SCORE_CONFIG.QUESTION_INCORRECT_PENALTY);
        button.classList.add('incorrect');
        
        // Show correct answer
        optionButtons[gameState.game.currentQuestion.correctAnswer].classList.add('correct');
      }
      
      // Remove question after a delay
      setTimeout(() => {
        if (questionContainer.parentNode) {
          questionContainer.parentNode.removeChild(questionContainer);
        }
        
        gameState.game.questionActive = false;
        gameState.game.questionsAnswered++;
        gameState.game.speed = previousSpeed;
        
        // Check if we've asked enough questions for promotion
        if (gameState.game.questionsAnswered >= gameState.game.totalQuestionsNeeded && 
            gameState.game.score >= GAME_CONFIG.SCORE_CHECKPOINT) {
          endGame(true);
        }
      }, 2000);
    });
  });
}

// Initialize the game canvas and context
function initGame() {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = GAME_CONFIG.CANVAS_WIDTH;
  canvas.height = GAME_CONFIG.CANVAS_HEIGHT;
  
  // Reset game state
  gameState.game = {
    shipX: canvas.width / 2 - SHIP_CONFIG.WIDTH / 2,
    shipY: canvas.height - SHIP_CONFIG.HEIGHT - 20,
    shipWidth: SHIP_CONFIG.WIDTH,
    shipHeight: SHIP_CONFIG.HEIGHT,
    speed: SHIP_CONFIG.SPEED,
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
    lastEducationalPopupTime: 0,
    lastQuestionTime: 0,
    officerAlive: true,
    isGuiding: true,
    questionActive: false,
    currentQuestion: -1,
    questionsAnswered: 0,
    gameStartTime: Date.now(),
    questionsToAsk: shuffleArray([...gameQuestions]),
    totalQuestionsNeeded: 10
  };
  
  // Load images
  const shipImg = new Image();
  shipImg.src = 'assets/ship.png';
  
  const pirateImg = new Image();
  pirateImg.src = 'assets/pirate.png';
  
  const mineImg = new Image();
  mineImg.src = 'assets/mine.png';
  
  const backgroundImg = new Image();
  backgroundImg.src = 'assets/sea_background.png';
  
  // Set up event listeners for keyboard controls
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);
  
  // Start game loop
  const gameLoop = setInterval(() => {
    if (gameState.game.gameOver) {
      clearInterval(gameLoop);
      return;
    }
    
    update();
    render(ctx, shipImg, pirateImg, mineImg, backgroundImg);
    
    // Check for educational popup timing
    const currentTime = Date.now();
    if (currentTime - gameState.game.lastEducationalPopupTime >= GAME_CONFIG.EDUCATIONAL_POPUP_INTERVAL) {
      showEducationalPopup();
      gameState.game.lastEducationalPopupTime = currentTime;
    }
    
    // Check for question timing
    if (currentTime - gameState.game.lastQuestionTime >= GAME_CONFIG.QUESTION_INTERVAL && 
        !gameState.game.questionActive && 
        gameState.game.questionsAnswered < gameState.game.totalQuestionsNeeded) {
      showGameQuestion();
      gameState.game.lastQuestionTime = currentTime;
    }
    
    // Check for achievements
    const achievement = achievementSystem.checkAchievement(gameState.game.score);
    if (achievement) {
      achievementSystem.displayAchievement(achievement);
    }
    
  }, 1000 / GAME_CONFIG.FPS);
}

// Handle keydown events
function keyDownHandler(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    gameState.game.leftPressed = true;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    gameState.game.rightPressed = true;
  } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
    fireBullet();
  }
}

// Handle keyup events
function keyUpHandler(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    gameState.game.leftPressed = false;
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    gameState.game.rightPressed = false;
  }
}

// Fire a bullet from the ship
function fireBullet() {
  if (gameState.game.bullets.length < BULLET_CONFIG.MAX_BULLETS) {
    gameState.game.bullets.push({
      x: gameState.game.shipX + gameState.game.shipWidth / 2 - BULLET_CONFIG.WIDTH / 2,
      y: gameState.game.shipY,
      width: BULLET_CONFIG.WIDTH,
      height: BULLET_CONFIG.HEIGHT
    });
  }
}

// Spawn a pirate ship
function spawnPirate() {
  const currentTime = Date.now();
  const spawnInterval = gameState.game.score > GAME_CONFIG.SCORE_CHECKPOINT ? 
                       ENEMY_CONFIG.ENHANCED_PIRATE_SPAWN_INTERVAL : 
                       ENEMY_CONFIG.PIRATE_SPAWN_INTERVAL;
                       
  if (currentTime - gameState.game.lastPirateTime > spawnInterval) {
    gameState.game.pirates.push({
      x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - ENEMY_CONFIG.PIRATE_WIDTH),
      y: -ENEMY_CONFIG.PIRATE_HEIGHT,
      width: ENEMY_CONFIG.PIRATE_WIDTH,
      height: ENEMY_CONFIG.PIRATE_HEIGHT,
      speed: 2 + Math.random() * 1.5
    });
    
    gameState.game.lastPirateTime = currentTime;
  }
}

// Spawn a mine
function spawnMine() {
  const currentTime = Date.now();
  if (currentTime - gameState.game.lastMineTime > ENEMY_CONFIG.MINE_SPAWN_INTERVAL) {
    gameState.game.mines.push({
      x: Math.random() * (GAME_CONFIG.CANVAS_WIDTH - ENEMY_CONFIG.MINE_WIDTH),
      y: -ENEMY_CONFIG.MINE_HEIGHT,
      width: ENEMY_CONFIG.MINE_WIDTH,
      height: ENEMY_CONFIG.MINE_HEIGHT,
      speed: 1 + Math.random()
    });
    
    gameState.game.lastMineTime = currentTime;
  }
}

// Check for collisions between objects
function checkCollisions() {
  // Check bullet-pirate collisions
  gameState.game.bullets.forEach((bullet, bulletIndex) => {
    gameState.game.pirates.forEach((pirate, pirateIndex) => {
      if (
        bullet.x < pirate.x + pirate.width &&
        bullet.x + bullet.width > pirate.x &&
        bullet.y < pirate.y + pirate.height &&
        bullet.y + bullet.height > pirate.y
      ) {
        // Collision detected, remove both bullet and pirate
        gameState.game.bullets.splice(bulletIndex, 1);
        gameState.game.pirates.splice(pirateIndex, 1);
        gameState.game.score += SCORE_CONFIG.PIRATE_SCORE;
      }
    });
  });
  
  // Check ship-pirate collisions
  gameState.game.pirates.forEach((pirate, pirateIndex) => {
    if (
      gameState.game.shipX < pirate.x + pirate.width &&
      gameState.game.shipX + gameState.game.shipWidth > pirate.x &&
      gameState.game.shipY < pirate.y + pirate.height &&
      gameState.game.shipY + gameState.game.shipHeight > pirate.y
    ) {
      // Collision detected, reduce health and remove pirate
      gameState.game.health -= DAMAGE_CONFIG.PIRATE_COLLISION_DAMAGE;
      gameState.game.pirates.splice(pirateIndex, 1);
      
      if (gameState.game.health <= DAMAGE_CONFIG.OFFICER_HIT_THRESHOLD && 
          gameState.game.officerAlive && 
          !gameState.game.isOfficerHit) {
        gameState.game.isOfficerHit = true;
      }
      
      if (gameState.game.health <= 0) {
        gameState.game.health = 0;
        endGame(false);
      }
    }
  });
  
  // Check ship-mine collisions
  gameState.game.mines.forEach((mine, mineIndex) => {
    if (
      gameState.game.shipX < mine.x + mine.width &&
      gameState.game.shipX + gameState.game.shipWidth > mine.x &&
      gameState.game.shipY < mine.y + mine.height &&
      gameState.game.shipY + gameState.game.shipHeight > mine.y
    ) {
      // Collision detected, reduce health and remove mine
      gameState.game.health -= DAMAGE_CONFIG.MINE_COLLISION_DAMAGE;
      gameState.game.mines.splice(mineIndex, 1);
      
      if (gameState.game.health <= DAMAGE_CONFIG.OFFICER_HIT_THRESHOLD && 
          gameState.game.officerAlive && 
          !gameState.game.isOfficerHit) {
        gameState.game.isOfficerHit = true;
      }
      
      if (gameState.game.health <= 0) {
        gameState.game.health = 0;
        endGame(false);
      }
    }
  });
  
  // Check for pirates that passed the ship
  gameState.game.pirates.forEach((pirate, pirateIndex) => {
    if (pirate.y > GAME_CONFIG.CANVAS_HEIGHT) {
      gameState.game.pirates.splice(pirateIndex, 1);
      gameState.game.health -= DAMAGE_CONFIG.PIRATE_PASS_DAMAGE;
      
      if (gameState.game.health <= 0) {
        gameState.game.health = 0;
        endGame(false);
      }
    }
  });
  
  // Check for mines that passed the ship
  gameState.game.mines.forEach((mine, mineIndex) => {
    if (mine.y > GAME_CONFIG.CANVAS_HEIGHT) {
      gameState.game.mines.splice(mineIndex, 1);
    }
  });
}

// Update game state
function update() {
  // Move ship based on key presses
  if (gameState.game.leftPressed && gameState.game.shipX > 0) {
    gameState.game.shipX -= gameState.game.speed;
  }
  if (gameState.game.rightPressed && gameState.game.shipX < GAME_CONFIG.CANVAS_WIDTH - gameState.game.shipWidth) {
    gameState.game.shipX += gameState.game.speed;
  }
  
  // Move bullets
  gameState.game.bullets.forEach((bullet, index) => {
    bullet.y -= BULLET_CONFIG.SPEED;
    if (bullet.y + bullet.height < 0) {
      gameState.game.bullets.splice(index, 1);
    }
  });
  
  // Move pirates
  gameState.game.pirates.forEach(pirate => {
    pirate.y += pirate.speed;
  });
  
  // Move mines
  gameState.game.mines.forEach(mine => {
    mine.y += mine.speed;
  });
  
  // Spawn new enemies
  spawnPirate();
  spawnMine();
  
  // Check for collisions
  checkCollisions();
  
  // Increase game difficulty based on score
  if (gameState.game.score > GAME_CONFIG.SCORE_CHECKPOINT && gameState.game.speed < SHIP_CONFIG.ENHANCED_SPEED) {
    gameState.game.speed = SHIP_CONFIG.ENHANCED_SPEED;
  }
}

// Render game objects
function render(ctx, shipImg, pirateImg, mineImg, backgroundImg) {
  // Clear canvas
  ctx.clearRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
  
  // Draw background
  ctx.drawImage(backgroundImg, 0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
  
  // Draw ship
  ctx.drawImage(shipImg, gameState.game.shipX, gameState.game.shipY, gameState.game.shipWidth, gameState.game.shipHeight);
  
  // Draw pirates
  gameState.game.pirates.forEach(pirate => {
    ctx.drawImage(pirateImg, pirate.x, pirate.y, pirate.width, pirate.height);
  });
  
  // Draw mines
  gameState.game.mines.forEach(mine => {
    ctx.drawImage(mineImg, mine.x, mine.y, mine.width, mine.height);
  });
  
  // Draw bullets
  ctx.fillStyle = '#FF0000';
  gameState.game.bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
  
  // Draw HUD (Heads-Up Display)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${gameState.game.score}`, 10, 30);
  
  // Draw health bar
  ctx.fillStyle = '#000000';
  ctx.fillRect(GAME_CONFIG.CANVAS_WIDTH - 210, 10, 200, 20);
  
  let healthColor;
  if (gameState.game.health > 70) {
    healthColor = '#00FF00'; // Green
  } else if (gameState.game.health > 30) {
    healthColor = '#FFFF00'; // Yellow
  } else {
    healthColor = '#FF0000'; // Red
  }
  
  ctx.fillStyle = healthColor;
  ctx.fillRect(GAME_CONFIG.CANVAS_WIDTH - 210, 10, gameState.game.health * 2, 20);
  
  ctx.strokeStyle = '#FFFFFF';
  ctx.strokeRect(GAME_CONFIG.CANVAS_WIDTH - 210, 10, 200, 20);
  
  // Draw text
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('Health:', GAME_CONFIG.CANVAS_WIDTH - 290, 25);
  
  // Draw officer hit state if needed
  if (gameState.game.isOfficerHit) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px Arial';
    ctx.fillText('Officer injured! Defend the ship!', GAME_CONFIG.CANVAS_WIDTH / 2 - 150, GAME_CONFIG.CANVAS_HEIGHT / 2);
  }
}

// End the game and show results
function endGame(victory) {
  gameState.game.gameOver = true;
  
  // Create end game overlay
  const overlay = document.createElement('div');
  overlay.className = 'game-over-overlay';
  
  if (victory) {
    // Show promotion dialogue for victory
    overlay.innerHTML = `
      <div class="game-over-content victory">
        <h2>Mission Accomplished!</h2>
        <p>You've successfully defended the ship and protected your crew.</p>
        <p>Final Score: ${gameState.game.score}</p>
        <p>Questions Answered: ${gameState.game.questionsAnswered}</p>
        <button id="continue-btn">Continue</button>
      </div>
    `;
    
    document.getElementById('game-section').appendChild(overlay);
    
    document.getElementById('continue-btn').addEventListener('click', () => {
      overlay.parentNode.removeChild(overlay);
      showPromotionDialogue();
    });
  } else {
    // Show game over for defeat
    overlay.innerHTML = `
      <div class="game-over-content defeat">
        <h2>Mission Failed</h2>
        <p>Your ship has been overwhelmed by pirates.</p>
        <p>Final Score: ${gameState.game.score}</p>
        <button id="retry-btn">Try Again</button>
        <button id="menu-btn">Main Menu</button>
      </div>
    `;
    
    document.getElementById('game-section').appendChild(overlay);
    
    document.getElementById('retry-btn').addEventListener('click', () => {
      overlay.parentNode.removeChild(overlay);
      initGame();
    });
    
    document.getElementById('menu-btn').addEventListener('click', () => {
      overlay.parentNode.removeChild(overlay);
      showSection('welcomeScreen');
    });
  }
}

// Show promotion dialogue after successful game completion
function showPromotionDialogue() {
  showSection('storySection');
  gameState.promotionStage = 0;
  
  const careerData = careerPositions[gameState.quizResult];
  updatePromotionDialogue(careerData);
}

// Update promotion dialogue text
function updatePromotionDialogue(careerData) {
  const dialogueContainer = document.getElementById('dialogue-text');
  const optionsContainer = document.getElementById('dialogue-options');
  
  let dialogueText = promotionDialogues[gameState.promotionStage].text;
  
  // Replace placeholders with actual career data
  dialogueText = dialogueText.replace('%RANK%', careerData.rank);
  dialogueText = dialogueText.replace('%POSITION%', careerData.position);
  dialogueText = dialogueText.replace('%SHIP_CLASS%', careerData.ship);
  
  dialogueContainer.textContent = dialogueText;
  
  // Clear previous options
  optionsContainer.innerHTML = '';
  
  // Add new options
  const options = promotionDialogues[gameState.promotionStage].options;
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'dialogue-option';
    button.textContent = option.text;
    
    button.addEventListener('click', () => {
      if (option.next === 'end') {
        // End of promotion dialogue
        showSection('welcomeScreen');
      } else {
        gameState.promotionStage = option.next;
        updatePromotionDialogue(careerData);
      }
    });
    
    optionsContainer.appendChild(button);
  });
}

// =============================================
// WELCOME SCREEN AND QUIZ FUNCTIONS
// =============================================

// Initialize welcome screen
function initWelcomeScreen() {
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', () => {
    showSection('quizSection');
    initQuiz();
  });
}

// Initialize the career aptitude quiz
function initQuiz() {
  const quizContainer = document.getElementById('quiz-container');
  const quiz = [
    {
      question: "What aspect of naval service interests you the most?",
      options: [
        "The physical challenge and elite training",
        "Working with advanced technology and weapons systems",
        "Leading teams and strategic planning",
        "Solving technical problems and engineering"
      ]
    },
    {
      question: "How do you typically approach challenges?",
      options: [
        "Head-on with physical prowess and determination",
        "Analyzing the situation and finding tactical advantages",
        "Organizing a team and delegating tasks efficiently",
        "Breaking down the problem and finding technical solutions"
      ]
    },
    {
      question: "What would you most enjoy doing in your free time?",
      options: [
        "Physical training or extreme sports",
        "Simulations or strategic games",
        "Team sports or social activities",
        "Building or fixing things"
      ]
    },
    {
      question: "In an emergency situation, what would be your first instinct?",
      options: [
        "Take immediate action to resolve the threat",
        "Assess the situation and identify key threats",
        "Ensure everyone knows their role and coordinates the response",
        "Identify the cause of the problem and how to fix it"
      ]
    },
    {
      question: "Which skill would you most want to develop in the Navy?",
      options: [
        "Combat and survival skills",
        "Technical expertise with advanced systems",
        "Leadership and strategic thinking",
        "Engineering and problem-solving abilities"
      ]
    }
  ];
  
  // Build quiz HTML
  let quizHTML = '';
  quiz.forEach((q, index) => {
    quizHTML += `
      <div class="quiz-question" id="question-${index + 1}">
        <h3>Question ${index + 1}: ${q.question}</h3>
        <div class="options">
          ${q.options.map((option, optIndex) => `
            <div class="option">
              <input type="radio" name="q${index + 1}" id="q${index + 1}o${optIndex + 1}" value="${optIndex + 1}">
              <label for="q${index + 1}o${optIndex + 1}">${option}</label>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });
  
  quizHTML += `<button id="submit-quiz" class="btn">Submit</button>`;
  quizContainer.innerHTML = quizHTML;
  
  // Add submit event listener
  document.getElementById('submit-quiz').addEventListener('click', () => {
    // Collect answers
    let answers = {};
    let allAnswered = true;
    
    for (let i = 1; i <= quiz.length; i++) {
      const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
      if (selectedOption) {
        answers[i] = parseInt(selectedOption.value);
      } else {
        allAnswered = false;
        alert(`Please answer question ${i}`);
        break;
      }
    }
    
    if (allAnswered) {
      gameState.quizAnswers = answers;
      evaluateQuiz();
    }
  });
}

// Evaluate quiz results
function evaluateQuiz() {
  // Count answers for each path
  let pathScores = { path1: 0, path2: 0, path3: 0, path4: 0 };
  
  Object.values(gameState.quizAnswers).forEach(answer => {
    switch (answer) {
      case 1:
        pathScores.path1++;
        break;
      case 2:
        pathScores.path2++;
        break;
      case 3:
        pathScores.path3++;
        break;
      case 4:
        pathScores.path4++;
        break;
    }
  });
  
  // Find the highest score
  let maxScore = 0;
  let result = '';
  
  Object.entries(pathScores).forEach(([path, score]) => {
    if (score > maxScore) {
      maxScore = score;
      result = path;
    }
  });
  
  gameState.quizResult = result;
  showQuizResults();
}

// Show quiz results
function showQuizResults() {
  showSection('quizResults');
  
  const resultContainer = document.getElementById('quiz-result-container');
  const career = careerPaths[gameState.quizResult];
  
  resultContainer.innerHTML = `
    <div class="result-card">
      <div class="result-emoji">${career.emoji}</div>
      <h2>${career.title}</h2>
      <p>${career.description}</p>
      <button id="continue-after-quiz" class="btn">Continue</button>
    </div>
  `;
  
  document.getElementById('continue-after-quiz').addEventListener('click', () => {
    showSection('characterSelection');
    initCharacterSelection();
  });
}

// Initialize character selection
function initCharacterSelection() {
  const maleButton = document.getElementById('select-male');
  const femaleButton = document.getElementById('select-female');
  
  maleButton.addEventListener('click', () => {
    gameState.characterGender = 'male';
    gameState.characterName = 'Commander Lim';
    startStory();
  });
  
  femaleButton.addEventListener('click', () => {
    gameState.characterGender = 'female';
    gameState.characterName = 'Commander Tan';
    startStory();
  });
}

// Start story with selected character
function startStory() {
  showSection('storySection');
  gameState.dialogueStage = 0;
  updateDialogue();
}

// Update dialogue in the story section
function updateDialogue() {
  const dialogueContainer = document.getElementById('dialogue-text');
  const optionsContainer = document.getElementById('dialogue-options');
  const characterImage = document.getElementById('character-image');
  const characterNameElement = document.getElementById('character-name');
  
  // Set character info
  characterImage.src = `assets/${gameState.characterGender}.png`;
  characterNameElement.textContent = gameState.characterName;
  
  // Set dialogue text
  dialogueContainer.textContent = dialogues[gameState.dialogueStage].text;
  
  // Clear previous options
  optionsContainer.innerHTML = '';
  
  // Add new options
  const options = dialogues[gameState.dialogueStage].options;
  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'dialogue-option';
    button.textContent = option.text;
    
    button.addEventListener('click', () => {
      if (option.next === 'game') {
        // Start the game
        showSection('gameSection');
        initGame();
      } else {
        gameState.dialogueStage = option.next;
        updateDialogue();
      }
    });
    
    optionsContainer.appendChild(button);
  });
}

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initWelcomeScreen();
  showSection('welcomeScreen');
});
