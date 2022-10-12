'use strict'

function formTemplate(type) {

    const template = {
        taskForm: `
        <label for="taskName">
            Task name
            <textarea id="taskName" rows="1" ></textarea>
        </label>
        <label for="descript">
            Description
            <textarea id="descript" rows="1"></textarea>
        </label>
        <div class="buttons">
            <div class="datePicker">
                <input class="date" type="date">
            </div>
            <div class="timePicker active">
                <input class="time" type="time">
            </div>
            <div class="selectButton">
                <li class="item">
                    <div class="wrap">
                        <button type="button" class="type title selectMenuButton">Inbox</button>
                        <ul class="selectMenu">
                            <li>
                                <button type="button" class="title">task 1</button>
                            </li>
                        </ul>
                    </div>
                </li>
                <li class="item">
                    <div class="wrap">
                        <button type="button" class="priority title selectMenuButton">Low</button>
                        <ul class="selectMenu">
                            <li>
                                <button type="button" class="title critical">Critical</button>
                            </li>
                            <li>
                                <button type="button" class="title high">High</button>
                            </li>
                            <li>
                                <button type="button" class="title medium">Medium</button>
                            </li>
                            <li>
                                <button type="button" class="title low">Low</button>
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
        `,
        productForm: `
            <h3>Add Product</h3>
            <label for="productName">
                Name
                <input type="text" id="productName" maxlength="50">
            </label>
            <div class="colorSelect">
                Color
                <button type="button" class="colorButton title">origin</button>
                <ul class="colorList">
                    <li>
                        <button type="button" class="title">red</button>
                    </li>
                </ul>
            </div>
            <div class="submitButton">
                <button type="button" class="cancelButton">Cancel</button>
                <button type="submit" class="addButton">Add task</button>
            </div>
        `,
    }

    const element = document.createElement('form');
    element.classList.add(type, 'active')
    element.innerHTML = template[type];

    return element
}

export {
    formTemplate,
} 