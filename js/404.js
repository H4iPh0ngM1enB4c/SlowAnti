// Danh sách các trang hợp lệ
const validPages = [
    'index.html',
    'features.html',
    'pricing.html',
    'changelog.html',
    'discord.html',
    'support.html'
];

// Hàm tìm trang gần giống nhất
function findClosestMatch(wrongUrl) {
    let bestMatch = '';
    let bestScore = Infinity;
    
    // Bỏ đuôi .html nếu có
    const searchTerm = wrongUrl.toLowerCase().replace('.html', '');

    validPages.forEach(page => {
        const pageName = page.toLowerCase().replace('.html', '');
        // Tính điểm khác biệt (càng thấp càng giống)
        const score = levenshteinDistance(searchTerm, pageName);
        
        if (score < bestScore) {
            bestScore = score;
            bestMatch = page;
        }
    });

    // Chỉ trả về kết quả nếu độ tương đồng đủ cao
    return bestScore <= 3 ? bestMatch : null;
}

// Hàm tính khoảng cách Levenshtein (độ khác biệt giữa 2 chuỗi)
function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i-1] === str2[j-1]) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = Math.min(
                    dp[i-1][j-1] + 1,  // thay thế
                    dp[i-1][j] + 1,    // xóa
                    dp[i][j-1] + 1     // thêm
                );
            }
        }
    }
    return dp[m][n];
}

// Xử lý khi trang load
window.onload = function() {
    // Lấy URL hiện tại
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();

    // Nếu không phải trang 404.html
    if (fileName !== '404.html') {
        // Tìm trang gần giống nhất
        const closestMatch = findClosestMatch(fileName);
        
        if (closestMatch) {
            // Hiển thị thông báo và tự động chuyển hướng
            document.querySelector('.error-message').innerHTML = 
                `Đang chuyển hướng bạn đến <strong>${closestMatch}</strong> trong <span id="countdown">3</span> giây...`;
            
            let countdown = 3;
            const countdownElement = document.getElementById('countdown');
            
            const timer = setInterval(() => {
                countdown--;
                countdownElement.textContent = countdown;
                
                if (countdown <= 0) {
                    clearInterval(timer);
                    window.location.href = closestMatch;
                }
            }, 1000);
        }
    }
}; 