'use strict'

// private method

function getLocalTasks() {
    const item = localStorage.getItem('tasks');

    if (!item) return

    return JSON.parse(item)
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

    overlay.addEventListener('pointerdown', activeCloseButton)
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
}

function closeForm() {

    const overlay = document.querySelector('.overlay');
    const currentForm = overlay.querySelector('.taskForm')
    currentForm.classList.remove('active');
    
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




