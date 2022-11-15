const createProjectMethod = ()=> {

// Get localStorage Projects Data
    const getAllProjects = () => {
        const item = localStorage.getItem('projects');

        if (!item) return []

        const projects = JSON.parse(item)

        for (let item of projects) {
            Object.assign(item,
                handleProjectDelete(item.id),
                handleProjectUpdate(item)
            )
        }

        return projects
    }
    // Project Form Handler
    const createProject = (e) => {
        e.preventDefault();
        
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


    return {
        getAllProjects,
        createProject,
    }
}

export {
    createProjectMethod,
}