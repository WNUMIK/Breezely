
# Breezely 🌤️

**Breezely** is a weather application that combines **React** on the frontend and **Flask** on the backend to deliver real-time weather updates, city comparisons, and interactive weather animations. This project follows a modular and scalable architecture, making it easy to develop further.

## ✨ Features

- 🌍 **Real-Time Weather**: Get current weather for any city worldwide.
- 🏙️ **Weather Comparison**: Compare weather data across multiple cities.
- 🌟 **Favorite Cities**: Add and manage favorite cities with dynamic updates.
- ✨ **Featured Cities**: Automatically displays weather data for popular cities.
- 🎞️ **Weather Animations**: Animated weather icons using Lottie.
- 📱 **Responsive Design**: Optimized for both mobile and desktop devices.

## 🛠️ Tech Stack

- **Frontend**: React, CSS Modules, Lottie Animations
- **Backend**: Flask, Python
- **API**: OpenWeatherMap API for weather data

## 📂 Project Structure

```bash
Breezely-master/
│
├── backend/                  # Flask backend
│   ├── app/                  # Main application files (Flask)
│   ├── tests/                # Backend tests
│   └── wsgi.py               # WSGI entry point
│
├── frontend/                 # React frontend
│   ├── public/               # Static public files
│   ├── src/                  # Source code for React components
│   ├── package.json          # Frontend dependencies
│   └── README.md             # Frontend documentation
│
├── .gitignore                # Git ignore rules
├── Pipfile                   # Python dependencies
├── run.sh                    # Shell script to run the project
└── README.md                 # Project documentation
```

## 🚀 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/WNUMIK/Breezely.git
   cd Breezely-master
   ```

### Backend Setup

2. **Set up the backend environment and install dependencies**:

   ```bash
   cd backend
   pip install pipenv
   pipenv install
   ```

3. **Create a `.env` file** in the `backend/` directory with your API keys:

   ```env
   WEATHER_API_KEY=your_openweathermap_api_key
   ```

4. **Run the backend server**:

   ```bash
   flask run
   ```

### Frontend Setup

5. **Set up the frontend and install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

6. **Run the frontend development server**:

   ```bash
   npm start
   ```

   The frontend will be accessible at **`http://localhost:3000`** and the backend at **`http://localhost:5000`**.

## 🌱 Future Enhancements

- 🔐 **User Authentication**: Allow users to log in and save favorite cities.
- 📍 **Geolocation Support**: Automatically detect user location for local weather.
- 📅 **Extended Forecast**: Provide a 7-day weather forecast for cities.

## 📄 License

This project is licensed under the **MIT License**.
