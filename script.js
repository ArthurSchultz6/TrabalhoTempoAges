import { aplicarClima } from './styleScript.js';

let lang = "pt_br";
let countryCode = "BR";
const appid = "d2dd3ebe824843148eda1d70b6bba58d";

let lat;
let lon;

const estados = {
  "AC":"Acre",
  "AL":"Alagoas",
  "AP":"Amapá",
  "AM": "Amazonas",
  "BA": "Bahia",
  "CE": "Ceará",
  "DF": "Distrito Federal",
  "ES": "Espírito Santo",
  "GO": "Goiás",
  "MA": "Maranhão",
  "MT": "Mato Grosso",
  "MS": "Mato Grosso do Sul",
  "MG": "Minas Gerais",
  "PA": "Pará",
  "PB": "Paraíba",
  "PR": "Paraná",
  "PE": "Pernambuco",
  "PI": "Piauí",
  "RJ": "Rio de Janeiro",
  "RN": "Rio Grande do Norte",
  "RS": "Rio Grande do Sul",
  "RO": "Rondônia",
  "RR": "Roraima",
  "SC": "Santa Catarina",
  "SP": "São Paulo",
  "SE": "Sergipe",
  "TO": "Tocantins"
}

const diasDaSemana = {
  "0":"Dom",
  "1":"Seg",
  "2":"Ter",
  "3":"Qua",
  "4":"Qui",
  "5":"Sex",
  "6":"Sab"
}


const cond = document.getElementById("cond");
const local = document.getElementById("city-input");
const local_display = document.getElementById("city-name");
const buscar = document.getElementById("search-btn");
const temp = document.getElementById("temp-display"); // graus atuais em celsius
const sensacao = document.getElementById("feels-val"); // sensção térmica em célsius
const desc = document.getElementById("condition-desc"); // céu limpo, poucas nuvens, nublado, chovendo, etc
const umidade = document.getElementById("hum-val"); // umidade do ar em %
const vel_vento = document.getElementById("wind-val"); // velocidade do vento em km/h

const forecast = document.getElementById("forecast");
const forecast_display = document.getElementById("forecast-container");

local.value = "Porto Alegre, RS";


async function getData() {
  const url =  `https://api.openweathermap.org/data/2.5/weather?lang=${lang}&&lat=${lat}&lon=${lon}&appid=${appid}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    const obj = result;
    console.log("0:");
    console.log(result)

    cond.innerText = obj.weather[0].main.toLowerCase()
    local_display.innerText = obj.name;
    temp.innerText = obj.main.temp.toFixed(1) +"°C";
    sensacao.innerText = obj.main.feels_like.toFixed(1) +"°C";
    desc.innerText = capitalize(obj.weather[0].description);
    umidade.innerText = obj.main.humidity+"%";
    vel_vento.innerText = (obj.wind.speed * 3.6).toFixed(2) +" km/h";
    aplicarClima();

  } catch (error) {
    console.error(error.message);
  }
}

async function getCoords(){
  try {
    let cidade = local.value.split(",")[0].trim();
    let estado = estados[local.value.split(",")[1].trim()];

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=100&language=${lang}&format=json&countryCode=${countryCode}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const listaLocais = await response.json(); // Parses JSON into a JS object
    console.log("1: ");
    console.log(listaLocais)
    
    for (const l of listaLocais.results){
      console.log("2: i.name:"+l.name+"\ncidade:"+cidade+"\n= "+(l.name.toLowerCase() === cidade.toLowerCase())+"\ni.admin1:"+l.admin1+"\nestado:"+estado+"\n= "+(l.admin1.toLowerCase() === estado.toLowerCase()))
      if (l.name.toLowerCase() === cidade.toLowerCase() && l.admin1.toLowerCase() === estado.toLowerCase()){
        lat = l.latitude;
        lon = l.longitude;
        console.log("3:")
        console.log(l)
        console.log(" lat: "+lat+" lon: "+lon)
        break;
      }
    }
    getData();
    cleanTable(forecast);
    getForecast()
  } catch (error) {
    console.error('Error loading JSON:', error);
  }
}


async function getForecast() {
  const url = `http://api.openweathermap.org/data/2.5//forecast?appid=${appid}&lang=${lang}&lat=${lat}&lon=${lon}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    const obj = result;
    console.log(result);

    forecast_display.innerHTML = "";

    for (const entry of obj.list){
      if (parseInt(obj.list.indexOf(entry))%8 === 0){
        var row = forecast.insertRow();
        var day = row.insertCell();
        day.innerText = sec_to_date(entry.dt);
        
        var temp = row.insertCell();
        temp.innerText = entry.main.temp.toFixed(1)+"°C";

        var chuva = row.insertCell();
        chuva.innerText = entry.weather[0].description;
        [day].forEach(d => {
        forecast_display.innerHTML += `<div class="forecast-card"><p>${d.innerText}</p><h3>${temp.innerText}</h3><p>${capitalize(chuva.innerText)}</p></div>`;
    });
  
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

function cleanTable(table){
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}


function sec_to_date(sec){
  let time = new Date(sec*1000);
  return diasDaSemana[time.getDay()];
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.addEventListener('load', function(){
  getCoords();
})

buscar.addEventListener('click', function(){
  getCoords();
})
