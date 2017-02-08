//class for todo
class toDo {
  constructor(fileName) {
    this.file=fileName;
  }
//menampilkan task yang ada
  list(){
    let file=this.file;
    let dataInFile = ReadWriteJson.readJson(file);
    //console.log(dataInFile.length);
    if (dataInFile.length<1) {
      console.log('belum ada list todo');
    } else {
      for (var i = 0; i < dataInFile.length; i++) {
      let id = dataInFile[i].id;
      let detail = dataInFile[i].detail;
      let mark;
      if (dataInFile[i].mark) {
        mark='[x]'
      } else {
        mark='[ ]'
      }
      console.log(`${id}. ${mark} ${detail}`);
      }
    }

  }

  //menampilkan list outstanding task
  outStanding(order){
    let file=this.file;
    let dataInFile = ReadWriteJson.readJson(file);
    let dataOutStanding=[]
    let mark;
    for (var i = 0; i < dataInFile.length; i++) {
      if (!dataInFile[i].mark) {
        dataOutStanding.push(dataInFile[i]);
      }
    }
    dataOutStanding = this.orderBy(dataOutStanding,order,'createDate');
    //console.log(dataOutStanding);
    for (var i = 0; i < dataOutStanding.length; i++) {
      if (dataOutStanding[i].mark) {
        mark='[x]'
      } else {
        mark='[ ]'
      }
      console.log(`${dataOutStanding[i].id}. ${mark} ${dataOutStanding[i].detail} ${dataOutStanding[i].createDate}` );
    }

  }

  completed(order){
    let file=this.file;
    let dataInFile = ReadWriteJson.readJson(file);
    let dataCompleted=[];
    let mark;
    for (var i = 0; i < dataInFile.length; i++) {
      if (dataInFile[i].mark) {
        dataCompleted.push(dataInFile[i]);
      }
    }
    dataCompleted = this.orderBy(dataCompleted,order,'doneDate');
    for (var i = 0; i < dataCompleted.length; i++) {
      if (dataCompleted[i].mark) {
        mark='[x]'
      } else {
        mark='[ ]'
      }
      console.log(`${dataCompleted[i].id}. ${mark} ${dataCompleted[i].detail} ${dataCompleted[i].doneDate}` );
    }
  }

  orderBy(data,order,orderByWhat){
    let orderedList;
    if (order=='asc') {
      orderedList = data.sort(function(a, b){
        return new Date(a[orderByWhat]) - new Date(b[orderByWhat]);
      })
    } else if(order=='desc'){
      //console.log('desc');
      orderedList = data.sort(function(a, b){
        return new Date(b[orderByWhat]) - new Date(a[orderByWhat]);
      })
    }
    return orderedList;
  }

//menambahkan task baru
  addTask(detailTask){
    let file=this.file;
    let dataInFile = ReadWriteJson.readJson(file);
    let taskProp={};
    if (dataInFile.length==0) {
      taskProp['id']=1
    }else {
      taskProp['id']=dataInFile[dataInFile.length-1].id+1;
    }
    taskProp['detail'] = detailTask;
    taskProp['tag'] = [];
    taskProp['createDate'] = new Date();
    let taskObj = new task(taskProp);
    dataInFile.push(taskObj);
    console.log(`${detailTask} berhasil ditambaahkan dengan id ${taskProp.id}`);
    ReadWriteJson.writeJson(file,dataInFile);
  }


  help(){
    console.log('------menu-------');
    console.log('node todo.js = menapilkan menu yang ada (help)' );
    console.log('node todo.js help = menapilkan menu yang ada (help)' );
    console.log('node todo.js list = menapilkan list task' );
    console.log('node todo.js add task baru= menambahkan "task baru" kedalam list task' );
    console.log('node todo.js delete i = menghapus task ke i didalam list' );
    console.log('node todo.js markDone i = memberi tanda done pada task ke i ' );
    console.log('node todo.js markUnDone i = menghapus tanda done pada task ke i ' );
    console.log('');
  }

  getStringFromArgv(argument,start){
    let string=[]
    for (var i = start; i < argument.length; i++) {
      string.push(argument[i]);
    }
    return string.join(' ');
  }

  deleteTask(number){
    let file = this.file;
    let dataInFile = ReadWriteJson.readJson(file);
    for (var i = 0; i < dataInFile.length; i++) {
      if (dataInFile[i].id == number ) {
        console.log(`${dataInFile[i].detail} berhasil dihapus`);
        dataInFile.splice(i,1);
      }
    }
  for (var i = 0; i < dataInFile.length; i++) {
    dataInFile[i].id=i+1;
  }
  //console.log(dataInFile);
    ReadWriteJson.writeJson(file,dataInFile);

  }

  markComplete(number){
    let file = this.file;
    let dataInFile = ReadWriteJson.readJson(file);
    for (var i = 0; i < dataInFile.length; i++) {
      if (dataInFile[i].id == number ) {
        dataInFile[i].mark = true;
        dataInFile[i].doneDate = new Date();
        console.log(`${dataInFile[i]} di tandai selesai`);
      }
    }
    ReadWriteJson.writeJson(file,dataInFile);
  }

  markUnComplete(number){
    let file = this.file;
    let dataInFile = ReadWriteJson.readJson(file);
    for (var i = 0; i < dataInFile.length; i++) {
      if (dataInFile[i].id == number ) {
        dataInFile[i].mark = false;
        dataInFile[i].doneDate = '';
        console.log(`${dataInFile[i]} di tandai belum selesai`);
      }
    }
    ReadWriteJson.writeJson(file,dataInFile);
  }

  addTag(id,tag){
    let file = this.file;
    let tagging=tag||[];
    let index;
    let mark='';
    let dataInFile = ReadWriteJson.readJson(file);
    for (var i = 0; i < dataInFile.length; i++) {
      if (dataInFile[i].id == id) {
        index = i;
      }
    }

    for (var i = 0; i < tagging.length; i++) {
     dataInFile[index].tag.push(tagging[i]);
    }
    if (dataInFile[index].mark) {mark='[x]'}
    else {mark='[ ]'}
    console.log(`${dataInFile[index].id}. ${mark} ${dataInFile[index].detail} ditambahkan tag ${tag}`);
    ReadWriteJson.writeJson(file,dataInFile);
  }

  tagFilter(tag){
    let file = this.file;
    let mark='';
    let taggedObj=[]
    let dataInFile = ReadWriteJson.readJson(file);
    for (var i = 0; i < dataInFile.length; i++) {
      if (this.getTagFilter(tag,dataInFile[i].tag)) {
        taggedObj.push(dataInFile[i]);
      }
    }
    for (var i = 0; i < taggedObj.length; i++) {
      if (taggedObj[i].mark) {
        mark='[x]'
      } else {
        mark='[ ]'
      }
      console.log(`${taggedObj[i].id}. ${mark} ${taggedObj[i].detail}` )
    }
  }

  getTagFilter(tag,taskTag){
    for (var i = 0; i < taskTag.length; i++) {
      if (tag==taskTag[i]) {
        return true;
      }
    }
    return false;
  }

}

//membaca dan menulis JSON
class ReadWriteJson{
//membaca JSON
  static readJson(file){
     let fs = require('fs');
     let data = fs.readFileSync(file);

     if(data.toString()){
       return JSON.parse(data);
     }else{
       return [];
     }
 }

//Menulis JSON
   static writeJson(file,objToWrite){
     let fs = require('fs');
     objToWrite = JSON.stringify(objToWrite);
     fs.writeFileSync(file,objToWrite);
   }

}

//class all about task
class task {
  constructor(taskProp) {
    this.id = taskProp.id;
    this.mark = taskProp.mark||false;
    this.detail = taskProp.detail;
    this.createDate = taskProp.createDate;
    this.doneDate = taskProp.doneDate;
    this.tag = taskProp.tag||[];
  }
}

//console.log(ReadWriteJson.readJson('data.json'));

//let todo = new toDo('data.json');
//todo.addTag(1,['daily','setiap'])
//todo.tagFilter('setiap');
let argv = process.argv;
if (argv.length<3) {
  let todo = new toDo('data.json');
  todo.help();
}else if (argv.length>=3) {
  let todo = new toDo('data.json');
  switch (argv[2].toLocaleLowerCase()) {
    case 'help':
     todo.help();
    break;

    case 'list':
     todo.list();
    break;

    case 'add':
    let detail = todo.getStringFromArgv(argv,3);
    todo.addTask(detail);
    break;

    case 'delete':
    todo.deleteTask(argv[3]);
    break;

    case 'markdone':
    todo.markComplete(argv[3]);
    break;

    case 'markundone':
    todo.markUnComplete(argv[3]);
    break;

    case 'list:outstanding':
    todo.outStanding(argv[3]);
    break;

    case 'list:completed':
    todo.completed(argv[3]);
    break;

    case 'tag':
    let tag = todo.getStringFromArgv(argv,4);
    tag = tag.split(' ');
    todo.addTag(argv[3],tag);
    break;


    default:
    let option = argv[2].split(':');
    if (option[0]=='filter') {
      todo.tagFilter(option[1])
    }
  }
}
