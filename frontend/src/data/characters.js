export const characters = [
  {
    id: 1,
    name: "Iron Fist",
    type: "Fighting",
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
    type: "Speed",
    description: "A lightning-fast athlete with incredible stamina. Excels at speed and endurance challenges.",
    sprites: {
      level1: "/Fsprite1.png",
      level2: "/Fsprite2.png",
      level3: "/Fsprite3.png",
    },
    color: "from-blue-500 to-blue-700",
    borderColor: "border-blue-800"
  }
];

export const getCharacterSprite = (characterName, stats) => {
  const character = characters.find(c => c.name === characterName);
  if (!character) return '';

  const { armStrength, legStrength } = stats;
  if (armStrength > 30 || legStrength > 30) {
    return character.sprites.level3;
  }
  if (armStrength > 20 || legStrength > 20) {
    return character.sprites.level2;
  }
  return character.sprites.level1;
}; 