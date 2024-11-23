import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import '../styles/animations.css';

const AnimatedBackground = ({ weather }) => {
    const [elements, setElements] = useState([]);

    const weatherClass = useMemo(() => {
        if (!weather) return 'clear';
        
        const weatherId = weather.weather[0].id;
        if (weatherId >= 200 && weatherId < 300) return 'storm';
        if (weatherId >= 300 && weatherId < 600) return 'rain';
        if (weatherId >= 600 && weatherId < 700) return 'snow';
        if (weatherId >= 700 && weatherId < 800) return 'cloudy';
        if (weatherId === 800) return 'clear';
        return 'cloudy';
    }, [weather]);

    const elementCount = useMemo(() => {
        const isMobile = window.innerWidth < 768;
        switch (weatherClass) {
            case 'clear':
                return isMobile ? 50 : 100;
            case 'cloudy':
                return isMobile ? 8 : 15;
            case 'rain':
                return isMobile ? 50 : 100;
            case 'snow':
                return isMobile ? 30 : 60;
            case 'storm':
                return isMobile ? 3 : 5;
            default:
                return 0;
        }
    }, [weatherClass]);

    const getAnimationDuration = () => {
        switch (weatherClass) {
            case 'clear':
                return 2 + Math.random() * 3;
            case 'cloudy':
                return 15 + Math.random() * 10;
            case 'rain':
                return 0.8 + Math.random() * 0.3;
            case 'snow':
                return 5 + Math.random() * 3;
            case 'storm':
                return 3 + Math.random() * 2;
            default:
                return 2;
        }
    };

    const generateElements = () => {
        return Array.from({ length: elementCount }, (_, index) => ({
            id: index,
            style: {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${getAnimationDuration()}s`,
                animationDelay: `${Math.random() * 5}s`
            }
        }));
    };

    useEffect(() => {
        const handleResize = () => {
            setElements(generateElements());
        };

        setElements(generateElements());
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [elementCount]);

    return (
        <div className={`animated-background ${weatherClass}`}>
            <div className="overlay" />
            <div className="elements-container">
                {elements.map(element => (
                    <div
                        key={element.id}
                        className="animated-element"
                        style={element.style}
                    />
                ))}
            </div>
        </div>
    );
};

AnimatedBackground.propTypes = {
    weather: PropTypes.shape({
        weather: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired
            })
        ).isRequired
    })
};

export default AnimatedBackground;
