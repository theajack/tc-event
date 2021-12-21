window.jsboxCode = {
    lib: 'https://cdn.jsdelivr.net/npm/tc-event/tc-event.min.js',
    lang: 'html',
    code: /* html */`<button onclick="emitEvent()">emitEvent</button>
<script>
    TEvent.clear()
    TEvent.regist('myEvent', function (data) {
        alert('emited!' + data);
    })
    function emitEvent(){
        TEvent.emit('myEvent', 'Hello!');
    }
</script>`
};