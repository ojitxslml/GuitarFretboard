export class PitchDetector {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private mediaStream: MediaStream | null = null;
  private isListening = false;
  private readonly AMPLITUDE_THRESHOLD = 0.05;
  private noteHistory: { note: string; timestamp: number }[] = [];
  private readonly HISTORY_TIME_FRAME = 500; // 500 ms
  private lastNoteEmitTime: number = 0;
  private noteEmitInterval: number | null = null;

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
  }

  async start() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const source = this.audioContext.createMediaStreamSource(
        this.mediaStream
      );
      source.connect(this.analyser);
      this.isListening = true;

      // Emitting note in a interval of 500ms
      this.noteEmitInterval = setInterval(() => this.emitNote(), 500);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      throw error;
    }
  }

  stop() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.isListening = false;
    if (this.noteEmitInterval) {
      clearInterval(this.noteEmitInterval);
      this.noteEmitInterval = null;
    }
  }

  private updateNoteHistory(frequency: number) {
    const note = this.frequencyToNoteForGuitar(frequency);
    if (!note) return;

    const currentTime = Date.now();
    this.noteHistory.push({ note, timestamp: currentTime });

    this.noteHistory = this.noteHistory.filter(
      (item) => currentTime - item.timestamp <= this.HISTORY_TIME_FRAME
    );
  }

  private emitNote() {
    const frequency = this.getCurrentFrequency();
    if (frequency && frequency !== -1) {
      this.updateNoteHistory(frequency);
      const prevalentNote = this.getPrevalentNote();
      if (prevalentNote) {
        console.log("Prevalent Note:", prevalentNote);
      }
    }
  }

  getPrevalentNote(): string | null {
    const currentTime = Date.now();

    // Wait the sufficient time before emitting the note
    if (currentTime - this.lastNoteEmitTime < this.HISTORY_TIME_FRAME)
      return null;

    const prevalentNote = this.calculatePrevalentNote();
    this.lastNoteEmitTime = currentTime;

    this.noteHistory = []; // Restart history after emitting
    return prevalentNote;
  }

  private calculatePrevalentNote(): string {
    if (this.noteHistory.length === 0) return "";

    const noteCount: { [key: string]: number } = {};
    this.noteHistory.forEach((item) => {
      noteCount[item.note] = (noteCount[item.note] || 0) + 1;
    });

    let prevalentNote = "";
    let maxCount = 0;

    for (const [note, count] of Object.entries(noteCount)) {
      if (count > maxCount) {
        prevalentNote = note;
        maxCount = count;
      }
    }

    return prevalentNote;
  }

  getCurrentFrequency(): number | null {
    if (!this.isListening) return null;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(dataArray);

    let rms = 0;
    for (let i = 0; i < bufferLength; i++) {
      rms += dataArray[i] * dataArray[i];
    }
    rms = Math.sqrt(rms / bufferLength);

    if (rms < this.AMPLITUDE_THRESHOLD) return null;

    const frequency = this.autoCorrelate(
      dataArray,
      this.audioContext.sampleRate
    );
    if (frequency && frequency !== -1) {
      return frequency;
    }

    return null;
  }

  public frequencyToNoteForGuitar(frequency: number): string {
    const guitarRange = { min: 82, max: 1100 };
    if (frequency < guitarRange.min || frequency > guitarRange.max) return "";

    return this.frequencyToNote(frequency);
  }

  private frequencyToNote(frequency: number): string {
    const notes = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const a4 = 440;
    const c0 = a4 * Math.pow(2, -4.75);

    const h = Math.round(12 * Math.log2(frequency / c0));
    const octave = Math.floor(h / 12);
    const noteIndex = h % 12;

    return notes[noteIndex] + octave;
  }

  private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    let rms = 0;
    for (let i = 0; i < buffer.length; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / buffer.length);

    if (rms < this.AMPLITUDE_THRESHOLD) return -1;

    let r1 = 0,
      r2 = buffer.length - 1;
    const threshold = 0.2;

    for (let i = 0; i < buffer.length / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) {
        r1 = i;
        break;
      }
    }

    for (let i = 1; i < buffer.length / 2; i++) {
      if (Math.abs(buffer[buffer.length - i]) < threshold) {
        r2 = buffer.length - i;
        break;
      }
    }

    buffer = buffer.slice(r1, r2);
    const c = new Array(buffer.length).fill(0);

    for (let i = 0; i < buffer.length; i++) {
      for (let j = 0; j < buffer.length - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1,
      maxpos = -1;
    for (let i = d; i < buffer.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;
    const x1 = c[T0 - 1],
      x2 = c[T0],
      x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }
}
