// LingoDungeon — Spanish dungeon levels.
// TILE constants: FLOOR=0, WALL=1, DOOR_C=2, DOOR_O=3, CHEST_C=4, CHEST_O=5, STAIRS=6, RUG=7

export const LEVELS = [
  {
    "id": 0,
    "name": "The Gatehouse of First Words",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        2,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        4,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "6,3": {
        "type": "door",
        "challengeId": 0
      },
      "3,6": {
        "type": "door",
        "challengeId": 1
      },
      "11,6": {
        "type": "door",
        "challengeId": 2
      },
      "10,4": {
        "type": "chest",
        "challengeId": 3
      }
    },
    "npcs": [
      {
        "id": "guard",
        "col": 2,
        "row": 9,
        "color": "#777",
        "label": "G",
        "name": "Guard",
        "dialogue": [
          "Welcome to the Gatehouse. The doors here do not open for strength, only basic manners.",
          "First survival words: gracias, buenos dias, and Como te llamas?",
          "The chests are not friendly, but they respect clear Spanish. That is more than I can say for most furniture."
        ]
      },
      {
        "id": "sage",
        "col": 12,
        "row": 9,
        "color": "#aaa",
        "label": "S",
        "name": "Sage",
        "dialogue": [
          "This first floor teaches greetings and tiny descriptive sentences.",
          "Remember: el gato es pequeno means the cat is small. The dungeon has no cat. The dungeon has standards.",
          "Open every door and chest, then the stairs will stop pretending to be decorative."
        ]
      },
      {
        "id": "mystery",
        "col": 7,
        "row": 2,
        "color": "#ccc",
        "label": "?",
        "name": "Stranger",
        "dialogue": [
          "I came here to learn Spanish and was immediately judged by a door.",
          "Tip from a nervous stranger: read the whole sentence before choosing. The dungeon likes obvious traps.",
          "If a chest whispers, answer calmly. Whispering furniture feeds on panic."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "The door clears its throat.\n\"Como te llamas?\" means...",
        "choices": [
          "What time is it?",
          "What is your name?",
          "Where are you going?",
          "How old are you?"
        ],
        "answer": 1,
        "hint": "Think about asking someone's name.",
        "reward": "Correcto. The door is satisfied and only slightly dramatic. 'Como te llamas?' means 'What is your name?'"
      },
      {
        "prompt": "A polite-looking door asks:\nHow do you say 'Thank you' in Spanish?",
        "choices": [
          "Por favor",
          "De nada",
          "Gracias",
          "Perdon"
        ],
        "answer": 2,
        "hint": "The Sage already handed you this one like a cheat sheet.",
        "reward": "Muy bien. 'Gracias' means thank you, and the door opens like it has been waiting all day for basic manners."
      },
      {
        "prompt": "The rune panel flickers:\nWhat does 'Buenos dias' mean?",
        "choices": [
          "Good night",
          "Good afternoon",
          "Goodbye",
          "Good morning"
        ],
        "answer": 3,
        "hint": "Dias is related to day.",
        "reward": "Excelente. 'Buenos dias' means good morning. The rune panel glows like it just had coffee."
      },
      {
        "prompt": "The chest whispers:\nTranslate: 'The cat is small.'",
        "choices": [
          "El perro es grande.",
          "El gato es pequeno.",
          "La casa es bonita.",
          "El libro es nuevo."
        ],
        "answer": 1,
        "hint": "Gato means cat. Pequeno means small.",
        "reward": "Perfecto. 'El gato es pequeno.' The chest pops open like it was rooting for the cat the whole time."
      }
    ]
  },
  {
    "id": 1,
    "name": "The Scholar's Candle Maze",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        4,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        0,
        1,
        4,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "8,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,6": {
        "type": "door",
        "challengeId": 2
      },
      "7,6": {
        "type": "door",
        "challengeId": 3
      },
      "12,6": {
        "type": "door",
        "challengeId": 4
      },
      "12,4": {
        "type": "chest",
        "challengeId": 0
      },
      "6,10": {
        "type": "chest",
        "challengeId": 2
      }
    },
    "npcs": [
      {
        "id": "scholar",
        "col": 2,
        "row": 9,
        "color": "#ddd",
        "label": "T",
        "name": "Teacher",
        "dialogue": [
          "Welcome to the candle maze, where sentence fragments go to become useful.",
          "Quiero comer means I want to eat. Tengo hambre means I am hungry. Both are valid dungeon feelings.",
          "Look for full phrases, not lonely words. Lonely words get lost in corridors."
        ]
      },
      {
        "id": "librarian",
        "col": 12,
        "row": 9,
        "color": "#999",
        "label": "L",
        "name": "Librarian",
        "dialogue": [
          "The maze shelves are arranged by grammar, then by dramatic inconvenience.",
          "Ella esta leyendo un libro: she is reading a book. Present action, right now.",
          "Nosotros estamos contentos means we are happy. The maze is not, but that is its problem."
        ]
      },
      {
        "id": "ghost",
        "col": 7,
        "row": 1,
        "color": "#fff",
        "label": "G",
        "name": "Ghost",
        "dialogue": [
          "Boo. Also: voy means I go. Very important for fleeing ghosts politely.",
          "Yo voy a la escuela means I go to school. I went once. Haunting was cheaper.",
          "The doors love subject pronouns. Humor them."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "Translate:\n'I want to eat.'",
        "choices": [
          "Yo quiero dormir.",
          "Quiero comer.",
          "Ella quiere bailar.",
          "Nosotros queremos jugar."
        ],
        "answer": 1,
        "hint": "Quiero is 'I want.' Comer is 'to eat.'",
        "reward": "Excelente. 'Quiero comer.' The door swings open like it, too, missed lunch."
      },
      {
        "prompt": "Translate:\n'She is reading a book.'",
        "choices": [
          "Ella es bonita.",
          "El esta comiendo.",
          "Ella esta leyendo un libro.",
          "Nosotros leemos mucho."
        ],
        "answer": 2,
        "hint": "Ella is she. Esta leyendo is is reading.",
        "reward": "Muy bien. 'Ella esta leyendo un libro.' The lock clicks with librarian-level approval."
      },
      {
        "prompt": "Translate:\n'We are happy.'",
        "choices": [
          "Ellos son felices.",
          "Nosotros estamos contentos.",
          "Yo estoy triste.",
          "Tu estas bien."
        ],
        "answer": 1,
        "hint": "Nosotros means we. Estamos is we are for a state.",
        "reward": "Correcto. 'Nosotros estamos contentos.' The maze hates joy, but grammar won."
      },
      {
        "prompt": "What does 'Tengo hambre' mean?",
        "choices": [
          "I am thirsty.",
          "I am tired.",
          "I am hungry.",
          "I have food."
        ],
        "answer": 2,
        "hint": "Hambre is hunger.",
        "reward": "Perfecto. 'Tengo hambre' means 'I am hungry.' Even the chest seems suddenly snack-aware."
      },
      {
        "prompt": "Choose the correct translation:\n'I go to school.'",
        "choices": [
          "Yo voy al trabajo.",
          "El va a casa.",
          "Yo voy a la escuela.",
          "Nosotros vamos al parque."
        ],
        "answer": 2,
        "hint": "Yo voy is I go. Escuela is school.",
        "reward": "Bien hecho. 'Yo voy a la escuela.' The door opens and pretends it knew that all along."
      }
    ]
  },
  {
    "id": 2,
    "name": "The Conjurer's Verb Keep",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1
      ],
      [
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        4,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        4,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "10,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,5": {
        "type": "door",
        "challengeId": 2
      },
      "8,5": {
        "type": "door",
        "challengeId": 3
      },
      "12,5": {
        "type": "door",
        "challengeId": 4
      },
      "4,10": {
        "type": "door",
        "challengeId": 5
      },
      "8,10": {
        "type": "door",
        "challengeId": 0
      },
      "9,9": {
        "type": "chest",
        "challengeId": 2
      },
      "13,11": {
        "type": "chest",
        "challengeId": 4
      }
    },
    "npcs": [
      {
        "id": "conjurer",
        "col": 2,
        "row": 8,
        "color": "#777",
        "label": "C",
        "name": "Conjurer",
        "dialogue": [
          "This keep studies verbs. The stones conjugate at night. It is unsettling but educational.",
          "Yo hablo, ellos son, tu tienes, nosotros vamos. Four keys for four stubborn locks.",
          "Irregular verbs act royal. Do not bow. Just memorize them."
        ]
      },
      {
        "id": "specter",
        "col": 12,
        "row": 8,
        "color": "#bbb",
        "label": "S",
        "name": "Specter",
        "dialogue": [
          "I was speaking is yo estaba hablando. Past action, ghost-approved.",
          "They had already left is ellos ya se habian ido. Very advanced. Very rude of them.",
          "If a rune asks tense, ask yourself: now, ongoing past, or already completed?"
        ]
      },
      {
        "id": "oracle",
        "col": 7,
        "row": 1,
        "color": "#eee",
        "label": "O",
        "name": "Oracle",
        "dialogue": [
          "The keep tests present, imperfect-progressive, and past perfect phrases.",
          "Do not let long answers scare you. Find the verb spine first.",
          "The final rune respects confidence, but it still checks spelling emotionally."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "Conjugate 'hablar' for yo:",
        "choices": [
          "hablas",
          "habla",
          "hablo",
          "hablamos"
        ],
        "answer": 2,
        "hint": "Drop -ar and add -o for yo.",
        "reward": "Correcto. Yo hablo. The conjurer nods like you finally earned eye contact."
      },
      {
        "prompt": "Conjugate 'ser' for ellos:",
        "choices": [
          "somos",
          "eres",
          "es",
          "son"
        ],
        "answer": 3,
        "hint": "Ellos form ends with -n.",
        "reward": "Excelente. Ellos son. Even the ghost has to admit that one was clean."
      },
      {
        "prompt": "Conjugate 'tener' for tu:",
        "choices": [
          "tengo",
          "tienes",
          "tiene",
          "tenemos"
        ],
        "answer": 1,
        "hint": "Tu tienes.",
        "reward": "Muy bien. Tu tienes. The chest unclenches like a tiny grammar fist."
      },
      {
        "prompt": "Conjugate 'ir' for nosotros:",
        "choices": [
          "voy",
          "van",
          "va",
          "vamos"
        ],
        "answer": 3,
        "hint": "It is the same form people shout before running somewhere.",
        "reward": "Perfecto. Nosotros vamos. The door opens with real field-trip energy."
      },
      {
        "prompt": "Which means 'I was speaking'?",
        "choices": [
          "Yo hable.",
          "Yo estaba hablando.",
          "Yo hablo.",
          "Yo habre hablado."
        ],
        "answer": 1,
        "hint": "Imperfect progressive is estaba plus -ando or -iendo.",
        "reward": "Brillante. 'Yo estaba hablando.' The oracle pretends to be surprised."
      },
      {
        "prompt": "Translate:\n'They had already left.'",
        "choices": [
          "Ellos van a salir.",
          "Ellos salen ahora.",
          "Ellos ya se habian ido.",
          "Ellos salieron ayer."
        ],
        "answer": 2,
        "hint": "Look for habian plus a past participle.",
        "reward": "Maestro. 'Ellos ya se habian ido.' The last rune gives you a deeply annoyed applause."
      }
    ]
  },
  {
    "id": 3,
    "name": "The Vault Market Catacombs",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        4,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        0,
        1,
        4,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "8,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,6": {
        "type": "door",
        "challengeId": 2
      },
      "7,6": {
        "type": "door",
        "challengeId": 3
      },
      "12,6": {
        "type": "door",
        "challengeId": 4
      },
      "12,4": {
        "type": "chest",
        "challengeId": 5
      },
      "6,10": {
        "type": "chest",
        "challengeId": 0
      }
    },
    "npcs": [
      {
        "id": "vendor",
        "col": 2,
        "row": 9,
        "color": "#ddd",
        "label": "V",
        "name": "Vendor",
        "dialogue": [
          "Welcome to the market vaults. Every stall is underground because rent is cursed.",
          "Cuesta cinco dolares means it costs five dollars. Even dungeon apples have pricing.",
          "Quiero una manzana means I want an apple. A brave sentence in a place with no sunlight."
        ]
      },
      {
        "id": "cashier",
        "col": 12,
        "row": 9,
        "color": "#999",
        "label": "C",
        "name": "Cashier",
        "dialogue": [
          "La caja is the cash register. Donde esta la caja? is practical when the shop is also a maze.",
          "Dos cafes means two coffees. The dungeon runs on both of them.",
          "Adjectives often follow nouns: la camisa roja, the red shirt."
        ]
      },
      {
        "id": "shopper",
        "col": 7,
        "row": 1,
        "color": "#fff",
        "label": "S",
        "name": "Shopper",
        "dialogue": [
          "Estoy buscando pan means I am looking for bread. Same, honestly.",
          "The market chests test shopping words, colors, numbers, and useful panic.",
          "If you find bread, tell me. If the bread talks, do not negotiate."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "What does 'Cuesta cinco dolares' mean?",
        "choices": [
          "It weighs five pounds.",
          "It costs five dollars.",
          "I want five dollars.",
          "It closes at five."
        ],
        "answer": 1,
        "hint": "Cuesta is about cost.",
        "reward": "Correcto. It costs five dollars. The shop door respects your budget literacy."
      },
      {
        "prompt": "Translate:\n'I want an apple.'",
        "choices": [
          "Quiero una manzana.",
          "Tengo una manzana.",
          "Necesito arroz.",
          "Vendo una manzana."
        ],
        "answer": 0,
        "hint": "Quiero means I want.",
        "reward": "Excelente. Quiero una manzana. Somewhere, a fruit stand beams with pride."
      },
      {
        "prompt": "Choose the right phrase for 'the red shirt.'",
        "choices": [
          "la camisa roja",
          "el zapato azul",
          "la falda verde",
          "el sombrero negro"
        ],
        "answer": 0,
        "hint": "Camisa is shirt. Roja is red.",
        "reward": "Muy bien. La camisa roja. The chest approves your fashion vocabulary."
      },
      {
        "prompt": "What does 'dos cafes' mean?",
        "choices": [
          "two coffees",
          "two cakes",
          "ten coffees",
          "a coffee table"
        ],
        "answer": 0,
        "hint": "Dos is two.",
        "reward": "Perfecto. Dos cafes. Caffeine remains undefeated."
      },
      {
        "prompt": "Translate:\n'I am looking for bread.'",
        "choices": [
          "Estoy comprando pan.",
          "Estoy buscando pan.",
          "Estoy cocinando pan.",
          "Estoy vendiendo pan."
        ],
        "answer": 1,
        "hint": "Buscar is to look for.",
        "reward": "Bien hecho. Estoy buscando pan. The door opens as if it also wants carbs."
      },
      {
        "prompt": "What does 'Donde esta la caja?' mean?",
        "choices": [
          "Where is the cash register?",
          "How much is the box?",
          "Who has the key?",
          "Where is the market?"
        ],
        "answer": 0,
        "hint": "Caja is cash register here.",
        "reward": "Exacto. 'Where is the cash register?' A very practical survival sentence."
      }
    ]
  },
  {
    "id": 4,
    "name": "The Clocktower of Polite Echoes",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1
      ],
      [
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        4,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        4,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "10,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,5": {
        "type": "door",
        "challengeId": 2
      },
      "8,5": {
        "type": "door",
        "challengeId": 3
      },
      "12,5": {
        "type": "door",
        "challengeId": 4
      },
      "4,10": {
        "type": "door",
        "challengeId": 5
      },
      "8,10": {
        "type": "door",
        "challengeId": 0
      },
      "9,9": {
        "type": "chest",
        "challengeId": 2
      },
      "13,11": {
        "type": "chest",
        "challengeId": 4
      }
    },
    "npcs": [
      {
        "id": "clerk",
        "col": 2,
        "row": 8,
        "color": "#777",
        "label": "K",
        "name": "Clerk",
        "dialogue": [
          "The clocktower teaches time, days, and polite survival phrases.",
          "Son las ocho means it is eight o clock. The bells are thrilled you noticed.",
          "Hoy es martes means today is Tuesday. Ayer fue lunes means yesterday was Monday."
        ]
      },
      {
        "id": "bellkeeper",
        "col": 12,
        "row": 8,
        "color": "#bbb",
        "label": "B",
        "name": "Bellkeeper",
        "dialogue": [
          "Necesito llegar temprano means I need to arrive early. The tower approves punctual dread.",
          "Abren a las nueve means they open at nine. Doors love business hours.",
          "Puede repetir, por favor? is how you ask someone to repeat politely."
        ]
      },
      {
        "id": "watcher",
        "col": 7,
        "row": 1,
        "color": "#eee",
        "label": "W",
        "name": "Watcher",
        "dialogue": [
          "This level is a clock with opinions. Move calmly.",
          "When the Spanish mentions time, look for son las, hoy, ayer, or a las.",
          "The chests are not timed. They only make you feel timed. Different curse."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "What does 'Son las ocho' mean?",
        "choices": [
          "It is eight o'clock.",
          "There are eight doors.",
          "They are eight years old.",
          "It opens at eight."
        ],
        "answer": 0,
        "hint": "Las ocho is the hour.",
        "reward": "Correcto. It is eight o'clock. One bell rings like it really needed this moment."
      },
      {
        "prompt": "Translate:\n'Today is Tuesday.'",
        "choices": [
          "Hoy es martes.",
          "Ayer es martes.",
          "Mañana es martes.",
          "Es lunes hoy."
        ],
        "answer": 0,
        "hint": "Hoy means today. Martes means Tuesday.",
        "reward": "Muy bien. Hoy es martes. The clocktower agrees, possibly too strongly."
      },
      {
        "prompt": "What does 'Necesito llegar temprano' mean?",
        "choices": [
          "I need to arrive early.",
          "I want to leave tomorrow.",
          "I arrived too late.",
          "I need a ticket."
        ],
        "answer": 0,
        "hint": "Llegar is to arrive. Temprano is early.",
        "reward": "Excelente. 'I need to arrive early.' The door nods like a stressed commuter."
      },
      {
        "prompt": "Choose the polite phrase for 'Can you repeat, please?'",
        "choices": [
          "Puede repetir, por favor?",
          "Cuanto cuesta?",
          "Donde esta?",
          "Que hora es?"
        ],
        "answer": 0,
        "hint": "Repeat is repetir.",
        "reward": "Perfecto. Puede repetir, por favor? Even the chest becomes suddenly more courteous."
      },
      {
        "prompt": "Translate:\n'They open at nine.'",
        "choices": [
          "Abren a las nueve.",
          "Cierran a las nueve.",
          "Son las nueve.",
          "Llegan a las nueve."
        ],
        "answer": 0,
        "hint": "Abrir is to open. Abren is they open.",
        "reward": "Bien hecho. Abren a las nueve. The lock respects punctual business hours."
      },
      {
        "prompt": "What does 'Ayer fue lunes' mean?",
        "choices": [
          "Yesterday was Monday.",
          "Tomorrow is Monday.",
          "Monday is busy.",
          "It was one o'clock yesterday."
        ],
        "answer": 0,
        "hint": "Ayer is yesterday.",
        "reward": "Exacto. Yesterday was Monday. The clocktower is thrilled someone remembered the calendar."
      }
    ]
  },
  {
    "id": 5,
    "name": "The Kitchen Catacombs",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        4,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        0,
        1,
        4,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "8,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,6": {
        "type": "door",
        "challengeId": 2
      },
      "7,6": {
        "type": "door",
        "challengeId": 3
      },
      "12,6": {
        "type": "door",
        "challengeId": 4
      },
      "12,4": {
        "type": "chest",
        "challengeId": 5
      },
      "6,10": {
        "type": "chest",
        "challengeId": 1
      }
    },
    "npcs": [
      {
        "id": "chef",
        "col": 2,
        "row": 9,
        "color": "#ddd",
        "label": "H",
        "name": "Chef",
        "dialogue": [
          "Welcome to the kitchen catacombs. The soup is cursed but grammatically correct.",
          "Me gusta el arroz means I like rice. No quiero sopa means I do not want soup.",
          "Food phrases matter. Adventurers who cannot order dinner become cautionary skeletons."
        ]
      },
      {
        "id": "server",
        "col": 12,
        "row": 9,
        "color": "#999",
        "label": "R",
        "name": "Server",
        "dialogue": [
          "Quisiera el menu means I would like the menu. Polite, useful, and slightly fancy.",
          "La cuenta, por favor means the bill, please. Even dungeons close tabs eventually.",
          "El agua esta fria means the water is cold. A chest taught me that and then sneezed frost."
        ]
      },
      {
        "id": "dishghost",
        "col": 7,
        "row": 1,
        "color": "#fff",
        "label": "D",
        "name": "Dish Ghost",
        "dialogue": [
          "Tengo alergia a las nueces means I have an allergy to nuts. Important sentence. Zero jokes.",
          "The kitchen tests likes, dislikes, restaurant manners, and safety.",
          "I haunt plates because nobody rinsed me. Learn from this."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "Translate:\n'I like rice.'",
        "choices": [
          "Me gusta el arroz.",
          "Quiero arroz.",
          "No quiero arroz.",
          "La sopa es fria."
        ],
        "answer": 0,
        "hint": "Me gusta means I like.",
        "reward": "Correcto. Me gusta el arroz. The pantry door softens immediately."
      },
      {
        "prompt": "Translate:\n'I do not want soup.'",
        "choices": [
          "No quiero sopa.",
          "Quiero sopa.",
          "Tengo sopa.",
          "Me gusta sopa."
        ],
        "answer": 0,
        "hint": "No quiero means I do not want.",
        "reward": "Excelente. No quiero sopa. Bold, honest, and grammatically solid."
      },
      {
        "prompt": "What does 'El agua esta fria' mean?",
        "choices": [
          "The water is cold.",
          "The soup is hot.",
          "I want water.",
          "The kitchen is closed."
        ],
        "answer": 0,
        "hint": "Agua is water. Fria is cold.",
        "reward": "Muy bien. The water is cold. The chest opens with refrigerator energy."
      },
      {
        "prompt": "Choose the polite restaurant phrase for 'I would like the menu.'",
        "choices": [
          "Quisiera el menu.",
          "Tengo el menu.",
          "Veo el menu.",
          "Como el menu."
        ],
        "answer": 0,
        "hint": "Quisiera is a polite I would like.",
        "reward": "Perfecto. Quisiera el menu. The dungeon appreciates civil table manners."
      },
      {
        "prompt": "What does 'La cuenta, por favor' mean?",
        "choices": [
          "The soup, please.",
          "The bill, please.",
          "The kitchen, please.",
          "The key, please."
        ],
        "answer": 1,
        "hint": "Cuenta here means the bill or check.",
        "reward": "Bien hecho. 'The bill, please.' Even cursed chefs deserve to be paid."
      },
      {
        "prompt": "Translate:\n'I have an allergy to nuts.'",
        "choices": [
          "Tengo hambre de nueces.",
          "Tengo alergia a las nueces.",
          "Quiero nueces.",
          "No tengo agua."
        ],
        "answer": 1,
        "hint": "Alergia is allergy.",
        "reward": "Exacto. Safety and grammar, an unbeatable combo."
      }
    ]
  },
  {
    "id": 6,
    "name": "The Night School Crypts",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1
      ],
      [
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        4,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        4,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "10,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,5": {
        "type": "door",
        "challengeId": 2
      },
      "8,5": {
        "type": "door",
        "challengeId": 3
      },
      "12,5": {
        "type": "door",
        "challengeId": 4
      },
      "4,10": {
        "type": "door",
        "challengeId": 5
      },
      "8,10": {
        "type": "door",
        "challengeId": 0
      },
      "9,9": {
        "type": "chest",
        "challengeId": 2
      },
      "13,11": {
        "type": "chest",
        "challengeId": 5
      }
    },
    "npcs": [
      {
        "id": "principal",
        "col": 2,
        "row": 8,
        "color": "#777",
        "label": "P",
        "name": "Principal",
        "dialogue": [
          "Night school is in session. The desks are coffins but the lesson plan is solid.",
          "Me despierto a las seis means I wake up at six. A heroic claim in this hallway.",
          "Siempre estudio por la noche means I always study at night. You are doing that now, technically."
        ]
      },
      {
        "id": "janitor",
        "col": 12,
        "row": 8,
        "color": "#bbb",
        "label": "J",
        "name": "Janitor",
        "dialogue": [
          "Despues trabajo means afterward, I work. Then I sweep bats. Then I question my career.",
          "Mi hermana vive en Boston means my sister lives in Boston.",
          "Daily routine phrases are dungeon maps for normal life."
        ]
      },
      {
        "id": "student",
        "col": 7,
        "row": 1,
        "color": "#eee",
        "label": "N",
        "name": "Student",
        "dialogue": [
          "Practicamos espanol todos los dias means we practice Spanish every day.",
          "Ellos comen antes de clase means they eat before class. Wise. Extremely wise.",
          "If a door asks about routine, look for time words: siempre, despues, antes, todos los dias."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "Translate:\n'I wake up at six.'",
        "choices": [
          "Me despierto a las seis.",
          "Me duermo a las seis.",
          "Trabajo a las seis.",
          "Como a las seis."
        ],
        "answer": 0,
        "hint": "Despertarse is to wake up.",
        "reward": "Correcto. Me despierto a las seis. The school bell rings in support."
      },
      {
        "prompt": "What does 'Despues trabajo' mean?",
        "choices": [
          "Afterward, I work.",
          "Then I sleep.",
          "I work before class.",
          "Afterward, we leave."
        ],
        "answer": 0,
        "hint": "Despues means afterward. Trabajo can mean I work.",
        "reward": "Excelente. Afterward, I work. Very adult of you."
      },
      {
        "prompt": "Translate:\n'I always study at night.'",
        "choices": [
          "Siempre estudio por la noche.",
          "Nunca estudio por la noche.",
          "Siempre como por la noche.",
          "Estudio en la mañana."
        ],
        "answer": 0,
        "hint": "Siempre is always. Noche is night.",
        "reward": "Muy bien. Siempre estudio por la noche. The chest respects the grind."
      },
      {
        "prompt": "What does 'Mi hermana vive en Boston' mean?",
        "choices": [
          "My sister lives in Boston.",
          "My brother studies in Boston.",
          "My friend works in Boston.",
          "My sister visits Boston."
        ],
        "answer": 0,
        "hint": "Hermana is sister. Vive is lives.",
        "reward": "Perfecto. Your imaginary sister is doing great."
      },
      {
        "prompt": "Translate:\n'We practice Spanish every day.'",
        "choices": [
          "Nosotros practicamos español cada dia.",
          "Nosotros hablamos ingles cada dia.",
          "Ellos practican español hoy.",
          "Yo practico español cada dia."
        ],
        "answer": 0,
        "hint": "Cada dia means every day.",
        "reward": "Bien hecho. Daily practice wins again. The door can hardly argue with consistency."
      },
      {
        "prompt": "What does 'Ellos comen antes de clase' mean?",
        "choices": [
          "They eat before class.",
          "They study after class.",
          "They leave early.",
          "They open the class."
        ],
        "answer": 0,
        "hint": "Comen is they eat. Antes de is before.",
        "reward": "Exacto. They eat before class. Honestly, wise."
      }
    ]
  },
  {
    "id": 7,
    "name": "The Iron Rail Dungeon",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        4,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        0,
        1,
        4,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "8,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,6": {
        "type": "door",
        "challengeId": 2
      },
      "7,6": {
        "type": "door",
        "challengeId": 3
      },
      "12,6": {
        "type": "door",
        "challengeId": 4
      },
      "12,4": {
        "type": "chest",
        "challengeId": 5
      },
      "6,10": {
        "type": "chest",
        "challengeId": 2
      }
    },
    "npcs": [
      {
        "id": "conductor",
        "col": 2,
        "row": 9,
        "color": "#ddd",
        "label": "C",
        "name": "Conductor",
        "dialogue": [
          "This rail dungeon teaches near future, movement, and directions.",
          "Voy a estudiar manana means I am going to study tomorrow.",
          "Vamos a salir ahora means we are going to leave now. The train loves decisions."
        ]
      },
      {
        "id": "porter",
        "col": 12,
        "row": 9,
        "color": "#999",
        "label": "P",
        "name": "Porter",
        "dialogue": [
          "El tren va al centro means the train goes downtown.",
          "Gira a la derecha means turn right. Sigue todo recto means go straight ahead.",
          "The rails are straight. The grammar is mostly straight. The passengers are not."
        ]
      },
      {
        "id": "passenger",
        "col": 7,
        "row": 1,
        "color": "#fff",
        "label": "T",
        "name": "Passenger",
        "dialogue": [
          "Estamos cerca de la estacion means we are near the station.",
          "Near future uses ir + a + infinitive: voy a estudiar, vamos a salir.",
          "If you miss the train, blame the cursed platform. If you miss the answer, reread the verb."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "Translate:\n'I am going to study tomorrow.'",
        "choices": [
          "Voy a estudiar mañana.",
          "Estudio ayer.",
          "Fui a estudiar hoy.",
          "Voy estudiando ahora."
        ],
        "answer": 0,
        "hint": "Use voy a plus infinitive.",
        "reward": "Correcto. Voy a estudiar mañana. The train schedule approves your planning."
      },
      {
        "prompt": "What does 'Vamos a salir ahora' mean?",
        "choices": [
          "We are going to leave now.",
          "We left yesterday.",
          "They are leaving tomorrow.",
          "We are at the station."
        ],
        "answer": 0,
        "hint": "Vamos a is we are going to.",
        "reward": "Excelente. We are going to leave now. The door slides open like a punctual train."
      },
      {
        "prompt": "Translate:\n'The train goes downtown.'",
        "choices": [
          "El tren va al centro.",
          "El tren viene del centro.",
          "La estación está cerrada.",
          "El tren es rapido."
        ],
        "answer": 0,
        "hint": "Va is goes. Centro is downtown or center.",
        "reward": "Muy bien. El tren va al centro. The chest hums like rails."
      },
      {
        "prompt": "What does 'Gira a la derecha' mean?",
        "choices": [
          "Turn right.",
          "Turn left.",
          "Go straight.",
          "Stop here."
        ],
        "answer": 0,
        "hint": "Derecha is right.",
        "reward": "Perfecto. Turn right. Miraculously, your sense of direction survives."
      },
      {
        "prompt": "Translate:\n'Go straight ahead.'",
        "choices": [
          "Sigue todo recto.",
          "Dobla a la izquierda.",
          "Vuelve mañana.",
          "Sube la escalera."
        ],
        "answer": 0,
        "hint": "Todo recto is straight ahead.",
        "reward": "Bien hecho. Sigue todo recto. For once, the path and the grammar agree."
      },
      {
        "prompt": "What does 'Estamos cerca de la estacion' mean?",
        "choices": [
          "We are near the station.",
          "We are inside the station.",
          "We are late for the station.",
          "We are going to the station."
        ],
        "answer": 0,
        "hint": "Cerca de means near.",
        "reward": "Exacto. We are near the station. The final gate finally stops being weird about it."
      }
    ]
  },
  {
    "id": 8,
    "name": "The Archive of Impossible Forms",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1
      ],
      [
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        4,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        4,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "10,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,5": {
        "type": "door",
        "challengeId": 2
      },
      "8,5": {
        "type": "door",
        "challengeId": 3
      },
      "12,5": {
        "type": "door",
        "challengeId": 4
      },
      "4,10": {
        "type": "door",
        "challengeId": 5
      },
      "8,10": {
        "type": "door",
        "challengeId": 0
      },
      "9,9": {
        "type": "chest",
        "challengeId": 2
      },
      "13,11": {
        "type": "chest",
        "challengeId": 4
      }
    },
    "npcs": [
      {
        "id": "manager",
        "col": 2,
        "row": 8,
        "color": "#777",
        "label": "M",
        "name": "Manager",
        "dialogue": [
          "Welcome to the archive. The forms are impossible, but the preterite is manageable.",
          "Ayer envie el correo means yesterday I sent the email.",
          "Ella hablo con el jefe means she spoke with the boss. Office horror, grammatically clean."
        ]
      },
      {
        "id": "intern",
        "col": 12,
        "row": 8,
        "color": "#bbb",
        "label": "I",
        "name": "Intern",
        "dialogue": [
          "Comimos a las dos means we ate at two. A rare archived lunch success.",
          "Necesite ayuda means I needed help. A powerful phrase in any bureaucracy.",
          "Llegaron tarde means they arrived late. The archive filed a complaint."
        ]
      },
      {
        "id": "copyghost",
        "col": 7,
        "row": 1,
        "color": "#eee",
        "label": "G",
        "name": "Copy Ghost",
        "dialogue": [
          "Termine el informe means I finished the report. This sentence is fantasy content.",
          "This floor focuses on completed past actions. Look for ayer and preterite endings.",
          "The copy machine is haunted by unfinished drafts. Do not make eye contact."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "Translate:\n'Yesterday I sent the email.'",
        "choices": [
          "Ayer envié el correo.",
          "Hoy envio el correo.",
          "Mañana voy a enviar el correo.",
          "Ayer leo el correo."
        ],
        "answer": 0,
        "hint": "Ayer is yesterday. Envié is I sent.",
        "reward": "Correcto. Ayer envié el correo. The office door relaxes one memo at a time."
      },
      {
        "prompt": "What does 'Ella habló con el jefe' mean?",
        "choices": [
          "She spoke with the boss.",
          "She works with the boss.",
          "She speaks about the office.",
          "She called the client."
        ],
        "answer": 0,
        "hint": "Habló is she spoke.",
        "reward": "Excelente. She spoke with the boss. Somehow the chest now looks managerial."
      },
      {
        "prompt": "Translate:\n'We ate at two.'",
        "choices": [
          "Comimos a las dos.",
          "Comemos a las dos.",
          "Comeremos a las dos.",
          "Comía a las dos."
        ],
        "answer": 0,
        "hint": "Comimos is we ate.",
        "reward": "Muy bien. Comimos a las dos. Lunch remains an elite grammar topic."
      },
      {
        "prompt": "What does 'Necesité ayuda' mean?",
        "choices": [
          "I need help.",
          "I needed help.",
          "We needed help.",
          "I found help."
        ],
        "answer": 1,
        "hint": "The accent marks the completed past here.",
        "reward": "Perfecto. I needed help. The form department finds this painfully relatable."
      },
      {
        "prompt": "Translate:\n'They arrived late.'",
        "choices": [
          "Llegan tarde.",
          "Llegaron tarde.",
          "Van a llegar tarde.",
          "Llegaban tarde."
        ],
        "answer": 1,
        "hint": "Llegaron is they arrived.",
        "reward": "Bien hecho. Llegaron tarde. The lock opens ten minutes after the correct answer, out of spite."
      },
      {
        "prompt": "What does 'Terminé el informe' mean?",
        "choices": [
          "I started the report.",
          "I finished the report.",
          "I lost the report.",
          "I printed the report."
        ],
        "answer": 1,
        "hint": "Terminé is I finished.",
        "reward": "Exacto. I finished the report. That may be the most fantasy thing in this whole game."
      }
    ]
  },
  {
    "id": 9,
    "name": "The Palace of Polite Doom",
    "playerStart": {
      "col": 7,
      "row": 10
    },
    "map": [
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        1,
        0,
        2,
        0,
        0,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        1,
        2,
        1,
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        1,
        2,
        1,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1,
        1,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1,
        0,
        1
      ],
      [
        1,
        1,
        1,
        0,
        1,
        0,
        1,
        0,
        1,
        4,
        1,
        0,
        1,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        2,
        0,
        1,
        0,
        2,
        0,
        1,
        0,
        0,
        0,
        1
      ],
      [
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        6,
        0,
        0,
        0,
        0,
        0,
        4,
        1
      ],
      [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ]
    ],
    "locks": {
      "4,3": {
        "type": "door",
        "challengeId": 0
      },
      "10,3": {
        "type": "door",
        "challengeId": 1
      },
      "2,5": {
        "type": "door",
        "challengeId": 2
      },
      "8,5": {
        "type": "door",
        "challengeId": 3
      },
      "12,5": {
        "type": "door",
        "challengeId": 4
      },
      "4,10": {
        "type": "door",
        "challengeId": 5
      },
      "8,10": {
        "type": "door",
        "challengeId": 6
      },
      "9,9": {
        "type": "chest",
        "challengeId": 2
      },
      "13,11": {
        "type": "chest",
        "challengeId": 4
      }
    },
    "npcs": [
      {
        "id": "queen",
        "col": 2,
        "row": 8,
        "color": "#777",
        "label": "Q",
        "name": "Queen",
        "dialogue": [
          "The final palace tests practical Spanish under royal pressure.",
          "Puede ayudarme? means can you help me? Polite panic is still panic.",
          "No entendi la pregunta means I did not understand the question. This is wisdom, not weakness."
        ]
      },
      {
        "id": "advisor",
        "col": 12,
        "row": 8,
        "color": "#bbb",
        "label": "A",
        "name": "Advisor",
        "dialogue": [
          "Ayer fui al banco means yesterday I went to the bank.",
          "Manana vamos a visitar a la familia means tomorrow we are going to visit family.",
          "The palace mixes past, future plans, location, and polite requests. Bring all your keys."
        ]
      },
      {
        "id": "steward",
        "col": 7,
        "row": 1,
        "color": "#eee",
        "label": "S",
        "name": "Steward",
        "dialogue": [
          "La llave esta debajo de la mesa means the key is under the table. Terrible security, excellent vocabulary.",
          "Necesitamos abrir la ultima puerta means we need to open the last door. Very direct. Very useful.",
          "Por favor, hable mas despacio means please speak more slowly. Final boss survival phrase."
        ]
      }
    ],
    "challenges": [
      {
        "prompt": "What does 'Puede ayudarme?' mean?",
        "choices": [
          "Can you help me?",
          "Should I leave?",
          "Do you know her?",
          "Can I pay now?"
        ],
        "answer": 0,
        "hint": "Ayudar is to help.",
        "reward": "Correcto. Can you help me? The palace appreciates civilized panic."
      },
      {
        "prompt": "Translate:\n'Yesterday I went to the bank.'",
        "choices": [
          "Ayer fui al banco.",
          "Hoy voy al banco.",
          "Mañana iré al banco.",
          "Ayer estoy en el banco."
        ],
        "answer": 0,
        "hint": "Fui is I went.",
        "reward": "Excelente. Ayer fui al banco. Even royal paperwork salutes that effort."
      },
      {
        "prompt": "What does 'Mañana vamos a visitar a la familia' mean?",
        "choices": [
          "Tomorrow we are going to visit the family.",
          "Tomorrow the family arrives here.",
          "We visited the family yesterday.",
          "The family lives nearby."
        ],
        "answer": 0,
        "hint": "Vamos a visitar is we are going to visit.",
        "reward": "Muy bien. The future tense train arrives right on time."
      },
      {
        "prompt": "Translate:\n'The key is under the table.'",
        "choices": [
          "La llave está debajo de la mesa.",
          "La llave está sobre la mesa.",
          "La puerta está debajo de la mesa.",
          "La mesa tiene una llave."
        ],
        "answer": 0,
        "hint": "Debajo de means under.",
        "reward": "Perfecto. The key is under the table. Not a great hiding place, honestly."
      },
      {
        "prompt": "What does 'No entendí la pregunta' mean?",
        "choices": [
          "I did not understand the question.",
          "I answered the question.",
          "I repeated the question.",
          "I forgot the key."
        ],
        "answer": 0,
        "hint": "Entendí is I understood. No entendí is I did not understand.",
        "reward": "Bien hecho. Admitting confusion is powerful, and apparently unlocks treasure."
      },
      {
        "prompt": "Translate:\n'We need to open the last door.'",
        "choices": [
          "Necesitamos abrir la última puerta.",
          "Queremos ver la última puerta.",
          "Abrimos la última puerta ayer.",
          "La puerta está cerrada hoy."
        ],
        "answer": 0,
        "hint": "Necesitamos is we need. Abrir is to open.",
        "reward": "Exacto. Necesitamos abrir la última puerta. The final lock finally takes the hint."
      },
      {
        "prompt": "Choose the best translation:\n'Please speak more slowly.'",
        "choices": [
          "Hable más despacio, por favor.",
          "Hablo más despacio, por favor.",
          "Puede repetir ahora.",
          "Voy más despacio mañana."
        ],
        "answer": 0,
        "hint": "A polite command here uses hable.",
        "reward": "Magnífico. 'Please speak more slowly.' A worthy final-floor survival phrase."
      }
    ]
  }
];

export function getLevel(n) {
  return LEVELS[Math.min(Math.max(n - 1, 0), LEVELS.length - 1)];
}

export function getLevelCount() {
  return LEVELS.length;
}

export function getLevelName(n) {
  return getLevel(n).name;
}
