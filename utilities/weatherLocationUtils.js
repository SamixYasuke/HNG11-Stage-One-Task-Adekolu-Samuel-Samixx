import axios from "axios";

const getWeatherData = async (city) => {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process?.env?.OPENWEATHER_API_KEY}&units=metric`;
    const weatherResponse = await axios.get(weatherUrl);
    const weatherInfo = weatherResponse?.data?.main?.temp;
    return weatherInfo;
  } catch (error) {
    throw new Error("Weather Information Not Found");
  }
};

const getLocationData = async (ipAddress) => {
  try {
    const locationUrl = `https://ipapi.co/${ipAddress}/json/`;
    const locationResponse = await axios.get(locationUrl);
    const city = locationResponse?.data?.city;
    return city;
  } catch (error) {
    throw new Error("Location Not Found!!");
  }
};

export { getWeatherData, getLocationData };
