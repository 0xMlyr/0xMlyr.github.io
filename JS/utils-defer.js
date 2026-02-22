// 合并的defer脚本：lazy-emoji + debug + ip-record

// ========== Lazy Emoji ==========
(function() {
    let lcpDone = false;
    
    new PerformanceObserver((list) => {
        lcpDone = true;
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    function loadEmojis() {
        const imgs = document.querySelectorAll('.SleepImg[data-emoji]');
        imgs.forEach(img => {
            const emojiUrl = img.getAttribute('data-emoji');
            if (emojiUrl) img.src = emojiUrl;
        });
    }
    
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

// ========== Debug Tool ==========
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('debug-input');
    const submitButton = document.getElementById('debug-submit');
    
    if (!input || !submitButton) return;

    function submitInput() {
        const port = input.value;
        if (port) {
            window.open(`http://debug.mlyr.top:${port}`, '_blank');
        } else {
            alert('啥也没输你想干啥？');
        }
    }

    submitButton.addEventListener('click', submitInput);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitInput();
    });
});

// ========== IP Record ==========
function getBrowserAndOSInfo() {
    const userAgent = navigator.userAgent;
    const el = document.getElementById("userAgentInfo");
    if (el) el.textContent = userAgent;

    const osPatterns = [
        { pattern: /Windows NT 10.0/, name: "Windows 10" },
        { pattern: /Windows NT 6.3/, name: "Windows 8.1" },
        { pattern: /Windows NT 6.2/, name: "Windows 8" },
        { pattern: /Windows NT 6.1/, name: "Windows 7" },
        { pattern: /Android ([0-9\.]+)/, name: "Android" },
        { pattern: /iPhone/, name: "iPhone iOS" },
        { pattern: /Mac/, name: "Mac" },
        { pattern: /iOS/, name: "iOS" },
        { pattern: /Linux/, name: "Linux" }
    ];

    const browserPatterns = [
        { pattern: /Chrome\/([0-9\.]+)/, name: "Chrome" },
        { pattern: /Firefox\/([0-9\.]+)/, name: "Firefox" },
        { pattern: /Safari\/([0-9\.]+)/, name: "Safari" },
        { pattern: /Edge\/([0-9\.]+)/, name: "Edge" },
        { pattern: /Opera\/([0-9\.]+)|OPR\/([0-9\.]+)/, name: "Opera" }
    ];

    function matchPattern(patterns, userAgent) {
        for (const { pattern, name } of patterns) {
            const match = userAgent.match(pattern);
            if (match) return name + (match[1] ? ` ${match[1]}` : "");
        }
        return "未知";
    }

    const osEl = document.getElementById("osInfo");
    const browserEl = document.getElementById("browserInfo");
    if (osEl) osEl.textContent = matchPattern(osPatterns, userAgent);
    if (browserEl) browserEl.textContent = matchPattern(browserPatterns, userAgent);
}

function updateScreenSize() {
    const el = document.getElementById("screenSize");
    if (el) el.textContent = `${window.screen.width} x ${window.screen.height} px`;
}

async function getIPAddress() {
    try {
        const response = await fetch("https://api.suyanw.cn/api/ip.php");
        const ip = await response.text();
        const el = document.getElementById("ipAddress");
        if (el) el.textContent = ip;
        getIPLocation(ip);
        recordVisit(ip);
    } catch (error) {
        console.error("获取IP地址失败:", error);
        const el = document.getElementById("ipAddress");
        if (el) el.textContent = "获取IP地址失败";
        recordVisit('unknown');
    }
}

async function getIPLocation(ip) {
    try {
        const response = await fetch(`https://api.suyanw.cn/api/ipcha.php?ip=${ip}`);
        const data = await response.json();
        const el = document.getElementById("ipLocation");
        if (el) el.textContent = data && data.code === 1 && data.text ? data.text : "IP地址信息获取失败";
    } catch (error) {
        console.error("获取IP地址信息失败:", error);
        const el = document.getElementById("ipLocation");
        if (el) el.textContent = "IP地址信息获取失败";
    }
}

function updateTime() {
    const now = new Date();
    const timeString = now.getFullYear() + '-' + 
        String(now.getMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getDate()).padStart(2, '0') + ' ' + 
        String(now.getHours()).padStart(2, '0') + ':' + 
        String(now.getMinutes()).padStart(2, '0') + ':' + 
        String(now.getSeconds()).padStart(2, '0') + 
        ' (UTC' + (now.getTimezoneOffset() > 0 ? '-' : '+') + 
        String(Math.abs(Math.floor(now.getTimezoneOffset() / 60))).padStart(2, '0') + ':' + 
        String(Math.abs(now.getTimezoneOffset() % 60)).padStart(2, '0') + ')';
    const el = document.getElementById('sysTime');
    if (el) el.textContent = timeString;
}

async function recordVisit(ip) {
    try {
        const response = await fetch('https://mlyr.top:4099/api/visit', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ip: ip})
        });
        const data = await response.json();
        if (data.success) updateVisitCount(data.count);
    } catch (error) {
        console.error('记录访问失败:', error);
    }
}

async function getVisitCount() {
    try {
        const response = await fetch('https://mlyr.top:4099/api/count');
        const data = await response.json();
        if (data.success) updateVisitCount(data.count);
    } catch (error) {
        console.error('获取访问量失败:', error);
    }
}

function updateVisitCount(count) {
    const el = document.getElementById('visitCount');
    if (el) el.textContent = count;
}

document.addEventListener('DOMContentLoaded', () => {
    getBrowserAndOSInfo();
    updateScreenSize();
    getIPAddress();
    updateTime();
    setInterval(updateTime, 1000);
    getVisitCount();
});

// ========== Console Easter Egg ==========
!function () {
    if (window.console && window.console.log) {
        const e = (...e) => setTimeout(console.log.bind(console, ...e));
        e("\n %c  © 慕灵一儒  %c https://mlyr.top \n", "color:#FFFFFB;background:#0a7a13;padding:5px 0;border-radius:.5rem 0 0 .5rem;", "background: #e9eea0;padding:5px 0 5px;border-radius:0 .5rem .5rem 0;"),
            e(`%c页面加载消耗了 ${(Math.round(100 * performance.now()) / 100 / 1e3).toFixed(2)}s`, "background: #fff;color: #333;text-shadow: 0 0 2px #eee, 0 0 3px #eee, 0 0 3px #eee, 0 0 2px #eee, 0 0 3px #eee;"),
            localStorage.getItem("access") || localStorage.setItem("access", (new Date).getTime());
        let o = new Date(Number.parseInt(localStorage.getItem("access"))),
            t = `${o.getFullYear()}年${o.getMonth() + 1}月${o.getDate()}日`, n = 0; localStorage.getItem("hit") ? n = Number.parseInt(localStorage.getItem("hit")) : localStorage.setItem("hit", 0), localStorage.setItem("hit", ++n),
                e(`这是你自 ${t} 以来第 ${n} 次在控制台打开本站，你想知道什么秘密嘛~`);
    }
}();
