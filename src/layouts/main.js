'use strict'

// From library
import { format, isToday, isTomorrow } from 'date-fns';

// 只做渲染列表和 compos method 並回傳給todoList

const main = (() => {

    const createTasksList = (tasks) => {

        const tasksList = document.querySelector('.tasksList');

        tasksList.firstElementChild.remove()

        const div = document.createElement('div');
    
        tasksList.append(div)

        if (tasks.length === 0) {
            div.insertAdjacentHTML('beforeend', '<h3 class="noTask">There is no Task</h3>');
            return
        }
        
        for (let task of tasks) {
            createTaskItem(task)
        }
    }
    const createTaskItem = (task) => {
        const date = formatDate(task.day, task.time)

        const template = `
            <input class="complete" type="checkbox" style="--priority-color:${task.priority}">
            <div class="wrap">
                <h3 class="title"></h3>
                <div class="option">
                    <button type="button" class="optionButton">•••</button>
                    <ul class="optionList">
                        <li>
                            <button class="editButton" type="button">Edit task</button>
                        </li>
                        <li>
                            <button class="deleteButton"  type="button">Delete task</button>
                        </li>
                    </ul>
                </div>
            </div>
            <p class="description title"></p>
            <div class="dueDate">
                <span class="icon calendar"></span>
                ${date}
            </div>
            
        `;

        const li = document.createElement('li');

        li.className = 'item'
        li.innerHTML = template;
        li.dataset.id = task.id;
        li.querySelector('.title').textContent = task.name;
        li.querySelector('.description').textContent = task.descript;

        if (task.completed) {
            li.querySelector('.complete[type="checkbox"]').checked = true;
        }


        const div = document.querySelector('.tasksList div');
        div.append(li)
    }
    const createTaskForm = (task) => {
        const template = `
            <h2>Add Task</h2>
            <label for="taskName">
                Task name
                <textarea class="disableOutline" id="taskName" name="name" rows="1" tabIndex="0" maxlength="100" required></textarea>
            </label>
            <label for="descript">
                Description
                <textarea class="disableOutline" id="descript" name="descript" rows="1" maxlength="300" data-skip-valid="1"></textarea>
            </label>
                <div class="taskFormButtons">
                    <input class="day disableOutline" name="day" type="date" required>
                    <input class="time disableOutline" name="time" type="time" data-skip-valid="1">
                    <div class="dropdown">
                        <button type="button" class="wrap dropDownButton priority" data-color="rgb(0,210,102)">
                            <span class="icon flag low"></span>
                            Low
                        </button>
                        <div class="dropdownList">
                            <ul>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1" data-color="rgb(226,54,48)">
                                        <span class="icon flag critical"></span>
                                        Critical
                                    </button>
                                </li>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1" data-color="rgb(251,131,0)">
                                        <span class="icon flag high"></span>
                                        High
                                    </button>
                                </li>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1" data-color="rgb(0,114,231)">
                                        <span class="icon flag medium"></span>
                                        Medium
                                    </button>
                                </li>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1" data-color="rgb(0,210,102)">
                                        <span class="icon flag low"></span>
                                        Low
                                    </button>
                                </li>
                            </ul>   
                        </div>
                    </div>
                    <div class="dropdown projectDropdown">
                        <button type="button" class="wrap dropDownButton projectName">
                            <span class="icon box"></span>
                            Inbox
                        </button>
                        <div class="dropdownList">
                            <ul>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1">
                                        <span class="icon box"></span>
                                        Inbox
                                    </button>
                                </li>
                            </ul>   
                        </div>
                    </div>
                    <span class="message" aria-live="polite">Time is optional</span>
                </div>
                <div class="submitButton">
                    <button type="button" class="cancel">Cancel</button>
                    <button type="submit" class="submit">Add task</button>
                </div>
        `;

        const form = document.createElement('form');
        form.classList.add('taskForm')
        form.innerHTML = template;

        if (task) {
            form.elements.day.value = task.day;
            form.elements.time.value = task.time;

            const priorityButton = form.querySelector('.priority')

            const allPriorityDropDownButtons =  Array.from(priorityButton.nextElementSibling.querySelectorAll('button'))
            const priorityElem = allPriorityDropDownButtons.find(item => item.dataset.color === task.priority)

            const priorityElemClone = priorityElem.cloneNode(true)
            priorityElemClone.classList.add(...priorityButton.classList)

            priorityButton.replaceWith(priorityElemClone)

            form.elements.taskName.value = task.name;
            form.elements.descript.value = task.descript;

        } else {
            form.elements.day.value = format(new Date(), 'yyyy-MM-dd')
        }

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        return form
    }
    const createTaskProductNameDropdown = (projects, id) => {
        const dropdownList = document.querySelector('.projectDropdown .dropdownList ul')

        if (projects.length === 0) return

        for (let project of projects) {
            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1" data-project-id="${project.id}">
                    <span class="icon" style="--project-color:${project.hexCode}"></span>
                    ${project.name}
                </button>
            `;
            
            li.className = 'item'
            li.innerHTML = button;

            if (project.id === id) {
                const projectNameButton = document.querySelector('.projectName')

                const div = document.createElement('div');
                div.innerHTML = button;
                
                div.firstElementChild.classList.add(...projectNameButton.classList)

                projectNameButton.replaceWith(div.firstElementChild)
            }
            
            dropdownList.append(li);
        }
    }

    function formatDate (day, time) {
        let tokens = null;
        let timeTokens = ''
        let date = new Date(day)
        
        if (time) {
            date = new Date(`${day}T${time}`);
            timeTokens = ' HH:mm'
        }

        const distanceDays = date.getDate() - new Date().getDate()

        if (isToday(date)) {
            tokens = "'Today'";
        } else if (isTomorrow(date)) {
            tokens = "'Tomorrow'";
        } else if (distanceDays >= 2 && distanceDays <= 7) {
            tokens = 'EEEE';
        } else {
            tokens = 'd MMM';
        }

        tokens += timeTokens

        return format(date, tokens)
    }

    return {
        createTasksList,
        createTaskForm,
        createTaskItem,
        createTaskProductNameDropdown,
        
    }
})();

export {
    main,
}