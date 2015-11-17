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
     * @param numberPageOfPagination - Limit number of page display in pagination
     * @returns HTML
     */
    handler: function (totalPage, currentPage, itemLink, className, previousButton, nextButton, numberPageOfPagination) {
        // Set default values
        totalPage = _.isNumber(parseInt(totalPage)) ? parseInt(totalPage) : 1;
        currentPage = _.isNumber(parseInt(currentPage)) ? parseInt(currentPage) : 1;
        className = className || 'pagination';
        previousButton = previousButton || '«';
        nextButton = nextButton || '»';
        numberPageOfPagination = (_.isNumber(numberPageOfPagination) && parseInt(numberPageOfPagination) > 1) ? numberPageOfPagination : 3;

        let start, end;
        // Only display pagination when total page > 1
        if (totalPage > 1) {
            if (totalPage > numberPageOfPagination) {
                if (numberPageOfPagination >= 3) {
                    if ((currentPage >= numberPageOfPagination) && (currentPage <= (totalPage - numberPageOfPagination + 1))) {
                        start = currentPage - Math.floor(numberPageOfPagination / 2);
                        if (start < 1) {
                            start = 1;
                        }

                        end = start + numberPageOfPagination - 1;
                        if (end > totalPage) {
                            end = totalPage;
                        }
                    }
                    else if (currentPage < numberPageOfPagination) {
                        start = 1;
                        end = numberPageOfPagination;
                    }
                    else if (currentPage > (totalPage - numberPageOfPagination + 1)) {
                        start = totalPage - numberPageOfPagination + 1;
                        end = totalPage;
                    }
                }
            }
            else if (totalPage <= numberPageOfPagination) {
                start = 1;
                end = totalPage;
            }
            else {
                start = currentPage;
                if ((currentPage + numberPageOfPagination) > totalPage) {
                    start = totalPage - numberPageOfPagination + 1;
                }

                end = currentPage + numberPageOfPagination - 1;
                if (end > totalPage) {
                    end = totalPage;
                }
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