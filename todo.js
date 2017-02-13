"use strict"

const fs = require('fs')

let data = JSON.parse(fs.readFileSync('data.json','utf-8'))
let argv = process.argv.slice(2)
// console.log(argv);

class Todo {
  constructor() {

  }

  help() {
    let command = `$ node todo.js`
    if (argv == 'help' || argv == '') {
      console.log(`TODO LIST COMMAND:`);
      console.log(`${command} help`);
      console.log(`${command} list`);
      console.log(`${command} add <task_content>`);
      console.log(`${command} task <task_id>`);
      console.log(`${command} delete <task_id>`);
      console.log(`${command} completed <task_id>`);
      console.log(`${command} uncompleted <task_id>`);
      console.log(`${command} list:outstanding asc | desc`);
      console.log(`${command} list:completed asc | desc`);
      console.log(`${command} tag <task_id> <name_1> <name_2>`);
      console.log(`${command} filter: <tag_name>`);
    }
  }
  list() {
    for (let i = 0;i < data.length; i++) {
      if (data[i].completed == true) {
        console.log(`[X] ${data[i].id}. ${data[i].task} | created_at: ${data[i].createdAt} | updated_at: ${data[i].updatedAt} | tag: ${data[i].tag}`);
      } else {
        console.log(`[ ] ${data[i].id}. ${data[i].task} | created_at: ${data[i].createdAt} | updated_at: ${data[i].updatedAt} | tag: ${data[i].tag}`);
      }
    }
    // console.log(data);
  }

  add() {
    let addTask = argv.slice(1).join(' ')
    // console.log(addTask);
    data.push({
      "id"          : data.length+1,
      "task"        : addTask,
      "completed"   : false,
      "tag"         : "",
      "createdAt"   : new Date().toLocaleString(),
      "updatedAt"   : new Date().toLocaleString()
    })
    console.log(`===================================`);
    console.log(`${addTask} has been added`);
    console.log(`===================================`);
    fs.writeFileSync('data.json', JSON.stringify (data, null , 3), 'utf-8')
  }

  task() {
    if (data[argv[1]-1].completed == true) {
      console.log(`[X] ${data[argv[1]-1].id}. ${data[argv[1]-1].task}`);
    } else {
      console.log(`[ ] ${data[argv[1]-1].id}. ${data[argv[1]-1].task}`);
    }
  }

  delete() {
    let removeTask = argv.slice(1).join(' ')
    data.splice(argv[1]-1,1)
    for (let i = argv[1]-1; i < data.length; i++) {
      data[i].id--
    }
    // console.log(data);
    console.log(`===================================`);
    console.log(`task no. ${removeTask} has been deleted`);
    console.log(`===================================`);
    fs.writeFileSync('data.json', JSON.stringify (data, null , 3), 'utf-8')
  }

  completed() {
    let completedTask = argv.slice(1).join(' ')
    data[argv[1]-1].completed = true
    data[argv[1]-1].updatedAt = new Date().toLocaleString()
    console.log(`===================================`);
    console.log(`task no. ${completedTask} set to completed`);
    console.log(`===================================`);
    fs.writeFileSync('data.json', JSON.stringify (data, null , 3), 'utf-8')
  }

  uncompleted() {
    let uncompletedTask = argv.slice(1).join(' ')
    data[argv[1]-1].completed = false
    data[argv[1]-1].updatedAt = new Date().toLocaleString()
    console.log(`===================================`);
    console.log(`task no. ${uncompletedTask} set to uncompleted`);
    console.log(`===================================`);
    fs.writeFileSync('data.json', JSON.stringify (data, null , 3), 'utf-8')
  }

  listUncompleted() {
    if(argv[1] == 'asc') {
      let tmp = []
      for (let i = 0; i < data.length; i++) {
        if(data[i].completed == false) {
          tmp.push(data[i])
          tmp.sort(function(a,b) {
            return new Date(b.updatedAt) - new Date(a.updatedAt)
          })
        }
      }
      for(let j = 0; j < tmp.length; j++) {
        tmp[j].id = j + 1
        console.log(`[ ] ${tmp[j].id}. ${tmp[j].task} ${tmp[j].createdAt} ${tmp[j].updatedAt} ${tmp[j].tag}`);
      }
      // console.log(tmp);
    } else if(argv[1] == 'desc') {
      let tmp1 = []
      for (let i = 0; i < data.length; i++) {
        if(data[i].completed == false) {
          tmp1.push(data[i])
          tmp1.sort(function(a,b) {
            return new Date(a.updatedAt) - new Date(b.updatedAt)
          })
        }
      }
      for(let j = 0; j < tmp1.length; j++) {
        tmp1[j].id = j + 1
        console.log(`[ ] ${tmp1[j].id}. ${tmp1[j].task} ${tmp1[j].createdAt} ${tmp1[j].updatedAt} ${tmp1[j].tag}`);
      }
    }
  }

  listCompleted() {
    if(argv[1] == 'asc') {
      let tmp = []
      for (let i = 0; i < data.length; i++) {
        if(data[i].completed == true) {
          tmp.push(data[i])
          tmp.sort(function(a,b) {
            return new Date(b.updatedAt) - new Date(a.updatedAt)
          })
        }
      }
      for(let j = 0; j < tmp.length; j++) {
        tmp[j].id = j + 1
        console.log(`[ ] ${tmp[j].id}. ${tmp[j].task} ${tmp[j].createdAt} ${tmp[j].updatedAt} ${tmp[j].tag}`);
      }
      // console.log(tmp);
    } else if(argv[1] == 'desc') {
      let tmp1 = []
      for (let i = 0; i < data.length; i++) {
        if(data[i].completed == true) {
          tmp1.push(data[i])
          tmp1.sort(function(a,b) {
            return new Date(a.updatedAt) - new Date(b.updatedAt)
          })
        }
      }
      for(let j = 0; j < tmp1.length; j++) {
        tmp1[j].id = j + 1
        console.log(`[ ] ${tmp1[j].id}. ${tmp1[j].task} ${tmp1[j].createdAt} ${tmp1[j].updatedAt} ${tmp1[j].tag}`);
      }
    }
  }

  tag() {
    data[argv[1]-1].tag = argv.slice(2).join(' ')
    data[argv[1]-1].updatedAt = new Date().toLocaleString()
    fs.writeFileSync('data.json', JSON.stringify (data, null , 3), 'utf-8')
  }

  filter() {
    let tmp = []
    let cond = argv[1]
    // console.log(cond);
    for(var i = 0; i < data.length; i++) {
      if(data[i].tag.indexOf(cond) != -1) {
        tmp.push(data[i])
      }
    }
    for (var i = 0; i < tmp.length; i++) {
      if(tmp[i].completed == true) {
        console.log(`[X] ${tmp[i].id}. ${tmp[i].task} ${tmp[i].createdAt} ${tmp[i].createdAt} ${tmp[i].tag}`)
      } else {
        console.log(`[ ] ${tmp[i].id}. ${tmp[i].task} ${tmp[i].createdAt} ${tmp[i].createdAt} ${tmp[i].tag}`)
      }
    }
    // console.log(tmp);
  }
}

let todo = new Todo()

if (argv[0] == 'help' || argv == '') {
  todo.help()
} else if (argv[0] == 'list') {
  todo.list()
} else if (argv[0] == 'add') {
  todo.add()
  todo.list()
} else if (argv[0] == 'task') {
  todo.task()
  todo.list()
} else if (argv[0] == 'delete') {
  todo.delete()
  todo.list()
} else if (argv[0] == 'completed') {
  todo.completed()
  todo.list()
} else if (argv[0] == 'uncompleted') {
  todo.uncompleted()
  todo.list()
} else if (argv[0] == 'list:outstanding') {
  todo.listUncompleted()
} else if (argv[0] == 'list:completed') {
  todo.listCompleted()
} else if (argv[0] == 'tag') {
  todo.tag()
  todo.list()
} else if(argv[0] == 'filter:'){
  todo.filter()
}

// console.log(argv[1]);
