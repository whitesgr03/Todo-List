"use strict";

const handleProject = (() => {
    // Project Form Handler
    const createLocalProject = (data) => {
        let result = {
            status: null,
            id: null,
        };

        const projects = getLocalProjects();

        if (projects.length > 0) {
            data.id = projects.at(-1).id + 1;
        } else {
            data.id = 1;
        }

        projects.push(data);

        localStorage.setItem("projects", JSON.stringify(projects));

        result.status = true;
        result.id = data.id;

        return result;
    };
    const getLocalProjects = () => {
        const item = localStorage.getItem("projects");

        if (!item) return [];

        const projects = JSON.parse(item);

        return projects;
    };
    const updateLocalProject = (data, id) => {
        let result = {
            status: false,
        };

        const projects = getLocalProjects();

        const project = projects.find((item) => item.id === id);

        if (!project) {
            alert("error: project can't find");
            return result;
        }

        for (let key in project) {
            if (data[key]) {
                project[key] = data[key];
            }
        }

        localStorage.setItem("projects", JSON.stringify(projects));
        result.status = true;

        return result;
    };
    const deleteLocalProject = (id) => {
        let result = {
            status: false,
        };

        const projects = getLocalProjects();

        const index = projects.findIndex((item) => item.id === +id);

        if (index === -1) {
            alert("error: project can't find");
            return result;
        }

        projects.splice(index, 1);

        localStorage.setItem("projects", JSON.stringify(projects));
        result.status = true;

        return result;
    };

    return {
        createLocalProject,
        getLocalProjects,
        updateLocalProject,
        deleteLocalProject,
    };
})();

export { handleProject };
