
import { GOOGLE_PLACES_API_KEY } from '@env';

export const getPlacePhotoUrl = async (photoReference: string): Promise<string> => {
    if (!photoReference) {
        console.error('Photo reference is undefined or empty');
        return '';
    }

    try {
        const url = 'https://maps.googleapis.com/maps/api/place/photo';
        const response = await fetch(
            url +
            `maxwidth=400&photoreference=${photoReference}` + `}&key=${'AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg'}`
        );

        // Make the request and follow redirects
        // const response = await axios.get(url, {
        //     params,
        //     responseType: 'text',
        //     maxRedirects: 5, // Ensure axios follows redirects
        // });

        // The final URL after redirects
        const finalUrl = response.request?.responseURL || '';
        if (!finalUrl) {
            throw new Error('No final URL found after redirect');
        }

        console.log('Final image URL:', finalUrl);
        return finalUrl;
    } catch (error) {
        console.error('Error fetching photo URL:', error);
        return '';
    }
};