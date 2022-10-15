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
                inbox.showSelectMenu(menuButton);
                return
            }
            
            if (form) {
                inbox.showForm(form)
                return
            }

        })


})()


