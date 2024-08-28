document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('filter');
    const textElement = document.getElementById('text');
    const textareaElement = document.getElementById('textarea');
    const speechElement = document.getElementById('speech');
    const btn1 = document.querySelector('.btn-1');
    const btn2 = document.querySelector('.btn-2');
    const btn3 = document.querySelector('.btn-3');
    const bars = document.getElementById('bars');
    const stopwatch = document.getElementById('stopwatch');
    const timeDisplay = document.getElementById('time');

    let stopwatchInterval = null;
    let stopwatchRunning = false;
    let startTime = 0;
    let elapsedTime = 0;

    // Initialize Speech Recognition API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        textareaElement.value = finalTranscript || interimTranscript;
    };

    function updateTime() {
        const elapsed = Date.now() - startTime + elapsedTime;
        const totalSeconds = Math.floor(elapsed / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    function startStopwatch() {
        if (!stopwatchRunning) {
            startTime = Date.now();
            stopwatchInterval = setInterval(updateTime, 1000);
            stopwatchRunning = true;
        }
    }

    function stopStopwatch() {
        clearInterval(stopwatchInterval);
        elapsedTime += Date.now() - startTime;
        stopwatchRunning = false;
    }

    function resetStopwatch() {
        stopStopwatch();
        elapsedTime = 0;
        timeDisplay.textContent = '00:00:00';
        bars.style.display = 'none';
    }

    if (!checkbox || !textElement || !textareaElement || !speechElement || !btn1 || !btn2 || !btn3 || !bars || !stopwatch || !timeDisplay) {
        console.error('One or more elements not found.');
        return;
    }

    bars.style.display = 'none';
    stopwatch.classList.add('hidden');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            textElement.textContent = 'Speech to Text';
            speechElement.style.display = 'flex';
            btn1.style.display = 'none';
            btn2.style.display = 'block';
            btn3.style.display = 'block';
            stopwatch.classList.remove('hidden');
        } else {
            textElement.textContent = 'Text to Speech';
            speechElement.style.display = 'flex';
            btn1.style.display = 'block';
            btn2.style.display = 'none';
            btn3.style.display = 'none';
            bars.style.display = 'none';
            stopwatch.classList.add('hidden');
            resetStopwatch();
        }
    });

    btn2.addEventListener('click', () => {
        if (bars.style.display === 'none') {
            bars.style.display = 'flex';
            startStopwatch();
            recognition.start();
        } else {
            bars.style.display = 'none';
            stopStopwatch();
            recognition.stop();
        }
    });

    btn3.addEventListener('click', () => {
        resetStopwatch();
        textareaElement.value = ''; // Clear textarea when btn-3 is clicked
        recognition.stop();
    });

    btn1.addEventListener('click', () => {
        const utterance = new SpeechSynthesisUtterance(textareaElement.value);
        window.speechSynthesis.speak(utterance);
    });
});
