const fs = require('fs')

class Task {
  constructor(data, id) {
    this.name = data['name']
    this.id = id
    this.complete = data['complete'] || false
    this.tag = data['tag'] || ""
    this.createDate = data['createDate'] || new Date
    this.completeDate = data['completeDate'] || ""
  }
}
class Todo {
  constructor(task, file) {
    this._task = task
    this.lastId = 1
    this.file = file
  }
  addTask() {

  }

  help() {
    console.log(`- help - Display this message`)
    console.log(`- list - Display task list`)
    console.log(`- add - add 'value' to add task`)
    console.log(`- task - Display task detail`)
    console.log(`- delete - delete 'id' delete specific task by id`)
    console.log(`- complete - complete 'id' mark complete to specific task by id`)
    console.log(`- uncomplete - uncomplete 'id' mark uncomplete to specific task by id`)
  }
  list() {
    let theData = fs.readFileSync(this.file, "utf-8")
    let jsonData = JSON.parse(theData)

    for(let i=0; i<jsonData.length; i++) {
      this._task[i].id = i+1
      if(jsonData[i]['complete'] === false)
      console.log(`[ ] - ${i+1} - ${jsonData[i]['name']}`)
      else {
        console.log(`[X] - ${i+1} - ${jsonData[i]['name']}`)
      }
    }
    fs.writeFileSync(this.file, JSON.stringify(this._task), "utf-8")
  }
  add(taskData) {

    let baru = {'name' : taskData}
    let newTask = new Task(baru, this._task.length + 1)
    this._task.push(newTask)
    console.log(`Task untuk "${taskData}" sudah dimasukan`)
    fs.writeFileSync(this.file, JSON.stringify(this._task), "utf-8")
  }

  // menampilkan task detail
  taskId(id) {
    for(let i=0; i<this._task.length; i++) {
      if(this._task[i].id + 1 == id) {
      console.log(`- ID : ${this._task[i+1].id}`)
      console.log(`- Task : ${this._task[i+1].name}`)
      if(this._task[i+1].complete) {
          console.log(`- Is it Done : DONE`)
      } else {
          console.log(`- Is it Done : NO`)
        }
      console.log(`- Tag : ${this._task[i+1].tag}`)
      console.log(`- Create Date : ${this._task[i+1].createDate}`)
      console.log(`- Complete Date : ${this._task[i+1].completeDate}`)
      break;
      }
    }
  }
  delete(id) {
    for(let i=0; i<this._task.length; i++) {
      if(this._task[i].id == id) {
        this._task.splice(id-1, 1)
        // console.log(this._task[id].name)
      }
    }
    fs.writeFileSync(this.file, JSON.stringify(this._task), "utf-8")
  }

  completed(id) {
    for(let i=0; i<this._task.length; i++) {
      if(this._task[i].id == id) {
        this._task[i].complete = true
        this._task[i].completeDate = new Date
        break;
      }
    }
    fs.writeFileSync(this.file, JSON.stringify(this._task), "utf-8")
  }
  uncomplete(id) {
    for(let i=0; i<this._task.length; i++) {
      if(this._task[i].id == id) {
        this._task[i].complete = false
        break;
      }
    }
    fs.writeFileSync(this.file, JSON.stringify(this._task), "utf-8")
  }

  filter(key) {
    let filteredArr = []
    for(let i=0; i<this._task.length; i++) {
      if(this._task[i].tag.indexOf(key) !== -1)
        filteredArr.push(this._task[i])
    }
    if(filteredArr.length != 0) {
      for(let i=0; i<filteredArr.length; i++) {
        console.log(`- ID : ${filteredArr[i].id}`)
        console.log(`- Task : ${filteredArr[i].name}`)
        if(filteredArr[i].complete) {
            console.log(`- Is it Done : DONE`)
        } else {
            console.log(`- Is it Done : NO`)
          }
        console.log(`- Tag : ${filteredArr[i].tag}`)
        console.log(`- Create Date : ${filteredArr[i].createDate}`)
        console.log(`- Complete Date : ${filteredArr[i].completeDate}`)
        console.log(" ")
      }
    } else {
      console.log("Not Found")
    }
  }

  tag(id, arrTag) {
    this._task[id-1].tag = arrTag
    fs.writeFileSync(this.file, JSON.stringify(this._task), "utf-8")
  }

  sortFunction(a,b){
    var dateA = new Date(a.createDate).getTime();
    var dateB = new Date(b.createDate).getTime();
    return dateA > dateB ? 1 : -1;
  }
  sortFunctionDesc(a,b){
    var dateA = new Date(a.createDate).getTime();
    var dateB = new Date(b.createDate).getTime();
    return dateA < dateB ? 1 : -1;
  }

  listComplete() {
    let arrStanding = []
    for(let i =0; i<this._task.length; i++) {
      if(this._task[i].complete === true) {
        arrStanding.push(this._task[i])
      }
    }
    let arrSorted = arrStanding.sort(this.sortFunction)
    for(let i=0; i<arrSorted.length; i++) {
      console.log(`[X] - ${arrSorted[i].id} - ${arrSorted[i].name}`)
    }
  }

  listCompleteDesc() {
    let arrStanding = []
    for(let i =0; i<this._task.length; i++) {
      if(this._task[i].complete === true) {
        arrStanding.push(this._task[i])
      }
    }
    let arrSorted = arrStanding.sort(this.sortFunctionDesc)
    for(let i=0; i<arrSorted.length; i++) {
      console.log(`[X] - ${arrSorted[i].id} - ${arrSorted[i].name}`)
    }
  }

  listOutstanding() {
    let arrStanding = []
    for(let i =0; i<this._task.length; i++) {
      if(this._task[i].complete === false) {
        arrStanding.push(this._task[i])
      }
    }
    let arrSorted = arrStanding.sort(this.sortFunction)
    for(let i=0; i<arrSorted.length; i++) {
      console.log(`[ ] - ${arrSorted[i].id} - ${arrSorted[i].name}`)
    }
  }

  listOutstandingDesc() {
    let arrStanding = []
    for(let i =0; i<this._task.length; i++) {
      if(this._task[i].complete === false) {
        arrStanding.push(this._task[i])
      }
    }
    let arrSorted = arrStanding.sort(this.sortFunctionDesc)
    for(let i=0; i<arrSorted.length; i++) {
      console.log(`[ ] - ${arrSorted[i].id} - ${arrSorted[i].name}`)
    }
  }


}

let readData = fs.readFileSync("data.json", "utf-8").split(',')
let jsonData = JSON.parse(readData)

let arrData = []
for(let i=0; i<jsonData.length; i++) {
  let newTask = new Task(jsonData[i], i+1)
  arrData.push(newTask)
}


// Read file .json, push data to new class Todo.
let doIt = new Todo(arrData, "data.json")

switch (process.argv[2]) {
  case "help":
    doIt.help()
    break;
  case "list:outstanding":
    switch (process.argv[3]) {
      case "desc":
        doIt.listOutstandingDesc()
        break;
      default:
        doIt.listOutstanding()
    }
  break;
  case "list:completed":
    switch (process.argv[3]) {
      case "desc":
        doIt.listCompleteDesc()
        break;
      default:
        doIt.listComplete()
    }
  break;
  case "list":
  // console.log(doIt._task)
    if(doIt._task !== []) {
      doIt.list()
    } else {
      console.log("No list")
    }
  break;
  case "add":
    taskData = ''
    for(let i=3; i<process.argv.length; i++) {
      taskData += process.argv[i] + " "
    }
    doIt.add(taskData)
  break;
  case "tag":
    let arrTag = []
    for(let i=4; i<process.argv.length; i++) {
      arrTag.push(process.argv[i])
    }
    doIt.tag(process.argv[3], arrTag)
  break;
  case "task":
    doIt.taskId(process.argv[3])
  break;
  case "delete":
    doIt.delete(process.argv[3])
  break;
  case "complete":
    doIt.completed(process.argv[3])
  break;
  break;
  case "uncomplete":
    doIt.uncomplete(process.argv[3])
  break;
  default:
    if(/filter:/.test(process.argv[2])) {
      let filterKey = process.argv[2].split(':')
      doIt.filter(filterKey[1])
    }
    else {
      doIt.help()
    }
}
