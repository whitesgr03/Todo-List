'use strict'


const handleTask = (() => {

    // Task Form Handler
    const createLocalTask = (data) => {
        let result = {
            status: false
        }

        const tasks = getLocalTasks()

        if ( tasks.length > 0) {
            data.id = tasks.at(-1).id + 1;
        } else {
            data.id = 1;
        }

        tasks.push(data)

        localStorage.setItem('tasks', JSON.stringify(tasks))
        
        result.status = true;
        result.id = data.id

        return result;
        
    }
    const getLocalTasks = () => {
        const item = localStorage.getItem('tasks');

        if (!item) return []

        const Tasks = JSON.parse(item)

        return Tasks
    }
    const updateLocalTask = (data, id) => {
        let result = {
            status: false
        }

        const tasks = getLocalTasks()
        
        const task = tasks.find(item => item.id === id)


        if (!task) {
            alert("error: task can't find")
            return result
        }

        for (let key in task) {
            if (data[key]) {
                task[key] = data[key]
            }
        }

        task.completed = data.completed;

        localStorage.setItem('tasks', JSON.stringify(tasks))
        result.status = true;

        return result;
    }
    const deleteLocalTask = (id) => {
        let result = {
            status: false
        }

        const tasks = getLocalTasks();

        const index = tasks.findIndex(item => item.id === +id);

        if (index === -1) {
            alert("error: Task can't find")
            return result
        }
        
        tasks.splice(index, 1);

        localStorage.setItem('tasks', JSON.stringify(tasks));
        result.status = true;

        return result;
    }

    return {
        createLocalTask,
        getLocalTasks,
        updateLocalTask,
        deleteLocalTask,
    }
})()

export {
    handleTask,
}