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

        if (port === '1124') { // 新增的条件判断：如果输入是 '1124'
            // 执行跳转到 HTML 内部的 #f10wer 子菜单
            window.location.href = '#f10wer';
            // 可选：阻止页面刷新，如果 #f10wer 已经在当前页面
            // event.preventDefault(); // 注意：这个需要event参数，如果需要用可以从keydown或click事件中传递
        } else if (port) { // 否则，如果输入不为空（且不是 '1124'）
            window.open(`http://debug.mlyr.top:${port}`, '_blank');
        } else { // 如果输入为空
            alert('你想干啥？');
        }
    }
});