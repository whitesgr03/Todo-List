'use strict'

import './css/style.css';


// library
import namedColors from 'color-name-list';


const navbar = (() => {
    let products = getLocalProducts();
    // let tasks = getLocalTasks();

    // cache DOM
    const nav = document.querySelector('nav');

    // bind events
    nav.addEventListener('click', changePage)
    nav.addEventListener('click', showAddProductForm)

    createPages('Inbox')


    // General
    function changePage(e) {

        const navItem = e.target.closest('.wrap')

        if (!navItem) return


        const name = navItem.querySelector('.title').textContent;

        if (name === 'Products') {
            showProductList();
            return
        }

        // 製作切換 product name
        createPages(name)
    }
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

            if (elem.dataset.skipValid) {
                continue
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


    // Tasks
    function createPages(page) {

        const content = document.querySelector('.content')

        content.innerHTML = '';

        createTasksTopBar(page, content)
        document.addEventListener('pointerdown', showOptionList);
        createTasksList(content)

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
    function createTasksTopBar(name, element) {
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

        element.append(div);

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

            console.log(showTaskButton)
        }
    }
    function createTasksList(element) {

        const taskList = document.createElement('ul');
        taskList.className = 'taskList'
        element.append(taskList);

        const tasks = [
            { name: '123', descript: '9999', date: '2020/12/20' },
            { name: '123', descript: '9999', date: '2020/12/20' },
            { name: '123', descript: '9999', date: '2020/12/20' },
            { name: '123', descript: '9999', date: '2020/12/20' },
            {name: '123', descript: '9999', date: '2020/12/20'},
        ]

        for (let task of tasks) {
            const template = `
                <input type="checkbox">
                <div class="wrap">
                    <h3 class="title">test</h3>
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
                <p class="description title">rmkwekr</p>
                <p class="dueDate">10/03/2022</p>
            `;

            // tasks = getLocalProducts();
        
            // if (!tasks) return

            const li = document.createElement('li');

            li.className = 'item'
            li.innerHTML = template;
            li.querySelector('.title').textContent = task.name;
            li.querySelector('.description').textContent = task.descript;
            li.querySelector('.dueDate').textContent = task.date;

            taskList.append(li);
        }

        taskList.addEventListener('pointerdown', editProductName);
        taskList.addEventListener('pointerdown', deleteProduct);

        function editProductName(e) {
            e.preventDefault(); 
            
            const editButton = e.target.closest('.editButton');
            if (!editButton) return

            console.log(editButton)

            // const id = editButton.closest('.item').dataset.productId
            // const item = products.find(item => item.id === +id)

            // if (!item || !id) return

            // createEditForm(item);
            // showForm();
        }
        function deleteProduct(e) {
            const deleteButton = e.target.closest('.deleteButton');

            if (!deleteButton) return

            console.log(deleteButton)

            // const id = deleteButton.closest('.item').dataset.productId
            // const item = products.find(item => item.id === +id)

            // if (!item || !id) return

            // item.remove();
        }
    }


    // Task form
    function showAddTaskForm(e) {
        const addButton = e.target.closest('.addButton')

        if (!addButton) return

        createAddTaskFrom()
    }
    function createAddTaskFrom() {
        const template = `
            <label for="taskName">
                Task name
                <textarea class="disableOutline" id="taskName" name="name" rows="1" tabIndex="0" maxlength="100"></textarea>
            </label>
            <label for="descript">
                Description
                <textarea class="disableOutline" id="descript" name="descript" rows="1" maxlength="300"></textarea>
            </label>
                <div class="taskFormButtons">
                    <input class="date disableOutline" name="date" type="date" data-skip-valid="1" required>
                    <input class="time disableOutline" name="time" type="time" data-skip-valid="1">
                    <div class="dropdown priority">
                        <button type="button" class="wrap dropDownButton">
                            <span class="icon flag low"></span>
                            Low
                        </button>
                        <div class="dropdownList">
                            <ul>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1">
                                        <span class="icon flag critical"></span>
                                        Critical
                                    </button>
                                </li>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1">
                                        <span class="icon flag high"></span>
                                        High
                                    </button>
                                </li>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1">
                                        <span class="icon flag medium"></span>
                                        Medium
                                    </button>
                                </li>
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1">
                                        <span class="icon flag low"></span>
                                        Low
                                    </button>
                                </li>
                            </ul>   
                        </div>
                    </div>
                    <div class="dropdown productName">
                        <button type="button" class="wrap dropDownButton">
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
                                <li class="item">
                                    <button type="button" class="wrap" tabIndex="-1">
                                        <span class="icon order"></span>
                                        Today
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
        // form.addEventListener('submit', validation)
        
        const overlay = document.querySelector('.overlay');
        overlay.append(form)

        form.elements.date.addEventListener('change', validDate)
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
    function showTaskDropdown(e) {
        
        const button = e.target.closest('.dropDownButton');

        if (!button) return

        button.classList.toggle('showList')

        const dropdownList = button.nextElementSibling;

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

            selectElem.classList.add('dropDownButton')
            selectElem.tabIndex = 0;

            button.replaceWith(selectElem)
        }
    }
    function createTaskDropdown() {
        const dropdownList = document.querySelector('.productName .dropdownList ul')
        for (let product of products) {
            const template = `
            <li class="item">
                <button type="button" class="wrap" tabIndex="-1">
                    <span class="icon" style="--product-color:#000000"></span>
                    black
                </button>
            </li>`

            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1">
                    <span class="icon" style="${product.colorHexCode}"></span>
                    ${product.name}
                </button>
            `;
            
            li.className = 'item'
            li.innerHTML = button;
            
            dropdownList.append(li);
        }
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
        let date = new Date(e.target.value);              
        let currentTime = new Date().setHours(0,0,0,0)

        if (date < currentTime) {  // 如果日期是今天之前
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

        let date = form.elements.date;
    
        if (inputState.valueMissing || e.target.value.length === 0) { // 有選過之後又刪除值時
            e.target.value = '';
            e.target.classList.add('disableOutline')
            return
        }


        if (!date.value) {  // 未設定日期時會不給設定
            date.focus()
            e.target.value = '';
            message.textContent = 'Date must be set'
            message.classList.add('error');
            message.hidden = false;
            return;
        }
        

        if (!date.classList.contains('disableOutline')) {  // 未設定日期時會不給設定
            date.focus()
            e.target.value = '';
            message.textContent = 'Date and Time cannot be set to the past'
            message.classList.add('error');
            message.hidden = false;
            return;
        }


        // 這邊開始是一定有選日期並且大於今日

        if (!isToday(new Date(date.value))) return // 如果選擇的日期不是今天, 那就是未來時不需驗證


        // 如果選擇的日期是今天時, 必須驗證日期 + 時間是否有大於現在的時間
        const inputDate = new Date(`${date.value}T${e.target.value}`);
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


    // Get Product Data
    function getLocalProducts() {
        const item = localStorage.getItem('products');

        if (!item) return

        const products = JSON.parse(item)

        for (let product of products) {
            compose(product)
        }

        return products
    }
    function compose(product) {
        return Object.assign(product,
            handleDelete(product.id),
            handleUpdate(product)
        )
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
            <label for="productName">
                Name
                <input class="disableOutline" name="name" type="text" id="productName" maxlength="50" tabindex="0">
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
    function createEditProductForm(product) {
        const template = `
            <h2>Add Product</h2>
            <label for="productName">
                Name
                <input class="disableOutline" name="name" type="text" id="productName" maxlength="50" tabindex="0">
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

        const form = document.createElement('form');
        form.classList.add('productForm');
        form.innerHTML = template;

        form.querySelector('#productName').value = product.name;

        form.querySelector('.colorButton').append(product.colorName);
        form.querySelector('.icon').style = product.colorHexCode;

        form.addEventListener('focusout', focusForm)
        form.addEventListener('submit', product.edit)

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        createProductDropdown();

        form.addEventListener('click', showProductDropdown)

        overlay.addEventListener('pointerdown', activeCloseButton)
    }
    function createProductDropdown() {
        const dropdownList = document.querySelector('.dropdownList ul')

        const colorList = ['#e97451', '#f4a461', '#e7c068', '#2b9890', '#a2cffe', '#000000']

        for (let hax of colorList) {
            const color = namedColors.find(color => color.hex === hax);

            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1">
                    <span class="icon" style="--product-color:${color.hex}"></span>
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

        const hexCode = this.querySelector('.icon').getAttribute('style');
        const color = this.querySelector('.colorButton').textContent.trim();

        formProps.colorHexCode = hexCode;
        formProps.colorName = color;

        const products = JSON.parse(localStorage.getItem('products')) || [];

        if (products.length > 0) {
            formProps.id = products.at(-1).id + 1;
        } else {
            formProps.id = 1;
        }
        products.push(formProps)

        localStorage.setItem('products', JSON.stringify(products))

        createProductList();

        const productButton = document.querySelector('.products');
        productButton.classList.add('arrowDown');

        const productList = document.querySelector('.productList ul');
        productList.scrollTo({top: productList.scrollHeight, behavior: 'smooth'});

        this.reset();
        closeForm();
    }


    // Product List
    function showProductList() {
        const products = document.querySelector('.products')

        products.classList.toggle('arrowDown');

        if (products.classList.contains('arrowDown')) {
            createProductList();
        }
    }
    function createProductList() {
        
        const productList = document.querySelector('.productList');

        productList.innerHTML = '';

        const ul = document.createElement('ul');
        
        productList.append(ul);

        products = getLocalProducts();

        if (!products) return

        for (let product of products) {
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
            li.dataset.productId = product.id;
            li.innerHTML = template;
            li.querySelector('.title').textContent = product.name;
            li.querySelector('.icon').style = product.colorHexCode;

            ul.append(li);

            if (li.querySelector('.title').scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
                li.querySelector('.title').style.overflow = 'hidden';
                li.querySelector('.title').title = product.name;
            }
        }

        productList.append(ul);
        
        ul.addEventListener('pointerdown', editProductName);
        ul.addEventListener('pointerdown', deleteProduct);

        function editProductName(e) {
            e.preventDefault(); 
            
            const editButton = e.target.closest('.editButton');
            if (!editButton) return

            const id = editButton.closest('.item').dataset.productId
            const item = products.find(item => item.id === +id)

            if (!item || !id) return

            createEditProductForm(item);
            showForm();
            
        }
        function deleteProduct(e) {
            const deleteButton = e.target.closest('.deleteButton');

            if (!deleteButton) return

            const id = deleteButton.closest('.item').dataset.productId
            const item = products.find(item => item.id === +id)

            if (!item || !id) return

            item.remove();
        }
    }

    // Product list handle
    function handleDelete(id) {
        const remove = () => {

            const index = products.findIndex(item => item.id === id)
            products.splice(index, 1)

            localStorage.setItem('products', JSON.stringify(products))

            document.querySelector((`[data-product-id="${id}"]`)).remove()
        }

        return { remove }
    }
    function handleUpdate(product) {
        const edit = function (e) {
            e.preventDefault()

            const formData = new FormData(this);
            const formProps = Object.fromEntries(formData);

            if (!validation(formProps, this)) return

            const hexCode = this.querySelector('.icon').getAttribute('style');
            const color = this.querySelector('.colorButton').textContent.trim();

            product.colorHexCode = hexCode;
            product.colorName = color;
            product.name = formProps.name

            localStorage.setItem('products', JSON.stringify(products))

            let productList = document.querySelector('.productList ul');
            const currentScrollBarPosition = productList.scrollTop;

            createProductList();

            productList = document.querySelector('.productList ul');
            productList.scrollTo({ top: currentScrollBarPosition });

            closeForm();
        }

        return { edit }
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

})();


// 建立 每個 product 都能切換頁面, 並建立 task

// 限制 product 建立相同的名稱

// 建立 task 之後再顯示每個 product 的 task 數量



// 主要功能

// inbox 顯示所有項目

// today 顯示截止日期是今天的項目

// Upcoming 任何不是今天截止的項目, 使用時間來區隔

// projects 可命名分類建立獨立的項目


// 項目的內容是

// title

// description

// dueDate

// priority

// 包括 CRUD



// 1. Inbox

//     列表按鈕
//         顯示不包含 Products 內的總數

//     內容
//         顯示全部, 編輯單項, 刪除單項

//     ...列表按鈕 使用 point event 移入時開 移出關


// 2. Today

//     列表按鈕
//         顯示今天的總數, 包括 Products

//     內容
//         只顯示今天的, 新增單項, 編輯單項, 刪除單項


// 3. Upcoming

//     列表按鈕
//         無

//     內容
//         顯示從今天開始到當月份最後一天的, 新增單項, 編輯單項, 刪除單項


// 4. Products

//     列表按鈕 (+ 符號)
//         收縮列表, 新增單項專案

//     單項專案列表按鈕 (...)
//         顯示專案內所有單項總數, 編輯單項專案, 刪除單項專案

//     內向
//         顯示全部, 新增單項子項目(section), 新增單項 (task)

//     子項目
//         編輯單項, 刪除單項