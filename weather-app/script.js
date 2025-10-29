// ===============================
// CONFIGURATION
// ===============================
const apiKey = "Your Key";  // 🔹 Replace this with your OpenWeatherMap API key
const cacheKey = "weatherData";
const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

// ===============================
// MAIN FUNCTION
// ===============================
async function getWeatherData() {
  // Step 1: Check local cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheDuration) {
      console.log("✅ Using cached data");
      displayWeather(data);
      return;
    }
  }

  // Step 2: Get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      try {
        // Step 3: Fetch weather from API
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
          throw new Error(data.message);
        }

        // Step 4: Save in cache
        localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));

        // Step 5: Display results
        displayWeather(data);

      } catch (err) {
        console.error("❌ API Error:", err);
        alert("Error fetching weather data. Try again later.");
      }
    }, () => {
      alert("Please enable location access to get weather details.");
    });
  } else {
    alert("Your browser does not support geolocation.");
  }
}

// ===============================
// DISPLAY WEATHER DATA
// ===============================
function displayWeather(data) {
  const city = document.querySelector(".city");
  const temp = document.querySelector(".temp");
  const desc = document.querySelector(".desc");
  const humidity = document.querySelector(".humidity");
  const wind = document.querySelector(".wind");
  const pressure = document.querySelector(".pressure");
  const update = document.querySelector(".update");

  city.textContent = data.name;
  temp.textContent = `${Math.round(data.main.temp)}°C`;
  desc.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${data.wind.speed} km/h`;
  pressure.textContent = `${data.main.pressure} hPa`;
  update.textContent = "Last updated: " + new Date().toLocaleTimeString();

  changeBackground(data.main.temp);
  animateUI();
}

// ===============================
// BACKGROUND COLOR BY TEMPERATURE
// ===============================
function changeBackground(temp) {
  const body = document.body;

  if (temp >= 30) {
    gsap.to(body, { background: "linear-gradient(135deg, #FF7E5F, #FEB47B)", duration: 1 });
  } else if (temp >= 20) {
    gsap.to(body, { background: "linear-gradient(135deg, #74ABE2, #5563DE)", duration: 1 });
  } else {
    gsap.to(body, { background: "linear-gradient(135deg, #4E54C8, #8F94FB)", duration: 1 });
  }
}

// ===============================
// UI ANIMATIONS (GSAP)
// ===============================
function animateUI() {
  gsap.from(".city", { y: -30, opacity: 0, duration: 1 });
  gsap.from(".temp", { scale: 0, opacity: 0, duration: 1, delay: 0.3 });
  gsap.from(".desc", { y: 20, opacity: 0, duration: 1, delay: 0.6 });
  gsap.from(".details", { y: 30, opacity: 0, duration: 1, delay: 0.9 });
  gsap.from(".update", { opacity: 0, duration: 1, delay: 1.2 });
}

// ===============================
// REFRESH BUTTON
// ===============================
document.getElementById("refreshBtn").addEventListener("click", () => {
  localStorage.removeItem(cacheKey); // clear cache
  getWeatherData();
});

// ===============================
// INITIAL CALL
// ===============================
getWeatherData();

