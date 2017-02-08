"use strict"
const fs        = require('fs')

class TodoList {
  constructor(values) {
    this.listData = values
  }

  writeToFile(){
    fs.writeFileSync(file, JSON.stringify(this.listData),'utf-8')
  }

  inputToList(value){
    let idLast = 1
    if (typeof this.listData[this.listData.length -1] !== 'undefined'){
      idLast   = this.listData[this.listData.length -1].id + 1
    }

    this.listData.push({"id" : idLast, "task" : value, "status" : false})
  }

  controller(value){
    let listMenu = ["# will call help","node todo.js help","node todo.js list",
                    "node todo.js add <task_content>","node todo.js task <task_id>",
                    "node todo.js delete <task_id>", "node todo.js complete <task_id>",
                    "node todo.js uncomplete <task_id>","node todo.js list:outstanding asc|desc",
                    "node todo.js list:completed asc|desc", "node todo.js tag <task_id> <tag_name_1> ... <tag_name_N>",
                    "node todo.js filter:<tag_name>"];
    let argv     = process.argv

    switch (argv[2]) {
      case "help":
        for (let i = 0; i < listMenu.length; i++) {
          console.log(listMenu[i]);
        }
        break;
      case "list":
        for (let i = 0; i < this.listData.length; i++) {
          if(this.listData[i].status == false){
            console.log(`${this.listData[i].id}. [ ] ${this.listData[i].task}`);
          }else {
            console.log(`${this.listData[i].id}. [x] ${this.listData[i].task}`);
          }
        }
        break;
      case "add":
        if(argv[3] == undefined){
          console.log('write something!');
        }else {
          this.inputToList(argv.splice(3, argv.length).join(' '));
          this.writeToFile();
        }
        break;
      case "task":
        if(argv[3] == undefined || argv[3] > this.listData.length){
          console.log(`id not defined!! \n tak saat ini : ${this.listData.length}`);
        }else {
          console.log(`task ${argv[3]} : ${this.listData[argv[3]-1].task}`)
        }
        break;
      case "delete":
        if(argv[3] == undefined){
          console.log(`id not defined!! \n tak saat ini : ${this.listData.length}`);
        }else {
          // console.log(`task ${this.listData[argv[3]].task} deleted`)
          for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i].id == parseInt(argv[3])) {
              this.listData.splice(i, 1)
            }
          }
        }
        this.writeToFile()
        break;
      case "complete":
        if(argv[3] == undefined || argv[3] > this.listData.length){
          console.log(`id not defined!! \n task saat ini : ${this.listData.length}`);
        }else {
          this.listData[argv[3]-1].status = true
          console.log(`task ${this.listData[argv[3]-1].task} is completed!!`)
        }
        this.writeToFile();
        break;
      case "uncomplete":
        if(argv[3] == undefined || argv[3] > this.listData.length){
          console.log(`id not defined!! \n task saat ini : ${this.listData.length}`);
        }else {
          this.listData[argv[3]-1].status = false
          console.log(`task ${this.listData[argv[3]-1].task} is uncomplete !!`)
        }
        this.writeToFile()
        break;
      default:
      for (let i = 0; i < listMenu.length; i++) {
        console.log(listMenu[i]);
      }
    }//End switch
  }
}

const file      = 'data.json'
const readFile  = fs.readFileSync(file,'utf-8')
var parseData = []
if(readFile) {
  parseData = JSON.parse(readFile)
}

let todo = new TodoList(parseData)
todo.controller()
