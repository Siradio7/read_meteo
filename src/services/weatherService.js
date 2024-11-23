import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Créer une instance axios avec des paramètres par défaut
const weatherAPI = axios.create({
    baseURL: BASE_URL,
    params: {
        appid: API_KEY,
        units: 'metric',
        lang: 'fr'
    },
    timeout: 5000 // timeout après 5 secondes
});

// Cache avec limite de taille
const MAX_CACHE_SIZE = 10;
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const cleanCache = () => {
    if (cache.size > MAX_CACHE_SIZE) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
    }
};

const getCacheKey = (params) => JSON.stringify(params);

const getFromCache = (cacheKey) => {
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
    }
    cache.delete(cacheKey);
    return null;
};

export const getWeatherByCity = async (city) => {
    const cacheKey = getCacheKey({ city });
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await weatherAPI.get('', {
            params: { q: city }
        });
        
        const data = response.data;
        cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        cleanCache();
        
        return data;
    } catch (error) {
        if (error.response?.status === 404) {
            throw new Error('Ville non trouvée');
        }
        throw new Error('Erreur lors de la récupération des données météo');
    }
};

export const getWeatherByCoordinates = async (latitude, longitude) => {
    const cacheKey = getCacheKey({ latitude, longitude });
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await weatherAPI.get('', {
            params: { lat: latitude, lon: longitude }
        });
        
        const data = response.data;
        cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
        cleanCache();
        
        return data;
    } catch (error) {
        throw new Error('Impossible de récupérer les données météo');
    }
};
