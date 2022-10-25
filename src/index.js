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

        const navItem = e.target.closest('.wrap')

        if (!navItem) return

        const name = navItem.querySelector('.title').textContent.toLowerCase();

        if (name === 'products') {
            const products = document.querySelector('.products')

            products.classList.toggle('arrowDown');

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

