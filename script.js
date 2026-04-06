function updateBackgroundByTemp(temp) {
            const display = document.getElementById('temp-display');
            const desc = document.getElementById('desc');
            
            display.innerText = `${temp}°C`;

            const minTemp = 0;   
            const maxTemp = 40;  

            let porcentagem = (temp - minTemp) / (maxTemp - minTemp);
            
            // Constrain between 0 and 1
            porcentagem = Math.max(0, Math.min(1, porcentagem));


            const hue = 240 - (240 * porcentagem);
            

            document.body.style.background = `hsl(${hue}, 70%, 50%)`;

            // Add a text description
            if(temp <= 15) desc.innerText = "It's chilly!";
            else if(temp > 15 && temp < 28) desc.innerText = "Perfect weather.";
            else desc.innerText = "It's a scorcher!";
        }

        const mockTemp = 32; 
        updateBackgroundByTemp(mockTemp);

        // --- FUTURE BACKEND INTEGRATION ---
        /*
        async function getBackendTemp() {
            const res = await fetch('/api/weather');
            const data = await res.json();
            updateBackgroundByTemp(data.temperature);
        }
        */