import PropTypes from 'prop-types';
import { memo } from 'react';
import 'animate.css';

const WeatherDisplay = ({ weather }) => {
    if (!weather) return null;

    return (
        <div className="text-center text-white animate__animated animate__fadeIn animate__faster">
            <h2 className="text-xl md:text-3xl font-bold animate__animated animate__fadeInDown animate__faster" aria-label={`Météo pour ${weather.name}`}>
                {weather.name}
            </h2>
            <p className="text-lg md:text-2xl my-2 animate__animated animate__fadeIn animate__faster" aria-label={`Température: ${weather.main.temp} degrés Celsius`}>
                {weather.main.temp}°C
            </p>
            <p className="text-base md:text-lg capitalize animate__animated animate__fadeIn animate__faster" aria-label={`Conditions: ${weather.weather[0].description}`}>
                {weather.weather[0].description}
            </p>
            <div className="mt-4 animate__animated animate__fadeIn animate__faster">
                <img
                    src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    className="w-20 h-20 md:w-24 md:h-24 mx-auto"
                    loading="lazy"
                />
            </div>
            <div className="mt-4 text-left grid grid-cols-1 gap-2 animate__animated animate__fadeInUp animate__faster">
                <p aria-label={`Humidité: ${weather.main.humidity} pourcent`} className="animate__animated animate__fadeIn animate__delay-1s">
                    <span className="font-semibold">Humidité:</span> {weather.main.humidity}%
                </p>
                <p aria-label={`Pression: ${weather.main.pressure} hectopascals`} className="animate__animated animate__fadeIn animate__delay-1s">
                    <span className="font-semibold">Pression:</span> {weather.main.pressure} hPa
                </p>
                <p aria-label={`Vitesse du vent: ${weather.wind.speed} mètres par seconde`} className="animate__animated animate__fadeIn animate__delay-1s">
                    <span className="font-semibold">Vitesse du vent:</span> {weather.wind.speed} m/s
                </p>
            </div>
        </div>
    );
};

WeatherDisplay.propTypes = {
    weather: PropTypes.shape({
        name: PropTypes.string.isRequired,
        main: PropTypes.shape({
            temp: PropTypes.number.isRequired,
            humidity: PropTypes.number.isRequired,
            pressure: PropTypes.number.isRequired,
        }).isRequired,
        weather: PropTypes.arrayOf(
            PropTypes.shape({
                description: PropTypes.string.isRequired,
                icon: PropTypes.string.isRequired,
            })
        ).isRequired,
        wind: PropTypes.shape({
            speed: PropTypes.number.isRequired,
        }).isRequired,
    }),
};

// Utiliser memo pour éviter les re-rendus inutiles
export default memo(WeatherDisplay);
