// services/recommendationService.ts
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Uses your exported Firestore instance

export async function getRecommendedTypesForUser(
  userId: string
): Promise<string[]> {
  const q = query(
    collection(db, "searchHistory"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);

  const typeFrequency: Record<string, number> = {};
  snapshot.forEach((doc) => {
    const data = doc.data();
    (data.types || []).forEach((type: string) => {
      typeFrequency[type] = (typeFrequency[type] || 0) + 1;
    });
  });

  const sortedTypes = Object.entries(typeFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([type]) => type);

  return sortedTypes.slice(0, 2);
}

export async function fetchNearbyRecommendations(
  lat: number,
  lng: number,
  topTypes: string[],
  apiKey: string
): Promise<any[]> {
  const results: any[] = [];

  for (const type of topTypes) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=${type}&key=${apiKey}`;
    const response = await fetch(url);
    const json = await response.json();
    if (json.results) results.push(...json.results);
  }

  return results;
}
