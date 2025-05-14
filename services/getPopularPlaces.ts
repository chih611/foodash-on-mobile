export const getDessertPlaces = async (
    latitude: number,
    longitude: number,
    radius: number = 5000 // 5km radius, adjustable
): Promise<any> => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&keyword=desserts&key=${'AIzaSyBF5NvI9qkvQhE69wNxCwzovOr2ja5Cgtg'}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.results) {
            // Sort by rating and number of reviews for popularity
            const sortedResults = data.results.sort((a: any, b: any) => {
                const ratingScoreA = a.rating || 0;
                const ratingScoreB = b.rating || 0;
                const reviewScoreA = a.user_ratings_total || 0;
                const reviewScoreB = b.user_ratings_total || 0;
                return (ratingScoreB * reviewScoreB) - (ratingScoreA * reviewScoreA); // Weighted popularity
            });
            return sortedResults.slice(0, 10); // Return top 10 popular places
        } else {
            throw new Error('No places found');
        }
    } catch (error) {
        console.error('Error fetching dessert places:', error);
        return null;
    }
};