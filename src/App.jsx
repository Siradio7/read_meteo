import { useState, useEffect } from 'react';
import axios from 'axios';
import 'animate.css';

function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [locationError, setLocationError] = useState(null);

    const API_KEY = '7f8a298784aea522c3d479ad2d45869a';

    const getWeatherByCity = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`);
            setWeather(response.data);
            setError(null);
        } catch (error) {
            setError('Ville non trouvée');
            setWeather(null);
            console.error(error)
        }
    };

    const getWeatherByCoordinates = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`);
            setWeather(response.data);
            setLocationError(null);
        } catch (error) {
            setLocationError('Impossible de récupérer les données météo');
            setWeather(null);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    getWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    setLocationError('Accès à la géolocalisation refusé');
                    console.error(error)
                }
            );
        } else {
            setLocationError('Géolocalisation non supportée par ce navigateur');
        }
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4 md:p-8 animate__animated animate__fadeIn animate__delay-1s">
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl max-w-md w-full animate__animated animate__fadeIn animate__delay-2s">
                <h1 className="text-2xl md:text-4xl font-extrabold text-white text-center mb-4 md:mb-6 animate__animated animate__fadeIn animate__delay-3s">Application Météo</h1>
                <form onSubmit={getWeatherByCity} className="flex flex-col md:flex-row mb-4 md:mb-6">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 mb-2 md:mb-0 md:mr-2 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Entrez le nom de la ville"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
                    >
                        Rechercher
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mb-4 animate__animated animate__shakeX animate__delay-4s">{error}</p>}
                {locationError && <p className="text-red-500 text-center mb-4 animate__animated animate__shakeX animate__delay-4s">{locationError}</p>}

                {weather && (
                    <div className="text-center animate__animated animate__fadeIn animate__delay-5s text-white">
                        <h2 className="text-xl md:text-3xl font-bold">{weather.name}</h2>
                        <p className="text-lg md:text-2xl my-2">{weather.main.temp}°C</p>
                        <p className="text-base md:text-lg capitalize">{weather.weather[0].description}</p>
                        <div className="mt-4">
                            <img
                                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt="weather icon"
                                className="w-20 h-20 md:w-24 md:h-24 mx-auto"
                            />
                        </div>
                        <div className="mt-4 text-left">
                            <p><span className="font-semibold">Humidité:</span> {weather.main.humidity}%</p>
                            <p><span className="font-semibold">Pression:</span> {weather.main.pressure} hPa</p>
                            <p><span className="font-semibold">Vitesse du vent:</span> {weather.wind.speed} m/s</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
