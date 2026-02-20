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
  "Boom! Another case in the books — you're unstoppable 📖",
  "Case saved! Like a little bird building its nest, one piece at a time 🐦",
  "You're flying through these cases! Keep soaring 🕊️",
  "Organized and done! That's the kind of energy we love 🔥",
  "Case logged! Small steps lead to big accomplishments 👏",
  "Way to go! Your consistency is truly inspiring 💫",
  "Saved! You're building something great, one case at a time 🧱",
  "Case added! Teamwork makes the dream work — and you're a star player ⚡",
  "Another case down! You're like an early bird catching every detail 🐤",
  "Nicely done! Keep that momentum going strong 💛",
  "Case recorded! Precision and care — that's your superpower 🎯",
  "You just keep getting better at this! Case saved 🌻",
  "Case organized! Take pride in the work you're doing 🏅",
  "Logged! Every case you handle makes a real impact 🌍",
];

export function getRandomEncouragingMessage(): string {
  return ENCOURAGING_MESSAGES[
    Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)
  ];
}
