class listToDo {
  constructor(comment) {
    this.comment = comment
    this.data = jsonfile.readFileSync('data.json')
  }

  execute(){
    // console.log(this.comment[0].match(/filter:/ig).join('').trim());
    switch (this.comment[0]) {
      case "help":

        this.help();
        break;

      case "list":

        this.list();
        break;

      case "add":

        this.add(this.comment.slice(1).join(' '))
        break;

      case "task":

        this.task(this.comment.slice(1).join(''));
        break;

      case "delete":

        this.deleteData(this.comment.slice(1).join(''));
        break;

      case "complete":

        this.completeTask(this.comment.slice(1).join(''));
        break;

      case "uncomplete":

        this.uncompleteTask(this.comment.slice(1).join(''));
        break;

      case "list:completed":

        this.completed(this.comment.slice(1).join(''));
        break;

      case "list:outstanding":

        this.outstanding(this.comment.slice(1).join(''));
        break;

      case "tag":

        this.addTag(this.comment.slice(1));
        break;

      case "filter:" :

        this.filterTags(this.comment.slice(1).join(''));
        break;
      default:
        console.log("command is not found see help!");
        this.help();
    }
  }

  help(){
    console.log(`==================================`);
    console.log(`Help Menu`);
    console.log(`==================================`);
    console.log(`$ node todo.js help`);
    console.log(`$ node todo.js list`);
    console.log(`$ node todo.js add <task_content>`);
    console.log(`$ node todo.js delete <task_id>`);
    console.log(`$ node todo.js task <task_id>`);
    console.log(`$ node todo.js complete <task_id>`);
    console.log(`$ node todo.js delete <task_id>`);
    console.log(`$ node todo.js uncomplete <task_id>`);

    console.log(`$ node todo.js list:outstanding asc|desc <default: asc>`);
    console.log(`$ node todo.js list:completed asc|desc <default: asc>`);
    console.log(`$ node todo.js tag <task_id> <tag_name_1> <tag_name_2> ... <tag_name_n>`);
    console.log(`$ node todo.js filter: <tag_name>`);
    console.log(`===================================`);
  }

  list(data = this.data){
    for(let i=0; i<data.length; i++){
      console.log(`${data[i].id}. ${data[i].status?'[x]':'[ ]'} ${data[i].task}`);
      console.log(`Created : ${new Date(data[i].createdAt).toLocaleString()}\nUpdated : ${new Date(data[i].updatedAt).toLocaleString()}`);
      console.log('===============================================================');
    }
  }

  add(task){
    if(task) {
      this.data.push({
        "id"     : this.data.length + 1,
        "task"   : task,
        "status" : false,
        "createdAt" : new Date().toISOString(),
        "updatedAt" : new Date().toISOString(),
        "tags" :[]
      })
      this.save()
      console.log("data has been added");
    }else{
      console.log("nothing to be added");
    }

  }

  task(id){
    let i = 0
    let flag = true
    while (flag) {
      if(id<=this.data.length){
        if(id == this.data[i].id){
          console.log(`${this.data[i].id}. ${this.data[i].status?'[x]':'[ ]'} ${this.data[i].task}`);
          flag = false
        }else{
          i++
        }
      }else{
        console.log('data is not found, see help!');
        flag = false
      }
    }
  }

  deleteData(id){
    let i = 0
    let flag = true
    while (flag) {
      if(id<=this.data.length){
        if(id == this.data[i].id){
          this.data.splice(i,1)
          console.log('data has been removed!');
          for (let j=id-1; j <this.data.length; j++) {
            this.data[j].id--
          }
          flag = false
        }
        else{
          i++
        }
      }else{
        console.log('data is not found, see help!');
        flag = false
      }
    }
    this.save()
  }

  completeTask(id){
    let i = 0
    let flag = true
    while (flag) {
      if(id<=this.data.length){
        if(id == this.data[i].id){
          this.data[i].status = true
          this.data[i].updatedAt = new Date().toISOString()
          console.log('data has been sucsessfully updated!');
          flag = false
        }
        else{
          i++
        }
      }else{
        console.log('data is not found, see help!');
        flag = false
      }
    }
    this.save()
    this.list()
  }

  uncompleteTask(id){
    let i = 0
    let flag = true
    while (flag) {
      if(id<=this.data.length){
        if(id == this.data[i].id){
          this.data[i].status = false
          this.data[i].updatedAt = new Date().toISOString()
          console.log('data has been sucsessfully updated!');
          flag = false
        }
        else{
          i++
        }
      }else{
        console.log('data is not found, see help!');
        flag = false
      }
    }
    this.save()
    this.list()
  }

  completed(sort){// Asc or Desc, default: asc
    let dataSortByDate = this.data.sort(function(a,b){
      return new Date(a.updatedAt) - new Date(b.updatedAt)
    })
    let lengthSort = dataSortByDate.length
    for (let i=0; i < lengthSort; i++) {
      if(!dataSortByDate[i].status){
        dataSortByDate.splice(i,1)
        i--
      }
    }

    switch (sort) {// default asc
      case 'desc':
        this.list(dataSortByDate.reverse())
        break;
      default:
        this.list(dataSortByDate)
    }
  }

  outstanding(sort){// Asc or Desc, default: asc
    let dataSortByDate = this.data.sort(function(a,b){
      return new Date(a.updatedAt) - new Date(b.updatedAt)
    })

    for (let i=0; i < dataSortByDate.length; i++) {
      if(dataSortByDate[i].status){
        dataSortByDate.splice(i,1)
      }
    }

    switch (sort) {// default asc
      case 'desc':
        this.list(dataSortByDate.reverse())
        break;
      default:
        this.list(dataSortByDate)
    }
  }

  addTag(arrIdTags){
    let id = arrIdTags[0]
    let newTags = arrIdTags.slice(1)
    let i = 0
    let flag = true

    while (flag) {
      if(id<=this.data.length){
        if(id == this.data[i].id){
          for (let j=0; j<newTags.length; j++) {
            if(!this.data[i].tags.includes(newTags[j])){
              this.data[i].tags.push(newTags[j])
            }
          }
          console.log(`Tagged task ${this.data[i].task} with tags: ${this.data[i].tags}`);
          this.data[i].updatedAt = new Date().toISOString()
          flag = false
        }
        else{
          i++
        }
      }else{
        console.log('data is not found, see help!');
        flag = false
      }
    }
    this.save()
  }

  filterTags(arr){
    let tag = arr
    let dataSortByDate = this.data.sort(function(a,b){
      return new Date(a.updatedAt) - new Date(b.updatedAt)
    })

    for(let i=0; i<dataSortByDate.length; i++){
      if(dataSortByDate[i].tags.includes(tag)){
        console.log(`${dataSortByDate[i].id} ${dataSortByDate[i].task} [${dataSortByDate[i].tags}]`);
      }
    }
  }

  save(){
    jsonfile.writeFileSync("data.json",this.data,{spaces: 2})
  }

}

let jsonfile = require ('jsonfile')
let argv = process.argv
let list = new listToDo(argv.slice(2))

list.execute()
// list.sort([1,4,3,2,6,9,0,1,4,8,9])
