export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  if (!text) return "";

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseData) {
      return data.responseData.translatedText;
    }
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};
