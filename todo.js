const fs = require('fs');

class Data {
  static getAllData() {
    let listToDo = fs.readFileSync('data.json');
    return JSON.parse(listToDo);
  }

  static complete(id) {
    let newData = this.getAllData();
    let tobecompleted = newData[id-1];
    tobecompleted.completed = "x";
    tobecompleted.time_completed = Date();
    newData[id-1] = tobecompleted;

    fs.writeFile("data.json", JSON.stringify(newData), "utf8", (err) => {
      if (err) {
        console.log("Error, failed to update data!");
      }
      else {
        console.log("Data updated successfully!");
      }
    });
  }

  static uncomplete(id) {
    let newData = this.getAllData();
    let tobecompleted = newData[id-1];
    tobecompleted.completed = " ";
    tobecompleted.time_completed = "not completed yet";
    newData[id-1] = tobecompleted;

    fs.writeFile("data.json", JSON.stringify(newData), "utf8", (err) => {
      if (err) {
        console.log("Error, failed to update data!");
      }
      else {
        console.log("Data updated successfully!");
      }
    });
  }

  static setTags(id, tags) {
    let newData = this.getAllData();
    let toSetTags = newData[id];
    toSetTags.tags = tags;
    fs.writeFile("data.json", JSON.stringify(newData), "utf8", (err) => {
      if (err) {
        console.log("Error, failed to update data!");
      }
      else {
        console.log("Data updated successfully!");
      }
    });
  }

  static pushData(task) {
    let newData = this.getAllData();
    newData.push(new ToDo({
      'task' : task,
    }));
    return newData;
  }

  static writeData(task) {
    let toSaved = this.pushData(task);
    fs.writeFile("data.json", JSON.stringify(toSaved), "utf8", (err) => {
      if (err) {
        console.log(`Data  [ ${task} ] Failed to add!`);
      } else {
        console.log(`Data [ ${task} ] added successfully!`);
      }
    })
  }

  static delData(id) {
    let deleted = this.getAllData();
    deleted.splice((id-1), 1);

    fs.writeFile("data.json", JSON.stringify(deleted), "utf8", (err) => {
      if (err) {
        console.log(`Failed to delete data with id ${id}!`);
      } else {
        console.log(`Data with id ${id} deleted successfully!`);
      }
    })
  }
}
//

class ToDo {
  constructor(args={}) {
    this.task = args['task'];
    this.completed = args['completed'] || " ";
    this.date = args['date'] || Date();
    this.time_completed = args['date'] || "not completed yet";
    this.tags = args['tags'] || [];
  }

  help() {
    console.log("----------------------");
    console.log("+++++ TO-DO-LIST +++++");
    console.log("----------------------\n");
    console.log("'node todo.js help' - for help");
    console.log("'node todo.js add <task_content>' - to add new task content");
    console.log("'node todo.js delete <task_id>' - to delete a task");
    console.log("'node todo.js complete <task_id>' - to mark a task as a completed task");
    console.log("'node todo.js uncomplete <task_id>' - to mark a task as a uncompleted task\n");
    console.log(" -------------------------------  new features ----------------------------------------------");
    console.log("'node todo.js list:outstanding' - to show default all of to-do list");
    console.log("'node todo.js list:outstanding:asc' - to show all of to-do list asc according to date added");
    console.log("'node todo.js list:outstanding:desc' - to show all of to-do list desc according to date added");
    console.log("'node todo.js list:completed' - to show default all task that have been completed");
    console.log("'node todo.js list:completed:asc' - to show all task that have been completed with asc order");
    console.log("'node todo.js list:completed:desc' - to show all task that have been completed with desc order");
    console.log("'node todo.js tag <task_id> <tags1> <tags2> . .' - to set tags for particular task");
    console.log("'node todo.js filter <tag>' - to show all task with spesific tag");
    console.log(" --------------------------------  end of ----------------------------------------------------");
      }

  list() {
    let listToDo = Data.getAllData();
    console.log("| id | task | completed | tags | created at | completed at ");
    for (var i = 0; i < listToDo.length; i++) {
      console.log(`| ${i+1}. | [${listToDo[i].completed}]  | ${listToDo[i].task} | ${listToDo[i].tags} | ${listToDo[i].date} | ${listToDo[i].time_completed}`);
    }
  }

  desc() {
    let listToDo = Data.getAllData();
    listToDo = listToDo.sort((a,b)=>{
      if(a.date > b.date) {
        return -1;
      }
      else if(a.date < b.date) {
        return 1;
      }
      else {
        return 0;
      }
    });

    let j = 1;
    for (var i = 0; i < listToDo.length; i++) {
      console.log(`| ${i+1}. | [${listToDo[i].completed}]  | ${listToDo[i].task} | ${listToDo[i].tags} | ${listToDo[i].date} | ${listToDo[i].time_completed}`);
    }
  }

  ascCompleted() {
    let listToDo = Data.getAllData();
    listToDo = listToDo.sort((a,b)=>{
      if(a.time_completed < b.time_completed) {
        return -1;
      }
      else if(a.time_completed > b.time_completed) {
        return 1;
      }
      else {
        return 0;
      }
    });
    let j = 1;
    for (var i = 0; i < listToDo.length; i++) {
      if (listToDo[i].completed == "x") {
        console.log(`| ${i+1}. | [${listToDo[i].completed}]  | ${listToDo[i].task} | ${listToDo[i].tags} | ${listToDo[i].date} | ${listToDo[i].time_completed}`);
      }
    }
  }

  descCompleted() {
    let listToDo = Data.getAllData();
    listToDo = listToDo.sort((a,b)=>{
      if(a.time_completed > b.time_completed) {
        return -1;
      }
      else if(a.time_completed < b.time_completed) {
        return 1;
      }
      else {
        return 0;
      }
    });
    let j = 1;
    for (var i = 0; i < listToDo.length; i++) {
      if (listToDo[i].completed == "x") {
        console.log(`| ${i+1}. | [${listToDo[i].completed}]  | ${listToDo[i].task} | ${listToDo[i].tags} | ${listToDo[i].date} | ${listToDo[i].time_completed}`);
      }
    }
  }

  static filterTags(tag) {
    let listToDo = Data.getAllData();
    let j = 1;
    for (var i = 0; i < listToDo.length; i++) {
      if (listToDo[i].tags.indexOf(tag) != -1) {
        console.log(`| ${i+1}. | [${listToDo[i].completed}]  | ${listToDo[i].task} | ${listToDo[i].tags} | ${listToDo[i].date} | ${listToDo[i].time_completed}`);
      }
    }
  }

}



let todo = new ToDo();

// console.log(Data.pushData("Test"));
// Data.writeData("Terus");
// Data.delData(2);
process.argv.splice(0,2);
let cmd = process.argv.splice(0,1).join("");
let arg = process.argv.join(" ");

if (cmd == "list:outstanding" || cmd == "list:outstanding:asc") {
    todo.list();
}
else if(cmd == "list:outstanding:desc") {
  todo.desc();
}
else if (cmd == "help" || cmd == "") {
  todo.help();
}
else if (cmd == "add" && arg != "") {
  Data.writeData(arg);
}
else if (cmd == "delete" && isNaN(arg) == false) {
  Data.delData(arg);
}
else if (cmd == "complete" && isNaN(arg) == false) {
  Data.complete(arg);
}
else if (cmd == "uncomplete" && isNaN(arg) == false) {
  Data.uncomplete(arg);
}
else if(cmd == "list:completed") {
  todo.ascCompleted();
}
else if(cmd == "list:completed:asc") {
  todo.ascCompleted();
}
else if(cmd == "list:completed:desc") {
  todo.descCompleted();
}
else if(cmd == "tag") {
  let id = arg.split(" ").splice(0,1).join() - 1 ;
  let tags = arg.split(" ");
  tags.splice(0,1);
  Data.setTags(id, tags);
}
else if(cmd == "filter") {
  ToDo.filterTags(arg);
}
else {
  todo.help();
}


// console.log(Data.getAllData());
// console.log(Data.updateData());
