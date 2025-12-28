export interface AiRecipeResult {
  id: number;
  title: string;
  ingredients: string;
  category: string;
  score: number;
  texture?: string;
}

export const fetchAiRecommendations = async (
  query: string,
  allergens: string = ""
): Promise<AiRecipeResult[]> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        allergens: allergens,
        top_k: 3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", errorText);
      throw new Error("Failed to fetch recommendations");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("AI Service Error:", error);
    return [];
  }
};
