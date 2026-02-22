// 延迟加载emoji图片
(function() {
    function loadEmojis() {
        requestIdleCallback(() => {
            const imgs = document.querySelectorAll('.SleepImg[data-emoji]');
            imgs.forEach(img => {
                const emojiUrl = img.getAttribute('data-emoji');
                if (emojiUrl) {
                    // 直接替换src，让浏览器异步加载
                    img.src = emojiUrl;
                }
            });
        }, { timeout: 3000 });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadEmojis);
    } else {
        loadEmojis();
    }
})();
