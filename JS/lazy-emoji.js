// 延迟加载emoji图片
(function() {
    function loadEmojis() {
        requestIdleCallback(() => {
            const defaultImg = document.querySelector('.SleepImg.default');
            const alternateImg = document.querySelector('.SleepImg.alternate');
            
            if (defaultImg) {
                defaultImg.src = 'https://www.emojiall.com/images/240/microsoft-teams/1f928.png';
            }
            if (alternateImg) {
                alternateImg.src = 'https://www.emojiall.com/images/240/microsoft-teams/1f60e.png';
            }
        }, { timeout: 2000 });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadEmojis);
    } else {
        loadEmojis();
    }
})();
