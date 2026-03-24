export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Read from POST body OR GET query
  const city = req.body?.city || req.query?.city || "Chennai";
  const date = req.body?.date || req.query?.date || "";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=c8e93dec0785987402c79c04def55afc&units=metric`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(200).json({
        city,
        date,
        recommendation: `Weather data unavailable for ${city}. Please check local forecast before travel.`,
      });
    }

    const temp = data.main.temp;
    const condition = data.weather[0].main;
    const humidity = data.main.humidity;
    const feelsLike = data.main.feels_like;
    const windSpeed = data.wind.speed;
    const description = data.weather[0].description;

    // Generate dynamic recommendation
    let recommendation = "";
    let emoji = "";

    if (condition === "Thunderstorm") {
      emoji = "⛈️";
      recommendation = "Thunderstorms expected — avoid travel if possible and stay indoors.";
    } else if (condition === "Rain" || condition === "Drizzle") {
      emoji = "🌧️";
      recommendation = "High chance of rain — carry an umbrella and plan indoor activities.";
    } else if (condition === "Snow") {
      emoji = "❄️";
      recommendation = "Snowy conditions — pack warm clothes and check road conditions before travel.";
    } else if (condition === "Mist" || condition === "Fog" || condition === "Haze") {
      emoji = "🌫️";
      recommendation = "Low visibility due to fog — drive carefully and allow extra travel time.";
    } else if (temp > 35) {
      emoji = "🥵";
      recommendation = "Extreme heat expected — stay hydrated, wear sunscreen and avoid outdoor walks midday.";
    } else if (temp > 30) {
      emoji = "☀️";
      recommendation = "Hot temperatures — stay hydrated and avoid long outdoor walks during peak hours.";
    } else if (temp > 20) {
      emoji = "🌤️";
      recommendation = "Expect sunny skies — perfect for outdoor sightseeing and activities!";
    } else if (temp > 10) {
      emoji = "🍃";
      recommendation = "Pleasant weather — light jacket recommended for evenings.";
    } else if (temp > 0) {
      emoji = "🧥";
      recommendation = "Cold weather — carry warm clothes and layer up for outdoor activities.";
    } else {
      emoji = "🥶";
      recommendation = "Freezing temperatures — pack heavy winter clothing and limit time outdoors.";
    }

    // Build full note for Freshservice ticket
    const note = `🌤️ Weather-Based Travel Recommendation

📍 Destination: ${city}
📅 Travel Date: ${date}

🌡️ Temperature: ${temp}°C (Feels like ${feelsLike}°C)
🌥️ Condition: ${description}
💧 Humidity: ${humidity}%
💨 Wind Speed: ${windSpeed} m/s

${emoji} Recommendation:
${recommendation}

✔️ Weather data fetched live via OpenWeatherMap API`;

    res.status(200).json({
      city,
      date,
      temperature: temp,
      feelsLike,
      condition,
      description,
      humidity,
      windSpeed,
      recommendation,
      note,
    });

  } catch (error) {
    res.status(200).json({
      city,
      date,
      recommendation: "Unable to fetch weather data. Please check local forecast before travel.",
    });
  }
}
