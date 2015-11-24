"use strict";

let _ = require('arrowjs')._;

module.exports = {

    /**
     * Create pagination
     *
     * @param totalPage - Total page
     * @param currentPage - Current page
     * @param routePattern - Pattern for link of page items, must contains {page}. It will replace {page} with page number
     * @param numberPagesOfPagination - Limit number of page display in pagination
     * @param prevText - Content of previous button
     * @param nextText - Content of next button
     * @param className - Class of pagination use for CSS
     * @returns HTML
     */
    handler: function (totalPage, currentPage, routePattern, numberPagesOfPagination, prevText, nextText, className) {
        // Default total page = 1
        totalPage = parseInt(totalPage);
        totalPage = (_.isNumber(totalPage) && totalPage > 0) ? totalPage : 1;

        // Default current page = 1
        currentPage = parseInt(currentPage);
        currentPage = (_.isNumber(currentPage) && currentPage > 0) ? currentPage : 1;

        // Default number pages of pagination = 5
        numberPagesOfPagination = parseInt(numberPagesOfPagination);
        numberPagesOfPagination = (_.isNumber(numberPagesOfPagination) && numberPagesOfPagination > 1) ? numberPagesOfPagination : 5;

        // Default item link = '?p={page}'
        routePattern = routePattern.match(/\{page\}/) ? routePattern : '?p={page}';

        // Default previous and next button
        prevText = prevText || '«';
        nextText = nextText || '»';

        // Default pagination class name
        className = className || 'pagination';

        let start, end;

        // Only display pagination when total page > 1
        if (totalPage > 1) {
            if (totalPage > numberPagesOfPagination) {
                if (numberPagesOfPagination >= 3) {
                    if ((currentPage >= numberPagesOfPagination) && (currentPage <= (totalPage - numberPagesOfPagination + 1))) {
                        start = currentPage - Math.floor(numberPagesOfPagination / 2);
                        if (start < 1) {
                            start = 1;
                        }

                        end = start + numberPagesOfPagination - 1;
                        if (end > totalPage) {
                            end = totalPage;
                        }
                    }
                    else if (currentPage < numberPagesOfPagination) {
                        start = 1;
                        end = numberPagesOfPagination;
                    }
                    else if (currentPage > (totalPage - numberPagesOfPagination + 1)) {
                        start = totalPage - numberPagesOfPagination + 1;
                        end = totalPage;
                    }
                }
            }
            else if (totalPage < numberPagesOfPagination) {
                start = 1;
                end = totalPage;
            }
            else {
                start = currentPage;
                if ((currentPage + numberPagesOfPagination) > totalPage) {
                    start = totalPage - numberPagesOfPagination + 1;
                }

                end = currentPage + numberPagesOfPagination - 1;
                if (end > totalPage) {
                    end = totalPage;
                }
            }

            let html = `<ul class="${className}">
                            <li class="previous ${currentPage == 1 ? 'disabled' : ''}">
                                <a href="${currentPage == 1 ? '#' : routePattern.replace('{page}', currentPage - 1)}">
                                    ${prevText}
                                </a>
                            </li>`;

            if (start > 1) {
                let url = routePattern.replace('{page}', start - 1);
                html += `<li><a href="${url}">...</a></li>`
            }

            for (let i = start; i <= end; i++) {
                let url = routePattern.replace('{page}', i);
                let active = currentPage == i ? "active" : "";
                html += `<li class="${active}"><a href="${url}">${i}</a></li>`
            }

            if (end < totalPage) {
                let url = routePattern.replace('{page}', end + 1);
                html += `<li><a href="${url}">...</a></li>`
            }

            html += `<li class="next ${currentPage == totalPage ? 'disabled' : ''}">
                        <a href="${currentPage == totalPage ? '#' : routePattern.replace('{page}', currentPage + 1)}">
                            ${nextText}
                        </a>
                    </li>
                </ul>`;

            return html;
        } else {
            return '';
        }
    }
};