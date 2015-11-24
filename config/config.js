'use strict';

module.exports = {
    app: {
        title: 'ArrowJS',
        description: '',
        keywords: '',
        logo: '',
        icon: ''
    },
    langPath : "/lang",
    language: 'en_US',
    long_stack : false, //only use for development. Carefully: this will slow system.
    port: process.env.PORT || 8000,
    ArrowHelper : "/helpers/"
};