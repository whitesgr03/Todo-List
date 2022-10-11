'use strict'

import './css/style.css';
import * as inbox from './js/inbox'


(function init() {
    // bind events
    document.documentElement.addEventListener('click', showAddForm)
    document.documentElement.addEventListener('pointerdown', closeAddForm)

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
}
    
function closeAddForm(e) {
    const cancel = e.target.classList.contains('cancelButton');
    let overlay = e.target.classList.contains('overlay');

    if (!cancel && !overlay) return

    overlay = e.target.closest('.overlay')
    overlay.textContent = '';
    overlay.className = 'overlay';
}
