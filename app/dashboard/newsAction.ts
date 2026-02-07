// app/dashboard/newsAction.ts

export async function getNewsFeed() {
  const API_KEY = process.env.NEWS_API_KEY;
  const keyword = encodeURIComponent("삼성 OR 하이닉스");
  // const url = `https://newsapi.org/v2/everything?q=삼성&sortBy=publishedAt&language=ko&apiKey=${API_KEY}`;
  const url = `https://newsapi.org/v2/everything?q=${keyword}&sortBy=publishedAt&language=ko&apiKey=${API_KEY}`;
  try {
    const res = await fetch(url, { next: { revalidate: 7200 } });
    const data = await res.json();

    if (data.status === "ok" && data.articles) {
      return data.articles.slice(0, 10);
    }

    console.error("뉴스 API 응답 이상:", data.message);
    return []; // 에러 시 빈 배열 반환
  } catch (error) {
    console.error("뉴스 페치 에러:", error);
    return []; // 네트워크 에러 시 빈 배열 반환
  }
}
