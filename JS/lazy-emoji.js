// 延迟加载emoji图片
(function() {
    function loadEmojis() {
        requestIdleCallback(() => {
            const imgs = document.querySelectorAll('.SleepImg[data-emoji]');
            imgs.forEach(img => {
                const emojiUrl = img.getAttribute('data-emoji');
                if (emojiUrl) {
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = emojiUrl;
                    };
                    newImg.src = emojiUrl;
                }
            });
        }, { timeout: 2000 });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadEmojis);
    } else {
        loadEmojis();
    }
})();
