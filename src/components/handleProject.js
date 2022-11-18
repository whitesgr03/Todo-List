'use strict'

const createProjectMethods = () => {

    // Project Form Handler
    const createLocalProject = (data) => {

        let result = {
            status: false
        }

        const projects = getLocalProjects()

        if ( projects.length > 0) {
            data.id = projects.at(-1).id + 1;
        } else {
            data.id = 1;
        }

        projects.push(data)

        localStorage.setItem('projects', JSON.stringify(projects))
        
        result.status = true;
        result.id = data.id

        return result;
    }
    const getLocalProjects = () => {
        const item = localStorage.getItem('projects');

        if (!item) return []

        const projects = JSON.parse(item)

        return projects
    }
    const updateLocalProject = (data, id) => {
        let result = {
            status: false
        }

        const projects = getLocalProjects()


        const project = projects.find(item => item.id === id)

        if (!project) {
            alert("error: project can't find")
            return result
        }
        
        project.name = data.name
        project.hexCode = data.hexCode

        localStorage.setItem('projects', JSON.stringify(projects))
        result.status = true;

        return result;
    }
    const deleteLocalProject = (id) => {
        let result = {
            status: false
        }

        const projects = getLocalProjects();

        const index = projects.findIndex(item => item.id === +id);

        if (index === -1) {
            alert("error: project can't find")
            return result
        }
        
        projects.splice(index, 1);

        localStorage.setItem('projects', JSON.stringify(projects));
        result.status = true;

        return result;
    } 

    return {
        createLocalProject,
        getLocalProjects,
        updateLocalProject,
        deleteLocalProject,
    }
}


// 只需要處理後端的動作 回傳錯誤或成功, 不需要處理 DOM 的任何變化





// Get localStorage Projects Data
// function getLocalProjects() {
//     const item = localStorage.getItem('projects');

//     if (!item) return []

//     const projects = JSON.parse(item)

//     return projects
// }
// function compos(projects) {
    
//     for (let item of projects) {
//         Object.assign(item,
//             handleProjectDelete(item.id),
//             handleProjectUpdate(item)
//         )
//     }

//     return projects
// }
// Project Form
// function showAddProjectForm(e) {

//     const target = e.target.closest('.addButton')
//     if (!target) return
    
//     createAddProjectForm()

//     showForm();
// }
// function createAddProjectForm() {
//     const template = `
//         <h2>Add Project</h2>
//         <label for="name">
//             Name
//             <input class="disableOutline" name="name" type="text" id="name" maxlength="50" tabindex="0">
//         </label>
//         <div class="dropdown">
//             <h3>Color</h3>
//             <button type="button" class="wrap colorButton">
//                 <span class="icon" style="--project-color:#000000"></span>
//                 Black
//             </button>
//             <div class="dropdownList">
//                 <ul>
//                 </ul>   
//             </div>
//         </div>
//         <div class="submitButton">
//             <button type="button" class="cancel">Cancel</button>
//             <button type="submit" name="submit" class="submit" disable>Add task</button>
//         </div>  
//         `;
    
//     const form = document.createElement('form');
//     form.classList.add('projectForm');
//     form.innerHTML = template;

//     form.addEventListener('focusout', focusForm)
//     form.addEventListener('submit', createProject)

//     const overlay = document.querySelector('.overlay');

//     overlay.append(form)

//     createProjectDropdown();

//     form.addEventListener('click', showProjectDropdown)

//     overlay.addEventListener('pointerdown', activeCloseButton)
// }
// function createProjectDropdown() {
//     const dropdownList = document.querySelector('.dropdownList ul')

//     for (let hax of COLOR_LIST) {
//         const color = namedColors.find(color => color.hex === hax);

//         const li = document.createElement('li');
//         const button = `
//             <button type="button" class="wrap" tabIndex="-1">
//                 <span class="icon" style="--project-color:${color.hex};"></span>
//                 ${color.name}
//             </button>
//         `;
        
//         li.className = 'item'
//         li.innerHTML = button;
        
//         dropdownList.append(li);
//     }
// }
// function showProjectDropdown(e) {
//     const button = e.target.closest('.colorButton');

//     if (!button) return

//     button.classList.toggle('showList')

//     if (button.classList.contains('showList')) {
//         this.addEventListener('pointerup', closeDropdown)
//         this.addEventListener('pointerdown', changeColor)
//     }

//     function closeDropdown(e) {
//         if (e.target !== button) {
//             button.classList.remove('showList')
//         }

//         this.removeEventListener('pointerup', closeDropdown)
//         this.removeEventListener('pointerdown', changeColor);
//     }

//     function changeColor(e) {
//         const target = e.target.closest('.wrap')
            
//         if (!target || target === button) return

//         const selectElem = target.cloneNode(true)

//         selectElem.classList.add('colorButton')
//         selectElem.tabIndex = 0;

//         button.replaceWith(selectElem)
//     }
// }
// Project Form Handler
// function createProject(e) {
//     e.preventDefault();
    
//     const formData = new FormData(this);
//     const formProps = Object.fromEntries(formData);

//     if (!validation(formProps, this)) return

//     const hexCode = getComputedStyle(this.querySelector('.icon')).getPropertyValue('--project-color')

//     if (COLOR_LIST.findIndex(item => item === hexCode) === -1) return

//     formProps.hexCode = hexCode;

//     if ( projects.length > 0) {
//         formProps.id = data.projects.at(-1).id + 1;
//     } else {
//         formProps.id = 1;
//     }

//     projects.push(formProps)

//     localStorage.setItem('projects', JSON.stringify(projects))

//     createProjectList();

//     const projectButton = document.querySelector('.projects');
//     projectButton.classList.add('arrowDown');

//     const projectsList = document.querySelector('.projectsList ul');
//     projectsList.scrollTo({top: projectsList.scrollHeight, behavior: 'smooth'});

//     closeForm();
// }
// Projects List
// function showProjectList() {
//     // const projects = document.querySelector('.projects')

//     // projects.classList.toggle('arrowDown');
//     // console.log('133')
//     createProjectList();
// }
// function createProjectList() {
    
//     const projectsList = document.querySelector('.projectsList');

//     projectsList.innerHTML = '';

//     projects = compos(getLocalProjects());

//     if (projects.length === 0) {
//         projectsList.innerHTML = '<p>There is no project</p>'
//         projectsList.classList.add('noProject')
//         return
//     }

//     if (projectsList.classList.contains('noProject')) {
//         projectsList.classList.remove('noProject')
//     }   

//     const ul = document.createElement('ul');
    
//     projectsList.append(ul);

//     for (let project of projects) {
//         const template = `
//             <div class="wrap">
//                 <span class="icon"></span>
//                 <span class="title"></span>
//             </div>
//             <div class="option">
//                 <button type="button" class="optionButton">•••</button>
//                 <ul class="optionList">
//                     <li>
//                         <button class="editButton" type="button">Edit project name</button>
//                     </li>
//                     <li>
//                         <button class="deleteButton"  type="button">Delete project</button>
//                     </li>
//                 </ul>
//             </div>
//         `;

//         const li = document.createElement('li');

//         li.className = 'item'
//         li.dataset.id = project.id;
//         li.innerHTML = template;
//         li.querySelector('.title').textContent = project.name;
//         li.querySelector('.icon').style = `--project-color:${project.hexCode}`;

//         ul.append(li);

//         if (li.querySelector('.title').scrollWidth > 150) {   // 不支援觸控以及鍵盤和螢幕閱讀器使用者
//             li.querySelector('.title').style.overflow = 'hidden';
//             li.querySelector('.title').title = project.name;
//         }
//     }

//     projectsList.append(ul);
    
//     ul.addEventListener('pointerdown', editProjectItem);
//     ul.addEventListener('pointerdown', deleteProjectItem);

//     function editProjectItem(e) {
//         e.preventDefault(); 
        
//         const editButton = e.target.closest('.editButton');
//         if (!editButton) return

//         const id = editButton.closest('.item').dataset.id
//         const index = data.projects.findIndex(item => item.id === +id)

//         if (index === -1 || !id) return

//         createEditProjectForm(data.projects[index]);
//         showForm();
        
//     }
//    
// function createEditProjectForm(project) {
//     const template = `
//         <h2>Edit Project</h2>
//         <label for="name">
//             Name
//             <input class="disableOutline" name="name" type="text" id="name" maxlength="50" tabindex="0">
//         </label>
//         <div class="dropdown">
//             <h3>Color</h3>
//             <button type="button" class="wrap colorButton">
//                 <span class="icon"></span>
//             </button>
//             <div class="dropdownList">
//                 <ul>
//                 </ul>   
//             </div>
//         </div>
//         <div class="submitButton">
//             <button type="button" class="cancel">Cancel</button>
//             <button type="submit" name="submit" class="submit" disable>Add task</button>
//         </div>  
//         `;

//     const color = namedColors.find(color => color.hex === project.hexCode);
//     const form = document.createElement('form');
//     form.classList.add('projectForm');
//     form.innerHTML = template;

//     form.elements.name.value = project.name;

//     form.querySelector('.colorButton').append(color.name);
//     form.querySelector('.icon').style = `--project-color:${project.hexCode}`;

//     form.addEventListener('focusout', focusForm)
//     form.addEventListener('submit', project.edit)

//     const overlay = document.querySelector('.overlay');

//     overlay.append(form)

//     createProjectDropdown();

//     form.addEventListener('click', showProjectDropdown)

//     overlay.addEventListener('pointerdown', activeCloseButton)
// }
// // Project item handle
// function handleProjectUpdate(project) {
//     const edit = function (e) {
//         e.preventDefault()

//         const formData = new FormData(this);
//         const formProps = Object.fromEntries(formData);

//         if (!validation(formProps, this)) return

//         const hexCode = getComputedStyle(this.querySelector('.icon')).getPropertyValue('--project-color')

//         if (COLOR_LIST.findIndex(item => item === hexCode) === -1) return

//         project.hexCode = hexCode;
//         project.name = formProps.name

//         localStorage.setItem('projects', JSON.stringify(data.projects))

//         let projectsList = document.querySelector('.projectsList ul');
//         const projectsListScrollBarPosition = projectsList.scrollTop;

//         createProjectList();

//         projectsList = document.querySelector('.projectsList ul');
//         projectsList.scrollTo({ top: projectsListScrollBarPosition });

//         if (page.targetId === project.id) {
//             let content = document.querySelector('.content');

//             const contentScrollBarPosition = content.scrollTop;

//             createPages(formProps.name)

//             content.scrollTo({ top: contentScrollBarPosition });
//         }

//         closeForm();
//     }

//     return { edit }
// }
// function handleProjectDelete(id) {
//     const remove = function (index) {

//         data.projects.splice(index, 1)

//         localStorage.setItem('projects', JSON.stringify(data.projects))

//         data.tasks = data.tasks.filter(item => item.projectId !== id)

//         localStorage.setItem('tasks', JSON.stringify(data.tasks))

//         let projectsList = document.querySelector('.projectsList ul');
//         const projectsListScrollBarPosition = projectsList.scrollTop;

//         createProjectList();

//         if (projectsList = document.querySelector('.projectsList ul')) {
//             projectsList.scrollTo({ top: projectsListScrollBarPosition });
//         }

//         const content = document.querySelector('.content');
//         let currentScrollBarPosition = 0;
    
//         if (page.targetId === id) {
//             page.name = 'Inbox'
//         } else {
//             currentScrollBarPosition = content.scrollTop;
//         }
            
//         createPages(page.name)
        
//         content.scrollTo({ top: currentScrollBarPosition});
//     }

//     return { remove }
// }


export {
    createProjectMethods,
}