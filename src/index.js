'use strict'

import './css/style.css';
import * as inbox from './js/inbox'

(function init() {

    // cache DOM
    const main = document.querySelector('main');
    const content = document.querySelector('.content');

    // bind events
    main.addEventListener('click', function (e) {

        const addTaskButton = e.target.closest('.createForm');

            if (addTaskButton) {
                inbox.showTaskForm()
                addTaskButton.blur();
                return
            }

        })

    content.append(inbox.createNav());
    content.append(inbox.createTask());
})()

