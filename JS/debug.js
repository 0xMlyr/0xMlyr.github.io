document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('debug-input');
    const submitButton = document.getElementById('debug-submit');

    // 提交按钮点击事件
    submitButton.addEventListener('click', function () {
        submitInput();
    });

    // 回车键事件
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            submitInput();
        }
    });

    // 提交函数
    function submitInput() {
        const port = input.value;

        if (port) { // 否则，如果输入不为空（且不是 '1124'）
            window.open(`http://debug.mlyr.top:${port}`, '_blank');
        } else { // 如果输入为空
            alert('啥也没输你想干啥？');
        }
    }
});