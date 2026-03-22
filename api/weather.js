export default function handler(req, res) {
  const temperature = 32;

  let recommendation = "";

  if (temperature > 30) {
    recommendation = "Hot weather — stay hydrated and avoid long outdoor walks.";
  } else {
    recommendation = "Pleasant weather — perfect for sightseeing!";
  }

  res.status(200).json({
    temperature,
    recommendation,
  });
}