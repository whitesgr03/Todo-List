'use strict'

import * as inbox from './inbox'

// library
import namedColors from 'color-name-list';

// private method
function getLocalProduct() {
    const item = localStorage.getItem('products');

    if (!item) return

    return JSON.parse(item)
}
function createForm(overlay) {
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
                    <span class="icon"  name="selectField" data-hex-code="#000000" style="--product-color:#000000"></span>
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
    form.addEventListener('submit', validation)

    overlay.append(form)

    createDropdown();

    form.addEventListener('click', showDropdown)

    overlay.addEventListener('pointerdown', activeCloseButton)
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
    
    this.addEventListener('pointerup', closeDropdown)
    this.addEventListener('pointerdown', changeColor)

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
function focusForm(e) {
    const target = e.relatedTarget;
    const firstField = this.querySelector('[tabIndex]')

    if (target && !target.closest('.productForm')) firstField.focus()
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

    const color = document.querySelector('[name="selectField"]').getAttribute('style');

    formProps.colorHexCode = color;

    addProduct('products', formProps)
    this.reset();
    closeForm();
}
function activeCloseButton(e) {
    
    const cancelButton = e.target.closest('.cancel');

    if (e.target !== cancelButton && e.target !== this) return

    closeForm(this);

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
function addProduct(name, data) {

    const item = localStorage.getItem(name);

    if (item) {
        const temp = JSON.parse(item);
        temp.push(data)
        localStorage.setItem(name, JSON.stringify(temp))
    } else {
        localStorage.setItem(name, JSON.stringify([data]))
    }

    createProduct();

    const products = document.querySelector('.products');
    products.classList.add('arrowDown');
}


// public method

function createPages(page) {
    

    const content = document.querySelector('.content')
    const overlay = document.querySelector('.overlay')

    content.innerHTML = '';
    overlay.innerHTML = '';

    switch (page) {
        case 'inbox':
            content.append(inbox.createNavbar());
            content.append(inbox.createTask());
            content.addEventListener('click', inbox.showForm)
            break;
    }

    // 依照 page 執行函式

}
function createProduct() {

    const productList = document.querySelector('.productList ul');
    
    productList.innerHTML = '';

    const data = getLocalProduct()

    
    if (!data) return 

    for (let product of data) {

        const template = `
            <div class="wrap">
            <span class="icon"></span>
            <span class="title"></span>
            </div>
            <span class="option">...</span>
            
        `;

        const li = document.createElement('li');

        li.className = 'item'
        li.innerHTML = template;
        li.querySelector('.title').textContent = product.name;
        li.querySelector('.icon').style = product.colorHexCode;

        productList.append(li);
    }
}
function showForm(e) {

    const target = e.target.closest('.addButton')
    if (!target) return

    const overlay = document.querySelector('.overlay');

    createForm(overlay)

    overlay.classList.add('show');
    document.body.style.overflow = "hidden";

    const currentForm = overlay.querySelector('.productForm')
    currentForm.classList.add('active');

    const firstField = currentForm.querySelector('[tabIndex]')
    
    firstField.focus();
}

export {
    createPages,
    createProduct,
    showForm,
}