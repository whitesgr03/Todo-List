'use strict'    
    
function createEventMethods() {

    const HAX_LIST = ['#e97451', '#f4a461', '#e7c068', '#2b9890', '#a2cffe', '#000000']

    const getHaxList = () => {
        return HAX_LIST
    }
    const focusOnForm = function(e) {
        const target = e.relatedTarget;
        const firstField = this.querySelector('[tabIndex]')

        if (target && !target.closest('form')) firstField.focus()
    }
    const showForm = () => {
        const overlay = document.querySelector('.overlay');

        overlay.classList.add('show');
        document.body.style.overflow = "hidden";

        const currentForm = overlay.firstElementChild;

        currentForm.classList.add('active');
        
        const firstField = currentForm.querySelector('[tabIndex]')

        firstField.focus();

        overlay.addEventListener('pointerdown', isClosedByPointer)
    }
    const closeForm = () => {
        const overlay = document.querySelector('.overlay');
        const currentForm = overlay.firstElementChild;

        currentForm.remove();
        
        overlay.className = 'overlay';
        document.body.style.overflow = "auto";

        overlay.removeEventListener('pointerdown', isClosedByPointer)
    }
    const validation = (formProps, form)  =>{
    let isValid = true;

    for (let field in formProps) {
        const elem = form.elements[field]

        if (elem.dataset.skipValid && elem.classList.contains('disableOutline')) {
            continue
        }

        if (!elem.classList.contains('disableOutline')) {
            isValid = false;
            elem.focus();
            return
        }

        const value = formProps[field].trim();

        if (value.length === 0) {
            const elem = form.elements[field]
        
            isValid = false;
            elem.focus();
            elem.classList.remove('disableOutline')

            elem.addEventListener('blur', disableOutLine)

            return isValid
        }
    }
        return isValid
    }
    const disableOutLine = function() {
        this.classList.add('disableOutline')
        this.removeEventListener('blur', disableOutLine)
    }
    function isClosedByPointer (e) {
        const cancelButton = e.target.closest('.cancel');

        if (!cancelButton && e.target !== this) return
        
        closeForm()
    }

    return {
        focusOnForm,
        showForm,
        closeForm,
        validation,
        getHaxList,
    }
}

export {
    createEventMethods,
}