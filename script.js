
//d2dd3ebe824843148eda1d70b6bba58d

async function getData() {
  const url =  "https://api.openweathermap.org/data/2.5/weather?lat=-30.033&lon=-51.23&appid=d2dd3ebe824843148eda1d70b6bba58d"
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
}

// https://api.openweathermap.org/data/2.5/forecast/daily?id=8467&cnt=16&appid=d2dd3ebe824843148eda1d70b6bba58d
// https://api.openweathermap.org/data/2.5/weather?lat=-30.033&lon=-51.23&appid=d2dd3ebe824843148eda1d70b6bba58d
// https://api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}



getData()
    