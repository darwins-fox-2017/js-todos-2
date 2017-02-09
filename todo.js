'use strict'

const fs = require('fs')

class Todo {
    constructor(argv) {
        this.argv = argv
        this.initFile()
    }

    /**
     * Switch between command of argv
     */
    getCommand() {
        switch (this.argv[2]) {
            case undefined:
                this.showHelp()
                break;
            case 'help':
                this.showHelp()
                break;
            case 'show':
                this.readTask()
                break;
            case 'add':
                this.writeTask(this.getCommandParam())
                break;
            case 'complete':
                this.completeTask(this.getCommandParam())
                break;
            case 'uncomplete':
                this.completeTask(this.getCommandParam(), 'uncomplete')
                break;
            case 'show:outstanding':
                this.readTask(this.getCommandParam(), 'outstanding')
                break;
            case 'show:complete':
                this.readTask(this.getCommandParam(), 'completed')
                break;
            case 'tag':
                this.addTags(this.getCommandParam())
                break;
            case 'filter':
                this.readTask(this.getCommandParam(), 'filter')
                break;
            case 'delete':
                this.deleteTask(this.getCommandParam())
                break;
            default:

        }
    }

    /**
     * Handle getting started with new blank data.json
     */
    initFile() {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (data === '') {
                fs.writeFile('data.json', '[]','utf8', (err) => {
                    // console.log(err)
                })
            }
        })
    }

    /**
     * Get 3rd index parameter of argv and so forth
     */
    getCommandParam() {
        let result = []
        for (var i = 3; i < this.argv.length; i++) {
           result.push(this.argv[i])
        }
        return result.join(' ')
    }

    /**
     * Read tasks in the json file, and show into the terminal
     * @option {String} Option of sort
     * @type {String} type of read task (outstanding or completed tasks)
     */
    readTask(option = 'desc', type = '') {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (data === '' | data === '[]') {
                console.log('TODO list is empty')
            } else {
                let tasks = JSON.parse(data)
                let filteredTasks = tasks
                if (type === 'outstanding') {
                    if (option === 'desc') {
                        filteredTasks = this.sortOption(tasks, 'desc')
                    } else if(option === 'asc') {
                        filteredTasks = this.sortOption(tasks, 'asc')
                    } else {
                        filteredTasks = this.sortOption(tasks, 'desc')
                    }
                } else if(type === 'completed') {
                    if (option === 'desc') {
                        filteredTasks = this.sortOption(tasks, 'desc', 'completed')
                    } else if(option === 'asc') {
                        filteredTasks = this.sortOption(tasks, 'asc', 'completed')
                    } else {
                        filteredTasks = this.sortOption(tasks, 'desc', 'completed')
                    }
                } else if(type === 'filter') {
                    filteredTasks = []
                    for (let i = 0; i < tasks.length; i++) {
                        for (var j = 0; j < tasks[i].tags.length; j++) {
                            if (tasks[i].tags[j] == option) {
                                filteredTasks.push(tasks[i])
                            }
                        }
                    }

                    for (let i = 0; i < filteredTasks.length; i++) {
                        console.log(`${filteredTasks[i].id}. ${filteredTasks[i].task} [${filteredTasks[i].tags}]`)
                    }
                    return
                }

                for (let i = 0; i < filteredTasks.length; i++) {
                    console.log(`${filteredTasks[i].id} [${(filteredTasks[i].is_done ? 'X' : ' ')}] : ${filteredTasks[i].task}`)
                }
            }
        })
    }

    /**
     *  Write task to the json file
     */
    writeTask(task, tags) {
        fs.readFile('data.json', 'utf8', (err, data) => {
            let tasks      = JSON.parse(data)
            let lastId     = tasks.length === 0 ? null : tasks[tasks.length-1].id
            let newId      = lastId === null ? 1 : lastId+1
            let newTask    = new Task(newId, task)//{"id":newId, "task":task, "is_done":false}
            tasks.push(newTask)
            let newTaskStr = JSON.stringify(tasks)
            fs.writeFile('data.json', newTaskStr,'utf8', (err) => {
                console.log(`Added "${task}" to your TODO list`)
            })
        })
    }
    /**
     * Delete task according of task id
     */
    deleteTask(id) {
        fs.readFile('data.json', 'utf8', (err, data) => {
            let tasks = JSON.parse(data)
            let deletedTask
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id == parseInt(id)) {
                    deletedTask = tasks[i].task
                    tasks.splice(i, 1)
                }
            }
            fs.writeFile('data.json', JSON.stringify(tasks),'utf8', (err) => {
                console.log(`Deleted "${deletedTask}" from your TODO list`)
            })
        })
    }

    /**
     * Mark any task as done
     *
     */
    completeTask(id, option = 'complete') {
        fs.readFile('data.json', 'utf8', (err, data) => {
            let tasks = JSON.parse(data)
            let completedTask
            let mark
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id == parseInt(id)) {
                    if (option === 'complete') {
                        completedTask           = tasks[i].task
                        mark                    = 'done'
                        tasks[i].is_done        = true
                        tasks[i].completed_date = Task.getCurrentDatetime()
                    } else {
                        if (tasks[i].is_done === true) {
                            completedTask           = tasks[i].task
                            mark                    = 'uncompleted'
                            tasks[i].is_done        = false
                            tasks[i].completed_date = null
                        }
                    }
                }
            }
            fs.writeFile('data.json', JSON.stringify(tasks),'utf8', (err) => {
                console.log(`You have marked "${completedTask}" as ${mark} from your TODO list`)
            })
        })
    }

    /**
     * Add tags to the task
     */
    addTags(args) {
        let splitArgs = args.split(' ')
        let id        = splitArgs[0]
        let tags      = []
        for (let i = 1; i < splitArgs.length; i++) {
            tags.push(splitArgs[i])
        }
        // console.log(tags);
        fs.readFile('data.json', 'utf8', (err, data) => {
            let tasks = JSON.parse(data)
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].id == id) {
                    // TODO: masukkan array tanpa duplikasi
                    let newTags = tags.filter(val => !tasks[i].tags.includes(val))
                    if (newTags.toString() !== '') {
                        tasks[i].tags.push(newTags.toString())
                    }
                }
            }
            fs.writeFile('data.json', JSON.stringify(tasks),'utf8', (err) => {
                console.log(`You have added "${tags}" tags`)
            })
        })
    }

    /**
     * Handle any sort for any function in the class
     * @type {String}
     */
    sortOption(tasks, option, type = 'outstanding') {
        let opt = type === 'outstanding' ? this.getOutstandingOrComplete(tasks) : this.getOutstandingOrComplete(tasks, 'completed')
        if(option === 'desc') {
            if (type === 'outstanding') {
                opt.sort((a, b) => {
                    return new Date(b.created_date) - new Date(a.created_date)
                })
            } else {
                opt.sort((a, b) => {
                    return new Date(b.completed_date) - new Date(a.completed_date)
                })
            }
        } else {
            if (type === 'outstanding') {
                opt.sort((a, b) => {
                    return new Date(a.created_date) - new Date(b.created_date)
                })
            } else {
                opt.sort((a, b) => {
                    return new Date(a.completed_date) - new Date(b.completed_date)
                })
            }
        }
        return opt
    }

    /**
     * Get outstanding or complete tasks
     * @type {String}
     */
    getOutstandingOrComplete(tasks, option = 'outstanding') {
        let outstanding = []
        let completed   = []
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].is_done === false) {
                outstanding.push(tasks[i])
            } else if (tasks[i].is_done === true) {
                completed.push(tasks[i])
            }
        }
        return option === 'outstanding' ? outstanding : completed
    }

    filterTasks(tagkeyword) {

    }

    /**
     * Show help
     */
    showHelp() {
        console.log(`
                            =========Welcome Master========
            --------You can give me command like given commands below-----
            1. Add todo task                   : node todo.js add <fill your task>
            2. Delete todo task                : node todo.js delete <id of your task>
            3. Mark as complete                : node todo.js complete <id of your task>
            4. Unmark completed task           : node todo.js uncomplete <id of your task>
            5. Give tag to your task           : node todo.js tag <id of your task> <tag>
            5. Filter your tasks by a given tag: node todo.js filter <tag>
            6. Show todo tasks                 : node todo.js show
            7. Show help                       : node todo.js help
        `)
    }
}

class Task {
    constructor(id, whatTodo, isDone = false) {
        this.id             = id
        this.task           = whatTodo
        this.is_done        = isDone
        this.created_date   = Task.getCurrentDatetime()
        this.completed_date = null
        this.tags           = []
    }

    /**
     * Get current date and time with following format : dd/mm/yyyy h:m
     */
    static getCurrentDatetime() {
        let date    = new Date()
        let day     = date.getDay()
        let month   = date.getMonth()
        let year    = date.getFullYear()
        let hours   = date.getHours()
        let minutes = date.getMinutes()

        return `${day}/${month}/${year} ${hours}:${minutes}`
    }
}


let argv = process.argv
let todo = new Todo(argv)
todo.getCommand()
