// 延迟加载emoji图片
(function() {
    // 监听LCP完成后再加载
    let lcpDone = false;
    
    new PerformanceObserver((list) => {
        lcpDone = true;
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    function loadEmojis() {
        const imgs = document.querySelectorAll('.SleepImg[data-emoji]');
        imgs.forEach(img => {
            const emojiUrl = img.getAttribute('data-emoji');
            if (emojiUrl) {
                img.src = emojiUrl;
            }
        });
    }
    
    // 等待至少3秒或LCP完成
    setTimeout(() => {
        if (lcpDone || document.readyState === 'complete') {
            loadEmojis();
        } else {
            window.addEventListener('load', () => {
                setTimeout(loadEmojis, 500);
            });
        }
    }, 3000);
})();
