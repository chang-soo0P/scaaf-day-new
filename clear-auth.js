// 브라우저 콘솔에서 실행할 스크립트
// sessionStorage 초기화하여 mock 모드 비활성화

console.log("Clearing auth storage...");
sessionStorage.removeItem("auth-storage");
console.log("Auth storage cleared. Please refresh the page.");

// 페이지 새로고침
window.location.reload();

