// 브라우저 콘솔에서 실행할 스크립트
// 모든 인증 관련 세션 스토리지 초기화

console.log("🧹 Clearing all session storage...");

// 모든 세션 스토리지 초기화
sessionStorage.clear();

console.log("✅ Session storage cleared successfully!");
console.log("🔄 Please refresh the page to start fresh with real Gmail data.");

// 페이지 새로고침
window.location.reload();

