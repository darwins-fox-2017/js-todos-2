"use strict"

class jsTODO {
  constructor() {
    this.data = JSON.parse(obj)
    this.content = ""
  }

  execute(command, content) {
    this.content = content

    switch(command) {
      case "help" :
        this.help()
        break

      case "list" :
        this.list()
        break

      case "add" :
        this.add(this.content.slice(1).join(' '))
        break

      case "task" :
        this.task(this.content.slice(1).join(' '))
        break

      case "delete" :
        this.delete(this.content.slice(1).join(' '))
        break

      case "complete" :
        this.complete(this.content.slice(1).join(' '))
        break

      case "uncomplete" :
        this.uncomplete(this.content.slice(1).join(' '))
        break

      case "list:outstanding" :
        this.outstanding(this.content.slice(1).join(' '))
        break

      case "list:completed" :
        this.listCompleted(this.content.slice(1).join(' '))
        break

      case "tag" :
        this.tag(this.content.slice(1))
        break

      case "filter" :
        this.filter(this.content)
        break

      default:
        this.help()
        break
    }
  }

  writeToFile() {
    fs.writeFileSync('data.json', JSON.stringify(this.data))
  }

  help() {
    console.log("============================================================")
    console.log("Help - /")
    console.log("node todo.js - Help content")
    console.log("node todo.js help - Help content")
    console.log("node todo.js list - Show todo list")
    console.log("node todo.js add <task_content> - Add element to do")
    console.log("node todo.js task <task_id> - Show todo list by id")
    console.log("node todo.js delete <task_id> - Delete todo list by id");
    console.log("node todo.js complete <task_id> - Complete todo list by id")
    console.log("node todo.js uncomplete <task_id> - uncomplete todo list by id")
    console.log("node todo.js list:completed asc | desc - sorting completed todo list")
    console.log("node todo.js list:outstanding asc | desc - sorting unfinish todo list by id")
    console.log("node todo.js list:filter <task_id> - uncomplete todo list by id")
    console.log("node todo.js tag <task_id> <name_tag1> <name_tag2> <name_tag3> - uncomplete todo list by id")
    console.log("============================================================")
  }

  list() {
    for (let i = 0; i < this.data.length; i++) {
      let status = (this.data[i].status) ? "x" : ' '
      console.log(this.data[i].id + ". [" + status + "] " + this.data[i].task)
    }
  }

  add(content){
    this.data.push({ id : this.data.length + 1, task : content, status : false, tags : "", createDate : Date(), completedDate : ""})
    this.writeToFile()
    console.log("Added \"" + content + "\" to your todo list")
  }

  task(content) {
    let index = content - 1
    let status = (this.data[index].status) ? "x" : ' '
    console.log(this.data[index].id + ". [" + status + "] " + this.data[index].task)
  }

  delete(content) {
    let index = content - 1
    this.data.splice(index, 1)
    this.writeToFile()
    console.log("Deleted one task to your todo list")
  }

  complete(content) {
    let index = Number(content)
    for (let i = 0; i < this.data.length; i++) {
      if ( this.data[i].id === index ) {
        this.data[i].status = true
        this.data[i].completedDate = Date()
      }
    }
    this.writeToFile()
    console.log("Completed \"" + content + "\" to your todo list")
  }

  uncomplete(content) {
    let index = Number(content)
    for (let i = 0; i < this.data.length; i++) {
      if ( this.data[i].id === index ) {
        this.data[i].status = false
      }
    }
    this.writeToFile()
    console.log("Uncompleted \"" + content + "\" to your todo list")
  }

  outstanding(content) {
    let dataSort = ''
    switch (content) {
      case "desc" :
        dataSort = this.data.sort(function(a, b) { return new Date(b.completedDate) - new Date(a.completedDate) })
        break
      default :
        dataSort = this.data.sort(function(a, b) { return new Date(a.completedDate) - new Date(b.completedDate) })
    }

    for (let i = 0; i < dataSort.length; i++) {
        let status = (dataSort[i].status) ? "x" : ' '
        console.log(i+1 + ". [" + status + "] " + dataSort[i].task + " is completed at " + dataSort[i].completedDate)
    }
  }

  listCompleted(content) {
    let dataSort = ""
    let result = ""
    if (content === "desc") {
      console.log("Sorting completed task descending")
      dataSort = this.data.reverse()
    } else {
      console.log("Sorting completed task ascending")
      dataSort = this.data
    }

    for (let i = 0; i < dataSort.length; i++) {
      if ( dataSort[i].status === true ) {
        let status = (dataSort[i].status) ? "x" : ' '
        console.log(" [" + status + "] " + dataSort[i].task)
      }
    }
  }

  tag(content) {
    console.log(content)

    let index = Number(content[0])
    let tagMember = (args.splice(4, args.length)).join(" ")
    console.log(tagMember);
    this.data[args[3]-1]["tags"].push(tagMember)
    // console.log(tagMember);
    // this.data[args[3]-1]['tags'].push(tagMember)
    // for (let i = 0; i < this.data.length; i++) {
    //   if (this.data[i].id === index) {
    //     this.data[args[3]-1]['tags'].push(tagMember)
    //     // for (let j = 0; j < tagMember.length; i++) {
    //     //   console.log(this.data[args[i]]['tags'])
    //     // }
    //   }
    // }
    this.writeToFile()
  }

  filter(content){

  }

}

// Parsing data from json file
let fs = require('fs')
var obj = fs.readFileSync("data.json", "utf-8")

// create new Object
let todo = new jsTODO()
let args = process.argv
let contentTask = args.slice(2)
todo.execute(args[2], contentTask)
