'use strict'

import './css/style.css';


// library
import namedColors from 'color-name-list';
import {format, isToday, isTomorrow} from 'date-fns';


const navbar = (() => {
    const COLOR_LIST = ['#e97451', '#f4a461', '#e7c068', '#2b9890', '#a2cffe', '#000000']

    let page = 'Inbox';
    const data = {
        tasks: null,
        products: null,
    }

    data.products = getLocalProducts();
    // data.tasks = getLocalTasks();

    // cache DOM
    const nav = document.querySelector('nav');
    // bind events
    nav.addEventListener('click', changePage)
    nav.addEventListener('click', showAddProductForm)

    createPages(page)


    // Change page init
    function changePage(e) {

        const navItem = e.target.closest('.wrap')

        if (!navItem) return

        page = navItem.querySelector('.title').textContent;

        if (page === 'Products') {
            showProductList();
            return
        }

        // 製作切換 product name
        createPages(page)
    }
    function createPages(page) {
        const content = document.querySelector('.content')

        content.innerHTML = '';

        createTasksTopBar(page)

        createTasksList(page)
        document.addEventListener('pointerdown', showOptionList);

        // switch (page) {
        //     case 'inbox':
        //         // content.append(inbox.createNavbar());
        //         // content.append(inbox.createTask());
        //         // content.addEventListener('click', inbox.showForm)
        //         break;
        //     // case 'today':
        //     //     content.append(today.createNavbar());
        //     //     content.append(today.createTask());
        //     //     content.addEventListener('click', today.showForm)
        //     //     break;
        //     // case 'upcoming':
        //     //     content.append(upcoming.createNavbar());
        //     //     content.append(upcoming.createTask());
        //     //     content.addEventListener('click', upcoming.showForm)
        //     //     break;
        //     default:
        //         // content.append(product.createNavbar(page));
        //         // content.append(product.createTask(page));
        //         // content.addEventListener('click', product.showForm)
        // }
    }


    // General
    function focusForm(e) {
        const target = e.relatedTarget;
        const firstField = this.querySelector('[tabIndex]')

        if (target && !target.closest('form')) firstField.focus()
    }
    function showForm() {
        
        const overlay = document.querySelector('.overlay');

        overlay.classList.add('show');
        document.body.style.overflow = "hidden";

        const currentForm = overlay.firstElementChild;
        currentForm.classList.add('active');

        const firstField = currentForm.querySelector('[tabIndex]')
        firstField.focus();
    }
    function showOptionList(e) {
        const target = e.target.closest('.option')

        if (!target) return

        const optionCoord = target.getBoundingClientRect()

        const optionList = target.querySelector('.optionList');
        optionList.style.top = `${optionCoord.bottom + 10}px`;
        optionList.style.left = `${optionCoord.left - (optionList.clientWidth - optionCoord.width) / 2}px`;

        target.classList.toggle('active');


        if (!target.classList.contains('active')) return 
        
        this.addEventListener('pointerdown', closeOptionListWithClick)
        this.addEventListener('scroll', closeOptionListWithScroll, {
            capture: true,
            once: true
        })

        function closeOptionListWithClick(e) {
            const secondTarget = e.target.closest('.option')

            if (!secondTarget || secondTarget !== target) {
                target.classList.remove('active');
            }
            this.removeEventListener('pointerdown', closeOptionListWithClick)
        }
        function closeOptionListWithScroll() {
            target.classList.remove('active');
        }
    }
    function activeCloseButton(e) {

        const cancelButton = e.target.closest('.cancel');

        if (e.target !== cancelButton && e.target !== this) return

        closeForm();

        this.removeEventListener('pointerdown', activeCloseButton)
    }
    function closeForm() {
        const overlay = document.querySelector('.overlay');

        const currentForm = overlay.querySelector('form')

        if (!currentForm) return
        
        currentForm.remove();

        overlay.className = 'overlay';
        document.body.style.overflow = "auto";
    }
    function validation(formProps, form) {
        let isValid = true;

        for (let field in formProps) {
            const elem = form.elements[field]

            if (elem.dataset.skipValid && elem.classList.contains('disableOutline')) {
                continue
            }

            if (!elem.classList.contains('disableOutline')) {
                isValid = false;
                elem.focus();
                return
            }

            const value = formProps[field].trim();

            if (value.length === 0) {
                const elem = form.elements[field]
            
                isValid = false;
                elem.focus();
                elem.classList.remove('disableOutline')

                elem.addEventListener('blur', disableOutLine)

                return isValid
            }
        }
        return isValid
    }
    function disableOutLine() {
        this.classList.add('disableOutline')
        this.removeEventListener('blur', disableOutLine)
    }



    // Get all Tasks Data
    function getLocalTasks() {
        const item = localStorage.getItem('tasks');

        if (!item) return []

        const tasks = JSON.parse(item)

        for (let item of tasks) {
            
            Object.assign(item,
                handleTaskDelete(item.id),
                handleTaskUpdate(item)
            )
        }
        return tasks
    }


    // Task form
    function showAddTaskForm(e) {
        const addButton = e.target.closest('.addButton')

        if (!addButton) return

        createAddTaskForm()
    }
    function createAddTaskForm() {
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
                    <div class="dropdown productDropdown">
                        <button type="button" class="wrap dropDownButton productName">
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

        form.addEventListener('focusout', focusForm)
        form.addEventListener('submit', addTask)
        
        const overlay = document.querySelector('.overlay');
        overlay.append(form)

        form.elements.day.addEventListener('change', validDate)
        form.elements.time.addEventListener('change', validTime)

        createTaskDropdown();

        form.addEventListener('click', showTaskDropdown)

        showForm()

        const textareas = form.querySelectorAll('textarea')
        
        for (let textarea of textareas) {

            const countLines = new Set();
            const maxLength = textarea.getAttribute('maxlength');

            for (let i = 0; i < maxLength; i++) {
                textarea.value += 'a'
                countLines.add(textarea.scrollHeight)
            }
            
            textarea.value = '';
            
            textarea.addEventListener("keydown", limitLines.bind(countLines))
            textarea.addEventListener("input", limitTextLength.bind(maxLength));
            textarea.addEventListener("input", autoResize);
        }

        overlay.addEventListener('pointerdown', activeCloseButton)
    }
    function createTaskDropdown() {
        const dropdownList = document.querySelector('.productDropdown .dropdownList ul')

        if (data.products.length === 0) return // 顯示尚未建立 product

        for (let product of data.products) {
            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1">
                    <span class="icon" style="--product-color:${product.hexCode}"></span>
                    ${product.name}
                </button>
            `;
            
            li.className = 'item'
            li.innerHTML = button;
            
            dropdownList.append(li);
        }
    }
    function showTaskDropdown(e) {
        
        const button = e.target.closest('.dropDownButton');

        if (!button) return

        button.classList.toggle('showList')


        const dropdownList = button.nextElementSibling;

        if (dropdownList.firstElementChild.clientHeight > 200) {
            dropdownList.firstElementChild.style.height = '200px'
        }

        dropdownList.style.right = 'auto';

        const dropdownListCoord = dropdownList.getBoundingClientRect()
        const windowRight = document.documentElement.clientWidth;

        if (dropdownListCoord.right > windowRight) {
            dropdownList.style.left = 'auto';
            dropdownList.style.right = '0px';
        }

        if (button.classList.contains('showList')) {
            this.addEventListener('pointerup', closeDropdown)
            dropdownList.addEventListener('pointerdown', changeItem)
        }

        function closeDropdown(e) {
            if (e.target !== button) {
                button.classList.remove('showList')
            }

            this.removeEventListener('pointerup', closeDropdown)
            this.removeEventListener('pointerdown', changeItem);
        }

        function changeItem(e) {

            const target = e.target.closest('.wrap')
            
                
            if (!target || target === button) return

            const selectElem = target.cloneNode(true)

            const buttonClassList = Array.from(button.classList)
            buttonClassList.pop()

            selectElem.classList.add(...buttonClassList)
            selectElem.tabIndex = 0;

            button.replaceWith(selectElem)
        }
    }


    // Task From handle
    function addTask(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        let formProps = Object.fromEntries(formData);

        if (!validation(formProps, this)) return

        formProps.priority = this.querySelector('.priority').dataset.color

        const productName = this.querySelector('.productName').textContent.trim();
        const productItem = data.products.find(item => item.name === productName)

        if (productName !== 'Inbox' && productItem === -1) return

        if (productName === 'Inbox') {
            formProps.productId = '';
        } else {
            formProps.productId = productItem.id
        }

        if (data.tasks.length > 0) {
            formProps.id = data.tasks.at(-1).id + 1;
        } else {
            formProps.id = 1;
        }

        data.tasks.push(formProps)

        localStorage.setItem('tasks', JSON.stringify(data.tasks))

        createTasksList(page);

        closeForm();
    }
    function validDate(e) {

        const form = e.target.closest('form');
        form.elements.time.value = '';  // 每次選日期時清除時間

        const message = form.querySelector('.message')
        const inputState = e.target.validity; // Constraint validation
    
        if (e.target.value.length === 0 || inputState.valueMissing) { // 點選或鍵盤刪除值時
            e.target.value = '';
            message.textContent = 'Time is optional';
            message.className = 'message';
            message.hidden = false;

            e.target.classList.add('disableOutline')
            return
        }

        // 這邊開始是一定有選擇值
        let day = new Date(e.target.value);              
        let currentTime = new Date().setHours(0,0,0,0)

        if (day < currentTime) {  // 如果日期是今天之前
            message.textContent = 'Date and Time cannot be set to the past'
            message.classList.add('error');
            message.hidden = false;

            e.target.classList.remove('disableOutline')
            e.target.focus();
        } else  {   // 如果日期是今天之後
            message.hidden = true;
            e.target.classList.add('disableOutline')
        }
    }
    function validTime(e) {
    
        const form = e.target.closest('form');
        const message = form.querySelector('.message')
        const inputState = e.target.validity; // Constraint validation

        let day = form.elements.day;
    
        if (inputState.valueMissing || e.target.value.length === 0) { // 有選過之後又刪除值時
            e.target.value = '';
            e.target.classList.add('disableOutline')
            return
        }


        if (!day.value) {  // 未設定日期時會不給設定
            day.focus()
            e.target.value = '';
            message.textContent = 'Date must be set'
            message.classList.add('error');
            message.hidden = false;
            return;
        }
        

        if (!day.classList.contains('disableOutline')) {  // 未設定日期時會不給設定
            day.focus()
            e.target.value = '';
            message.textContent = 'Date and Time cannot be set to the past'
            message.classList.add('error');
            message.hidden = false;
            return;
        }


        // 這邊開始是一定有選日期並且大於今日

        if (!isToday(new Date(day.value))) return // 如果選擇的日期不是今天, 那就是未來時不需驗證


        // 如果選擇的日期是今天時, 必須驗證日期 + 時間是否有大於現在的時間
        const inputDate = new Date(`${day.value}T${e.target.value}`);
        const currentTime = new Date().setSeconds(0, 0)
        
        if (inputDate < currentTime) { // 小於目前時間顯示
            message.textContent = 'Date and Time cannot be set to the past'
            message.classList.add('error');
            message.hidden = false;

            e.target.classList.remove('disableOutline')
            e.target.focus();
            return
        } else { // 大於目前時
            message.hidden = true;
            e.target.classList.add('disableOutline')
        }
    }
    function getDate(day, time) {
        let tokens = null;
        let timeTokens = ''
        let date = new Date(day)
        
        if (time) {
            date = new Date(`${day}T${time}`);
            timeTokens = ' HH:mm'
        }

        const distanceDays =  date.getDate() - new Date().getDate()

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
    function limitLines(e) {
        if (e.code === 'Backspace') return;
        
        if (!this.has(e.target.scrollHeight)) {
            e.preventDefault();
        }
    }
    function limitTextLength(e) {
        const valueLength = e.target.value.length

        if (valueLength > this) {
            e.target.value = e.target.value.slice(0, this)
            return
        }
    }
    function autoResize() {
        this.style.height = 0;
        this.style.height = `${this.scrollHeight}px`;
    }


    // Tasks List
    function createTasksTopBar(name) {
        const content = document.querySelector('.content')

        const template = `
            <div class="wrap">
                <h2 class="title"></h2>
                <button type="button" class="addButton">+</button>
            </div>
            <div class="option">
                <button type="button" class="optionButton">◦◦◦</button>
                <ul class="optionList">
                    <li>
                        <button class="showTaskButton" type="button">Show completed tasks</button>
                    </li>
                </ul>
            </div>
        `
        const div = document.createElement('div');
        div.className = 'top'
        div.innerHTML = template;

        const title = div.querySelector('.title');
        title.textContent = name;

        content.prepend(div);

        if (title.scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
            title.style.overflow = 'hidden';
            title.title = name;
        }
        title.style.flex = 1;

        div.addEventListener('pointerdown', showCompletedTasks)
        div.addEventListener('click', showAddTaskForm)

        function showCompletedTasks(e) {
            const showTaskButton = e.target.closest('.showTaskButton');
            
            if (!showTaskButton) return;
        }
    }
    function createTasksList(page) {

        data.tasks = getLocalTasks();

        if (data.tasks.length === 0) {
            console.log("Haven't item");
            return
        }

        const content = document.querySelector('.content')

        let tasksList = document.querySelector('.tasksList');

        const ul = document.createElement('ul');
        ul.className = 'tasksList';        

        if (tasksList) {
            tasksList.replaceWith(ul)
        } else {
            content.append(ul);
        }

        let pageItem = data.tasks;

        if (page !== 'Inbox') {
            const product = data.products.find(item => item.name === page)
            pageItem = data.tasks.filter(item => item.productId === product.id)
        }

        for (let task of pageItem) {
            const date = getDate(task.day, task.time)

            const template = `
                <input type="checkbox" style="--priority-color:${task.priority}">
                <div class="wrap">
                    <h3 class="title"></h3>
                    <div class="option">
                        <button type="button" class="optionButton">•••</button>
                        <ul class="optionList">
                            <li>
                                <button class="editButton" type="button">Edit product name</button>
                            </li>
                            <li>
                                <button class="deleteButton"  type="button">Delete product</button>
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

            ul.append(li);
        }

        ul.addEventListener('pointerdown', editTaskItem);
        ul.addEventListener('pointerdown', deleteTaskItem);

        function editTaskItem(e) {
            e.preventDefault(); 
            const editButton = e.target.closest('.editButton');
            if (!editButton) return

            const id = editButton.closest('.item').dataset.id
            const index = data.tasks.findIndex(item => item.id === +id)

            if (index === -1 || !id) return // 提示未找到項目

            createEditTaskForm(data.tasks[index]);
            showForm();
        }

        function deleteTaskItem(e) {
            const deleteButton = e.target.closest('.deleteButton');

            if (!deleteButton) return

            const id = deleteButton.closest('.item').dataset.id
            const index = data.tasks.findIndex(item => item.id === +id)

            if (index === -1 || !id) return // 提示未找到項目

            data.tasks[index].remove(index, 'tasks');
        }
    }
    function createEditTaskForm(task) {
        const template = `
            <h2>Edit Task</h2>
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
                    <div class="dropdown productDropdown">
                        <button type="button" class="wrap dropDownButton productName">
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

        form.elements.day.value = task.day;
        form.elements.time.value = task.time;

        form.addEventListener('focusout', focusForm)
        form.addEventListener('submit', task.edit)
        
        const overlay = document.querySelector('.overlay');
        overlay.append(form)

        form.elements.day.addEventListener('change', validDate)
        form.elements.time.addEventListener('change', validTime)

        createTaskDropdown();

        form.addEventListener('click', showTaskDropdown)

        showForm()

        const textareas = form.querySelectorAll('textarea')
        
        for (let textarea of textareas) {
            const countLines = new Set();
            const maxLength = textarea.getAttribute('maxlength');

            for (let i = 0; i < maxLength; i++) {
                textarea.value += 'a'
                countLines.add(textarea.scrollHeight)
            }
            
            textarea.value = '';

            textarea.addEventListener("keydown", limitLines.bind(countLines))
            textarea.addEventListener("input", limitTextLength.bind(maxLength));
            textarea.addEventListener("input", autoResize);
        }

        const priorityButton = form.querySelector('.priority')

        const allPriorityDropDownButtons =  Array.from(priorityButton.nextElementSibling.querySelectorAll('button'))
        const priorityElem = allPriorityDropDownButtons.find(item => item.dataset.color === task.priority)

        const priorityElemClone = priorityElem.cloneNode(true)
        priorityElemClone.classList.add(...priorityButton.classList)

        priorityButton.replaceWith(priorityElemClone)

        if (task.productId) {
            const productName = data.products.find(item => item.id === task.productId).name

            const productNameButton = form.querySelector('.productName')
            const allProductsNameDropDownButtons = Array.from(productNameButton.nextElementSibling.querySelectorAll('button'))
            const productNameElem = allProductsNameDropDownButtons.find(item => item.textContent.trim() === productName)

            const productNameElemClone = productNameElem.cloneNode(true)
            productNameElemClone.classList.add(...productNameButton.classList)
            productNameButton.replaceWith(productNameElemClone)
        }

        form.elements.taskName.value = task.name;
        form.elements.descript.value = task.descript;

        autoResize.call(form.elements.taskName);
        autoResize.call(form.elements.descript);

        overlay.addEventListener('pointerdown', activeCloseButton)
    }

    // Task item handle
    function handleTaskDelete(id) {
        const remove = (index, type) => {

            data[type].splice(index, 1)

            localStorage.setItem(type, JSON.stringify(data[type]))

            document.querySelector((`.${type}List [data-id="${id}"]`)).remove()
        }

        return { remove }
    }
    function handleTaskUpdate(task) {
        const edit = function (e) {
            e.preventDefault()

            const formData = new FormData(this);
            const formProps = Object.fromEntries(formData);

            if (!validation(formProps, this)) return

            console.log(task)
            console.log(formProps)

            task.priority = this.querySelector('.priority').dataset.color;
            task.productName = this.querySelector('.productName').textContent.trim();
            task.day = formProps.day
            task.descript = formProps.descript
            task.name = formProps.name
            task.title = formProps.title

            localStorage.setItem('tasks', JSON.stringify(data.tasks))

            let content = document.querySelector('.content');
            const currentScrollBarPosition = content.scrollTop;

            createTasksList(page);

            content.scrollTo({ top: currentScrollBarPosition });

            closeForm();
        }

        return { edit }
    }



    // Get all Products Data
    function getLocalProducts() {
        const item = localStorage.getItem('products');

        if (!item) return []

        const products = JSON.parse(item)

        for (let item of products) {
            Object.assign(item,
                handleProductUDelete(item.id),
                handleProductUpdate(item)
            )
        }
        
        return products
    }

    // Product Form
    function showAddProductForm(e) {

        const target = e.target.closest('.addButton')
        if (!target) return

        createAddProductForm()

        showForm();
    }
    function createAddProductForm() {
        const template = `
            <h2>Add Product</h2>
            <label for="name">
                Name
                <input class="disableOutline" name="name" type="text" id="name" maxlength="50" tabindex="0">
            </label>
            <div class="dropdown">
                <h3>Color</h3>
                <button type="button" class="wrap colorButton">
                    <span class="icon" style="--product-color:#000000"></span>
                    Black
                </button>
                <div class="dropdownList">
                    <ul>
                    </ul>   
                </div>
            </div>
            <div class="submitButton">
                <button type="button" class="cancel">Cancel</button>
                <button type="submit" name="submit" class="submit" disable>Add task</button>
            </div>  
            `;
        
        const form = document.createElement('form');
        form.classList.add('productForm');
        form.innerHTML = template;

        form.addEventListener('focusout', focusForm)
        form.addEventListener('submit', addProduct)

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        createProductDropdown();

        form.addEventListener('click', showProductDropdown)

        overlay.addEventListener('pointerdown', activeCloseButton)
    }
    function createProductDropdown() {
        const dropdownList = document.querySelector('.dropdownList ul')

        for (let hax of COLOR_LIST) {
            const color = namedColors.find(color => color.hex === hax);

            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1">
                    <span class="icon" style="--product-color:${color.hex};"></span>
                    ${color.name}
                </button>
            `;
            
            li.className = 'item'
            li.innerHTML = button;
            
            dropdownList.append(li);
        }
    }
    function showProductDropdown(e) {
        const button = e.target.closest('.colorButton');

        if (!button) return

        button.classList.toggle('showList')

        if (button.classList.contains('showList')) {
            this.addEventListener('pointerup', closeDropdown)
            this.addEventListener('pointerdown', changeColor)
        }

        function closeDropdown(e) {
            if (e.target !== button) {
                button.classList.remove('showList')
            }

            this.removeEventListener('pointerup', closeDropdown)
            this.removeEventListener('pointerdown', changeColor);
        }

        function changeColor(e) {
            const target = e.target.closest('.wrap')
                
            if (!target || target === button) return

            const selectElem = target.cloneNode(true)

            selectElem.classList.add('colorButton')
            selectElem.tabIndex = 0;

            button.replaceWith(selectElem)
        }
    }

    // Product Form Handler
    function addProduct(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const formProps = Object.fromEntries(formData);

        if (!validation(formProps, this)) return

        const hexCode = getComputedStyle(this.querySelector('.icon')).getPropertyValue('--product-color')

        if (COLOR_LIST.findIndex(item => item === hexCode) === -1) return

        formProps.hexCode = hexCode;

        if ( data.products.length > 0) {
            formProps.id = data.products.at(-1).id + 1;
        } else {
            formProps.id = 1;
        }

        data.products.push(formProps)

        localStorage.setItem('products', JSON.stringify(data.products))

        createProductList();

        const productButton = document.querySelector('.products');
        productButton.classList.add('arrowDown');

        const productsList = document.querySelector('.productsList ul');
        productsList.scrollTo({top: productsList.scrollHeight, behavior: 'smooth'});

        closeForm();
    }

    // Products List
    function showProductList() {
        const products = document.querySelector('.products')

        products.classList.toggle('arrowDown');

        if (products.classList.contains('arrowDown')) {
            createProductList();
        }
    }
    function createProductList() {
        
        const productsList = document.querySelector('.productsList');

        productsList.innerHTML = '';

        data.products = getLocalProducts();

        if (data.products.length === 0) return // 顯示尚未加入專案

        const ul = document.createElement('ul');
        
        productsList.append(ul);

        for (let product of data.products) {
            const template = `
                <div class="wrap">
                    <span class="icon"></span>
                    <span class="title"></span>
                </div>
                <div class="option">
                    <button type="button" class="optionButton">•••</button>
                    <ul class="optionList">
                        <li>
                            <button class="editButton" type="button">Edit product name</button>
                        </li>
                        <li>
                            <button class="deleteButton"  type="button">Delete product</button>
                        </li>
                    </ul>
                </div>
            `;

            const li = document.createElement('li');

            li.className = 'item'
            li.dataset.id = product.id;
            li.innerHTML = template;
            li.querySelector('.title').textContent = product.name;
            li.querySelector('.icon').style = `--product-color:${product.hexCode}`;

            ul.append(li);

            if (li.querySelector('.title').scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
                li.querySelector('.title').style.overflow = 'hidden';
                li.querySelector('.title').title = product.name;
            }
        }

        productsList.append(ul);
        
        ul.addEventListener('pointerdown', editProductItem);
        ul.addEventListener('pointerdown', deleteProductItem);

        function editProductItem(e) {
            e.preventDefault(); 
            
            const editButton = e.target.closest('.editButton');
            if (!editButton) return

            const id = editButton.closest('.item').dataset.id
            const index = data.products.findIndex(item => item.id === +id)

            if (index === -1 || !id) return // 提示未找到項目

            createEditProductForm(data.products[index]);
            showForm();
            
        }
        function deleteProductItem(e) {
            const deleteButton = e.target.closest('.deleteButton');

            if (!deleteButton) return

            const id = deleteButton.closest('.item').dataset.id
            const index = data.products.findIndex(item => item.id === +id)

            if (index === -1 || !id) return // 提示未找到項目

            data.products[index].remove(index, 'products');
        }
    }
    function createEditProductForm(product) {
        const template = `
            <h2>Edit Product</h2>
            <label for="name">
                Name
                <input class="disableOutline" name="name" type="text" id="name" maxlength="50" tabindex="0">
            </label>
            <div class="dropdown">
                <h3>Color</h3>
                <button type="button" class="wrap colorButton">
                    <span class="icon"></span>
                </button>
                <div class="dropdownList">
                    <ul>
                    </ul>   
                </div>
            </div>
            <div class="submitButton">
                <button type="button" class="cancel">Cancel</button>
                <button type="submit" name="submit" class="submit" disable>Add task</button>
            </div>  
            `;

        const color = namedColors.find(color => color.hex === product.hexCode);
        const form = document.createElement('form');
        form.classList.add('productForm');
        form.innerHTML = template;

        form.elements.name.value = product.name;

        form.querySelector('.colorButton').append(color.name);
        form.querySelector('.icon').style = `--product-color:${product.hexCode}`;

        form.addEventListener('focusout', focusForm)
        form.addEventListener('submit', product.edit)

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        createProductDropdown();

        form.addEventListener('click', showProductDropdown)

        overlay.addEventListener('pointerdown', activeCloseButton)
    }
    
    // Product item handle
    function handleProductUpdate(product) {
        const edit = function (e) {
            e.preventDefault()

            const formData = new FormData(this);
            const formProps = Object.fromEntries(formData);

            if (!validation(formProps, this)) return

            const hexCode = getComputedStyle(this.querySelector('.icon')).getPropertyValue('--product-color')

            if (COLOR_LIST.findIndex(item => item === hexCode) === -1) return

            formProps.hexCode = hexCode;

            product.hexCode = hexCode;
            product.name = formProps.name

            localStorage.setItem('products', JSON.stringify(data.products))

            let productsList = document.querySelector('.productsList ul');
            const currentScrollBarPosition = productsList.scrollTop;

            createProductList();

            productsList = document.querySelector('.productsList ul');
            productsList.scrollTo({ top: currentScrollBarPosition });

            closeForm();
        }

        return { edit }
    }
    function handleProductUDelete(id) {
        const remove = (index, type) => {

            data[type].splice(index, 1)

            localStorage.setItem(type, JSON.stringify(data[type]))

            document.querySelector((`.${type}List [data-id="${id}"]`)).remove()
        }

        return { remove }
    }

})();

