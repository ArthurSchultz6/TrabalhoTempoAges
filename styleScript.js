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

const cond = document.getElementById("cond");

// --- Chuvinha ---
function createParticles(mode) {
    particles = [];
    const count = mode === 'heavy' ? 400 : 150;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width - (mode === 'light' ? 15 : 7),
            y: Math.random() * canvas.height - (mode === 'light' ? 15 : 7),
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
    'clear': { id: 0, name: 'Carregando', temp: "-", hum: "-", wind: "-", feel: "-", desc: 'Carregando', rain: false },
    'clouds': { id: 1, name: 'Carregando', temp: "-", hum: "-", wind: "-", feel: "-", desc: 'Carregando', rain: false },
    'drizzle' :  { id: 2, name: 'Carregando', temp: "-", hum: "-", wind: "-", feel: "-", desc: 'Carregando', rain: true, mode: 'light' },
    'rain': { id: 3, name: 'Carregando', temp: "-", hum: "-", wind: "-", feel: "-", desc: 'Carregando', rain: true, mode: 'regular' },
    'thunderstorm': { id: 4, name: 'Carregando', temp: "-", hum: "-", wind: "-", feel: "-", desc: 'Carregando', rain: true, mode: 'heavy' }
};

// --- Função de renderização ---
export function aplicarClima() {
    console.log(cond.innerText)
    const data = climas[cond.innerText.toLowerCase()] || climas['clear'];
    
    /*
    // Atualiza Interface
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temp-display').innerText = `${data.temp}°C`;
    document.getElementById('hum-val').innerText = `${data.hum}%`;
    document.getElementById('wind-val').innerText = `${data.wind}km/h`;
    document.getElementById('feels-val').innerText = `${data.feel}°C`;
    document.getElementById('condition-desc').innerText = data.desc;
    */

    // Reset Visual
    cancelAnimationFrame(animId);
    document.body.className = '';
    document.getElementById('character-wrapper').className = 'hidden';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplica Novo Clima
    const wrapper = document.getElementById('character-wrapper');
    wrapper.className = 'visible'; // Sempre deixa visível para sol, chuva ou tempestade
    
    if (data.rain) {
        if (data.id == 2){
            document.body.className = 'drizzle';
        }else{
            if (data.id == 3) {
                document.body.className = 'rain';
            } else {
                if (data.id == 4){
                    document.body.className = 'thunderstorm';
                }
            }
        }
    }
        
        // Mostra guarda-chuva e esconde óculos
        wrapper.classList.add('show-umbrella');
        wrapper.classList.remove('show-glasses');

        createParticles(data.mode);
        animate();
        if(data.id == 4){ dispararRaio();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        cancelAnimationFrame(animId);

        if (data.id == 1){
            wrapper.classList.remove('show-glasses');
            document.body.className = 'clouds';
        } else {
            wrapper.classList.add('show-glasses');
            document.body.className = 'clear';}
        
        // Mostra óculos e esconde guarda-chuva
        wrapper.classList.remove('show-umbrella');
    }
    // Gerar Forecast Fake
    /*
    const grid = document.getElementById('forecast-container');
    grid.innerHTML = '';
    ['-', '-', '-', '-', '-'].forEach(d => {
        grid.innerHTML += `<div class="forecast-card"><p>${d}</p><h3>-°C</h3><p>-</p></div>`;
    });
    console.log("aplicarClima "+data.id)*/
}

function dispararRaio() {
    document.body.classList.add('shake-active');
    document.body.style.filter = "brightness(3)";
    setTimeout(() => {
        document.body.classList.remove('shake-active');
        document.body.style.filter = "brightness(1)";
    }, 400);
}
