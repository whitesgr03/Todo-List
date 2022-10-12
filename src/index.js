'use strict'

import './css/style.css';
import * as inbox from './js/inbox'


(function init() {
    // bind events
    document.documentElement.addEventListener('click', showAddForm)
    document.documentElement.addEventListener('pointerdown', closeAddForm)
    document.documentElement.addEventListener('click', showColorList)

})()

function showAddForm(e) {
    
    const addTask = e.target.closest('.addTask')
    const addProduct = e.target.closest('.addProduct')

    if (!addTask && !addProduct) return
    
    const overlay = document.querySelector('.overlay');

    if (addTask) {
        overlay.append(inbox.formTemplate('taskForm'))
        overlay.classList.add('task');
    }

    if (addProduct) {
        overlay.append(inbox.formTemplate('productForm'))
        overlay.classList.add('product');
    }

    document.body.style.overflow = "hidden"
}
    
function closeAddForm(e) {
    const cancel = e.target.classList.contains('cancelButton');
    let overlay = e.target.classList.contains('overlay');

    if (!cancel && !overlay) return

    overlay = e.target.closest('.overlay')
    overlay.textContent = '';
    overlay.className = 'overlay';
    document.body.style.overflow = "auto"
}


function showColorList(e) {
    const colorButton = e.target.closest('.colorButton')
    const showList = document.querySelector('.showList')


    if (colorButton) {

        const productForm = document.querySelector('.productForm');
        productForm.classList.toggle('showList');

        colorButton.style.borderRadius = '5px 5px 0 0';
        return
    }

    if (showList) {
        const colorButton = document.querySelector('.colorButton');
        showList.classList.remove('showList')
        colorButton.style.removeProperty('border-radius')
    }
    
}
