import { useState, useEffect, useCallback, memo } from 'react';
import { getWeatherByCity, getWeatherByCoordinates } from './services/weatherService';
import WeatherDisplay from './components/WeatherDisplay';
import 'animate.css';

// Mémoiser le composant WeatherDisplay
const MemoizedWeatherDisplay = memo(WeatherDisplay);

function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCitySearch = useCallback(async (e) => {
        e.preventDefault();
        if (!city.trim()) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const data = await getWeatherByCity(city);
            setWeather(data);
        } catch (error) {
            setError(error.message);
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    }, [city]);

    const handleGeolocation = useCallback(async (position) => {
        const { latitude, longitude } = position.coords;
        setIsLoading(true);
        setLocationError(null);

        try {
            const data = await getWeatherByCoordinates(latitude, longitude);
            setWeather(data);
        } catch (error) {
            setLocationError(error.message);
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                handleGeolocation,
                (error) => {
                    setLocationError('Accès à la géolocalisation refusé');
                    console.error(error);
                }
            );
        } else {
            setLocationError('Géolocalisation non supportée par ce navigateur');
        }
    }, [handleGeolocation]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4 md:p-8 animate__animated animate__fadeIn animate__faster">
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl max-w-md w-full animate__animated animate__fadeInUp animate__faster">
                <h1 className="text-2xl md:text-4xl font-extrabold text-white text-center mb-4 md:mb-6 animate__animated animate__fadeInDown animate__faster">
                    WeatherScope
                </h1>
                
                <form onSubmit={handleCitySearch} className="flex flex-col md:flex-row mb-4 md:mb-6 animate__animated animate__fadeIn animate__faster">
                    <input
                        type="text"
                        className="flex-1 px-4 py-2 mb-2 md:mb-0 md:mr-2 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                        placeholder="Entrez le nom de la ville"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        aria-label="Nom de la ville"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50"
                        disabled={isLoading || !city.trim()}
                    >
                        {isLoading ? 'Chargement...' : 'Rechercher'}
                    </button>
                </form>

                {error && (
                    <p role="alert" className="text-red-500 text-center mb-4 animate__animated animate__shakeX animate__faster">
                        {error}
                    </p>
                )}
                
                {locationError && (
                    <p role="alert" className="text-red-500 text-center mb-4 animate__animated animate__shakeX animate__faster">
                        {locationError}
                    </p>
                )}

                {isLoading ? (
                    <div className="text-center text-white animate__animated animate__pulse animate__infinite">
                        <p>Chargement des données météo...</p>
                    </div>
                ) : (
                    <MemoizedWeatherDisplay weather={weather} />
                )}
            </div>
        </div>
    );
}

export default App;
