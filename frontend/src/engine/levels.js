// LingoDungeon — Level data ported from lingo_pkmn
// TILE constants: FLOOR=0, WALL=1, DOOR_C=2, DOOR_O=3, CHEST_C=4, CHEST_O=5, STAIRS=6, RUG=7

export const LEVELS = [
  {
    "id": 0,
    "name": "The Entrance Hall",
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
          "Bienvenido, adventurer. I guard this hallway and, sadly, also the curriculum.",
          "Every door in here thinks it is a Spanish professor. None of them are humble about it.",
          "Answer clearly, walk proudly, and ignore any chest that sounds smug.",
          "Buena suerte. If a door judges you, judge it back."
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
          "Quick survival kit: hola means hello. Useful for people, less useful for haunted furniture.",
          "Como te llamas means 'What is your name?' which is a strong first-date opener and a decent dungeon opener.",
          "Gracias is thank you, por favor is please. Manners still work in cursed architecture."
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
          "...",
          "Rojo is red, azul is blue, verde is green.",
          "Remember the colors. The dungeon decor budget was small, but educational."
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
    "name": "The Scholar's Maze",
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
          "Welcome to the Scholar's Maze, where full sentences roam free and absolutely pay no rent.",
          "Quiero means 'I want.' Quiero comer means 'I want to eat.' A noble and relatable sentence.",
          "Tengo hambre means 'I am hungry.' Literally 'I have hunger,' because Spanish likes to keep things interesting.",
          "Think in phrases, not lonely little words. Words need friends."
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
          "Ella is she. El is he. Nosotros is we. Grammar is just naming who caused the chaos.",
          "Use estar for temporary states: estoy, estas, esta. Feelings, locations, and panic all fit nicely.",
          "Ella esta leyendo means 'She is reading.' Present progressive, now with 100% more books."
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
          "Oooooo. I died waiting for someone to learn ir, so please don't waste this haunting.",
          "Yo voy means 'I go.' Voy a la escuela means 'I go to school.'",
          "Ir is irregular: voy, vas, va, vamos, van. It refuses to behave, but at least it is famous."
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
    "name": "The Conjurer's Keep",
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
          "Welcome to the Keep. We conjugate verbs here and absolutely overreact about endings.",
          "Hablar becomes hablo, hablas, habla. Regular -ar verbs are the reliable coworkers of Spanish.",
          "Once you know the pattern, half the dungeon loses its personality."
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
          "Irregular verbs haunt these halls because they refused to be normal in life too.",
          "Ser: soy, eres, es, somos, son. Tener: tengo, tienes, tiene. Ir: voy, vas, va.",
          "Memorize them now and spare yourself future emotional damage."
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
          "Past tense lives upstairs and has strong opinions about timing.",
          "Estaba hablando means 'was speaking.' Habian ido means 'had gone.'",
          "Relax. We are still beginner-friendly, just with mood lighting."
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
    "name": "The Market of Mild Panic",
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
          "Welcome to the market, where everyone talks fast and every tomato has emotional baggage.",
          "Quiero una manzana means 'I want an apple.' Useful if you enjoy buying apples or sounding prepared.",
          "Cuesta means 'it costs.' Numbers suddenly matter a lot when money enters the chat."
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
          "La caja is the register. It is where your coins go to retire.",
          "Dos cafes means two coffees. One for you, one for the version of you who made it this far."
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
          "Estoy buscando pan means 'I am looking for bread.'",
          "This is a market, so obviously nobody has bread where it makes sense."
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
    "name": "The Clocktower of Polite Chaos",
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
          "Time phrases are easy until someone asks them before coffee.",
          "Son las ocho means 'It is eight o'clock.' If it is one o'clock, Spanish gets fancy and says es la una.",
          "Also, please and thank you still work when everyone is panicking."
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
          "Hoy is today, ayer is yesterday, manana is tomorrow. Time is fake, but vocabulary is real.",
          "Puede repetir, por favor? means 'Can you repeat, please?' Use it whenever life becomes too fast."
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
          "Temprano means early. Tarde can mean late or afternoon, because context enjoys drama.",
          "You are doing well. The clocks are just loud about it."
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
          "Welcome to the Kitchen Catacombs, where every skeleton is somehow judging your pronunciation.",
          "Me gusta means 'I like.' Quisiera is a polite 'I would like.'",
          "Learn the food phrases and maybe nobody burns the soup today."
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
          "La cuenta, por favor means 'The bill, please.' Important if you enjoy leaving restaurants legally.",
          "Alergia means allergy. Useful and dramatically non-optional."
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
          "El agua esta fria means 'The water is cold.'",
          "I have haunted worse kitchens, but not by much."
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
    "name": "The Night School Halls",
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
          "Welcome to night school. Everyone is tired, but the verbs are wide awake.",
          "Daily routine phrases are powerful because they show up in real life constantly.",
          "Also, yes, the hallway lockers are quiz-based. Budget cuts."
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
          "Me despierto means 'I wake up.' Trabajo means 'I work.' Estudio means 'I study.'",
          "Learn these and you can narrate a very responsible day."
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
          "Mi hermana vive en Boston. Nosotros practicamos español cada dia.",
          "Useful, normal sentences. A rare luxury in this dungeon."
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
    "name": "The Trainyard of Tenses",
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
          "Future plans in beginner Spanish are easy: ir plus a plus infinitive. No time machine required.",
          "Voy a estudiar means 'I am going to study.' Vamos a salir means 'We are going to leave.'",
          "Directions also matter, unless you enjoy getting lost with confidence."
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
          "Derecha is right. Izquierda is left. Todo recto is straight ahead.",
          "These words save time, stress, and dramatic spinning in place."
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
          "Cerca means near. Estacion means station.",
          "If you can ask where something is and where it is going, you are dangerous in a good way."
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
    "name": "The Office of Impossible Forms",
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
          "Welcome to the office, where forms multiply when frightened.",
          "Today we touch simple past actions. Short, useful, and only a little annoying.",
          "Do not fear the preterite. Fear meetings that should have been emails."
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
          "Envie means I sent. Habló means she spoke. Comimos means we ate.",
          "Tiny endings, huge consequences. Basically office life."
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
          "Necesite ayuda means I needed help. Llegaron tarde means they arrived late.",
          "Honestly, same."
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
          "You made it to the palace. Please stay calm; the carpets are mostly ceremonial menace.",
          "This final floor mixes polite requests, locations, past, future, and surviving one more quiz with dignity.",
          "At this point, the doors are more nervous than you are."
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
          "Puede ayudarme means 'Can you help me?' No entendi la pregunta means 'I did not understand the question.'",
          "Both are excellent palace survival skills."
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
          "Debajo de la mesa means under the table. Mañana vamos a visitar a la familia means we are going to visit the family tomorrow.",
          "If that sentence shows up in a dungeon, just nod and keep moving."
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
