"use strict";

module.exports = {
    "pagination" : function (totalPage, currentPage, itemLink, previousButton, nextButton, numberDisplayPage) {
        // Set default values
        itemLink = itemLink.replace(/\"(.*)\"\.\"(.*)\"/, '$1.$2');
        previousButton = previousButton ? previousButton : '«';
        nextButton = nextButton ? nextButton : '»';
        numberDisplayPage = (!isNaN(numberDisplayPage) && numberDisplayPage > 1) ? numberDisplayPage : 4;

        // Only display pagination when total page > 1
        if (totalPage > 1) {
            let start = parseInt(currentPage) - numberDisplayPage - 1;
            if (start < 1) {
                start = 1;
            }

            let end = parseInt(currentPage) + numberDisplayPage - 1;
            if (end > totalPage) {
                end = totalPage;
            }

            let html = `<ul class="pagination">
                            <li class="previous ${parseInt(currentPage) == 1 ? 'disabled' : ''}">
                                <a href="${parseInt(currentPage) == 1 ? '#' : itemLink.replace('{page}', parseInt(currentPage) - 1)}">
                                    ${previousButton}
                                </a>
                            </li>`;

            if (start > 1) {
                let url = itemLink.replace('{page}', start - 1);
                html += `<li><a href="${url}">...</a></li>`
            }

            for (let i = start; i <= end; i++) {
                let url = itemLink.replace('{page}', i);
                let active = parseInt(currentPage) == i ? "active" : "";
                html += `<li class="${active}"><a href="${url}">${i}</a></li>`
            }

            if (end < totalPage) {
                let url = itemLink.replace('{page}', end + 1);
                html += `<li><a href="${url}">...</a></li>`
            }

            html += `<li class="next ${currentPage == totalPage ? 'disabled' : ''}">
                        <a href="${parseInt(currentPage) == totalPage ? '#' : itemLink.replace('{page}', parseInt(currentPage) + 1)}">
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