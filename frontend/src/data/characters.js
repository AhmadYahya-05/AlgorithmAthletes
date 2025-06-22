export const characters = [
  {
    id: 1,
    name: "Iron Fist",
    class: "Fighting",
    gender: "male",
    description: "A powerful warrior with unmatched arm strength. Focuses on upper body power and resilience.",
    sprites: {
      level1: "/Msprite1.png",
      level2: "/Msprite2.png",
      level3: "/Msprite3.png",
    },
    thumb: "/Msprite1thumb.png",
    color: "from-red-500 to-red-700",
    borderColor: "border-red-800"
  },
  {
    id: 2,
    name: "Swift Runner",
    class: "Speed",
    gender: "female",
    description: "A lightning-fast athlete with incredible stamina. Excels at speed and endurance challenges.",
    sprites: {
      level1: "/Fsprite1.png",
      level2: "/Fsprite2.png",
      level3: "/Fsprite3.png",
    },
    thumb: "/Fsprite1thumb.png",
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-800"
  },
  {
    id: 3,
    name: "Fox",
    class: "Agility",
    gender: "male",
    description: "A swift and cunning fighter with exceptional agility and quick reflexes.",
    sprites: {
      level1: "/fox.png",
    },
    thumb: "/foxthumb.png",
    color: "from-orange-500 to-orange-700",
    borderColor: "border-orange-800"
  },
  {
    id: 4,
    name: "Fox Pink",
    class: "Agility",
    gender: "female",
    description: "A graceful and agile warrior with pink fur and lightning-fast movements.",
    sprites: {
      level1: "/foxpink.png",
    },
    thumb: "/foxpinkthumb.png",
    color: "from-pink-500 to-pink-700",
    borderColor: "border-pink-800"
  },
  {
    id: 5,
    name: "Gorilla",
    class: "Strength",
    gender: "male",
    description: "A mighty beast with incredible strength and raw power. Dominates in close combat.",
    sprites: {
      level1: "/gorilla.png",
    },
    thumb: "/gorillathumb.png",
    color: "from-gray-600 to-gray-800",
    borderColor: "border-gray-900"
  },
  {
    id: 6,
    name: "Monkey",
    class: "Agility",
    gender: "male",
    description: "A nimble and acrobatic fighter with exceptional balance and dexterity.",
    sprites: {
      level1: "/monkey.png",
    },
    thumb: "/monkeythumb.png",
    color: "from-yellow-500 to-yellow-700",
    borderColor: "border-yellow-800"
  },
  {
    id: 7,
    name: "Rhino",
    class: "Tank",
    gender: "male",
    description: "A massive and unstoppable force with incredible durability and charging power.",
    sprites: {
      level1: "/rhino.png",
    },
    thumb: "/rhinothumb.png",
    color: "from-purple-600 to-purple-800",
    borderColor: "border-purple-900"
  }
];

export const getCharacterSprite = (characterData, statsData) => {
  // If characterData is a string (character name), find the character object
  if (typeof characterData === 'string') {
    characterData = characters.find(c => c.name === characterData);
  }

  if (!characterData) {
    // Return a default sprite if no character is found
    return characters[0].sprites.level1;
  }

  // Use characterStats to determine level
  const { armStrength = 10, legStrength = 10 } = statsData || {};
  
  // Determine level based on the highest stat
  const maxStat = Math.max(armStrength, legStrength);
  
  if (maxStat >= 30) {
    return characterData.sprites.level3;
  }
  if (maxStat >= 20) {
    return characterData.sprites.level2;
  }
  return characterData.sprites.level1;
}; 