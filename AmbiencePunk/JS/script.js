// Audio Functionality
const icons = document.querySelectorAll(".icon-grid i");
const images = document.querySelectorAll(".image-grid img");
const currentAudio = new Set();

icons.forEach(icon => addAudioFunctionality(icon));
images.forEach(image => addAudioFunctionality(image));

function addAudioFunctionality(element) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("icon-wrapper");
    wrapper.style.position = "relative";

    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);

    const audioId = element.dataset.audio;
    const audio = document.getElementById(audioId);

    if (!audio) {
        console.error(`Audio element with id ${audioId} not found`);
        return;
    }

    const volumeSlider = createVolumeSlider(audio);
    wrapper.appendChild(volumeSlider);

    element.addEventListener("click", () => {
        toggleAudio(audio);
    });
}

function createVolumeSlider(audio) {
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = "0";
    volumeSlider.max = "100";
    volumeSlider.value = audio.volume * 100;
    volumeSlider.classList.add("volume-slider");

    Object.assign(volumeSlider.style, {
        display: "block", // Always display the volume slider
        position: "absolute",
        bottom: "-20px",
        left: "0",
        width: "100%",
        height: "10px",
        backgroundColor: "white",
        zIndex: "1000"
    });

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value / 100;
    });

    return volumeSlider;
}

function toggleAudio(audio) {
    if (audio.paused) {
        audio.play();
        currentAudio.add(audio);
    } else {
        audio.pause();
        audio.currentTime = 0;
        currentAudio.delete(audio);
    }
}

// Weather Animation
const canvas = document.getElementById('weatherCanvas');
const ctx = canvas.getContext('2d');
const weatherSelect = document.getElementById('weatherSelect');
const sun = document.getElementById('sun');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor(isSnow) {
        this.reset(isSnow, true);
    }

    reset(isSnow, initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : -10;
        this.speed = isSnow ? 0.5 + Math.random() * 1.5 : 1 + Math.random() * 3;
        this.radius = isSnow ? Math.random() * 2 + 1 : 0;
        this.length = isSnow ? 0 : 10 + Math.random() * 20;
    }

    fall() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.reset(weatherSelect.value === 'snow');
        }
    }

    draw(isSnow) {
        ctx.beginPath();
        if (isSnow) {
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
        } else {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x, this.y + this.length);
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}

function createParticles(count, isSnow) {
    particles = Array.from({ length: count }, () => new Particle(isSnow));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isSnow = weatherSelect.value === 'snow';
    particles.forEach(particle => {
        particle.fall();
        particle.draw(isSnow);
    });

    requestAnimationFrame(animate);
}

function setWeather() {
    const weather = weatherSelect.value;
    switch (weather) {
        case 'sunny':
            canvas.style.backgroundColor = '#87CEEB';
            sun.style.display = 'block';
            particles = [];
            break;
        case 'rain':
            canvas.style.backgroundColor = '#1157b3';
            sun.style.display = 'none';
            createParticles(200, false);
            break;
        case 'snow':
            canvas.style.backgroundColor = '#4A5D79';
            sun.style.display = 'none';
            createParticles(300, true);
            break;
    }
}

weatherSelect.addEventListener('change', setWeather);

setWeather();
animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setWeather();
});