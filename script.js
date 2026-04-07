// --- Configuração dos canvas ---
const canvas = document.getElementById('weatherCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// --- Chuvinha ---
function createParticles(mode) {
    particles = [];
    const count = mode === 'heavy' ? 400 : 150;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 10 + (mode === 'heavy' ? 15 : 7),
            len: Math.random() * 15 + 10
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
    ctx.lineWidth = 1;
    particles.forEach(p => {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y + p.len); ctx.stroke();
        p.y += p.speed;
        if (p.y > canvas.height) p.y = -20;
    });
    animId = requestAnimationFrame(animate);
}

// --- Dados fakes para simulação ---
const climas = {
    'sol': { name: 'Porto Alegre', temp: 31, hum: 35, wind: 12, feel: 33, desc: 'Céu ensolarado', rain: false },
    'chuva': { name: 'Porto Alegre', temp: 19, hum: 85, wind: 20, feel: 18, desc: 'Chuva passageira', rain: true, mode: 'light' },
    'tempestade': { name: 'Porto Alegre', temp: 15, hum: 95, wind: 55, feel: 13, desc: 'Tempestade severa', rain: true, mode: 'heavy' }
};

// --- Função de renderização ---
function aplicarClima(tipo) {
    const data = climas[tipo] || climas['sol'];
    
    // Atualiza Interface
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temp-display').innerText = `${data.temp}°C`;
    document.getElementById('hum-val').innerText = `${data.hum}%`;
    document.getElementById('wind-val').innerText = `${data.wind}km/h`;
    document.getElementById('feels-val').innerText = `${data.feel}°C`;
    document.getElementById('condition-desc').innerText = data.desc;

    // Reset Visual
    cancelAnimationFrame(animId);
    document.body.className = '';
    document.getElementById('character-wrapper').className = 'hidden';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplica Novo Clima
    if (data.rain) {
        document.body.classList.add(data.mode === 'heavy' ? 'state-rain-heavy' : 'state-rain-light');
        document.getElementById('character-wrapper').className = 'visible';
        createParticles(data.mode);
        animate();
        if(data.mode === 'heavy') dispararRaio();
    } else {
        document.body.classList.add('state-clear');
    }

    // Gerar Forecast Fake
    const grid = document.getElementById('forecast-container');
    grid.innerHTML = '';
    ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].forEach(d => {
        grid.innerHTML += `<div class="forecast-card"><p>${d}</p><h3>24°C</h3><p>Nublado</p></div>`;
    });
}

function dispararRaio() {
    document.body.classList.add('shake-active');
    document.body.style.filter = "brightness(3)";
    setTimeout(() => {
        document.body.classList.remove('shake-active');
        document.body.style.filter = "brightness(1)";
    }, 400);
}

// Botao para buscae
document.getElementById('search-btn').onclick = () => {
    const val = document.getElementById('city-input').value.toLowerCase();
    aplicarClima(val);
};

// inicio padrao
aplicarClima('sol');