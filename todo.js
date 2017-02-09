const fs = require('fs');
let argv = process.argv;
let argv_command = argv.slice(2)

class Todo {
  constructor(path) {
    this.path = path  // letak file data.json (database)
  }

  readFile() {
    var list = JSON.parse(fs.readFileSync(this.path, "utf-8"));
    return list
  }

  writeFile(file) {
    fs.writeFileSync("data.json", file, "utf-8");
  }

  jsonStringify(file) {
    return JSON.stringify(file, false, 3);
  }

  compare_sort_outstanding(a,b) {
    if (a.created_date < b.created_date) {
      return -1
    }
    if (a.created_date > b.created_date) {
      return  1
    }
    return 0
  }

  compare_desc_outstanding(a,b) {
    if (a.created_date > b.created_date) {
      return -1
    }
    if (a.created_date < b.created_date) {
      return  1
    }
    return 0
  }

  compare_sort_completed(a,b) {
    if (a.finished_date < b.finished_date) {
      return -1
    }
    if (a.finished_date > b.finished_date) {
      return  1
    }
    return 0
  }

  compare_desc_completed(a,b) {
    if (a.finished_date > b.finished_date) {
      return -1
    }
    if (a.finished_date < b.finished_date) {
      return  1
    }
    return 0
  }

  help () {
    console.log(
      `Command:
      // 1. help
      // 2. list
      // 3. add <task_content>
      // 4. task <task_id>
      // 5. delete <task_id>
      // 6. complete <task_id>
      // 7. uncomplete <task_id>`);
  }

  list() {
    // panggil method readFile() agar DRY code
    let list = this.readFile()
    for (let i = 0; i < list.length; i++) {
      console.log(`${i+1}. [${list[i]["status"]}] ${list[i]["task"]}`);
    }
  }

  add() {
    // harus dirubah dulu ke array of object
    let list = this.readFile()
    let obj = JSON.parse(`{ "task": "${argv_command.slice(1).join(' ')}",
                            "id": "${list.length + 1}",
                            "status": "",
                            "created_date": "${new Date()}",
                            "finished_date": "",
                            "tags": ""}`);
    // karena sifat nya sudah array, jadi kita bisa push object ke dalam array
    list.push(obj)
    // saat di masukkan, harus di convert lagi jadi string
    var json = this.jsonStringify(list)
    this.writeFile(json)
  }

  task() {
    let list = this.readFile()
    var index = argv_command[1] - 1;
    console.log(` Task ke ${argv_command[1]}, adalah ${list[ index ]["task"]} `);
  }

  delete() {
    let list = this.readFile()
    let index = argv_command[1] - 1
    delete list[index];   // 'delete' => untuk menghapus object berdasarkan index
    list.splice( index, 1 );
    console.log(`Task ke ${argv_command[1]} sudah di hapus`);
    var json = this.jsonStringify(list)
    this.writeFile(json)
  }

  complete() {
    let list = this.readFile()
    let index = argv_command[1] - 1;
    list[index]["status"] = "X";
    list[index]['finished_date'] = new Date().toUTCString();
    console.log(`Task ke ${argv_command[1]} sudah selesai dilakukan`);
    var json = this.jsonStringify(list)
    this.writeFile(json)
  }

  uncomplete() {
    let list = this.readFile()
    let index = argv_command[1] - 1;
    list[index]["status"] = "";
    console.log(`Status ke ${argv_command[1]} sudah selesai dirubah`);
    var json = this.jsonStringify(list)
    this.writeFile(json)
  }

  outstandingAsc() {
    let list = this.readFile()
    let result = list.sort(this.compare_sort_outstanding)
    console.log('ini ascending');
    for(let i = 0; i < result.length; i++) {
      if(result[i]['status'] != 'X')
      console.log(`${i+1}. [${list[i]["status"]}] ${list[i]["task"]}, created at: ${list[i]["created_date"]} `);
    }
  }

  outstandingDesc() {
    let list = this.readFile()
    let result = list.sort(this.compare_desc_outstanding)
    console.log('ini descending');
    for(let i = 0; i < result.length; i++) {
      if(result[i]['status'] != 'X')
      console.log(`${i+1}. [${list[i]["status"]}] ${list[i]["task"]}, created at: ${list[i]["created_date"]} `);
    }
  }

  completedAsc() {
    let list = this.readFile()
    let result = list.sort(this.compare_sort_completed)
    console.log('ini ascending');
    for(let i = 0; i < result.length; i++) {
      if(result[i]['status'] == 'X')
      console.log(`${i+1}. [${list[i]["status"]}] ${list[i]["task"]}, finished at: ${list[i]["finished_date"]} `);
    }
  }

  completedDesc() {
    let list = this.readFile()
    let result = list.sort(this.compare_desc_completed)
    console.log('ini ascending');
    for(let i = 0; i < result.length; i++) {
      if(result[i]['status'] == 'X')
      console.log(`${i+1}. [${list[i]["status"]}] ${list[i]["task"]}, finished at: ${list[i]["finished_date"]} `);
    }
  }

  tag() {
    let list = this.readFile()
    let index = argv_command[1] - 1;
    var tag = argv_command.splice(2);
    list[index]["tag"] = tag;
    var json = this.jsonStringify(list)
    this.writeFile(json)
  }

  filter() {
    let list = this.readFile()
    for (let i = 0; i < list.length; i++) {
      let hasil = list[i]["tags"].indexOf(argv_command[1]);
      if (hasil != -1) {
        console.log(`tag yang dicari ada di nomor ${i + 1}, dengan task: ${list[i]["task"]}`)
      }
    }
  }
}

let todoList = new Todo('data.json')

switch (argv_command[0]) {
  case 'help':
    todoList.help()
    break;
  case 'list':
    todoList.list()
    break;
  case 'add':
    todoList.add()
    break;
  case 'task':
    todoList.task()
    break;
  case 'delete':
    todoList.delete()
    break;
  case 'complete':
    todoList.complete()
    break;
  case 'uncomplete':
    todoList.uncomplete()
    break;
  case 'uncomplete':
    todoList.uncomplete()
    break;
  case 'outstanding':
    if(argv_command[1] == 'asc') {
      todoList.outstandingAsc()
    } else if (argv_command[1] == 'dsc') {
      todoList.outstandingDsc()
    }
    break;
  case 'completed':
    if(argv_command[1] == 'asc') {
      todoList.completedAsc()
    } else if (argv_command[1] == 'dsc') {
      todoList.completedDesc()
    }
    break;
  case 'tag':
    todoList.tag()
    break;
  case 'filter':
    todoList.filter()
    break;
}


// function asc() {
//   var list = JSON.parse(fs.readFileSync('data.json', "utf-8"));
//   let tampil = list.sort(compare_sort);
//   console.log(tampil);
// }
//
// function desc() {
//   var list = JSON.parse(fs.readFileSync('data.json', "utf-8"));
//   let tampil = list.sort(compare_desc);
//   console.log(tampil);
// }

// function compare_sort(a,b) {
//   if (a.created_date < b.created_date) {
//     return -1
//   }
//   if (a.created_date > b.created_date) {
//     return  1
//   }
//   return 0
// }
// function compare_desc(a,b) {
//   if (a.created_date > b.created_date) {
//     return -1
//   }
//   if (a.created_date < b.created_date) {
//     return  1
//   }
//   return 0
// }
