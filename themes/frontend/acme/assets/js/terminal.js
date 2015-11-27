$(function () {
    var data = [
        {
            strings: ['npm install -g yo generator-arrowjs^400'],
            output: '<span class="gray">install yo & generator-arrowjs</span><br>&nbsp;',
            postDelay: 1000
        },
        {
            strings: ['yo arrowjs^400'],
            output: '<span class="gray">create arrowjs sample application</span><br>&nbsp;',
            postDelay: 1000
        },
        {
            strings: ['cd my-app && yo arrowjs:feature my-feature^400'],
            output: '<span class="gray">create feature my-feature for application my-app</span><br>&nbsp;',
            postDelay: 1000
        }
    ];

    runScripts(data, 0);
});

function runScripts(data, position) {
    var h = $('.history');
    var prompt = $('.prompt'), script = data[position];

    if (script.clear === true) {
        h.html('');
    }

    prompt.removeData();
    $('.typed-cursor').text('');

    prompt.typed({
        contentType: 'text',
        strings: script.strings,
        typeSpeed: 20,
        callback: function () {
            var history = h.html();
            history = history ? [history] : [];
            history.push('$ ' + prompt.text());

            if (script.output) {
                history.push(script.output);
                prompt.html('');
                h.html(history.join('<br>'));
            }

            position++;

            if (position < data.length) {
                setTimeout(function () {
                    runScripts(data, position);
                }, script.postDelay || 1000);
            }
        }
    });
}