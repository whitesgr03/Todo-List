'use strict'    
    
function createEventMethods() {

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

        overlay.addEventListener('pointerdown', closeForm)

        function closeForm(e) {
            const cancelButton = e.target.closest('.cancel');

            if (!cancelButton && e.target !== this) return

            currentForm.remove();

            overlay.className = 'overlay';
            document.body.style.overflow = "auto";

            this.removeEventListener('pointerdown', closeForm)
        }
    }


    return {
        focusOnForm,
        showForm,
    }
}

export {
    createEventMethods,
}