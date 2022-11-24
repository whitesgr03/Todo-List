"use strict";

// From layouts folder
import { sidebar, main } from "./layouts";

import {
    handleProject,
    handleTask,
    handleValidation,
    handleFormDOM,
} from "./components";

// library
import { isToday } from "date-fns";

function createTodoList() {
    const HAX_LIST = [
        "#e97451",
        "#f4a461",
        "#e7c068",
        "#2b9890",
        "#a2cffe",
        "#000000",
    ];

    const pageItem = {
        name: "Inbox",
        id: null,
    };

    const data = {
        projects: null,
        tasks: null,
    };

    data.projects = handleProject.getLocalProjects();
    data.tasks = handleTask.getLocalTasks();

    // cache DOM
    const nav = document.querySelector("nav");
    const projectsButton = nav.querySelector(".projects");
    const projectsList = nav.querySelector(".projectsList");
    const titleBar = document.querySelector(".titleBar");
    const tasksList = document.querySelector(".tasksList");
    const showTaskButton = titleBar.querySelector(".showTaskButton");

    const init = () => {
        changeTitle(pageItem.name);
        main.createTasksList(filterTasks(pageItem.name));

        nav.addEventListener("click", changePage);

        document.addEventListener("click", showOption);

        projectsButton.addEventListener("click", showProjectList);
        projectsButton.addEventListener("click", showAddProjectForm);

        projectsList.addEventListener("pointerdown", deleteProject);
        projectsList.addEventListener("pointerdown", showEditProjectForm);

        titleBar.addEventListener("click", showAddTaskForm);
        titleBar.addEventListener("click", showCompletedTasks);

        tasksList.addEventListener("pointerdown", deleteTask);
        tasksList.addEventListener("pointerdown", showEditTaskForm);
        tasksList.addEventListener("pointerdown", changeCompleteState);
    };

    function changeTitle(name) {
        const title = titleBar.querySelector(".title");

        title.textContent = name;

        if (title.scrollWidth > 150) {
            // 不支援觸控以及鍵盤和螢幕閱讀器使用者
            title.style.overflow = "hidden";
            title.title = pageItem.name;
        }
    }
    function changePage(e) {
        const target = e.target.closest(".wrap");

        if (!target) return;

        if (e.target.closest(".projects")) {
            if (projectsButton.classList.contains("arrowDown")) return;

            pageItem.name = "Inbox";
        } else {
            pageItem.name = target.querySelector(".title").textContent;
        }

        if (e.target.closest(".projectsList")) {
            pageItem.id = +target.parentElement.dataset.id;
        } else {
            pageItem.id = null;
        }

        showTaskButton.className = "showTaskButton";
        showTaskButton.textContent = "Show completed tasks";

        changeTitle(pageItem.name);

        main.createTasksList(filterTasks(pageItem.name));
    }
    function filterTasks(page, showAll) {
        let tasks = null;

        if (showAll) {
            tasks = data.tasks;
        } else {
            tasks = data.tasks.filter((item) => !item.completed);
        }

        let project = null;

        switch (page) {
            case "Inbox":
                break;
            case "Today":
                tasks = tasks.filter((item) => isToday(new Date(item.day)));
                break;
            default:
                project = data.projects.find((item) => item.id === pageItem.id);
                tasks = tasks.filter((item) => item.projectId === project.id);
        }

        return tasks;
    }
    function showOption(e) {
        const target = e.target.closest(".option");

        if (!target) return;

        target.classList.toggle("active");

        if (!target.classList.contains("active")) return;

        const optionCoord = target.getBoundingClientRect();

        const optionList = target.querySelector(".optionList");
        optionList.style.top = `${optionCoord.bottom + 10}px`;
        optionList.style.left = `${
            optionCoord.left - (optionList.clientWidth - optionCoord.width) / 2
        }px`;

        this.addEventListener("pointerdown", closeOptionListWithClick);
        this.addEventListener("scroll", closeOptionListWithScroll, {
            capture: true,
            once: true,
        });

        function closeOptionListWithClick(e) {
            const secondTarget = e.target.closest(".option");

            if (!secondTarget || secondTarget !== target) {
                target.classList.remove("active");
            }
            this.removeEventListener("pointerdown", closeOptionListWithClick);
        }

        function closeOptionListWithScroll() {
            target.classList.remove("active");
        }
    }
    function showCompletedTasks(e) {
        const showTaskButton = e.target.closest(".showTaskButton");

        if (!showTaskButton) return;

        if (!showTaskButton.classList.contains("showAll")) {
            main.createTasksList(filterTasks(pageItem.name, true));
            showTaskButton.classList.add("showAll");
            showTaskButton.textContent = "Hide completed tasks";
        } else {
            main.createTasksList(filterTasks(pageItem.name));
            showTaskButton.classList.remove("showAll");
            showTaskButton.textContent = "Show completed tasks";
        }
    }
    function changeCompleteState(e) {
        const checkbox = e.target.closest('.complete[type="checkbox"]');

        if (!checkbox) return;

        const id = +checkbox.closest(".item").dataset.id;

        const elem = data.tasks.find((item) => item.id === id);

        elem.completed = !checkbox.checked;

        handleTask.updateLocalTask(elem, id);

        if (showTaskButton.classList.contains("showAll")) {
            main.createTasksList(filterTasks(pageItem.name, true));
        } else {
            main.createTasksList(filterTasks(pageItem.name));
        }
    }

    // Product

    function showProjectList(e) {
        // 打開的動畫可以改成 transition 而不是 height (有空再改)
        const wrap = e.target.closest(".wrap");
        if (!wrap) return;

        this.classList.toggle("arrowDown");

        if (this.classList.contains("arrowDown")) {
            sidebar.createProjectList(data.projects);
        }
    }
    function showAddProjectForm(e) {
        const addButton = e.target.closest(".addButton");
        if (!addButton) return;

        const form = sidebar.createProjectForm();

        sidebar.createProjectDropdown(HAX_LIST);

        form.addEventListener("click", showProjectFormDropdown);

        form.addEventListener("submit", addProject);

        form.addEventListener("focusout", handleFormDOM.focusOnForm);

        handleFormDOM.showForm();
    }
    function showProjectFormDropdown(e) {
        const colorButton = e.target.closest(".colorButton");

        if (!colorButton) return;

        colorButton.classList.toggle("showList");

        if (colorButton.classList.contains("showList")) {
            this.addEventListener("pointerup", closeDropdown);
            this.addEventListener("pointerdown", changeColor);
        }

        function closeDropdown(e) {
            if (e.target !== colorButton) {
                colorButton.classList.remove("showList");
            }

            this.removeEventListener("pointerup", closeDropdown);
            this.removeEventListener("pointerdown", changeColor);
        }

        function changeColor(e) {
            const target = e.target.closest(".wrap");

            if (!target || target === colorButton) return;

            const selectElem = target.cloneNode(true);

            selectElem.classList.add("colorButton");
            selectElem.tabIndex = 0;

            colorButton.replaceWith(selectElem);
        }
    }
    function showEditProjectForm(e) {
        const editButton = e.target.closest(".editButton");

        if (!editButton) return;

        const item = editButton.closest(".item");

        const id = +item.dataset.id;

        if (!id) return;

        const index = data.projects.findIndex((project) => project.id === id);

        const form = sidebar.createProjectForm(data.projects[index]);

        sidebar.createProjectDropdown(HAX_LIST);

        form.addEventListener("click", showProjectFormDropdown);

        form.addEventListener("submit", updateProject(item, index));

        form.addEventListener("focusout", handleFormDOM.focusOnForm);

        handleFormDOM.showForm();
    }

    function addProject(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const formProps = Object.fromEntries(formData);

        if (!handleValidation.validFormData(formProps, this)) return;

        const hexCode = getComputedStyle(
            this.querySelector(".icon")
        ).getPropertyValue("--project-color");

        if (HAX_LIST.findIndex((item) => item === hexCode) === -1) return;

        formProps.hexCode = hexCode;

        const { id, status } = handleProject.createLocalProject(formProps);

        if (!status) return;

        formProps.id = id;

        data.projects.push(formProps);

        sidebar.createProjectList(data.projects);

        projectsButton.classList.add("arrowDown");

        const ul = projectsList.firstElementChild;
        ul.scrollTo({ top: ul.scrollHeight, behavior: "smooth" });

        handleFormDOM.closeForm();
    }
    function deleteProject(e) {
        const deleteButton = e.target.closest(".deleteButton");

        if (!deleteButton) return;

        const elem = deleteButton.closest(".item");

        const id = +elem.dataset.id;

        if (!id) return;

        const index = data.projects.findIndex((project) => project.id === id);

        const { status } = handleProject.deleteLocalProject(id);

        if (!status) return;

        data.projects.splice(index, 1);

        elem.remove();

        let ul = projectsList.firstElementChild;
        ul.scrollTo({ top: ul.scrollTop });

        for (let task of data.tasks) {
            if (task.projectId === id) {
                handleTask.deleteLocalTask(task.id);
            }
        }

        data.tasks = data.tasks.filter((task) => task.projectId !== id);

        if (pageItem.id === id) {
            pageItem.name = "Inbox";
            pageItem.id = null;
        }

        changeTitle(pageItem.name);
        main.createTasksList(filterTasks(pageItem.name));

        ul = tasksList.firstElementChild;
        ul.scrollTo({ top: ul.scrollTop });
    }
    function updateProject(item, index) {
        return function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const formProps = Object.fromEntries(formData);

            if (!handleValidation.validFormData(formProps, this)) return;

            const hexCode = getComputedStyle(
                this.querySelector(".icon")
            ).getPropertyValue("--project-color");

            if (HAX_LIST.findIndex((item) => item === hexCode) === -1) return;

            formProps.hexCode = hexCode;

            const project = data.projects[index];

            const { status } = handleProject.updateLocalProject(
                formProps,
                project.id
            );

            if (!status) return;

            for (let key in project) {
                if (formProps[key]) {
                    project[key] = formProps[key];
                }
            }

            item.querySelector(".title").textContent = formProps.name;
            item.querySelector(
                ".icon"
            ).style = `--project-color:${formProps.hexCode}`;

            if (item.querySelector(".title").scrollWidth > 150) {
                // 不支援觸控以及鍵盤和螢幕閱讀器使用者
                item.querySelector(".title").style.overflow = "hidden";
                item.querySelector(".title").title = formProps.name;
            }

            const ul = projectsList.firstElementChild;
            ul.scrollTo({ top: ul.scrollTop });

            handleFormDOM.closeForm();
        };
    }

    // Task

    function showAddTaskForm(e) {
        const addButton = e.target.closest(".addButton");
        if (!addButton) return;

        const form = main.createTaskForm();

        main.createTaskProductNameDropdown(data.projects, pageItem.id);

        form.elements.day.addEventListener(
            "change",
            handleValidation.validDate
        );
        form.elements.time.addEventListener(
            "change",
            handleValidation.validTime
        );

        form.addEventListener("focusout", handleFormDOM.focusOnForm);
        form.addEventListener("click", showTaskFormDropdown);

        form.addEventListener("submit", addTask);

        handleFormDOM.showForm();

        const textareaList = form.querySelectorAll("textarea");

        for (let textarea of textareaList) {
            const countLines = new Set();
            const maxLength = textarea.getAttribute("maxlength");

            for (let i = 0; i < maxLength; i++) {
                textarea.value += "a";
                countLines.add(textarea.scrollHeight);
            }

            textarea.value = "";

            textarea.addEventListener(
                "keydown",
                handleFormDOM.limitLines.bind(countLines)
            );
            textarea.addEventListener(
                "input",
                handleFormDOM.limitCharacters.bind(maxLength)
            );
            textarea.addEventListener("input", handleFormDOM.autoResize);
        }
    }
    function showTaskFormDropdown(e) {
        const button = e.target.closest(".dropDownButton");

        if (!button) return;

        button.classList.toggle("showList");

        const dropdownList = button.nextElementSibling;

        if (dropdownList.firstElementChild.clientHeight > 200) {
            dropdownList.firstElementChild.style.height = "200px";
        }

        dropdownList.style.right = "auto";

        const dropdownListCoord = dropdownList.getBoundingClientRect();
        const windowRight = document.documentElement.clientWidth;

        if (dropdownListCoord.right > windowRight) {
            dropdownList.style.left = "auto";
            dropdownList.style.right = "0px";
        }

        if (button.classList.contains("showList")) {
            this.addEventListener("pointerup", closeDropdown);
            dropdownList.addEventListener("pointerdown", changeItem);
        }

        function closeDropdown(e) {
            if (e.target !== button) {
                button.classList.remove("showList");
            }

            this.removeEventListener("pointerup", closeDropdown);
            this.removeEventListener("pointerdown", changeItem);
        }

        function changeItem(e) {
            const target = e.target.closest(".wrap");

            if (!target || target === button) return;

            const selectElem = target.cloneNode(true);

            const buttonClassList = Array.from(button.classList);
            buttonClassList.pop();

            selectElem.classList.add(...buttonClassList);
            selectElem.tabIndex = 0;

            button.replaceWith(selectElem);
        }
    }
    function showEditTaskForm(e) {
        const editButton = e.target.closest(".editButton");

        if (!editButton) return;

        const item = editButton.closest(".item");

        const id = +item.dataset.id;

        if (!id) return;

        const index = data.tasks.findIndex((task) => task.id === id);

        const form = main.createTaskForm(data.tasks[index]);

        main.createTaskProductNameDropdown(
            data.projects,
            data.tasks[index].projectId
        );

        form.elements.day.addEventListener(
            "change",
            handleValidation.validDate
        );
        form.elements.time.addEventListener(
            "change",
            handleValidation.validTime
        );

        form.addEventListener("focusout", handleFormDOM.focusOnForm);

        form.addEventListener("click", showTaskFormDropdown);

        form.addEventListener("submit", updateTask(index));

        handleFormDOM.showForm();

        const textareaList = form.querySelectorAll("textarea");

        for (let textarea of textareaList) {
            const countLines = new Set();
            const maxLength = textarea.getAttribute("maxlength");
            const value = textarea.value;

            textarea.value = "";

            for (let i = 0; i < maxLength; i++) {
                textarea.value += "a";
                countLines.add(textarea.scrollHeight);
            }

            textarea.value = value;

            textarea.addEventListener(
                "keydown",
                handleFormDOM.limitLines.bind(countLines)
            );
            textarea.addEventListener(
                "input",
                handleFormDOM.limitCharacters.bind(maxLength)
            );
            textarea.addEventListener("input", handleFormDOM.autoResize);
        }

        handleFormDOM.autoResize.call(form.elements.taskName);
        handleFormDOM.autoResize.call(form.elements.description);
    }

    function addTask(e) {
        e.preventDefault();

        const formData = new FormData(this);
        let formProps = Object.fromEntries(formData);

        if (!handleValidation.validFormData(formProps, this)) return;

        formProps.priority = this.querySelector(".priority").dataset.color;

        const projectButton = this.querySelector(".projectName");
        const itemName = projectButton.textContent.trim();
        const productId = +projectButton.dataset.projectId;

        if (itemName !== "Inbox" && !productId) return;

        if (itemName === "Inbox") {
            formProps.projectId = "";
        } else {
            if (data.projects.findIndex((item) => item.id === productId) === -1)
                return;

            formProps.projectId = productId;
        }

        formProps.completed = false;

        const { id, status } = handleTask.createLocalTask(formProps);

        if (!status) return;

        formProps.id = id;

        main.createTaskItem(formProps);

        data.tasks.push(formProps);

        main.createTasksList(filterTasks(pageItem.name));

        const content = document.querySelector(".content");
        content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });

        handleFormDOM.closeForm();
    }
    function deleteTask(e) {
        const deleteButton = e.target.closest(".deleteButton");

        if (!deleteButton) return;

        const elem = deleteButton.closest(".item");

        const id = +elem.dataset.id;

        if (!id) return;

        const index = data.tasks.findIndex((task) => task.id === id);

        const { status } = handleTask.deleteLocalTask(data.tasks[index].id);

        if (!status) return;

        data.tasks.splice(index, 1);

        main.createTasksList(filterTasks(pageItem.name));

        const ul = tasksList.firstElementChild;
        ul.scrollTo({ top: ul.scrollTop });
    }
    function updateTask(index) {
        return function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const formProps = Object.fromEntries(formData);

            if (!handleValidation.validFormData(formProps, this)) return;

            formProps.priority = this.querySelector(".priority").dataset.color;

            const projectButton = this.querySelector(".projectName");
            const itemName = projectButton.textContent.trim();
            const productId = +projectButton.dataset.projectId;

            if (itemName !== "Inbox" && !productId) return;

            if (itemName === "Inbox") {
                formProps.projectId = "";
            } else {
                if (
                    data.projects.findIndex((item) => item.id === productId) ===
                    -1
                )
                    return;

                formProps.projectId = productId;
            }

            const task = data.tasks[index];

            const { status } = handleTask.updateLocalTask(formProps, task.id);

            if (!status) return;

            for (let key in task) {
                if (formProps[key]) {
                    task[key] = formProps[key];
                }
            }

            main.createTasksList(filterTasks(pageItem.name));

            let content = document.querySelector(".content");
            const currentScrollBarPosition = content.scrollTop;
            content.scrollTo({ top: currentScrollBarPosition });

            handleFormDOM.closeForm();
        };
    }

    return {
        init,
    };
}

export { createTodoList };
