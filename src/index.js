'use strict'

import './css/style.css';
import * as inbox from './js/inbox'


// library
import namedColors from 'color-name-list';


const navbar = (() => {			
    let data = getLocalProduct();

    // cache DOM
    const nav = document.querySelector('nav');

    // bind events
    nav.addEventListener('click', changePage)
    nav.addEventListener('click', showProductForm)


    function changePage(e) {

        const navItem = e.target.closest('.wrap')

        if (!navItem) return

        const name = navItem.querySelector('.title').textContent.toLowerCase();

        if (name === 'products') {
            showProductList();
            return
        }

        // 製作切換 product name

        // nav.createPages(name)
    }
    
    function getLocalProduct() { 
        const item = localStorage.getItem('products');

        if (!item) return

        const products = JSON.parse(item)

        for (let product of products) {
            Object.assign(product,
                handleRemove(product)
            )
        }

        return products
    }

    function showProductForm(e) {

        const target = e.target.closest('.addButton')
        if (!target) return

        const overlay = document.querySelector('.overlay');

        createProductForm(overlay)

        overlay.classList.add('show');
        document.body.style.overflow = "hidden";

        const currentForm = overlay.querySelector('.productForm')
        currentForm.classList.add('active');

        const firstField = currentForm.querySelector('[tabIndex]')
        
        firstField.focus();
    }

    function createProductForm(overlay) {
        const template = `
            <h2>Add Product</h2>
            <label for="productName">
                Name
                <input class="disableOutline" name="name" type="text" id="productName" maxlength="50" tabIndex="0">
            </label>
            <ul class="colorSelect">
                Color
                <li class="colorButton">
                    <div class="wrap">
                        <span class="icon"  name="colorField" data-hex-code="#000000" style="--product-color:#000000"></span>
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

        overlay.append(form)

        createDropdown();

        form.addEventListener('click', showDropdown)

        overlay.addEventListener('pointerdown', activeCloseButton)
    }

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

                elem.addEventListener('blur',disableOutLine)
                
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
            if ( !e.target.closest('.wrap')) {
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


    function showProductList() {
        const products = document.querySelector('.products')

        products.classList.toggle('arrowDown');

        createProduct();
    }
    function createProduct() {
        const productList = document.querySelector('.productList ul');
        
        productList.innerHTML = '';

        data = getLocalProduct();

        if (!data) return 

        for (let product of data) {

            const template = `
                <div class="wrap">
                    <span class="icon"></span>
                    <span class="title"></span>
                </div>
                <div class="option">•••
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
            li.querySelector('.icon').style = product.colorHexCode;

            productList.append(li);

            const optionCoord = li.querySelector('.option').getBoundingClientRect()

            const optionList = li.querySelector('.optionList');
            optionList.style.top = `${optionCoord.bottom + 10}px`;
            optionList.style.left = `${optionCoord.left - (optionList.clientWidth - optionCoord.width)  / 2 }px`;

            if (li.querySelector('.title').scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
                li.querySelector('.title').title = product.name
            }

            document.addEventListener('click', showProductOption)
        }
    }
    function showProductOption(e) {
        const target = e.target.closest('.option')

        if (!target) return
        
        target.classList.toggle('active');

        const productList = document.querySelector('.productList');
        
        if (target.classList.contains('active')) {
            this.addEventListener('pointerup', closeProductOption)
            productList.addEventListener('pointerdown', editProductName)
            productList.addEventListener('pointerdown', deleteProduct)
        }

        function closeProductOption(e) {
            if (!e.target.closest('.option')) {
                target.classList.remove('active')
            }

            this.removeEventListener('pointerup', closeProductOption)
            productList.removeEventListener('pointerdown', editProductName);
            productList.removeEventListener('pointerdown', deleteProduct);
        }

        function editProductName(e) {
            const editButton = e.target.closest('.editButton');

            if (!editButton) return

                const id = editButton.closest('.item').dataset.id
                const item = data.find(item => item.id === +id)

            if (!item || !id) return

                createEditForm(item)
                showProductForm();
        }
        function deleteProduct(e) {

            const deleteButton = e.target.closest('.deleteButton');

            if (!deleteButton) return

            const id = deleteButton.closest('.item').dataset.id
            const item = data.find(item => item.id === +id)

            if (!item || !id) return

            item.remove();
            createProduct();
        }
    }
    function createEditForm(product) {

        const template = `
            <h2>Edit Product</h2>
            <label for="productName">
                Name
                <input class="disableOutline" name="name" type="text" id="productName" maxlength="50" tabIndex="0">
            </label>
            <ul class="colorSelect">
                Color
                <li class="colorButton">
                    <div class="wrap">
                        <span class="icon"  name="colorField" data-hex-code="#000000"></span>
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

        form.querySelector('#productName').value = product.name

        form.querySelector('.icon').style = product.colorHexCode

        form.addEventListener('focusout', focusForm)
        form.addEventListener('submit', product.edit)

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        createDropdown();

        form.addEventListener('click', showDropdown)

        overlay.addEventListener('pointerdown', activeCloseButton)
    }

    // handler
    function handleDelete(id) {
        const remove = () => {
            
            const index = data.findIndex(item => item.id === id)
            data.splice(index, 1)

            localStorage.setItem('products', JSON.stringify(data))
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
            
            localStorage.setItem('products', JSON.stringify(data))

            createProduct();

            this.reset();
            closeForm();
        }

        return { edit }
    }

})();



    // return {
    //     getLocalProduct
    // }
})();


