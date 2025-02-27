// 获取操作系统和浏览器信息
function getBrowserAndOSInfo() {
    const userAgent = navigator.userAgent;
    document.getElementById("userAgentInfo").textContent = userAgent;

    const osPatterns = [
        { pattern: /Windows NT 10.0/, name: "Windows 10" },
        { pattern: /Windows NT 6.3/, name: "Windows 8.1" },
        { pattern: /Windows NT 6.2/, name: "Windows 8" },
        { pattern: /Windows NT 6.1/, name: "Windows 7" },
        { pattern: /Windows NT 6.0/, name: "Windows Vista" },
        { pattern: /Windows NT 5.1/, name: "Windows XP" },
        { pattern: /Windows NT 5.0/, name: "Windows 2000" },
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
            if (match) {
                return name + (match[1] ? ` ${match[1]}` : "");
            }
        }
        return "未知";
    }

    const os = matchPattern(osPatterns, userAgent);
    const browser = matchPattern(browserPatterns, userAgent);

    document.getElementById("osInfo").textContent = os;
    document.getElementById("browserInfo").textContent = browser;
}

// 获取屏幕尺寸
function updateScreenSize() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenSize = `${screenWidth} x ${screenHeight} px`;
    document.getElementById("screenSize").textContent = screenSize;
}

// 获取IP地址
async function getIPAddress() {
    try {
        const response = await fetch("https://api.suyanw.cn/api/ip.php");
        const ip = await response.text();
        document.getElementById("ipAddress").textContent = ip;
        getIPLocation(ip);
    } catch (error) {
        console.error("获取IP地址失败:", error);
        document.getElementById("ipAddress").textContent = "获取IP地址失败";
    }
}

// 获取IP地址信息
async function getIPLocation(ip) {
    try {
        const response = await fetch(`https://api.suyanw.cn/api/ipcha.php?ip=${ip}`);
        const data = await response.json();
        document.getElementById("ipLocation").textContent = data && data.code === 1 && data.text ? data.text : "IP地址信息获取失败";
    } catch (error) {
        console.error("获取IP地址信息失败:", error);
        document.getElementById("ipLocation").textContent = "IP地址信息获取失败";
    }
}

// 更新当前时间
function updateTime() {
    const now = new Date();
    const timeString = now.toISOString().replace("T", " ").substring(0, 19);
    document.getElementById('sysTime').textContent = timeString;
}

// 页面加载时立即更新
document.addEventListener('DOMContentLoaded', () => {
    getBrowserAndOSInfo();
    updateScreenSize();
    getIPAddress();
    updateTime();
    setInterval(updateTime, 1000); // 每秒更新一次时间
});