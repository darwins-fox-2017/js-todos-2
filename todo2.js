"use strict"
const fs = require('fs')
let argv = process.argv
const file      = 'data.json'
const readFile  = fs.readFileSync(file,'utf-8')
var parseData = []
if(readFile) {
  parseData = JSON.parse(readFile)
}

 class TodoList {
  constructor(val) {
    this.listData = val
  }

  write(){
    fs.writeFileSync(file, JSON.stringify(this.listData, null,"\t"),'utf-8')
  }

  inputToList(value){
    let idLast = 1
    if (typeof this.listData[this.listData.length -1] !== 'undefined'){
      idLast   = this.listData[this.listData.length -1].id + 1
    }

    this.listData.push({"id" : idLast, "task" : value, "status" : false, "date" : new Date(), "dateCompleted" : new Date(),"tag" : []})
    console.log(`${value} successfully saved`);
  }
  help(){
    let node = "$ node todo.js"
    let menu = (`\n ${node} add <task content> \n ${node} list \n ${node} help \n ${node} delete <task_id> \n ${node} complete <task_id> \n ${node} uncomplete <task_id \n ${node} task <task_id> \n ${node} list:outstanding asc|desc \n ${node} list:completed asc|desc \n ${node} tag <task_id> <tag_name_1> ... <tag_name_N> \n ${node} filter:<tag_name> `);
      if(argv[2] === undefined || argv[2] === 'help'){
        console.log(`${menu}`)
      }
  }
  list(){
    for (let i = 0; i < this.listData.length; i++) {
      if(this.listData[i].status == false){
        console.log(`${this.listData[i].id}. [ ] ${this.listData[i].task}`);
      }else {
        console.log(`${this.listData[i].id}. [x] ${this.listData[i].task}`);
      }
    }
  }

  execute(x)
    switch (argv[2]) {
      case "help":
        this.help()
        break;
      case "list":
        this.list()
        break;
      case "add":
        if(argv[3] == undefined){
          console.log('write something!');
        }else {
          this.inputToList(argv.splice(3, argv.length).join(' '));
          this.write();
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
          for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i].id == parseInt(argv[3])) {
              this.listData.splice(i, 1)
            }
          }
        }
        this.write()
        break;
      case "complete":
        if(argv[3] == undefined || argv[3] > this.listData.length){
          console.log(`id not defined!! \n task saat ini : ${this.listData.length}`);
        }else {
          this.listData[argv[3]-1].status = true
          console.log(`task ${this.listData[argv[3]-1].task} is completed!!`)
        }
        this.write();
        break;
      case "uncomplete":
        if(argv[3] == undefined || argv[3] > this.listData.length){
          console.log(`id not defined!! \n task saat ini : ${this.listData.length}`);
        }else {
          this.listData[argv[3]-1].status = false
          console.log(`task ${this.listData[argv[3]-1].task} is uncomplete !!`)
        }
        this.write()
        break;
      case "tag":
        if (argv[3] == undefined || argv[3] == 0 || argv[3] > this.listData.length) {
          console.log('Enter the task id that will be tagged');
        }else {
          if (argv[4] == undefined) {
            console.log(`Enter the type of tags that will be input to the task ${this.listData[argv[3]-1]['task']}`);
          }else {
            let addData = (argv.splice(4, argv.length)).join(' ')
            this.listData[argv[3]-1]['tag'].push(addData)
            console.log(`Task ${this.listData[argv[3]-1]['task']} has been included in the tag ${addData}`);
          }
        }
        this.write();
        break;
      case "list:outstanding":
        if (argv[3] == 'desc') {
          this.listData.sort(function(a,b){ return new Date(b.date) - new Date(a.date)})

          let check = 0
          for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i]['status'] == false) {
              console.log(`${this.listData[i].id}. [ ] ${this.listData[i]['task']} Create At ${this.listData[i].date}`);
              check++
            }
          }

          if (check == 0) {
            console.log('No task is complete');
          }
        }

        if (argv[3] == 'asc') {
          this.listData.sort(function(a,b){ return new Date(a.date) - new Date(b.date);})

          let check = 0
          for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i]['status'] == false) {
              console.log(`${this.listData[i].id}. [ ] ${this.listData[i]['task']} Create At ${this.listData[i].date}`);
              check++
            }
          }

          if (check == 0) {
            console.log('all task completed');
          }
        }
        break;
      case "list:completed":
        if (argv[3] == 'asc') {
          this.listData.sort(function(a,b){ return new Date(a.dateCompleted) - new Date(b.dateCompleted)})
          let check = 0
          for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i]['status'] == true) {
              console.log(`${this.listData[1].id}. [X] ${this.listData[i]['task']} | Create At ${this.listData[i].date} | date completed ${this.listData[i].dateCompleted}`);
              check++
            }
          }
          if (check == 0) {
            console.log('no task is complete');
          }
        }

       if (argv[3] == 'desc') {
         this.listData.sort(function(a,b){ return new Date(b.dateCompleted) - new Date(a.dateCompleted)})
         let check = 0
         for (let i = 0; i < this.listData.length; i++) {
           if (this.listData[i]['status'] == true) {
             console.log(`${this.listData[1].id}. [X] ${this.listData[i]['task']} | Create At ${this.listData[i].date} | date completed ${this.listData[i].dateCompleted}`);
             check++
           }
         }
         if (check == 0) {
           console.log('no task is complete');
         }
        }
        break;
      case "filter":
        if (argv[3] == undefined) {
          console.log(`Enter the tag name to be in the filter`);
        }else {
          let check = 0
          for (let i = 0; i < this.listData.length; i++) {
            if (argv[3] == this.listData[i].tag) {
              console.log(`${this.listData[i].id}. ${this.listData[i].task} | ${this.listData[i].tag}`);
              check++
            }
          }

          if (check === 0) {
            console.log(`Tag is not not found`);
          }
        }
        break;
      default:
      this.help()
    }//End switch
  }
}
let todo2 = new TodoList(parseData)
todo2.execute()
