'use strict'

import './css/style.css';
import * as inbox from './js/inbox'

(function init() {

    nav.createPages('inbox')

    // cache DOM
    const navbar = document.querySelector('nav');

    // bind events
    navbar.addEventListener('click', changePage)
    navbar.addEventListener('click', nav.showForm)

    function changePage(e) {

        const target = e.target.closest('.title')

        if (!target) return

        const name = target.textContent.toLowerCase();

        if (name === 'products') {
            e.target.closest('.products').classList.toggle('down');
            nav.createProduct();
            return
        }

        nav.createPages(name)
    }

})()






        if (!target) return

        nav.showForm();
    }

})()

