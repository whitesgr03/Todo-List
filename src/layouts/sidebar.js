'use strict'

// From component folder
import { createProjectMethods, createEventMethods } from '../components';

// From library
import namedColors from 'color-name-list';


const createSidebar = () => {
    const { getLocalProjects, createLocalProject, deleteLocalProject, updateLocalProject } = createProjectMethods()
    const { validation, focusOnForm, showForm, closeForm, getHaxList } = createEventMethods();

    const HAX_LIST = getHaxList()

    const data = {
        projects: null,
        tasks: null,
    }

    data.projects = getLocalProjects();

    const page = {
        name: 'Inbox',
        targetId: null,
    }

    // cache DOM
    const nav = document.querySelector('nav');
    const projectsButton = nav.querySelector('.projects');
    const projectsList = nav.querySelector('.projectsList'); 
    

    
    const init = () => {
        nav.addEventListener('click', changePage)
        projectsButton.addEventListener('click', showProjectForm)
        projectsButton.addEventListener('click', showProjectList)
        projectsList.addEventListener('pointerdown', handleDelete);
        projectsList.addEventListener('pointerdown', editProject);

    }

    function changePage (e) {

        const navItem = e.target.closest('.wrap')

        if (!navItem) return

        page.name = navItem.querySelector('.title').textContent;

        // if (e.target.closest('.projectsList')) {
        //     page.targetId = +e.target.closest('.item').dataset.id;
        // } else {
        //     page.targetId = null;
        // }

        if (page.name === 'Projects' && projectsButton.classList.contains('arrowDown')) {
            return
        } else {
            page.name = 'Inbox'
        }

        console.log(page.name)
        // createPages(page.name)
    }
    function showProjectForm(e) {
        const addButton = e.target.closest('.addButton')
        if (!addButton) return

        createProjectForm()
    }
    function createProjectForm(project = null, elem = null) {
        let name = 'Add'

        if (project) {
            name = 'Edit'
        }

        const template = `
            <h2>${name} Project</h2>
            <label for="name">
                Name
                <input class="disableOutline" name="name" type="text" id="name" maxlength="50" tabindex="0">
            </label>
            <div class="dropdown">
                <h3>Color</h3>
                <button type="button" class="wrap colorButton">
                    <span class="icon" style="--project-color:#000000"></span>
                    <span>Black</span>
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
        form.classList.add('projectForm');
        form.innerHTML = template;

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        createDropdown();

        if (project) {
            const color = namedColors.find(color => color.hex === project.hexCode);

            form.elements.name.value = project.name;

            form.querySelector('.colorButton').lastElementChild.textContent = color.name;
            form.querySelector('.icon').style = `--project-color:${project.hexCode}`;

            form.item = elem;
            form.addEventListener('submit', handleUpdate)
        } else {
            form.addEventListener('submit', handleCreate)
        }

        form.addEventListener('focusout', focusOnForm)
        form.addEventListener('click', showDropdown)
        
        showForm();
    }
    function createDropdown() {
        const dropdownList = document.querySelector('.dropdownList ul')

        for (let hax of HAX_LIST) { 
            const color = namedColors.find(color => color.hex === hax);

            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1">
                    <span class="icon" style="--project-color:${color.hex};"></span>
                    <span>${color.name}</span>
                </button>
            `;
            
            li.className = 'item'
            li.innerHTML = button;
            
            dropdownList.append(li);
        }
    }
    function showDropdown(e) {
        const colorButton = e.target.closest('.colorButton');

        if (!colorButton) return

        colorButton.classList.toggle('showList')

        if (colorButton.classList.contains('showList')) {
            this.addEventListener('pointerup', closeDropdown)
            this.addEventListener('pointerdown', changeColor)
        }

        function closeDropdown(e) {
            if (e.target !== colorButton) {
                colorButton.classList.remove('showList')
            }

            this.removeEventListener('pointerup', closeDropdown)
            this.removeEventListener('pointerdown', changeColor);
        }

        function changeColor(e) {
            const target = e.target.closest('.wrap')
                
            if (!target || target === colorButton) return

            const selectElem = target.cloneNode(true)

            selectElem.classList.add('colorButton')
            selectElem.tabIndex = 0;

            colorButton.replaceWith(selectElem)
        }
    }
    function showProjectList(e) {
        const wrap = e.target.closest('.wrap')

        if (!wrap) return

        projectsButton.classList.toggle('arrowDown');

        if (projectsButton.classList.contains('arrowDown')) {
            createProjectList()
        }
    }
    function createProjectList () {
        if (data.projects.length === 0) {
            projectsList.innerHTML = '<p>There is no project</p>'
            projectsList.classList.add('noProject')
            return
        }

        if (projectsList.classList.contains('noProject')) {
            projectsList.classList.remove('noProject')
        }   

        const ul = document.createElement('ul');
        
        projectsList.append(ul);

        for (let project of data.projects) {
            createProjectItem(project)
        }
    }
    function createProjectItem(project) {
        const template = `
            <div class="wrap">
                <div class="icon"></div>
                <div class="title"></div>
            </div>
            <div class="option">
                <button type="button" class="optionButton">•••</button>
                <ul class="optionList">
                    <li>
                        <button class="editButton" type="button">Edit project name</button>
                    </li>
                    <li>
                        <button class="deleteButton"  type="button">Delete project</button>
                    </li>
                </ul>
            </div>
        `;

        const li = document.createElement('li');

        li.className = 'item'
        li.dataset.id = project.id;
        li.innerHTML = template;
        li.querySelector('.title').textContent = project.name;
        li.querySelector('.icon').style = `--project-color:${project.hexCode}`;

        document.body.append(li)

        const ul = document.querySelector('.projectsList ul');
        ul.append(li)

        if (li.querySelector('.title').scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
            li.querySelector('.title').style.overflow = 'hidden';
            li.querySelector('.title').title = project.name;
        }
    }

        projectsList.append(ul);


        // ul.addEventListener('pointerdown', editProject);
        ul.addEventListener('pointerdown', handleDeleteProject);

        function handleDeleteProject(e) { 

            const deleteButton = e.target.closest('.deleteButton');

            if (!deleteButton) return

            const id = deleteButton.closest('.item').dataset.id

            if (!id) return

            const result = deleteProject(id)
        
            if (!result) return

            let ul = projectsList.firstElementChild

            const projectsListScrollBarPosition = ul.scrollTop;

            createProjectList();

            if (ul = nav.querySelector('.projectsList ul')) {
                ul.scrollTo({ top: projectsListScrollBarPosition });
            }


        

        }

    }
    function createDropdown() {
        const dropdownList = document.querySelector('.dropdownList ul')

        for (let hax of HAX_LIST) { 
            const color = namedColors.find(color => color.hex === hax);

            const li = document.createElement('li');
            const button = `
                <button type="button" class="wrap" tabIndex="-1">
                    <span class="icon" style="--project-color:${color.hex};"></span>
                    ${color.name}
                </button>
            `;
            
            li.className = 'item'
            li.innerHTML = button;
            
            dropdownList.append(li);
        }
    }
    function showDropdown(e) {
        const colorButton = e.target.closest('.colorButton');

        if (!colorButton) return

        colorButton.classList.toggle('showList')

        if (colorButton.classList.contains('showList')) {
            this.addEventListener('pointerup', closeDropdown)
            this.addEventListener('pointerdown', changeColor)
        }

        function closeDropdown(e) {
            if (e.target !== colorButton) {
                colorButton.classList.remove('showList')
            }

            this.removeEventListener('pointerup', closeDropdown)
            this.removeEventListener('pointerdown', changeColor);
        }

        function changeColor(e) {
            const target = e.target.closest('.wrap')
                
            if (!target || target === colorButton) return

            const selectElem = target.cloneNode(true)

            selectElem.classList.add('colorButton')
            selectElem.tabIndex = 0;

            colorButton.replaceWith(selectElem)
        }
    }

    return {
        init,
    }
};

export {
    createSidebar,
}