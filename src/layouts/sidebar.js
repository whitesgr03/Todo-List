'use strict'

// library
import namedColors from 'color-name-list';

const sidebar = (() => {

    // create Project DOM
    const createProjectList = (projects) => {
        
        const projectsList = document.querySelector('.projectsList');

        projectsList.innerHTML = '';
        
        if (projects.length === 0) {
            projectsList.innerHTML = '<p>There is no project</p>'
            projectsList.classList.add('noProject')
            return
        }

        if (projectsList.classList.contains('noProject')) {
            projectsList.classList.remove('noProject')
        }   

        const ul = document.createElement('ul');
        
        projectsList.append(ul);

        for (let project of projects) {
            createProjectItem(project);
        }
    }
    const createProjectItem = (project) => {
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

        const ul = document.querySelector('.projectsList ul');
        ul.append(li)

        if (li.querySelector('.title').scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
            li.querySelector('.title').style.overflow = 'hidden';
            li.querySelector('.title').title = project.name;
        }
    }
    const createProjectForm = (project) => {
        const template = `
            <h2></h2>
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

        if (project) {
            const color = namedColors.find(color => color.hex === project.hexCode);

            form.elements.name.value = project.name;
            form.firstElementChild.textContent = 'Edit Project';

            form.querySelector('.colorButton').lastElementChild.textContent = color.name;
            form.querySelector('.icon').style = `--project-color:${project.hexCode}`;

        } else {
            form.firstElementChild.textContent = 'Add Project';
        }

        const overlay = document.querySelector('.overlay');

        overlay.append(form)

        return form
    }
    const createProjectDropdown = (HAX_LIST) => {
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

    return {
        createProjectList,
        createProjectItem,
        createProjectForm,
        createProjectDropdown,
    }
})();

export {
    sidebar,
}