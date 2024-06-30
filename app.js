import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: "Missing API key for OpenWeather" });
  }
  next();
});

app.get("/api/hello/", async (req, res) => {
  const { visitor_name } = req.query;
  try {
    const ipAddress =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";
    console.log("Client IP Address:", ipAddress);

    // Fetch location data and city name based on IP address
    const locationUrl = `https://ipapi.co/${ipAddress}/json/`;
    const locationResponse = await axios.get(locationUrl);
    const city = locationResponse?.data?.city;

    // Fetch weather data based on city name
    if (city) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      const weatherInfo = weatherResponse?.data?.main?.temp;

      res.json({
        client_ip: ipAddress,
        location: city,
        greeting: `Hello, ${visitor_name}!, the temperature is ${weatherInfo} degrees Celsius in ${city}`,
      });
    } else {
      throw new Error("City name not found in location data");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
