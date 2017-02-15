
class Todo {
	constructor(list_data, argv_content) {
		//this.data = json.readFileSync('data.json')
		this.list_data = list_data
		this.argv_content = argv_content

	}

	Help(argv2) {
		switch(this.list_data[2]) {
			case "help" : 
				console.log("$===================================$")
				console.log("$ node todo.js # will can help")
				console.log("$ node todo.js help")
				console.log("$ node todo.js list")
				console.log("$ node todo.js add <task_content>")
				console.log("$ node todo.js task <task_id>")
				console.log("$ node todo.js delete <task_id>")
				console.log("$ node todo.js complete <task_id>")
				console.log("$ node todo.js uncomplete <task_id>")
				console.log("$ node todo.js list:completed asc | desc - sorting completed todo list")
    			console.log("$ node todo.js list:outstanding asc | desc - sorting unfinish todo list by id")
    			console.log("$ node todo.js list:tags")
				console.log("$ node todo.js filter <task_id> - uncomplete todo list by id")
   	 			console.log("$ node todo.js tag <task_id> <name_tag1> <name_tag2> <name_tag3> - tag activy todo list by id")
				break
			case "list" :
				this.listData()
				break
			case "add" :
				this.addData()
				break
			case "task" : 
				this.task()
				break
			case "delete" :
				this.delete()
				break
			case "complete" :
				this.complete()
				break
			case "uncomplete" :
				this.uncompleted()
				break
			case "list:outstanding" :
				this.outstanding()
				break
			case "list:completed" :
				this.listCompleted()
				break
			case "tag" :
				this.tag()
				break
			case "list:tags" : 
				this.tagList()
				break
			case "filter" :
				this.filter()
				break
		}	
		// console.log(convert(arr))
	}

	listData() {
		console.log("====== Cek list data ======")
		for(let i = 0; i < readDataFile.length; i++) {
			if(readDataFile[i].completed === true) {
				console.log(`${i + 1}. [X] ${readDataFile[i].task}`)
			} else {
				console.log(`${i + 1}. [ ] ${readDataFile[i].task}`)
			}
		}
		
	}

	addData() {
		console.log("====== Add data record ======")
		let addthis = argv.slice(3).join(" ")

		readDataFile.push({
			'id' : readDataFile.length+1,
			'task' : addthis,
			'completed' : false,
			'createDate' : new Date().toLocaleString(),
			'completedDate' : new Date().toLocaleString()
			
		})
		console.log(`${addthis} ditambahkan`)


		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')

	}

	task() {
		if(readDataFile[argv2[1] - 1].completed == true) {
			console.log(`[X] ${readDataFile[argv2[1]-1].id}. ${readDataFile[argv2[1]-1].task} - Completed`)
		} else {
			console.log(`[ ] ${readDataFile[argv2[1] - 1].id}. ${readDataFile[argv2[1]-1].task}`)
		}
		
	}

	delete() {

		delete readDataFile[argv[3] -1]
		readDataFile.splice(argv[3]-1, 1)
		console.log(`Data telah di hapus`)
		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')
	}

	complete() {
		//console.log("Task yang ke - " + this.list_data[3])
		let completed = argv2.slice(1).join(' ')			
		readDataFile[argv2[1] - 1].completed = true
		readDataFile[argv2[1] - 1].completedDate = new Date().toLocaleString()
		console.log(`Task ${completed} Completed!`)	
		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')
	}

	uncompleted() {
		// let uncompleted = argv.slice(1).join(" ")
		let id_uncomplete = Number(argv[3])
			
		readDataFile[argv[3] - 1].completed = false

		console.log(`${readDataFile[argv[3] - 1].task} uncompleted`)
		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')
	}

	// ============
	outstanding() {
		let datasorting = ""
		if(argv[3] == "desc") {
			datasorting = readDataFile.sort(function(a, b) {
				return new Date(b.completedDate) - new Date(a.completedDate)
			})
		} else {
			datasorting = readDataFile.sort(function(a, b) {
				return new Date(a.completedDate) - new Date(b.completedDate)
			})
		}

		for(let i = 0; i < datasorting.length; i++) {
			let status = (datasorting[i].completed)
			if(status == true) {
				console.log(i+1 + ". [X] " + datasorting[i].task + " is completed at " + datasorting[i].completedDate)
			} else {
				console.log(i+1 + ". [ ] " + datasorting[i].task + " is Create at " + datasorting[i].createDate)
			}
			
		}
	}	

	listCompleted() {
		let data_sorting = ""
		let data_result = ""

		if(argv[3] === "desc") {
			console.log("Todo list sort by DESC")
			data_sorting = readDataFile.reverse()
		} else {
			console.log("Todo list sort by ASC")
			data_sorting = readDataFile
		}

		for(let i = 0; i < data_sorting.length; i++) {
			if(data_sorting[i].completed === true) {
				let print = (data_sorting[i].completed) ? "X" : " "
				console.log("Todo list completed  : [" + print + "] " + data_sorting[i].task)
			}
		} 
	}

	tag() {
		readDataFile[argv2[1]-1].tags = argv2.slice(2).join(' ')
	    readDataFile[argv2[1]-1].completedDate = new Date().toLocaleString()
	    fs.writeFileSync('data.json', JSON.stringify (readDataFile, null , 3), 'utf-8')

	}

	tagList() {
		for(let i = 0; i < readDataFile.length; i++) {
		
			console.log(`${i + 1}. ${readDataFile[i].task} -> ${readDataFile[i].tags}`)
		
		}
	}

	filter() {
		let tmp = []
		let cond = argv2[1]

		for(let i = 0; i < readDataFile.length; i++) {
			if(readDataFile[i].tags.indexOf(cond) != -1) {
				tmp.push(readDataFile[i])
			}
		}

		// console.log('========', tmp)
		for(let i = 0; i < tmp.length; i++) {
			if(tmp[i].completed == true) {
				console.log(`[X] ${tmp[i].id}. ${tmp[i].task} ${tmp[i].tags}`)
			} else {
				console.log(`[ ] ${tmp[i].id}. ${tmp[i].task} ${tmp[i].task}`)
			}
		}

 	}

}
const fs = require('fs')
let argv = process.argv
let argv2 = process.argv.slice(2)
let readDataFile = JSON.parse(fs.readFileSync('data.json', 'utf-8'))

let todo_test = new Todo(argv, argv2)

todo_test.Help(argv2)


