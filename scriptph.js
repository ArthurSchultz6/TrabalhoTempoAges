//d2dd3ebe824843148eda1d70b6bba58d

let lat = -30.033;
let lon = -51.23;

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

const local = document.getElementById("city-input");
const local_display = document.getElementById("city-name")
//const horario = document.getElementById("horario"); // para saber o momento da API call, só para debugging
const temp = document.getElementById("temp-display"); // graus atuais em celsius
const sensacao = document.getElementById("feels-val"); // sensção térmica em célsius
//const temp_max = document.getElementById("temp_max"); // temperatura máxima do dia atual em celsius
//const temp_min = document.getElementById("temp_min"); // temperatura mínima do dia atual em celsius
const nuvens = document.getElementById("condition-desc"); // céu limpo, poucas nuvens, nublado, chovendo, etc
const umidade = document.getElementById("hum-val"); // umidade do ar em %
const vel_vento = document.getElementById("wind-val"); // velocidade do vento em km/h
//const dir_vento = document.getElementById("dir_vento"); // direção do vento
//const nascer_do_sol = document.getElementById("nascer_do_sol"); // horário do nascer do sol do dia atual (HH:MM)
//const por_do_sol = document.getElementById("por_do_sol"); // horário do pôr do sol no dia atual (HH:MM)

//const forecast = document.getElementById("forecast-container");

async function getData() {
  const url =  "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt_br&&lat="+lat+"&lon="+lon+"&appid=d2dd3ebe824843148eda1d70b6bba58d";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    obj = result;
    console.log("0:");
    console.log(result)

    //horario.innerText = new Date(obj.dt * 1000)
    local_display.innerText = obj.name;
    temp.innerText = obj.main.temp +"°C";
    sensacao.innerText = obj.main.feels_like.toFixed(2) +"°C";
    //temp_max.innerText = obj.main.temp_max.toFixed(2) +"°C";
    //temp_min.innerText = obj.main.temp_min.toFixed(2) +"°C";
    nuvens.innerText = capitalize(obj.weather[0].description);
    umidade.innerText = obj.main.humidity+"%";
    vel_vento.innerText = (obj.wind.speed * 3.6).toFixed(2) +" km/h";
    //dir_vento.innerText = deg_to_dir(obj.wind.deg);
    //nascer_do_sol.innerText = sec_to_time(obj.sys.sunrise);
    //por_do_sol.innerText = sec_to_time(obj.sys.sunset);
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
      if (parseInt(obj.list.indexOf(entry))%8 === 0){
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
      
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function getCoords(){
  try {
    let cidade = local.value.split(",")[0].trim();
    let estado = estados[local.value.split(",")[1].trim()];

    const url = "https://geocoding-api.open-meteo.com/v1/search?name="+cidade+"&count=100&language=pt&format=json&countryCode=BR";
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
      
    const listaLocais = await response.json(); // Parses JSON into a JS object
    console.log("1: ");
    console.log(listaLocais)

    for (i of listaLocais.results){
      console.log("2: i.name:"+i.name+"\ncidade:"+cidade+"\n= "+(i.name.toLowerCase() === cidade.toLowerCase())+"\ni.admin1:"+i.admin1+"\nestado:"+estado+"\n= "+(i.admin1.toLowerCase() === estado.toLowerCase()))
      if (i.name.toLowerCase() === cidade.toLowerCase() && i.admin1.toLowerCase() === estado.toLowerCase()){
        lat = i.latitude;
        lon = i.longitude;
        console.log("3:")
        console.log(i)
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

function cleanTable(table){
  while (table.rows.length > 1) {
    table.deleteRow(1);
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
  return diasDaSemana[time.getDay()];
}

function capitalize(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

