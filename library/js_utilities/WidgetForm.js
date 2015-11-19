'use strict';

let log = require('arrowjs').logger;

class WidgetForm {
    constructor(widget, wrapClass, elementClass, checkboxClass, radioClass, btnSaveClass, btnDeleteClass) {
        if(widget && widget.data){
            this.widget = widget;
            this.elements = [];
            this.wrapClass = wrapClass || 'form-group';
            this.elementClass = elementClass || 'form-control';
            this.checkboxClass = checkboxClass || 'checkbox';
            this.radioClass = radioClass || 'radio';
            this.btnSaveClass = btnSaveClass || 'btn btn-success';
            this.btnDeleteClass = btnDeleteClass || 'btn btn-danger';
        }else{
            log.error('Invalid widget, cannot create widget form!');
        }
    }

    /**
     * Add an element
     */
    addElement(element){
        this.elements.push(element);
    }

    /**
     * Add general element
     */
    addGeneralElement(name, label, content) {
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
        this.addElement(element);
    }

    /**
     * Add text element
     */
    addText(name, label) {
        let val = this.widget.data[name];
        let value = val ? `value="${val}"` : ``;
        let content = `<input type="text" name="${name}" id="${name}" class="${this.elementClass}" ${value}/>`;
        this.addGeneralElement(name, label, content);
    }

    /**
     * Add textarea element
     */
    addTextArea(name, label) {
        let val = this.widget.data[name];
        let value = val ? val : '';
        let content = `<textarea name="${name}" id="${name}" class="${this.elementClass}" rows="5">${value}</textarea>`;
        this.addGeneralElement(name, label, content);
    }

    /**
     * Add select element
     */
    addSelect(name, label, options) {
        if (typeof options != 'object') {
            log.error('Select options must be an Object or an Array!');
            return '';
        }

        let value = this.widget.data[name];
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

        this.addGeneralElement(name, label, content);
    }

    /**
     * Add checkbox element
     */
    addCheckbox(name, label) {
        if (!name) {
            log.error('Element name is not defined!');
            return '';
        }

        // Use name if label was not provided
        label = label || name;

        // Set checked box
        let checked = this.widget.data[name] ? ' checked' : '';

        let element = `<div class="${this.checkboxClass}">
                        <label>
                            <input type="checkbox" name="${name}" id="${name}" value="1"${checked}/>
                            ${label}
                        </label>
                    </div>`;

        this.addElement(element);
    }

    /**
     * Add radio element
     */
    addRadio(name, label, items) {
        if (typeof items != 'object') {
            log.error('Items must be an Object or an Array!');
            return '';
        }

        let value = this.widget.data[name];
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

        this.addElement(element);
    }

    /**
     * Render form
     */
    render() {
        let formContent = this.elements.join('');
        return `<form method="POST">
                    ${formContent}
                    <input type="hidden" name="widget_name" value="${this.widget.widget_name}">
                    <input type="hidden" name="id" value="${this.widget.id || ''}">

                    <div class="${this.wrapClass}">
                        <button type="button" class="${this.btnSaveClass}" onclick="return saveWidget(this)">
                            Save
                        </button>
                        <button type="button" class="${this.btnDeleteClass}" onclick="return removeWidget(this);">
                            Delete
                        </button>
                    </div>
                </form>`;
    }

}

module.exports = WidgetForm;