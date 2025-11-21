// 브라우저 콘솔에서 실행할 디버깅 스크립트

console.log("🔍 Gmail AI Agent - 인증 상태 디버깅");
console.log("=====================================");

// 1. 세션 스토리지 확인
const authStorage = sessionStorage.getItem('auth-storage');
console.log("📦 Session Storage (auth-storage):", authStorage ? "✅ 존재" : "❌ 없음");

if (authStorage) {
  try {
    const authData = JSON.parse(authStorage);
    console.log("👤 사용자 정보:", authData.user);
    console.log("🔐 인증 상태:", authData.isAuthenticated);
    console.log("🎭 Mock 모드:", authData.isMockMode);
    console.log("🎫 액세스 토큰:", authData.user?.accessToken ? "✅ 있음" : "❌ 없음");
    
    if (authData.user?.accessToken) {
      console.log("🎫 토큰 (처음 10자):", authData.user.accessToken.substring(0, 10) + "...");
//      console.log("🎫 Mock 토큰 여부:", authData.user.accessToken === "mock_access_token");
    }
  } catch (error) {
    console.error("❌ 세션 스토리지 파싱 오류:", error);
  }
}

// 2. 쿠키 확인
const cookies = document.cookie;
console.log("🍪 쿠키:", cookies ? "✅ 있음" : "❌ 없음");

if (cookies.includes('gmail_access_token')) {
  console.log("📧 Gmail 액세스 토큰 쿠키: ✅ 있음");
} else {
  console.log("📧 Gmail 액세스 토큰 쿠키: ❌ 없음");
}

// 3. 현재 URL 확인
console.log("🌐 현재 URL:", window.location.href);

// 4. API 호출 테스트
console.log("🧪 API 호출 테스트 시작...");
fetch('/api/gmail/messages?accessToken=test')
  .then(response => {
    console.log("📡 API 응답 상태:", response.status, response.statusText);
    return response.text();
  })
  .then(data => {
    console.log("📡 API 응답 데이터:", data);
  })
  .catch(error => {
    console.error("❌ API 호출 오류:", error);
  });

console.log("=====================================");
console.log("💡 다음 단계:");
console.log("1. 세션 스토리지가 없으면 → Gmail 재연동 필요");
console.log("2. Mock 토큰이면 → 브라우저 새로고침 후 재연동");
console.log("3. 실제 토큰이면 → Gmail API 호출 상태 확인");