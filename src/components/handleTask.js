'use strict'


// Get all Tasks Data
    function getLocalTasks() {
        const item = localStorage.getItem('tasks');

        if (!item) return []

        const tasks = JSON.parse(item)

        for (let item of tasks) {
            
            Object.assign(item,
                handleTaskDelete(),
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

        form.elements.day.value = format(new Date(), 'yyyy-MM-dd')

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
        const dropdownList = document.querySelector('.projectDropdown .dropdownList ul')

        if (data.projects.length === 0) return

        for (let project of data.projects) {
            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1" data-project-id="${project.id}">
                    <span class="icon" style="--project-color:${project.hexCode}"></span>
                    ${project.name}
                </button>
            `;
            
            li.className = 'item'
            li.innerHTML = button;
            
            dropdownList.append(li);

            if (page.targetId === project.id ) {
                const projectNameButton = document.querySelector('.projectName')

                const div = document.createElement('div');
                div.innerHTML = button;
                
                div.firstElementChild.classList.add(...projectNameButton.classList)

                projectNameButton.replaceWith(div.firstElementChild)

            }

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

        const project = this.querySelector('.projectName');
        let projectItem = null
        
        if (project.dataset.projectId) {
            projectItem = data.projects.find(item => item.id === +project.dataset.projectId)
        }

        if (project.textContent.trim() !== 'Inbox' && projectItem === -1) return

        if (projectItem) {
            formProps.projectId = projectItem.id
        } else {
            formProps.projectId = '';
        }

        if (data.tasks.length > 0) {
            formProps.id = data.tasks.at(-1).id + 1;
        } else {
            formProps.id = 1;
        }

        formProps.completed = false;

        data.tasks.push(formProps)

        localStorage.setItem('tasks', JSON.stringify(data.tasks))

        createTasksList(page.name);

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
    function showCompletedTasks(e) {
        const showTaskButton = e.target.closest('.showTaskButton');
        
        if (!showTaskButton) return;

        if (!showTaskButton.classList.contains('showAll')) {
            createTasksList(page.name, true)
            showTaskButton.classList.add('showAll');
            showTaskButton.textContent = 'Hide completed tasks'
        } else {
            createTasksList(page.name)
            showTaskButton.classList.remove('showAll');
            showTaskButton.textContent = 'Show completed tasks'
        }

    }
    function setTasksComplete(e) {
        const setCompleteButton = e.target.closest('.setCompleteButton');
        
        if (!setCompleteButton) return;

        const allCheckbox = Array.from(document.querySelectorAll('.tasksList [type="checkbox"]'))

        for (let checkbox of allCheckbox) {
            
            if (checkbox.checked) {
                const id = +checkbox.closest('.item').dataset.id;

                const item = data.tasks.find(item => item.id === id)

                item.completed = true;
            }
        }

        localStorage.setItem('tasks', JSON.stringify(data.tasks))

        createTasksList(page.name);
    }



    // Tasks List
    function createTasksTopBar(pageName) {
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
                        <button class="setCompleteButton" type="button">Set task to completed</button>
                    </li>
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
        title.textContent = pageName;

        content.prepend(div);

        if (title.scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
            title.style.overflow = 'hidden';
            title.title = name;
        }
        title.style.flex = 1;

        div.addEventListener('pointerdown', setTasksComplete)
        div.addEventListener('pointerdown', showCompletedTasks)
        div.addEventListener('click', showAddTaskForm)
    }
    function createTasksList(pageName, showAll = null) {
        

        data.tasks = getLocalTasks();

        let tasks = data.tasks;

        if (!showAll) {
            tasks = data.tasks.filter(item => !item.completed);
        }

        switch (pageName) {
            case 'Inbox':
                break;
            case 'Today':
                tasks = tasks.filter(item => isToday(new Date(item.day)))
                break;
            default: 
                const project = data.projects.find(item => item.id === page.targetId)
                tasks = tasks.filter(item => item.projectId === project.id)            
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

        showTasksCount()

        if (tasks.length === 0) {
            ul.insertAdjacentHTML('beforeend', '<h3 class="noTask">There is no Task</h3>');
            return
        }

        for (let task of tasks) {
            const date = getDate(task.day, task.time)

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

            if (showAll && task.completed) {
                li.querySelector('.complete[type="checkbox"]').checked = true;
            }

            ul.append(li);
        }

        ul.addEventListener('click', changeCompleteState);
        ul.addEventListener('pointerdown', editTaskItem);
        ul.addEventListener('pointerdown', deleteTaskItem);

        function editTaskItem(e) {
            e.preventDefault(); 
            const editButton = e.target.closest('.editButton');
            if (!editButton) return

            const id = editButton.closest('.item').dataset.id
            const index = data.tasks.findIndex(item => item.id === +id)

            if (index === -1 || !id) return 

            createEditTaskForm(data.tasks[index]);
            showForm();
        }

        function deleteTaskItem(e) {
            const deleteButton = e.target.closest('.deleteButton');

            if (!deleteButton) return

            const id = deleteButton.closest('.item').dataset.id
            const index = data.tasks.findIndex(item => item.id === +id)

            if (index === -1 || !id) return

            data.tasks[index].remove(index, 'tasks');
        }

        function changeCompleteState(e) {
            const checkbox = e.target.closest('.complete[type="checkbox"]');

            if (!checkbox || checkbox.checked) return

            const id = +checkbox.closest('.item').dataset.id;

            const item = data.tasks.find(item => item.id === id)

            item.completed = false;

            localStorage.setItem('tasks', JSON.stringify(data.tasks))
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

        form.elements.taskName.value = task.name;
        form.elements.descript.value = task.descript;

        autoResize.call(form.elements.taskName);
        autoResize.call(form.elements.descript);

        overlay.addEventListener('pointerdown', activeCloseButton)
    }

    // Task item handle
    function handleTaskDelete() {
        const remove = (index, type) => {

            data[type].splice(index, 1)

            localStorage.setItem(type, JSON.stringify(data[type]))

            let content = document.querySelector('.content');
            let currentScrollBarPosition = content.scrollTop;

            createTasksList(page.name);
            
            content.scrollTo({ top: currentScrollBarPosition });
        }

        return { remove }
    }
    function handleTaskUpdate(task) {
        const edit = function (e) {
            e.preventDefault()

            const formData = new FormData(this);
            const formProps = Object.fromEntries(formData);

            if (!validation(formProps, this)) return

            const project = this.querySelector('.projectName');
            let projectItem = null
            
            if (project.dataset.projectId) {
                projectItem = data.projects.find(item => item.id === +project.dataset.projectId)
            }

            if (project.textContent.trim() !== 'Inbox' && projectItem === -1) return

            if (projectItem) {
                task.projectId = projectItem.id
            } else {
                task.projectId = '';
            }

            task.priority = this.querySelector('.priority').dataset.color;
            task.day = formProps.day
            task.descript = formProps.descript
            task.name = formProps.name
            task.title = formProps.title
            task.time = formProps.time

            localStorage.setItem('tasks', JSON.stringify(data.tasks))

            let content = document.querySelector('.content');
            const currentScrollBarPosition = content.scrollTop;

            createTasksList(page.name);

            content.scrollTo({ top: currentScrollBarPosition });

            closeForm();
        }

        return { edit }
    }


export {
        getLocalTasks,
}
    
     // 給予 task
    // function createPages (page) {
    //     const content = document.querySelector('.content')

    //     content.innerHTML = '';

    //     console.log(page)
    //     // createTasksTopBar(page)

    //     // createTasksList(page)
    // }