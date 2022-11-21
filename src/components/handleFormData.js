'use strict'

const handleFormDOM = (() => {

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
    const limitLines = function (e) {
        if (e.code === 'Backspace') return;
        
        if (!this.has(e.target.scrollHeight)) {
            e.preventDefault();
        }
    }
    const limitCharacters = function(e) {
        const valueLength = e.target.value.length

        if (valueLength > this) {
            e.target.value = e.target.value.slice(0, this)
            return
        }
    }
    const autoResize = function() {
        this.style.height = 0;
        this.style.height = `${this.scrollHeight}px`;
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
        limitLines,
        limitCharacters,
        autoResize,
    }
})()

export {
    handleFormDOM
}