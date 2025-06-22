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
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-800"
  },
  {
    id: 3,
    name: "Steel Maiden",
    class: "Fighting",
    gender: "female",
    description: "A powerful warrior with unmatched arm strength. Focuses on upper body power and resilience.",
    sprites: {
      level1: "/Fsprite1.png", // Placeholder
      level2: "/Fsprite2.png", // Placeholder
      level3: "/Fsprite3.png", // Placeholder
    },
    color: "from-red-500 to-red-700",
    borderColor: "border-red-800"
  },
  {
    id: 4,
    name: "Swift Strider",
    class: "Speed",
    gender: "male",
    description: "A lightning-fast athlete with incredible stamina. Excels at speed and endurance challenges.",
    sprites: {
      level1: "/Msprite1.png", // Placeholder
      level2: "/Msprite2.png", // Placeholder
      level3: "/Msprite3.png", // Placeholder
    },
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-800"
  }
];

export const getCharacterSprite = (characterData, statsData) => {
  const { class: characterClass = 'Fighting', gender = 'male' } = characterData || {};
  const { level = 1 } = statsData || {};

  const character = characters.find(c => c.class === characterClass && c.gender === gender);

  if (!character) {
    // Return a default sprite if no match is found
    return characters[0].sprites.level1;
  }

  if (level >= 30) {
    return character.sprites.level3;
  }
  if (level >= 15) {
    return character.sprites.level2;
  }
  return character.sprites.level1;
}; 