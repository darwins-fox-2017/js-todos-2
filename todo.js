'use strict'
var jsonfile = require('jsonfile')

class Todo {
  constructor(fileName) {
    // this.name = ''
    // this.status = false // true it's mean done
    this.fileName = fileName
    this.todoList = []
  }


  parseFile(){
    this.todoList = jsonfile.readFileSync(this.fileName)
    // console.log(this.todoList);
  }

  writeToFile(){
    jsonfile.writeFileSync(this.fileName, this.todoList)
  }

  addTodo(todoProperties){
    let todo = {}
    todo.id = this.nextId()
    todo.title = todoProperties.title,
    todo.description = todoProperties.description,
    todo.status = todoProperties.status,
    todo.createdAt = new Date()

    this.todoList.push(todo)

    this.writeToFile()
    return {status: true, title: todo.title}
  }

  nextId(){
    return this.todoList[this.todoList.length - 1].id + 1
  }

  deleteTodo(id){
    for (var i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].id == id) {
        this.todoList.splice(i, 1)
        this.writeToFile()
        return true
      }
    }
    return false
  }

  complete(id){
    for (var i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].id == id) {
        this.todoList[i].status = true
        this.writeToFile()
        return true
      }
    }
    return false
  }

  uncomplete(id){
    for (var i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].id == id) {
        this.todoList[i].status = false
        this.writeToFile()
        return true
      }
    }
    return false
  }

  showList(){
    for (var i = 0; i < this.todoList.length; i++) {
      console.log(`${this.todoList[i].id} [ ${this.todoList[i].status == true ? 'X' : ' '} ] ${this.todoList[i].title} `);
    }
  }

  outstanding(order){
    let todoList = []
    for (var i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].status == false) {
        todoList.push(this.todoList[i])
      }
    }

    this.showOrderBy(todoList, order)
  }

  completed(order){
    let todoList = []
    for (var i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].status == true) {
        todoList.push(this.todoList[i])
      }
    }
    this.showOrderBy(todoList, order)
  }

  showOrderBy(todoList, order){
    if (order == 'asc') {
      for (var i = 0; i < todoList.length; i++) {
        console.log(`${todoList[i].id} [ ${todoList[i].status == true ? 'X' : ' '} ] ${todoList[i].title} `);

      }
    } else {
      for (var i = todoList.length -1; i >= 0 ; i--) {
        console.log(`${todoList[i].id} [ ${todoList[i].status == true ? 'X' : ' '} ] ${todoList[i].title} `);
      }
    }
  }

  sortingByName(todoList){
    let todos = todoList.sort(function(a, b){
      var titleA = a.title.toUpperCase(); // ignore upper and lowercase
      var titleB = b.title.toUpperCase(); // ignore upper and lowercase
      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }
      // names must be equal
      return 0;
    })
  }

  addTag(id, arrTag){
    let found = false
    let indexTodo = 0
    for (var i = 0; i < this.todoList.length; i++) {
      if (this.todoList[i].id == id) {
        this.todoList[i].tag = arrTag
        indexTodo = i
        found = true
      }
    }
    if (found) {
      this.writeToFile()
      return {status: true, todo: this.todoList[indexTodo]}
    } else{
      return false
    }
  }

  filterByTag(tag){
    // console.log(tag);
    for (let i = 0; i < this.todoList.length; i++) {
      for (let j = 0; j < this.todoList[i].tags.length; j++) {
        if (this.todoList[i].tags[j].toLowerCase() == tag.toLowerCase()) {
          console.log(`${this.todoList[i].id} [ ${this.todoList[i].status == true ? 'X' : ' '} ] ${this.todoList[i].title} `);
        }
      }
    }
  }

  sortingByDate(todoList){
    let todos = todoList.sort(function(a, b){
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    return todos
  }

}

class Command{
  constructor(){
    this.arguments = process.argv.splice(2, process.argv.length -1)
  }

  main(){
    let todo = new Todo('data.json')
    todo.parseFile()

    if (this.arguments.length == 0) {
      this.showHelp()
    } else {
      switch (this.arguments[0]) {
        case 'help':
          this.showHelp()
          break;
        case 'add':
          if (this.arguments[1] == undefined) {
            console.log('Nama tugasnya apa, Sis ?. Tambahin setelah add ya!');
          } else {
            let task = []
            for (var i = 1; i < this.arguments.length; i++) {
              task.push(this.arguments[i])
            }

            let todoProperties = {
              title: task.join(' '),
              description: 'Satu dua tiga',
              status: false,
            }

            let resultAdd = todo.addTodo(todoProperties)

            if (resultAdd.status == true) {
              console.log(`Task : ${resultAdd.title} berhasil di tambahkan, Sis! Jangan lupa di kerjain, ya!`);
            } else {
              console.log('Sorry, task kamu gagal dimasukin ke list ): ');
            }
          }
          break
        case 'delete':
          if (this.arguments[1] == undefined) {
            console.log('Task mana yang mau dihapus, Sis ?. Tambahin setelah delete ya!');
          } else {
            if (todo.deleteTodo(this.arguments[1]) == true) {
              console.log(`Task behasil di hapus`);
            } else {
              console.log(`Gak ketemu tuh sih task dengan id : ${this.arguments[1]}`);
            }
          }
          break
        case 'list':
          console.log('-------- Berikut Todo List kamu ----------');
          todo.showList()
          break
        case 'list:outstanding':
          console.log('-------- Berikut Todo List yang belum kamu kelarin ----------');
          if (this.arguments[1] == undefined) {
            console.log('Kita urutkan berdasarkan waktu masukin ya!');
            todo.outstanding('asc')
          } else {
            if (this.arguments[1] == 'asc') {
              console.log('Kita urutkan berdasarkan waktu masukin ya!');
              todo.outstanding('asc')
            } else {
              console.log('Urutanya dibalik dari waktu masukin ya!');
              todo.outstanding('desc')
            }
          }
          break
        case 'list:completed':
          console.log('-------- Berikut Todo List udah kamu kelarin ----------');
          if (this.arguments[1] == undefined) {
            console.log('Kita urutkan berdasarkan waktu masukin ya!');
            todo.completed('asc')
          } else {
            if (this.arguments[1] == 'asc') {
              console.log('Kita urutkan berdasarkan waktu masukin ya!');
              todo.completed('asc')
            } else {
              console.log('Urutanya dibalik dari waktu masukin ya!');
              todo.completed('desc')
            }
          }
          break
        case 'tag':
          if (this.arguments[1] == undefined) {
            console.log('Task mana yang mau kamu tambahin tag, Sis ?. Tambahin setelah complete ya!');
          } else {
            let arrTag = []
            for (var i = 2; i < this.arguments.length; i++) {
              arrTag.push(this.arguments[i])
            }
            // console.log(arrTag);
            let resultAddTag = todo.addTag(this.arguments[1], arrTag)
            if (resultAddTag.status) {
              console.log(`Tagged task ${resultAddTag.todo.title} with ${arrTag.join(' , ')}`);
            } else {
              console.log('Tagging fail ): ');
            }
          }
          break
        // case 'filter':
        //   if (this.arguments[1] == undefined) {
        //     console.log('Apa nama tag-nya, Sis ?');
        //   } else {
        //
        //   }
        //   break
        case 'complete':
          if (this.arguments[1] == undefined) {
            console.log('Task mana yang mau di complete-in, Sis ?. Tambahin setelah complete ya!');
          } else {
            if (todo.complete(this.arguments[1]) == true) {
              console.log(`Task behasil di rubah menjadi Complete, selamat Sista!`);
            } else {
              console.log(`Gak ketemu tuh sih task dengan id : ${this.arguments[1]}`);
            }
          }
          break
        case 'uncomplete':
          if (this.arguments[1] == undefined) {
            console.log('Task mana yang mau di un-complete-in, Sis ?. Tambahin setelah complete ya!');
          } else {
            if (todo.uncomplete(this.arguments[1]) == true) {
              console.log(`Task behasil di rubah menjadi Un-Complete, ada apa Sista?! `);
            } else {
              console.log(`Gak ketemu tuh sih task dengan id : ${this.arguments[1]}`);
            }
          }
          break
        default:
          let argFilter = this.arguments[0].split(':')
          if (argFilter[0] == 'filter') {
            todo.filterByTag(argFilter[1])
          }

      }
    }
  }



  isNumber(parameterID){
    return /[1-9]/g.test(parameterID)
  }

  showHelp(){
    console.log('----- Ada yang bisa di bantu, Sis ? ----- ');
    console.log(`$ node todo.js help - Jika kamu butuh bantuan`);
    console.log('$ node todo.js list - tampilih semua todo list');
    console.log('$ node todo.js list:outstanding <asc || desc>- tampilih semua todo list yang belum dikerjain');
    console.log('$ node todo.js list:completed <asc || desc>- tampilih semua todo list yang udah dikejain');
    console.log('$ node todo.js filter:<tag-name> - tampilih semua todo list dengan tag tersebut');
    console.log('$ node todo.js add <task_content> - tambahin todo list');
    console.log('$ node todo.js task <id-todo> - tampilin dengan index ke');
    console.log('$ node todo.js delete <id-todo> - delete todo dengan index ke');
    console.log('$ node todo.js complete <id-todo> - complete task index ke');
    console.log('$ node todo.js uncomplete <id-todo> - batal complete task dengan index ke');
    console.log('$ node todo.js tag <id-todo> <tags> <tags> - tambah tag ke dalama todo dengan index ke');
  }
}


let command = new Command()
command.main()
// Argument
