'use strict'

// private method

function getLocalTasks() {
    const item = localStorage.getItem('tasks');

    if (!item) return

    let data = JSON.parse(item)

    return data
}

function createForm() {
    const template = `
        <label for="taskName">
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
                <li class="item box" data-img="box">
                    <div class="wrap">
                        <button type="button" name="productName" class="title selectMenuButton">Inbox</button>
                        <ul class="selectMenu productNameSelect">
                            <li class="box" data-img="box">
                                <button type="button" class="title">Inbox</button>
                            </li>
                            <li class="order" data-img="order">
                                <button type="button" class="title">Today</button>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="item flag">
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
    form.classList.add('taskForm')
    form.innerHTML = template;

    const textareas = form.querySelectorAll('textarea')

    for (let textarea of textareas) {
        textarea.addEventListener("input", autoResize);
    }

    form.addEventListener('focusout', focusForm)
    form.addEventListener('click', selectMenu)
    form.addEventListener('submit', validation)
    
    
    const overlay = document.querySelector('.overlay');
    overlay.append(form)

    createProductList()

    overlay.addEventListener('pointerdown', activeCloseButton)
}

function createProductList() {

    let products =  localStorage.getItem('products');

    if (!products) return

    const productNameSelect = document.querySelector('.productNameSelect')

    for (let product of JSON.parse(products)) {

        const li = document.createElement('li');
        const button = `<button type="button" class="title"></button>`;
        li.innerHTML = button;

        const title = li.querySelector('.title')
        title.textContent = product.name;
        title.style = product.colorHexCode

        productNameSelect.append(li);
    }
}

function autoResize() {

    // 計算字數, 不然會超過螢幕的 x 軸

    // this.style.height = 0;
    this.style.height = `${this.scrollHeight}px`;
}

function focusForm(e) {
    const target = e.relatedTarget;

    const firstField = this.querySelector('[tabIndex]')

    if (target && !target.closest('.taskForm')) firstField.focus()
}

function selectMenu(e) {

    const button = e.target.closest('.selectMenuButton');

    if (!button) return

    const parentElem = button.closest('.item')

    parentElem.classList.toggle('showSelectMenu')
    
    this.addEventListener('click', changeValue)
    this.addEventListener('click', closeSelectMenu)

    function closeSelectMenu(e) {

        if (e.target !== button) {
            parentElem.classList.remove('showSelectMenu')
        }
        
        this.removeEventListener('click', closeSelectMenu)
        this.removeEventListener('click', changeValue);
    }

    function changeValue(e) {
        const target = e.target.closest('.selectMenu')
        if (!target || e.target === target) return

        switch (button.name) {
            case 'type':
                break;
            case 'priority':
                const buttonPriority = button.dataset.priority;
                const optionPriority = e.target.dataset.priority;

                button.classList.remove(buttonPriority);
                button.classList.add(optionPriority);
                button.dataset.priority = optionPriority;
                button.textContent = e.target.textContent;
                break;
        }
    }
}

function validation(e) {
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

    const priority = this.querySelector('[data-priority]');
    formProps.priority = priority.dataset.priority;

    // const type = currentForm.querySelector('[data-type]');
    // formProps.type = priority.dataset.type;

    addTask('tasks', formProps)
    this.reset();
    closeForm();
}

function activeCloseButton(e) {
    const cancelButton = e.target.closest('.cancelButton');

    if (e.target !== cancelButton && e.target !== this) return

    closeForm();

    this.removeEventListener('pointerdown', activeCloseButton)
}

function closeForm() {

    const currentForm = document.querySelector('.taskForm')

    if (!currentForm) return 
    
    currentForm.remove();

    const overlay = document.querySelector('.overlay');
    
    overlay.className = 'overlay';
    document.body.style.overflow = "auto";
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

    createTask();
}


// public method

function createNavbar() {
    const template = `
        <li class="item">
            <h2>Inbox</h2>
            <div class="wrap">
                <button type="button" class="createTask"  data-form="taskForm">+</button>
                <button type="button" class="selectMenuButton">◦◦◦</button>
                <ul class="selectMenu">
                    <li class="completed">
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
function createTask() {

    let taskList = document.querySelector('.taskList');

    if (taskList) { 
        taskList.innerHTML = '';
    } else {
        taskList = document.createElement('ul')
        taskList.className = 'taskList';
    }

    const data = getLocalTasks()
    

    if (!data) {
        const div = document.createElement('div')
        div.className = 'noTask';
        div.innerHTML = '尚未建立任何任務'
        taskList.append(div)
    } else {

        for (let task of data) {
            const template = `
            <div class="task">
                <input type="checkbox">
                <button type="button" class="title"></button>
                <h3 class="name title"></h3>
                <p class="description"></p>
                <p class="dueDate"></p>
            </div>
            <div class="option">
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
        `;

            const li = document.createElement('li');

            li.className = 'item'
            li.innerHTML = template;
            li.querySelector('.name').textContent = task.name;
            li.querySelector('.description').textContent = task.descript;
            li.querySelector('.dueDate').textContent = task.date;

            taskList.append(li);
        }
    }

    return taskList
}
function showForm(e) {

    const target = e.target.closest('.createTask');

    if (!target) return

    createForm()

    const overlay = document.querySelector('.overlay');
    overlay.classList.add('showForm');

    document.body.style.overflow = "hidden"

    const currentForm = overlay.querySelector('.taskForm')
    currentForm.classList.add('active');
    const firstField = currentForm.querySelector('[tabIndex]')

    firstField.focus();
}

export {
    createNavbar,
    createTask,
    showForm,
}


