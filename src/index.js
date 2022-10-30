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

    // All Pages
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

        div.querySelector('.title').textContent = name;

        element.append(div);

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
            // showProductForm();
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

        // createAddTaskFrom()
    }

    function createAddTaskFrom() {
        // const template = `
        //     <h2>Add Product</h2>
        //     <label for="productName">
        //         Name
        //         <input class="disableOutline" name="name" type="text" id="productName" maxlength="50" tabindex="0">
        //     </label>
        //     <ul class="colorSelect">
        //         Color
        //         <li class="colorButton">
        //             <div class="wrap">
        //                 <span class="icon"  name="colorField" style="--product-color:#000000"></span>
        //                 <span class="title">Black</span>
        //             </div>
        //         </li>
        //         <li class="dropdown">
        //             <ul></ul>
        //         </li>
        //     </ul>
        //     <div class="submitButton">
        //         <button type="button" class="cancel">Cancel</button>
        //         <button type="submit" name="submit" class="submit" disable>Add task</button>
        //     </div>
        //     `;
        // const form = document.createElement('form');
        // form.classList.add('productForm');
        // form.innerHTML = template;

        // form.addEventListener('focusout', focusForm)
        // form.addEventListener('submit', addProduct)

        // const overlay = document.querySelector('.overlay');

        // overlay.append(form)

        // createDropdown();

        // form.addEventListener('click', showDropdown)

        // overlay.addEventListener('pointerdown', activeCloseButton)

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
                <li class="item box" data-class-name="box">
                    <div class="wrap">
                        <button type="button" name="productName" class="title selectMenuButton">Inbox</button>
                        <ul class="selectMenu productNameSelect">
                            <li class="box" data-class-name="box">
                                <button type="button" class="title">Inbox</button>
                            </li>
                            <li class="order" data-class-name="order">
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

        showProductForm();
    }
    function createAddProductForm() {
        const template = `
            <h2>Add Product</h2>
            <label for="productName">
                Name
                <input class="disableOutline" name="name" type="text" id="productName" maxlength="50" tabindex="0">
            </label>
            <ul class="colorSelect">
                Color
                <li class="colorButton">
                    <div class="wrap">
                        <span class="icon"  name="colorField" style="--product-color:#000000"></span>
                        <span class="title">Black</span>
                    </div>
                </li>
                <li class="dropdown">
                    <ul></ul>
                </li>
            </ul>
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

        createDropdown();

        form.addEventListener('click', showDropdown)

        overlay.addEventListener('pointerdown', activeCloseButton)
    }
    function createEditProductForm(product) {
        const template = `
            <h2>Edit Product</h2>
            <label for="productName">
                Name
                <input class="disableOutline" name="name" type="text" id="productName" maxlength="50" tabindex="0">
            </label>
            <ul class="colorSelect">
                Color
                <li class="colorButton">
                    <div class="wrap">
                        <span class="icon"  name="colorField"></span>
                        <span class="title">Black</span>
                    </div>
                </li>
                <li class="dropdown">
                    <ul></ul>
                </li>
            </ul>
            <div class="submitButton">
                <button type="button" class="cancel">Cancel</button>
                <button type="submit" name="submit" class="submit" disable>Confirm</button>
            </div>
            `;

        const form = document.createElement('form');
        form.classList.add('productForm');
        form.innerHTML = template;

        form.querySelector('#productName').value = product.name;

        form.querySelector('.icon').style = product.colorHexCode;

        form.addEventListener('focusout', focusForm)
        form.addEventListener('submit', product.edit)

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        createDropdown();

        form.addEventListener('click', showDropdown)

        overlay.addEventListener('pointerdown', activeCloseButton)

    }
    function showProductForm() {
        
        const overlay = document.querySelector('.overlay');

        overlay.classList.add('show');
        document.body.style.overflow = "hidden";

        const currentForm = overlay.querySelector('.productForm')
        currentForm.classList.add('active');

        const firstField = currentForm.querySelector('[tabIndex]')
        firstField.focus();
    }


    // Product Form Handler
    function focusForm(e) {
        const target = e.relatedTarget;
        const firstField = this.querySelector('[tabIndex]')

        if (target && !target.closest('.productForm')) firstField.focus()
    }
    function addProduct(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formProps = Object.fromEntries(formData);

        if (!validation(formProps, this)) return

        const hexCode = document.querySelector('[name="colorField"]').getAttribute('style');

        formProps.colorHexCode = hexCode;

        const products = JSON.parse(localStorage.getItem('products')) || [];

        if (products.length > 0) {
            formProps.id = products.at(-1).id + 1;
        } else {
            formProps.id = 1;
        }

        products.push(formProps)

        localStorage.setItem('products', JSON.stringify(products))

        createProduct();

        const productButton = document.querySelector('.products');
        productButton.classList.add('arrowDown');

        this.reset();
        closeForm();
    }
    function validation(formProps, form) {
        let isValid = true;

        for (let field in formProps) {
            const value = formProps[field].trim();

            if (value.length === 0) {
                const elem = form.elements[field]

                isValid = false

                elem.focus();
                elem.classList.remove('disableOutline')

                elem.addEventListener('blur', disableOutLine)

                function disableOutLine() {
                    elem.classList.add('disableOutline')
                    this.removeEventListener('blur', disableOutLine)
                }
                return isValid
            }
        }

        return isValid
    }
    function createDropdown() {
        const dropdown = document.querySelector('.dropdown')

        const colorList = ['#e97451', '#f4a461', '#e7c068', '#2b9890', '#a2cffe', '#000000']

        for (let hax of colorList) {

            const color = namedColors.find(color => color.hex === hax);
            const li = document.createElement('li');
            const button = `<div class="wrap"><span class="icon" style="--product-color:${color.hex}"></span><span class="title">${color.name}</span></wrap>`

            li.innerHTML = button;

            dropdown.firstElementChild.append(li);
        }
    }
    function showDropdown(e) {

        const button = e.target.closest('.wrap');

        if (!button) return

        this.classList.toggle('showDropdown')

        if (this.classList.contains('showDropdown')) {
            this.addEventListener('pointerup', closeDropdown)
            this.addEventListener('pointerdown', changeColor)
        }

        function closeDropdown(e) {
            if (!e.target.closest('.wrap')) {
                this.classList.remove('showDropdown')
            }

            this.removeEventListener('pointerup', closeDropdown)
            this.removeEventListener('pointerdown', changeColor);
        }

        function changeColor(e) {
            const target = e.target.closest('.wrap')
            if (!target) return

            const hex = target.firstElementChild.getAttribute('style');
            const name = target.lastElementChild.textContent;

            button.firstElementChild.setAttribute('style', hex);
            button.lastElementChild.textContent = name
        }
    }
    function activeCloseButton(e) {

        const cancelButton = e.target.closest('.cancel');

        if (e.target !== cancelButton && e.target !== this) return

        closeForm();

        this.removeEventListener('pointerdown', activeCloseButton)
    }
    function closeForm() {

        const currentForm = document.querySelector('.productForm')

        if (!currentForm) return
        const overlay = document.querySelector('.overlay');

        currentForm.remove();

        overlay.className = 'overlay';
        document.body.style.overflow = "auto";
    }


    // Product List
    function showProductList() {
        const products = document.querySelector('.products')

        products.classList.toggle('arrowDown');

        createProduct();
    }
    function createProduct() {
        
        const productList = document.querySelector('.productList ul');

        productList.innerHTML = '';

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

            productList.append(li);

            if (li.querySelector('.title').scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
                li.querySelector('.title').style.overflow = 'hidden';
                li.querySelector('.title').title = product.name;
            }
        }

        productList.addEventListener('pointerdown', editProductName);
        productList.addEventListener('pointerdown', deleteProduct);

        function editProductName(e) {
            e.preventDefault(); 
            
            const editButton = e.target.closest('.editButton');
            if (!editButton) return

            const id = editButton.closest('.item').dataset.productId
            const item = products.find(item => item.id === +id)

            if (!item || !id) return

            createEditProductForm(item);
            showProductForm();
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

            const hexCode = document.querySelector('[name="colorField"]').getAttribute('style');

            product.colorHexCode = hexCode;
            product.name = formProps.name

            localStorage.setItem('products', JSON.stringify(products))

            const elem = document.querySelector((`[data-product-id="${product.id}"] .wrap`))
            
            elem.firstElementChild.style = hexCode
            elem.lastElementChild.textContent =   formProps.name

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


// 完成 createAddTaskFrom function 建立 task 表單

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