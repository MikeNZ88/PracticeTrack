class Metronome {
    constructor() {
        // DOM Elements
        this.bpmValue = document.getElementById('bpm-value');
        this.bpmSlider = document.getElementById('bpm-slider');
        this.decreaseBpmBtn = document.getElementById('decrease-bpm');
        this.increaseBpmBtn = document.getElementById('increase-bpm');
        this.metronomeToggle = document.getElementById('metronome-toggle');
        this.metronomeToggleText = this.metronomeToggle.querySelector('span');
        this.beatVisualization = document.querySelector('.beat-visualization');
        this.timeSigButtons = document.querySelectorAll('.time-signature-btn');
        this.soundButtons = document.querySelectorAll('.sound-btn');
        
        // Audio context
        this.audioContext = null;
        this.isPlaying = false;
        this.currentBeat = 0;
        this.intervalId = null;
        
        // Metronome state
        this.bpm = 120;
        this.timeSignature = '4/4';
        this.soundType = 'click';
        
        // Time signatures data
        this.timeSignatures = {
            '4/4': { beats: 4, pattern: [1, 0, 0, 0] },
            '3/4': { beats: 3, pattern: [1, 0, 0] },
            '6/8': { beats: 6, pattern: [1, 0, 0, 1, 0, 0] },
            '5/4': { beats: 5, pattern: [1, 0, 1, 0, 0] }, // Common accent for 5/4
            '7/4': { beats: 7, pattern: [1, 0, 0, 1, 0, 0, 0] }, // Common accent for 7/4
            '7/8': { beats: 7, pattern: [1, 0, 0, 1, 0, 0, 0] }, // Common accent for 7/8
            '9/8': { beats: 9, pattern: [1, 0, 0, 1, 0, 0, 1, 0, 0] } // Common accent for 9/8
        };
        
        // Initialize
        this.setupEventListeners();
        this.updateBpmDisplay();
        this.createBeatIndicators();
        this.setActiveButtons();
    }
    
    setupEventListeners() {
        // BPM slider
        this.bpmSlider.addEventListener('input', () => {
            this.bpm = parseInt(this.bpmSlider.value);
            this.updateBpmDisplay();
            if (this.isPlaying) {
                this.restartInterval();
            }
        });
        
        // Decrease BPM button
        this.decreaseBpmBtn.addEventListener('click', () => {
            if (this.bpm > 30) {
                this.bpm--;
                this.bpmSlider.value = this.bpm;
                this.updateBpmDisplay();
                if (this.isPlaying) {
                    this.restartInterval();
                }
            }
        });
        
        // Increase BPM button
        this.increaseBpmBtn.addEventListener('click', () => {
            if (this.bpm < 300) {
                this.bpm++;
                this.bpmSlider.value = this.bpm;
                this.updateBpmDisplay();
                if (this.isPlaying) {
                    this.restartInterval();
                }
            }
        });
        
        // Time signature buttons
        this.timeSigButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.timeSigButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.timeSignature = btn.getAttribute('data-signature');
                this.createBeatIndicators();
                if (this.isPlaying) {
                    this.restartInterval();
                }
            });
        });
        
        // Sound type buttons
        this.soundButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.soundButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.soundType = btn.getAttribute('data-sound');
            });
        });
        
        // Start/Stop button
        this.metronomeToggle.addEventListener('click', () => {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
    
    updateBpmDisplay() {
        this.bpmValue.textContent = this.bpm;
    }
    
    createBeatIndicators() {
        this.beatVisualization.innerHTML = '';
        const signature = this.timeSignatures[this.timeSignature];
        if (!signature) return;
        
        for (let i = 0; i < signature.beats; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'beat-indicator';
            indicator.textContent = (i + 1).toString();
            if (signature.pattern[i] === 1) {
                indicator.classList.add('accent');
            }
            this.beatVisualization.appendChild(indicator);
        }
    }
    
    setActiveButtons() {
        // Set initial active state based on defaults
        this.timeSigButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-signature') === this.timeSignature));
        this.soundButtons.forEach(b => b.classList.toggle('active', b.getAttribute('data-sound') === this.soundType));
    }
    
    initAudioContext() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.error('Web Audio API not supported:', e);
                alert('Your browser does not support the Web Audio API, which is needed for the metronome.');
                return false;
            }
        }
        // Resume context if needed (browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        return true;
    }
    
    start() {
        if (!this.initAudioContext()) return;
        
        this.isPlaying = true;
        this.metronomeToggleText.textContent = 'Stop';
        this.metronomeToggle.classList.add('active'); // Use .active for stop state styling
        
        this.currentBeat = -1; // Start before the first beat for immediate play
        this.restartInterval();
    }
    
    stop() {
        this.isPlaying = false;
        this.metronomeToggleText.textContent = 'Start';
        this.metronomeToggle.classList.remove('active');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        const indicators = this.beatVisualization.querySelectorAll('.beat-indicator');
        indicators.forEach(ind => ind.classList.remove('active'));
    }
    
    restartInterval() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        const signature = this.timeSignatures[this.timeSignature];
        if (!signature) return;
        
        let intervalMs = 60000 / this.bpm;
        if (this.timeSignature.endsWith('8')) {
            intervalMs /= 2; // Treat 6/8, 7/8, 9/8 as having 8th note pulse
        }
        
        const self = this;
        const tick = () => {
            self.currentBeat = (self.currentBeat + 1) % signature.beats;
            self.playBeat();
        };
        
        tick(); // Play the first beat immediately
        this.intervalId = setInterval(tick, intervalMs);
    }
    
    playBeat() {
        const indicators = this.beatVisualization.querySelectorAll('.beat-indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentBeat);
        });
        
        const signature = this.timeSignatures[this.timeSignature];
        const isAccented = signature.pattern[this.currentBeat] === 1;
        this.playSound(isAccented);
    }
    
    playSound(isAccented) {
        if (!this.audioContext) return;
        
        const time = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        let freq, vol, decay;
        
        switch (this.soundType) {
            case 'click':
            default:
                osc.type = 'sine';
                freq = isAccented ? 880 : 660;
                vol = isAccented ? 0.4 : 0.2;
                decay = 0.05;
                break;
            case 'wood':
                osc.type = 'triangle';
                freq = isAccented ? 1200 : 1000;
                vol = isAccented ? 0.5 : 0.3;
                decay = 0.08;
                break;
            case 'digital':
                osc.type = 'square';
                freq = isAccented ? 1000 : 750;
                vol = isAccented ? 0.3 : 0.15;
                decay = 0.03;
                break;
            case 'soft':
                osc.type = 'sine';
                freq = isAccented ? 600 : 440;
                vol = isAccented ? 0.3 : 0.15;
                decay = 0.1;
                break;
        }
        
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(vol, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(time);
        osc.stop(time + decay + 0.05); // Stop shortly after decay
    }
}

// Initialize metronome when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('metronome-toggle')) { // Check if metronome elements exist
        new Metronome();
    }
}); 