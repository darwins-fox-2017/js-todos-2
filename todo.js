"use strict"

const json         = require('jsonfile')

class TodoList {
  constructor (command) {
    this.command   = command
    this.data      = json.readFileSync('data.json')
  }

  run() {
    switch (this.command[0]) {
      case 'help':
        this.help()
        break;
      case 'list':
        this.list()
        break;
      case 'add':
        this.add(this.command.slice(1).join(' '))
        break;
      case 'delete':
        this.delete(this.command.slice(1,2)[0])
        break;
      case 'complete':
        this.complete(this.command.slice(1,2)[0])
        break;
      case 'uncomplete':
        this.uncomplete(this.command.slice(1,2)[0])
        break;
      case 'task':
        this.task(this.command.slice(1,2)[0])
        break;
      case 'listOutstanding':
        this.listOutstanding(this.command.slice(1,2)[0])
        break;
      case 'listCompleted':
        this.listCompleted(this.command.slice(1,2)[0])
        break;
      case 'tag':
        let param = this.command.slice(2).join(' ')
        this.tag(this.command.slice(1,2)[0], param)
        break;
      case 'filter':
        this.filter(this.command.slice(1).join(' '))
        break;
      default:
        console.log('Please input correct command!');
        this.help()
    }
  }

  help() {
    let helpMenu = ["$ node todo.js # will call help",
                    "$ node todo.js help",
                    "$ node todo.js list",
	                  "$ node todo.js add <task_content>",
                    "$ node todo.js task <task_id>",
	                  "$ node todo.js delete <task_id>",
                    "$ node todo.js complete <task_id>",
	                  "$ node todo.js uncomplete <task_id>",
                    "$ node todo.js listOutstanding asc|desc",
                    "$ node todo.js listCompleted asc|desc",
                    "$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>",
                    "$ node todo.js filter <tag_name>"]
  	 console.log(helpMenu.join("\n"))
  }

  list() {
    if (this.data.length > 0) {
      for (let i = 0; i < this.data.length; i++) {
        console.log(`${this.data[i].id}. [${this.data[i].completed ? "X" : " "}] ${this.data[i].task}`);
      }
    } else {
      console.log('-');
    }
  }

  add(string) {
      let formatAdd   = {
                          "id": this.data.length+1,
                          "task": string,
                          "completed": false,
                          "createdAt": new Date().toLocaleString(),
                          "completedAt": new Date().toLocaleString(),
                          "tags": []
                        }
      this.data.push(formatAdd)
      this.sortId()
      this.save()
      console.log("Success added "+string);
  }

  delete(id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        console.log("Record deleted "+this.data[i].task);
        this.data.splice(i, 1)
        break
      }
    }
    this.sortId()
    this.save()
  }

  complete(id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        this.data[i].completed = true
        this.data[i].completedAt = new Date().toLocaleString()
        break
      }
    }
    this.save()
  }

  uncomplete(id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        this.data[i].completed = false
        break
      }
    }
    this.save()
  }

  task(id) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        console.log(this.data[i].task +" : "+ this.data[i].tags)
        break
      }
    }
  }

  save() {
    json.writeFileSync('data.json', this.data)
  }

  sortId() {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].id = i+1
    }
    return this.data
  }

  sortCreateAsc() {
    let sortData = this.data.sort(function(a,b) {
      return new Date(a.createdAt) - new Date(b.createdAt)
    })
    return sortData
  }

  sortCreateDesc() {
    let sortData = this.data.sort(function(a,b) {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    return sortData
  }

  sortCreateBy(type) {
    if (type == "asc") {
      return this.sortCreateAsc()
    } else if (type == "desc") {
      return this.sortCreateDesc()
    } else {
      return this.sortCreateAsc()
    }
  }

  sortCompleteAsc() {
    let sortData = this.data.sort(function(a,b) {
      return new Date(a.completedAt) - new Date(b.completedAt)
    })
    return sortData
  }

  sortCompleteDesc() {
    let sortData = this.data.sort(function(a,b) {
      return new Date(b.completedAt) - new Date(a.completedAt)
    })
    return sortData
  }

  sortCompleteBy(type) {
    if (type == "asc") {
      return this.sortCompleteAsc()
    } else if (type == "desc") {
      return this.sortCompleteDesc()
    } else {
      return this.sortCompleteAsc()
    }
  }

  listOutstanding(type) {
    if (this.data.length > 0) {
      this.sortCreateBy(type)
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].completed == false) {
          console.log(`${this.data[i].id}. [${this.data[i].completed ? "X" : " "}] ${this.data[i].task}`);
          console.log(`Data created: ${this.data[i].createdAt}`);
        }
      }
    } else {
      console.log("Empty Task");
    }
  }

  listCompleted(type) {
    if (this.data.length > 0) {
      this.sortCompleteBy(type)
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].completed == true) {
          console.log(`${this.data[i].id}. [${this.data[i].completed ? "X" : " "}] ${this.data[i].task}`);
          console.log(`Data completed: ${this.data[i].completedAt}`);
        }
      }
    } else {
      console.log("Empty Task");
    }
  }

  tag(id, tagData) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].id == id) {
        this.data[i].tags = tagData
        console.log(`Tagged task "${this.data[i].task}" with tags: ${this.data[i].tags}`);
        break
      }
    }
    this.save()
  }

  filter(tagData) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].tags.indexOf(tagData) != -1) {
        console.log(`${this.data[i].id}. ${this.data[i].task} [${this.data[i].tags}]`);
      }
    }
  }
}

let argv           = process.argv
let list           = new TodoList(argv.slice(2))

list.run()
