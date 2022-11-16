'use strict'

// From common file
// import { createEventMethods } from './common';

// From library
// import namedColors from 'color-name-list';

const createProjectMethods = () => {

// Get localStorage Projects Data
    const getAllProjects = () => {
        const item = localStorage.getItem('projects');

        if (!item) return []

        const projects = JSON.parse(item)


        return projects
    }

    // Project Form Handler
    const createProject = (data) => {
        const projects = getAllProjects()

        if ( projects.length > 0) {
            data.id = projects.at(-1).id + 1;
        } else {
            data.id = 1;
        }

        projects.push(data)

        localStorage.setItem('projects', JSON.stringify(projects))

        return true;
    } 

        
        const formData = new FormData(this);
        const formProps = Object.fromEntries(formData);

        if (!validation(formProps, this)) return

        const hexCode = getComputedStyle(this.querySelector('.icon')).getPropertyValue('--project-color')

        if (COLOR_LIST.findIndex(item => item === hexCode) === -1) return

        formProps.hexCode = hexCode;

        if ( projects.length > 0) {
            formProps.id = data.projects.at(-1).id + 1;
        } else {
            formProps.id = 1;
        }

        projects.push(formProps)

        localStorage.setItem('projects', JSON.stringify(projects))

        createProjectList();

        const projectButton = document.querySelector('.projects');
        projectButton.classList.add('arrowDown');

        const projectsList = document.querySelector('.projectsList ul');
        projectsList.scrollTo({top: projectsList.scrollHeight, behavior: 'smooth'});

        closeForm();
    } 

    const deleteProject = (id) => {

        const projects = getAllProjects();

        const index = projects.findIndex(item => item.id === +id);

        if (index === -1) {
            alert("error: project can't find")
            return false
        }
        
        projects.splice(index, 1);

        localStorage.setItem('projects', JSON.stringify(projects));

        return true;
    } 

    return {
        getAllProjects,
        createProject,
        deleteProject,
    }
}

export {
    createProjectMethod,
}