fs = require('fs');
let data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let args = process.argv
let help = ['node todo.js', 'node todo.js help', 'node todo.js list', 'node todo.js add <task_content>', 'node todo.js task <task_id>', 'node todo.js delete <task_id>', 'node todo.js complete <task_id>', 'node todo.js uncomplete <task_id>', 'node todo.js list:outstanding asc|desc','node todo.js list:completed asc|desc',
'node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_N>','node todo.js filter:<tag_name>']
help = help.join('\n')

// class Todo {
//   constructor(){
//   }
//
//   help(){}
//   list(id){}
//   add(){}
//   task(){}
// }

switch(args[2]) {
  case 'help' : console.log('========== MENU HELP ==========');
  case 'list' : console.log('========== MENU LIST ==========');
    for(var i = 0; i < data.length; i++) {
      if(data[i].complete == true) {
        console.log(`${data[i].id}. [x] ${data[i].task}`);
      } else {
        console.log(`${data[i].id}. [] ${data[i].task}`);
      }
    }
    break;

  case 'add':
    let kata = args.splice(3,args.length-3)
    data.push({ "id": data.length+1,"task":kata.join(' '),"complete":false,"date":new Date(),"dateComplete":new Date(),"tag":[]})
    fs.writeFileSync('data.json', JSON.stringify(data) , 'utf-8');
    break;

  case 'task' :
    for(let i = 0; i < args.length; i++) {
      if(args[3] == [i+1]) {
        if(data[i].complete == true) {
          console.log(`${data[i].id}. [x] ${data[i].task}`);
        } else {
          console.log(`${data[i].id}. [] ${data[i].task}`);
        }
      }
    }
    break;

  case 'delete' :
    for(let i = 0; i < args.length; i++) {
      if(args[3] == [i+1]) {
        data.splice(i, 1)
      }
    }
    fs.writeFileSync('data.JSON', JSON.stringify(data), 'utf-8');
    break;

  case 'complete' :
    for(let i = 0; i < args.length; i++) {
      if(args[3] == [i+1]) {
        data[i].complete = true;
      }
    }
    fs.writeFileSync('data.JSON', JSON.stringify(data), 'utf-8');
    break;

  case 'uncomplete' :
    for(let i = 0; i < args.length; i++) {
      if(args[3] == [i+1]) {
        data[i].complete = false;
      }
    }
    fs.writeFileSync('data.JSON', JSON.stringify(data), 'utf-8');
    break;

    case 'list:outstanding':
    if (args[3]=='asc') {

      data.sort(function(a,b){return new Date(a.date) - new Date(b.date);});

      for(let i=0; i<data.length; i++) {
        if (data[i].complete == false) {
          console.log(`${data[i].id}. [ ] ${data[i].task}, created at ${data[i].date}`);
        }
      }
    }
    if (args[3]=='desc') {

      data.sort(function(a,b){return new Date(b.date) - new Date(a.date);});

      for(let i=0; i<data.length; i++) {
        if (data[i].complete == false) {
          console.log(`${data[i].id}. [ ] ${data[i].task}, created at ${data[i].date}`);
        }
      }
    }
    break;

    case 'list:completed':
    if (args[3]=='asc') {

      data.sort(function(a,b){return new Date(a.dateComplete) - new Date(b.dateComplete);});

      for(let i=0; i<data.length; i++) {
        if (data[i].complete == true) {
          console.log(`${data[i].id}. [X] ${data[i].task} || created at ${data[i].date} || completed at ${data[i].dateComplete}`);
        }
      }
    }
    if (args[3]=='desc') {

      data.sort(function(a,b){return new Date(b.dateComplete) - new Date(a.dateComplete);});

      for(let i=0; i<data.length; i++) {
        if (data[i].complete == true) {
          console.log(`${data[i].id}. [X] ${data[i].task} || created at ${data[i].date} || completed at ${data[i].dateComplete}`);
        }
      }
    }
    break;

    case 'tag':
    let tagTag = args.splice(4,args.length-4)
    for(let i=0; i<args.length; i++) {
      if(args[3]==[i+1]){
        data[i].tag = tagTag;
      }
    }
    fs.writeFileSync('data.json', JSON.stringify(data) , 'utf-8');
    console.log(`${tagTag} berhasil ditambahkan`);
    break;

    case 'filter:':
    for(let i=0; i<data.length; i++) {
      if(args[3]==data[i].tag){
        console.log(`${data[i].id}. ${data[i].task}, ${data[i].tag}`);
      }
    }
    break;

    default:
    console.log(help);
    break;
  }
