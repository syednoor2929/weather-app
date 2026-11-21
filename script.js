async function searchWeather() {

    let city = document.getElementById("city").value;

    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    try {

        // 1. City search
        let locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        let locationData = await locationResponse.json();

        if (!locationData.results) {
            alert("City not found!");
            return;
        }

        let location = locationData.results[0];

        // 2. Weather search
        let weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        let weatherData = await weatherResponse.json();

        // 3. Get weather values
        let temperature = weatherData.current.temperature_2m;
        let humidity = weatherData.current.relative_humidity_2m;
        let wind = weatherData.current.wind_speed_10m;
        let weatherCode = weatherData.current.weather_code;

        // 4. Show city
        document.getElementById("cityName").innerText = location.name;

        // 5. Show temperature
        document.getElementById("temperature").innerText =
            temperature + "°C";

        // 6. Show humidity
        document.getElementById("humidity").innerText =
            humidity + "%";

        // 7. Show wind
        document.getElementById("wind").innerText =
            wind + " km/h";

        // 8. Show condition
        document.getElementById("condition").innerText =
            getWeatherCondition(weatherCode);

    } catch (error) {

        alert("Something went wrong. Check your internet connection.");

        console.log(error);
    }
}


// Weather code ko text mein convert karna
function getWeatherCondition(code) {

    if (code === 0) {
        return "☀️ Clear Sky";
    }

    if (code === 1 || code === 2) {
        return "🌤️ Partly Cloudy";
    }

    if (code === 3) {
        return "☁️ Cloudy";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️ Rain";
    }

    if (code >= 71 && code <= 77) {
        return "❄️ Snow";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️ Rain Showers";
    }

    if (code >= 95) {
        return "⛈️ Thunderstorm";
    }

    return "🌤️ Unknown";
}