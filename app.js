import { publicIpv4 } from "public-ip";
import axios from "axios";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/hello/", async (req, res) => {
  const { visitor_name } = req.query;
  try {
    // This is the i got the user's public IP address
    const ip = await publicIpv4();
    console.log("Public IP Address:", ip);

    //
    const ipAddress =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";
    console.log(ipAddress);
    //

    // This is where i fetched the location data and city name based on IP address
    const locationUrl = `https://ipapi.co/${ipAddress}/json/`;
    const locationResponse = await axios.get(locationUrl);
    const city = locationResponse?.data?.city;

    // This is where i fetched the weather data based on city name
    if (city) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process?.env?.OPENWEATHER_API_KEY}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      const weatherInfo = weatherResponse?.data?.main?.temp;

      res.json({
        client_ip: ipAddress,
        location: city,
        greeting: `Hello, ${visitor_name}!, the temperature is ${weatherInfo} degrees Celcius in ${city}`,
      });
    } else {
      throw new Error("City name not found in location data");
    }
  } catch (error) {
    console.error("Error:", error?.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
