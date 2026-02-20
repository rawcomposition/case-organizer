export async function playTadaSound() {
  try {
    const ctx = new (window.AudioContext ?? (window as any).webkitAudioContext)();
    await ctx.resume();

    const notes = [
      { freq: 523.25, start: 0, duration: 0.15 },
      { freq: 659.25, start: 0.13, duration: 0.15 },
      { freq: 783.99, start: 0.26, duration: 0.15 },
      { freq: 1046.5, start: 0.38, duration: 0.45 },
    ];

    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.value = note.freq;

      gain.gain.setValueAtTime(0.45, ctx.currentTime + note.start);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + note.start + note.duration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.start);
      osc.stop(ctx.currentTime + note.start + note.duration);
    }

    setTimeout(() => ctx.close(), 1500);
  } catch (e) {
    console.error("playTadaSound failed:", e);
  }
}
