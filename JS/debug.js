document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('debug-input');

    // 回车键事件
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            submitInput();
        }
    });

    // 提交函数
    function submitInput() {
        const port = input.value;
        if (port) {
            window.open(`http://debug.mlyr.top:${port}`, '_blank');
        } else {
            alert('你想干啥？');
        }
    }
});