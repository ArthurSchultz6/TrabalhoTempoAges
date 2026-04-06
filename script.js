function updateBackgroundByTemp(temp) {
            const display = document.getElementById('temp-display');
            const desc = document.getElementById('desc');
            
            display.innerText = `${temp}°C`;

            const minTemp = 0;   
            const maxTemp = 40;  

            let porcentagem = (temp - minTemp) / (maxTemp - minTemp);
            

            porcentagem = Math.max(0, Math.min(1, porcentagem));


            const hue = 240 - (240 * porcentagem);
            

            document.body.style.background = `hsl(${hue}, 70%, 50%)`;

            if(temp <= 15) desc.innerText = "Ta congelando!";
            else if(temp > 15 && temp < 28) desc.innerText = "temperatura agradavel";
            else desc.innerText = "ta pelando!";
        }

        const mockTemp = 32; 
        updateBackgroundByTemp(mockTemp);

        // --- para implementar na api a parte da temp ---
        /*
        async function getBackendTemp() {
            const res = await fetch('/api/weather');
            const data = await res.json();
            updateBackgroundByTemp(data.temperature);
        }
        */