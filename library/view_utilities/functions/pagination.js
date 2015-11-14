"use strict";

let _ = require('lodash');

module.exports = {
    /**
     * Create pagination
     *
     * @param totalPage - Total page
     * @param currentPage - Current page
     * @param itemLink - Link of page item
     * @param className - Class of pagination use for CSS
     * @param previousButton - Content of previous button
     * @param nextButton - Content of next button
     * @param limitNumberOfPage - Limit number of page display in pagination
     * @returns HTML
     */
    handler: function (totalPage, currentPage, itemLink, className, previousButton, nextButton, limitNumberOfPage) {
        // Set default values
        totalPage = _.isNumber(parseInt(totalPage)) ? totalPage : 1;
        currentPage = _.isNumber(parseInt(currentPage)) ? currentPage : 1;
        className = className || 'pagination';
        previousButton = previousButton || '«';
        nextButton = nextButton || '»';
        limitNumberOfPage = (_.isNumber(limitNumberOfPage) && limitNumberOfPage > 1) ? limitNumberOfPage : 4;

        // Only display pagination when total page > 1
        if (totalPage > 1) {
            let start = currentPage - limitNumberOfPage - 1;
            if (start < 1) {
                start = 1;
            }

            let end = currentPage + limitNumberOfPage - 1;
            if (end > totalPage) {
                end = totalPage;
            }

            let html = `<ul class="${className}">
                            <li class="previous ${currentPage == 1 ? 'disabled' : ''}">
                                <a href="${currentPage == 1 ? '#' : itemLink.replace('{page}', currentPage - 1)}">
                                    ${previousButton}
                                </a>
                            </li>`;

            if (start > 1) {
                let url = itemLink.replace('{page}', start - 1);
                html += `<li><a href="${url}">...</a></li>`
            }

            for (let i = start; i <= end; i++) {
                let url = itemLink.replace('{page}', i);
                let active = currentPage == i ? "active" : "";
                html += `<li class="${active}"><a href="${url}">${i}</a></li>`
            }

            if (end < totalPage) {
                let url = itemLink.replace('{page}', end + 1);
                html += `<li><a href="${url}">...</a></li>`
            }

            html += `<li class="next ${currentPage == totalPage ? 'disabled' : ''}">
                        <a href="${currentPage == totalPage ? '#' : itemLink.replace('{page}', currentPage + 1)}">
                            ${nextButton}
                        </a>
                    </li>
                </ul>`;

            return html;
        } else {
            return '';
        }
    }
};