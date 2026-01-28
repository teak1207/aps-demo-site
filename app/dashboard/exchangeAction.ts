export async function getExchangeRate() {
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // 환율도 1시간 캐싱
    const data = await res.json();

    if (data.result === "success") {
      // KRW 환율만 쏙 뽑아서 리턴
      return data.conversion_rates.KRW;
    }
    return null;
  } catch (error) {
    return null;
  }
}
