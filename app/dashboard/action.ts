// app/dashboard/actions.ts

// ⚠️ "use server"는 폼 제출이나 클릭 이벤트 시 실행되는 '액션'에 주로 사용합니다.
// 단순히 데이터를 가져오는 함수라면 생략해도 서버 컴포넌트에서 안전하게 실행됩니다.

export async function getWeatherData() {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  const CITY = "Dongtan";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=kr`;
  // 서버 터미널 키 확인
  console.log("발급된 키 확인:", API_KEY);

  if (!API_KEY) {
    console.error("API 키가 설정되지 않았습니다.");
    return null;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      // 401이면 키 미활성화/오류, 404면 도시 이름 오류 등
      const errorData = await res.json();
      console.error("API 응답 에러:", errorData);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("네트워크 에러:", error);
    return null;
  }
}
