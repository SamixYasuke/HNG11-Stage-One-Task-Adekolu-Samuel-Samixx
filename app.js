import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import {
  getLocationDataFromIp,
  getWeatherData,
} from "./utilities/weatherLocationUtils.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/api/hello", async (req, res) => {
  const { visitor_name } = req.query;
  try {
    if (!visitor_name) {
      return res.status(400).json({ error: "Visitor name is required" });
    }

    const ipAddress =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";
    console.log(ipAddress);

    const city = await getLocationDataFromIp(ipAddress);
    const weatherInfo = await getWeatherData(city);

    if (city) {
      res.status(200).json({
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
