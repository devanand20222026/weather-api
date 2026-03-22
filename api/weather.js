export default async function handler(req, res) {
  const city = req.query.city || "Chennai";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c8e93dec0785987402c79c04def55afc&units=metric`
    );

    const data = await response.json();

    // ❗ Handle invalid city
    if (data.cod !== 200) {
      return res.status(400).json({
        error: "Invalid city name",
      });
    }

    const temp = data.main.temp;
    const condition = data.weather[0].main;
    const humidity = data.main.humidity;

    let recommendation = "";

    // 🔥 Smart logic
    if (condition === "Rain") {
      recommendation = "High chance of rain — carry an umbrella and plan indoor activities.";
    } else if (temp > 30) {
      recommendation = "Hot weather — stay hydrated and avoid long outdoor walks.";
    } else if (temp < 10) {
      recommendation = "Cold weather — carry warm clothes.";
    } else if (condition === "Clouds") {
      recommendation = "Moderate weather — good for light outdoor activities.";
    } else {
      recommendation = "Pleasant weather — perfect for sightseeing!";
    }

    res.status(200).json({
      city,
      temperature: temp,
      condition,
      humidity,
      recommendation,
    });

  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
    });
  }
}
