'use strict';

let cheerio = require('cheerio');

module.exports = {
    handler: function (data, defaultTitle, defaultKeywords, defaultDescription) {
        let $ = cheerio.load(data);
        let title = $('title').text();
        let keywords = $('meta[name="keywords"]').attr('content');
        let description = $('meta[name="description"]').attr('content');
        let html = '';

        if (title)
            html += '<title>' + title + '</title>';
        else
            html += '<title>' + defaultTitle + '</title>';

        if (keywords)
            html += '<meta name="keywords" content="' + keywords + '">';
        else
            html += '<meta name="keywords" content="' + defaultKeywords + '">';

        if (description)
            html += '<meta name="keywords" content="' + description + '">';
        else
            html += '<meta name="keywords" content="' + defaultDescription + '">';

        return html;
    }
};
