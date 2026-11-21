// Tiny WebAudio bleeps — no sound files, nothing fetched. The context is
// created on the first user gesture, so autoplay rules never block play.
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        ctx = null;
      }
    }
    if (ctx && ctx.state === 'suspended') void ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, when = 0) {
    if (muted) return;
    const ac = ensure();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ac.currentTime + when);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime + when);
    osc.stop(ac.currentTime + when + dur);
  }

  return {
    unlock() { ensure(); },
    get muted() { return muted; },
    toggleMute() { muted = !muted; return muted; },
    found() { tone(660, 0.12, 'sine', 0.16); tone(990, 0.16, 'sine', 0.16, 0.09); },
    wrong() { tone(180, 0.18, 'square', 0.08); },
    hint() { tone(520, 0.1, 'sine', 0.1); },
    clear() { tone(523, 0.12, 'sine', 0.15); tone(659, 0.12, 'sine', 0.15, 0.1); tone(784, 0.22, 'sine', 0.15, 0.2); },
    over() { tone(392, 0.2, 'sine', 0.14); tone(311, 0.3, 'sine', 0.14, 0.18); },
    click() { tone(440, 0.06, 'sine', 0.08); },
  };
}
