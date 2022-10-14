'use strict'

import './css/style.css';
import * as inbox from './js/inbox'

(function init() {

    // cache DOM
    const main = document.querySelector('main');

    // bind events
    main.addEventListener('click', function (e) {

        const menuButton = e.target.closest('.selectMenuButton');
        const form = e.target.dataset.form;

            if (menuButton) {
                showSelectMenu(menuButton);
                return
            }
            
            if (form) {
                showForm(form)
                return
            }

    })


})()

function showSelectMenu(menuButton) {

    const item = menuButton.closest('.item');

    item.classList.toggle('showSelectMenu');

    document.addEventListener('pointerdown', closeSelectMenu);
    
    function closeSelectMenu(e) {

        const selectMenuOpened = document.querySelector('.showSelectMenu');

        if (e.target !== menuButton) {
            selectMenuOpened?.classList.remove('showSelectMenu');
        }

        this.removeEventListener('pointerdown', closeSelectMenu);
    }   
}

function showForm(form) {

    const overlay = document.querySelector('.overlay');

    overlay.append(inbox.formTemplate(form))
    overlay.classList.add('showForm');

    document.body.style.overflow = "hidden"

    if (form === 'productForm') {
        overlay.querySelector('.productForm').addEventListener('click', showDropdown)
    }

    overlay.addEventListener('pointerdown', closeForm)

    function closeForm(e) {

        const cancelButton = document.querySelector('.cancelButton');

        if (e.target !== this && e.target !== cancelButton) return

        if (document.querySelector('.productForm')) {
            this.querySelector('.productForm').removeEventListener('click', showDropdown)
        }

        this.textContent = '';
        this.className = 'overlay';

        document.body.style.overflow = "auto";  

        this.removeEventListener('pointerdown', closeForm)
    }
}
    
function showDropdown(e) {
        
    const button = e.target.closest('.colorButton');

    if (!button) return

    this.classList.toggle('showDropdown')
    
    this.addEventListener('pointerup', closeDropdown)
    this.addEventListener('pointerdown', changeColor)

    function closeDropdown(e) {

        if (e.target !== button) {
            this.classList.remove('showDropdown')
        }
        
        this.removeEventListener('pointerup', closeDropdown)
        this.removeEventListener('pointerdown', changeColor);
    }

    function changeColor(e) {

        const target = e.target.closest('.title')
        if (!target || target === button) return

        const hex = e.target.getAttribute('style');
        const name = e.target.textContent;

        button.textContent = name;
        button.style = hex;
    }
}

}
