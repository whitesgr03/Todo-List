'use strict'

// library
import namedColors from 'color-name-list';


function createNav() {
    const template = `
        <li class="item">
            <h2>Inbox</h2>
            <div class="wrap">
                <button type="button" class="createForm"  data-form="taskForm">+</button>
                <button type="button" class="selectMenuButton">◦◦◦</button>
                <ul class="selectMenu">
                    <li>
                        <button type="button" class="title">Show completed tasks</button>
                    </li>
                </ul>
            </div>
        </li>
    `

    const element = document.createElement('ul');
    element.className = 'top'
    element.innerHTML = template;

    return element
}

function createForm() {
        const template = `<label for="taskName">
            Task name
            <textarea class="disableOutline" id="taskName" name="name" rows="1" tabIndex="0" maxlength="100"></textarea>
        </label>
        <label for="descript">
            Description
            <textarea class="disableOutline" id="descript" name="descript" rows="1" maxlength="150"></textarea>
        </label>
        <div class="buttons">
            <div class="datePicker">
                <input class="date" name="date" type="date">
            </div>
            <div class="timePicker active">
                <input class="time" name="time" type="time">
            </div>
            <div class="selectButton">
                <li class="item">
                    <div class="wrap">
                        <button type="button" name="type" class="title selectMenuButton">Inbox</button>
                        <ul class="selectMenu">
                            <li>
                                <button type="button" class="title">task 1</button>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <div class="wrap">
                        <button type="button" name="priority" class="title selectMenuButton low" data-priority="low">Low</button>
                        <ul class="selectMenu">
                            <li>
                                <button type="button" class="title critical" data-priority="critical">Critical</button>
                            </li>
                            <li>
                                <button type="button" class="title high" data-priority="high">High</button>
                            </li>
                            <li>
                                <button type="button" class="title medium" data-priority="medium">Medium</button>
                            </li>
                            <li>
                                <button type="button" class="title low" data-priority="low">Low</button>
                            </li>
                        </ul>
                    </div>
                </li>
            </div>
            <div class="submitButton">
                <button type="button" class="cancelButton">Cancel</button>
                <button type="submit" class="addButton">Add task</button>
            </div>
        </div>
        `;
    
    const form = document.createElement('form');
    form.classList.add('taskForm', 'active')
    form.innerHTML = template;

    return form
}

function createTaskTemplate() {

    const template = `
        <div class="task">
            <input type="checkbox">
            <button type="button" class="title"></button>
            <h3 class="title"></h3>
            <p class="description"></p>
            <p class="dueDate"></p>
        </div>
        <div class="option">
            <button type="button" class="title"></button>
            <button type="button" class="title"></button>
            <div class="wrap">
                <button type="button" class="selectMenuButton">•••</button>
                <ul class="selectMenu">
                    <li>
                        <button type="button" class="title">Edit project</button>
                    </li>
                    <li>
                        <button type="button" class="title">Delete project</button>
                    </li>
                </ul>
            </div>
        </div>
    `

    const element = document.createElement('li');
    element.className = 'item'
    element.innerHTML = template;

    return element
}

function showTaskForm() {
    const overlay = document.querySelector('.overlay');

    overlay.append(createForm())
    overlay.classList.add('showForm');

    document.body.style.overflow = "hidden"

    const currentForm = overlay.querySelector('.taskForm')
    const firstField = currentForm.querySelector('[tabIndex]')

    firstField.focus();
    
    const textareas = currentForm.querySelectorAll('textarea')

    for (let textarea of textareas) {
        textarea.addEventListener("input", autoResize);
    }

    currentForm.addEventListener('submit', fieldsValidation)
    currentForm.addEventListener('focusout', focusForm)
    currentForm. addEventListener('click', selectMenu)

    overlay.addEventListener('pointerdown', removeEvent)

    function removeEvent(e) {
        const cancelButton = currentForm.querySelector('.cancelButton');

        if (e.target !== this && e.target !== cancelButton) return

        for (let textarea of textareas) {
            textarea.removeEventListener("input", autoResize);
        }

        currentForm.removeEventListener('submit', fieldsValidation)
        currentForm.removeEventListener('focusout', focusForm)
        currentForm.removeEventListener('click', selectMenu)

        closeTaskForm();
        
        this.removeEventListener('pointerdown', removeEvent)
    }



    function selectMenu(e) {

        const button = e.target.closest('.selectMenuButton');

        if (!button) return

        const parent = button.closest('.item')

        parent.classList.toggle('showSelectMenu')
        
        this.addEventListener('click', changeValue)
        this.addEventListener('click', closeSelectMenu)

        function closeSelectMenu(e) {

            if (e.target !== button) {
                parent.classList.remove('showSelectMenu')
            }
            
            this.removeEventListener('click', closeSelectMenu)
            this.removeEventListener('click', changeValue);
        }

        function changeValue(e) {
            const target = e.target.closest('.title')
            if (!target || target === button) return

            switch (button.name) {
                case 'type':
                    break;
                case 'priority':
                    const selfPriority = button.dataset.priority;
                    const priority = target.dataset.priority;

                    button.classList.remove(selfPriority);
                    button.classList.add(priority);
                    button.dataset.priority = priority;
                    button.textContent = priority[0].toUpperCase() + priority.slice(1);
                    break;
            }


            
        }

    }

    function focusForm(e) {
        const target = e.relatedTarget;

        if (target && !target.closest('.taskForm')) firstField.focus()
    }

    function closeTaskForm() {

        overlay.textContent = '';
        overlay.className = 'overlay';

        document.body.style.overflow = "auto";
    }
    
    function autoResize() {

        // 計算字數, 不然會超過螢幕的 x 軸

        // this.style.height = 0;
        this.style.height = `${this.scrollHeight}px`;
    }

    function fieldsValidation(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const formProps = Object.fromEntries(formData);

        for (let field in formProps) {
            const value = formProps[field].trim();
            
            if (value.length === 0) {
                const elem = this.elements[field]
                
                elem.focus(); 
                elem.classList.remove('disableOutline')

                elem.addEventListener('blur',disableOutLine)
                
                function disableOutLine() {
                    elem.classList.add('disableOutline')
                    this.removeEventListener('blur', disableOutLine)
                }
                return
            }
        }

        const priority = currentForm.querySelector('[data-priority]');
        formProps.priority = priority.dataset.priority;

        // const type = currentForm.querySelector('[data-type]');
        // formProps.type = priority.dataset.type;

        addTask('task', formProps)
        closeTaskForm();
    }

    function addTask(name, data) {

        const item = localStorage.getItem(name);

        if (item) {
            const temp = JSON.parse(item);
            temp.push(data)
            localStorage.setItem(name, JSON.stringify(temp))
        } else {
            localStorage.setItem(name, JSON.stringify([data]))
        }

        const content = document.querySelector('.content');
        getTasks(content);
    }

}

function getTasks(parent) {

    const item = localStorage.getItem('task');

    if (!item) return

    const tasks = JSON.parse(item)
    let taskList = document.querySelector('.taskList');

    if (taskList) {
        taskList.innerHTML = '';
    }

    taskList = document.createElement('ul');
    taskList.className = "taskList";

    parent.append(taskList)

    for (let task of tasks) {

        const data = {
            name: task.name,
            descript: task.descript,
            date: task.date,
        }

        createTask(data);
    }
}
// 建立 Task
function createTask(data) {

    const taskList = document.querySelector('.taskList');
    
    const template = createTaskTemplate();

    template.querySelector('h3.title').textContent = data.name;
    template.querySelector('.description').textContent = data.descript;
    template.querySelector('.dueDate').textContent = data.date;

    taskList.append(template)
}



// nav 的

function createProductForm() {

    const template = `
        <h3>Add Product</h3>
        <label for="productName">
            Name
            <input class="disableOutline" name="nameField" type="text" id="productName" maxlength="50" tabIndex="0">
        </label>
        <div class="colorSelect">
            Color
            <button type="button" name="selectField" class="colorButton title" data-hex-code="#000000"  style="--color-list:#000000">Black</button>
            <ul class="dropdown">
            </ul>
        </div>
        <div class="submitButton">
            <button type="button" class="cancelButton">Cancel</button>
            <button type="submit" name="submit" class="addButton" disable>Add task</button>
        </div>
    `;


    
    const form = document.createElement('form');
    form.name="product"
    form.classList.add('productForm', 'active')
    form.innerHTML = template;

    const dropdown = form.querySelector('.dropdown')

    const iconColorList = ['#e97451', '#f4a461', '#e7c068', '#2b9890', '#a2cffe', '#000000']

    for (let hax of iconColorList) {

        const color = namedColors.find(color => color.hex === hax);
        const li = document.createElement('li');
        const button = `<button type="button" class="title" style="--color-list:${color.hex}">${color.name}</button>`
        
        li.innerHTML = button;

        dropdown.append(li);
    }

    return element
}


export {
    createNav,
    createForm,
    createTaskTemplate,
    showTaskForm,
    getTasks,

}