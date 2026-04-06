
//d2dd3ebe824843148eda1d70b6bba58d
let lat = -30.033;
let lon = -51.23;

const local = document.getElementById("local");
const cidades = document.getElementById("cidades");
const horario = document.getElementById("horario"); // para saber o momento da API call, só para debugging
const temp = document.getElementById("temp"); // graus atuais em celsius
const sensacao = document.getElementById("sensacao"); // sensção térmica em célsius
const temp_max = document.getElementById("temp_max"); // temperatura máxima do dia atual em celsius
const temp_min = document.getElementById("temp_min"); // temperatura mínima do dia atual em celsius
const nuvens = document.getElementById("nuvens"); // céu limpo, poucas nuvens, nublado, chovendo, etc
const umidade = document.getElementById("umidade"); // umidade do ar em %
const chuva = document.getElementById("chuva"); // precipitação em mm
const vel_vento = document.getElementById("vel_vento"); // velocidade do vento em km/h
const dir_vento = document.getElementById("dir_vento"); // direção do vento
const nascer_do_sol = document.getElementById("nascer_do_sol"); // horário do nascer do sol do dia atual (HH:MM)
const por_do_sol = document.getElementById("por_do_sol"); // horário do pôr do sol no dia atual (HH:MM)

const forecast = document.getElementById("forecast");

async function getCidades(){
  try {
    const response = await fetch('./city.list.min.json');
    if (!response.ok) throw new Error('Network response was not ok');
      
    const listaCidades = await response.json(); // Parses JSON into a JS object
    console.log(listaCidades);

    listaCidades.forEach((i,index) => {
      if (listaCidades[index].country == "BR"){
        const novaCidade = document.createElement('option');
        novaCidade.text = listaCidades[index].name;
        novaCidade.value = listaCidades[index];
        local.appendChild(novaCidade);
        console.log(novaCidade.innerText+" - index: "+index);
      }
    });

    local.customData = listaCidades[130613];
    local.innerText = listaCidades[130613].name;
    console.log("nome: "+local.customData.name)
    
  } catch (error) {
    console.error('Error loading JSON:', error);
  }

}

// Toggle menu on button click
local.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents immediate closing
  cidades.style.display = cidades.style.display === 'block' ? 'none' : 'block';
});

// Close menu when clicking anywhere else on the page
window.addEventListener('click', () => {
  cidades.style.display = 'none';
});

async function getData() {
  const url =  "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt_br&&lat=-30.033&lon=-51.23&appid=d2dd3ebe824843148eda1d70b6bba58d";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    obj = result;
    console.log(result);

    horario.innerText = new Date(obj.dt * 1000)
    temp.innerText = obj.main.temp +"°C";
    sensacao.innerText = obj.main.feels_like.toFixed(2) +"°C";
    temp_max.innerText = obj.main.temp_max.toFixed(2) +"°C";
    temp_min.innerText = obj.main.temp_min.toFixed(2) +"°C";
    nuvens.innerText = obj.weather[0].description;
    umidade.innerText = obj.main.humidity+"%";
    vel_vento.innerText = (obj.wind.speed * 3.6).toFixed(2) +" km/h";
    dir_vento.innerText = deg_to_dir(obj.wind.deg);
    nascer_do_sol.innerText = sec_to_time(obj.sys.sunrise);
    por_do_sol.innerText = sec_to_time(obj.sys.sunset);
  } catch (error) {
    console.error(error.message);
  }
}

async function getForecast() {
  const url = "http://api.openweathermap.org/data/2.5//forecast?appid=d2dd3ebe824843148eda1d70b6bba58d&lat="+lat+"&lon="+lon+"&units=metric&lang=pt_br";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    obj = result;
    console.log(result);
    for (const entry of obj.list){
      var row = forecast.insertRow();
      var day = row.insertCell();
      day.innerText = sec_to_date(entry.dt);
      var time = row.insertCell();
      time.innerText = sec_to_hour(entry.dt)+"h";
      
      var temp = row.insertCell();
      temp.innerText = entry.main.temp+"°C";

      var chuva = row.insertCell();
      chuva.innerText = entry.weather[0].description;

      var umidade = row.insertCell();
      umidade.innerText = entry.main.humidity+"%";
    }
  } catch (error) {
    console.error(error.message);
  }
}

function deg_to_dir(deg){
  if(deg >= 0 && deg < 22.5){
    return "N";
  }
  else if(deg >= 22.5 && deg < 67.5 ){
    return "NE";
  }
  else if(deg >= 67.5 && deg < 112.5){
    return "E";
  }
  else if (deg >= 112.5 && deg < 157.5){
    return "SE";
  }
  else if(deg >= 157.5 && deg < 202.5){
    return "S";
  }
  else if(deg >= 202.5 && deg < 247.5){
    return "SW";
  }
  else if(deg >= 247.5 && deg < 292.5){
    return "W";
  }
  else if(deg >= 292.5 && deg < 337.5){
    return "NW";
  }
  else if(deg >= 337.5 && deg <= 360){
    return "N";
  }
}

function sec_to_time(sec){
  let time = new Date(sec*1000);
  return time.getHours()+":"+time.getMinutes();
}

function sec_to_hour(sec){
  let time = new Date(sec*1000);
  return time.getHours();
}

function sec_to_date(sec){
  let time = new Date(sec*1000);
  return time.getDay()+"/"+time.getMonth();
}



// https://api.openweathermap.org/data/2.5/forecast/daily?id=8467&cnt=16&appid=d2dd3ebe824843148eda1d70b6bba58d
// https://api.openweathermap.org/data/2.5/weather?lat=-30.033&lon=-51.23&appid=d2dd3ebe824843148eda1d70b6bba58d
// https://api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}

//graus, nuvens, umidade, velocidade do vento, direção do vento, fase lunar, horario nascer do sol, horario por do sol
// previsao horas, previsao dias, barra de pesquisa de cidade


//getData()
    