'use strict';

let log = require('arrowjs').logger;

class WidgetForm {
    constructor(wrapClass, elementClass, checkboxClass, radioClass) {
        this.elements = [];
        this.wrapClass = wrapClass || 'form-group';
        this.elementClass = elementClass || 'form-control';
        this.checkboxClass = checkboxClass || 'checkbox';
        this.radioClass = radioClass || 'radio';
    }

    /**
     * Add generic element
     */
    addElement(name, label, content) {
        if (!name) {
            log.error('Element name is not defined!');
            return '';
        }

        // Use name if label was not provided
        label = label || name;

        let element = `<div class="${this.wrapClass}">
                        <label for="${name}">${label}</label>
                        ${content}
                        </div>`;
        this.elements.push(element);
    }

    /**
     * Add text element
     */
    addText(name, label, value) {
        let val = value ? `value="${value}"` : ``;
        let content = `<input type="text" name="${name}" id="${name}" class="${this.elementClass}" ${val}/>`;
        this.addElement(name, label, content);
    }

    /**
     * Add textarea element
     */
    addTextArea(name, label, value) {
        let val = value ? value : '';
        let content = `<textarea name="${name}" id="${name}" class="${this.elementClass}" rows="5">${val}</textarea>`;
        this.addElement(name, label, content);
    }

    /**
     * Add select element
     */
    addSelect(name, label, options, value) {
        if (typeof options != 'object') {
            log.error('Select options must be an Object or an Array!');
            return '';
        }

        let content = `<select name="${name}" id="${name}" class="${this.elementClass}">`;

        for (let opt in options) {
            if (options.hasOwnProperty(opt)) {
                // Set selected option
                let selected = '';

                // If options is an Array then value of item is equal title of item
                if (Array.isArray(options)) {
                    if (value == options[opt]) selected = 'selected';
                    content += `<option value="${options[opt]}"${selected}>${options[opt]}</opiton>`;
                } else {
                    if (value == opt) selected = 'selected';
                    content += `<option value="${opt}"${selected}>${options[opt]}</opiton>`;
                }
            }
        }

        content += `</select>`;

        this.addElement(name, label, content);
    }

    /**
     * Add checkbox element
     */
    addCheckbox(name, label, isCheck) {
        if (!name) {
            log.error('Element name is not defined!');
            return '';
        }

        // Use name if label was not provided
        label = label || name;

        // Set checked box
        let checked = isCheck ? ' checked' : '';

        let element = `<div class="${this.checkboxClass}">
                        <label>
                            <input type="checkbox" name="${name}" id="${name}" value="1"${checked}/>
                            ${label}
                        </label>
                    </div>`;

        this.elements.push(element);
    }

    /**
     * Add radio element
     */
    addRadio(name, label, items, value) {
        if (typeof items != 'object') {
            log.error('Items must be an Object or an Array!');
            return '';
        }

        let element = `<div class="${this.wrapClass}">
                        <label>${label}</label>`;

        for (let i in items) {
            if (items.hasOwnProperty(i)) {
                // Set checked item
                let checked = '';

                element += `<div class="${this.radioClass}"><label>`;

                // If items is an Array then value of item is equal title of item
                if (Array.isArray(items)) {
                    if (value == items[i]) checked = 'checked';
                    element += `<input type="radio" name=${name} value="${items[i]}"${checked}/>${items[i]}`;
                } else {
                    if (value == i) checked = 'checked';
                    element += `<input type="radio" name=${name} value="${i}"${checked}/>${items[i]}`;
                }

                element += `</label></div>`;
            }
        }

        element += `</div>`;

        this.elements.push(element);
    }

    render() {
        return this.elements.join('');
    }

}

module.exports = WidgetForm;