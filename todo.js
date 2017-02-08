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
    console.log('$ node todo.js add <task_content> - tambahin todo list');
    console.log('$ node todo.js task <id-todo> - tampilin dengan index ke');
    console.log('$ node todo.js delete <id-todo> - delete todo dengan index ke');
    console.log('$ node todo.js complete <id-todo> - complete task index ke');
    console.log('$ node todo.js uncomplete <id-todo> - batal complete task dengan index ke');
  }
}


let command = new Command()
command.main()
// Argument
