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
});

document.querySelector('.btn-1').addEventListener('click', function () {
    let text = document.getElementById('textarea').value;
    if (text) {
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';
        speech.rate = 1;
        window.speechSynthesis.speak(speech);
    } else {
        alert("Please enter some text in the textarea.");
    }
});

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;

const textarea = document.getElementById('textarea');

recognition.onresult = function (event) {
    let finalTranscript = textarea.value;
    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
        }
    }
    textarea.value = finalTranscript;
};

recognition.onspeechend = function () {
    recognition.start(); // Automatically restart recognition after speech ends
};

recognition.onerror = function (event) {
    console.error('Speech recognition error', event.error);
};

recognition.onstart = function () {
    console.log('Speech recognition started');
};

recognition.onend = function () {
    console.log('Speech recognition ended');
};

document.querySelector('.btn-2').addEventListener('click', function () {
    recognition.stop(); // Stop recognition without clearing the text
});
