const ENCOURAGING_MESSAGES = [
  "Case added! You're making real progress — keep it up! ✨",
  "Nice work! Every case you organize is a step forward 🌟",
  "Another one done! You're on a roll today 🚀",
  "Case saved! Your dedication truly makes a difference 💪",
  "Look at you go! One more case, one more win 💚",
  "Logged and organized! You've got this 🌿",
  "Case recorded! Every bit of effort counts — and yours shows ⭐",
  "Great job staying on top of things! Case saved 📋",
  "You're doing amazing work — this case is in good hands 🌈",
  "Case added! Take a moment to appreciate how far you've come 🙌",
  "Saved! Your hard work is paying off — keep going ☀️",
  "Another case organized beautifully! You make it look easy 🏆",
  "Case logged! Staying organized takes real effort — proud of you 📂",
  "Done! Remember to take a breather when you need one ☕",
  "Case created! You're absolutely crushing it today 🎉",
];

export function getRandomEncouragingMessage(): string {
  return ENCOURAGING_MESSAGES[
    Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)
  ];
}
