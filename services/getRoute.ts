// import { GOOGLE_MAPS_API_KEY } from '@env';

export const getRoute = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
): Promise<any> => {
    try {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${'AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg'}&mode=driving&departure_time=now&traffic_model=best_guess`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
            return data.routes[0]; // Return the first route
        } else {
            throw new Error('No routes found');
        }
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
};