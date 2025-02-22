// 获取操作系统和浏览器信息
function getBrowserAndOSInfo() {
    const userAgent = navigator.userAgent;
    document.getElementById("userAgentInfo").textContent = userAgent;

    let os = "未知操作系统";
    if (userAgent.indexOf("Windows") !== -1) {
        os = "Windows";
        if (userAgent.indexOf("Windows NT 10.0") !== -1) os += " 10";
        else if (userAgent.indexOf("Windows NT 6.3") !== -1) os += " 8.1";
        else if (userAgent.indexOf("Windows NT 6.2") !== -1) os += " 8";
        else if (userAgent.indexOf("Windows NT 6.1") !== -1) os += " 7";
        else if (userAgent.indexOf("Windows NT 6.0") !== -1) os += " Vista";
        else if (userAgent.indexOf("Windows NT 5.1") !== -1) os += " XP";
        else if (userAgent.indexOf("Windows NT 5.0") !== -1) os += " 2000";
    } else if (userAgent.indexOf("Android") !== -1) {
        os = "Android";
        const versionMatch = userAgent.match(/Android\s([0-9\.]+)/);
        if (versionMatch) {
            os += " " + versionMatch[1];
        }
    } else if (userAgent.indexOf("iPhone") !== -1) {
        os = "iPhone";
    } else if (userAgent.indexOf("Mac") !== -1) {
        os = "Mac";
    } else if (userAgent.indexOf("iOS") !== -1) {
        os = "IOS";
    } else if (userAgent.indexOf("Linux") !== -1) {
        os = "Linux";
    }

    let browser = "未知浏览器";
    if (userAgent.indexOf("Chrome") !== -1) {
        browser = "Chrome";
        let version = userAgent.substring(userAgent.indexOf("Chrome/") + 7);
        if (version.indexOf(" ") !== -1) {
            version = version.substring(0, version.indexOf(" "));
        }
        browser += " " + version;
    } else if (userAgent.indexOf("Firefox") !== -1) {
        browser = "Firefox";
        let version = userAgent.substring(userAgent.indexOf("Firefox/") + 8);
        if (version.indexOf(" ") !== -1) {
            version = version.substring(0, version.indexOf(" "));
        }
        browser += " " + version;
    } else if (userAgent.indexOf("Safari") !== -1) {
        browser = "Safari";
        let version = userAgent.substring(userAgent.indexOf("Version/") + 8);
        if (version.indexOf(" ") !== -1) {
            version = version.substring(0, version.indexOf(" "));
        }
        browser += " " + version;
    } else if (userAgent.indexOf("Edge") !== -1) {
        browser = "Edge";
        let version = userAgent.substring(userAgent.indexOf("Edge/") + 5);
        if (version.indexOf(" ") !== -1) {
            version = version.substring(0, version.indexOf(" "));
        }
        browser += " " + version;
    } else if (userAgent.indexOf("Opera") !== -1 || userAgent.indexOf("OPR") !== -1) {
        browser = "Opera";
        let version = userAgent.substring(userAgent.indexOf("Version/") + 8);
        if (version.indexOf(" ") !== -1) {
            version = version.substring(0, version.indexOf(" "));
        }
        browser += " " + version;
    }

    document.getElementById("osInfo").textContent = os;
    document.getElementById("browserInfo").textContent = browser;
}

// 获取IP地址
function getIPAddress() {
    fetch("https://api.suyanw.cn/api/ip.php")
        .then(response => response.text())
        .then(ip => {
            document.getElementById("ipAddress").textContent = ip;
            getIPLocation(ip);
        })
        .catch(error => {
            console.error("获取IP地址失败:", error);
            document.getElementById("ipAddress").textContent = "获取IP地址失败";
        });
}

// 获取IP地址信息
function getIPLocation(ip) {
    fetch(`https://api.suyanw.cn/api/ipcha.php?ip=${ip}`)
        .then(response => response.json())
        .then(data => {
            if (data && data.code === 1 && data.text) {
                document.getElementById("ipLocation").textContent = data.text;
            } else {
                document.getElementById("ipLocation").textContent = "IP地址信息获取失败";
            }
        })
        .catch(error => {
            console.error("获取IP地址信息失败:", error);
            document.getElementById("ipLocation").textContent = "IP地址信息获取失败";
        });
}

getBrowserAndOSInfo();
getIPAddress();

function updateTime() {
    const now = new Date();

    // 获取年月日
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，需要加 1
    const day = now.getDate().toString().padStart(2, '0');

    // 获取时分秒
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // 拼接时间字符串
    const timeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // 更新 HTML
    document.getElementById('time').textContent = timeString;
}

// 页面加载时立即更新一次时间
updateTime();

// 每秒更新一次时间
setInterval(updateTime, 1000);