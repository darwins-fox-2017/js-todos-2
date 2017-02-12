
class Todo {
	constructor(list_data, argv_content) {
		//this.data = json.readFileSync('data.json')
		this.list_data = list_data
		this.argv_content = argv_content

	}

	Help(argv_content) {
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
				console.log("$ node todo.js list:filter <task_id> - uncomplete todo list by id")
   	 			console.log("$ node todo.js list:tag - list tag todo list by id")
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
			case "list:tag" :
				this.listTag(argv_content.slice(1))
				break
			case "tag" :
				this.tag(argv_content.slice(1))
				break
			case "filter" :
				this.filter(argv_content.slice(1))
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
			'createDate' : Date(),
			'completedDate' : ""
			
		})
		console.log(`${addthis} ditambah`)


		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')

	}

	task() {
		for(let i = 0; i < readDataFile.length; i++) {
			if(readDataFile[i].id === readDataFile[3].id) {
				console.log(`readDataFile[i].id`)
			}
		}
		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')

	}

	delete() {

		delete readDataFile[argv[3] -1]
		readDataFile.splice(argv[3]-1, 1)
		console.log("Data di hapus")
		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')
	}

	complete() {
		console.log("Task yang ke - " + this.list_data[3])
		let inputan = argv[3]-1 
		let id_complete = Number(argv[3])
		for(let i = 0; i < readDataFile.length; i++) {
			if(readDataFile[i].id === id_complete) {
				readDataFile[i].completed = true
				readDataFile[i].completedDate = Date()
			}
		}

		// readDataFile[argv[3] - 1].completed = true
		// readDataFile[argv[3] - 1].completedDate = Date()
		console.log(`${readDataFile[argv[3]].task} Completed!`)	
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
			let status = (datasorting[i].completed) ? "X" : " "
			console.log(i+1 + ". [" + status + "] " + datasorting[i].task + " is completed at " + datasorting[i].completedDate)
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

	listTag(argv_content) {
		for(let i = 0; i < readDataFile.length; i++) {
			let print = (readDataFile[i].completed) ? "X" : " "
			console.log(readDataFile[i].id + ". [" + print + "] " + readDataFile[i].task + " - Tag Keyword : " + readDataFile[i].tags.join(','))
		}
	}

	tag(argv_content) {
		
		let index = Number(this.argv_content[0])
		let tagMember = this.argv_content.slice(1)
		console.log(tagMember)
		console.log(`Ini data ke ${index} ${readDataFile[index-1].task}`)

		for(let i = 0; i < tagMember.length; i++) {
			console.log("Tag member ke " + i + " " + tagMember[i])
			readDataFile[index-1].tags.push(tagMember[i])
		}
		fs.writeFileSync('data.json', JSON.stringify(readDataFile, false, 3), 'utf-8')

	}

	filter(argv_content) {
		for(let i = 0; i < readDataFile.length; i++) {
			for(let j = 0; j < readDataFile[i].tags.length; j++) {
				if(readDataFile[i].tags[j].toLowerCase() == argv_content[j]) {
					console.log(`[ ${readDataFile[i].completed == true ? "X" : " "}] ${readDataFile[i].task}`)
				}	
			}
			
		}
	}


}
const fs = require('fs')

let readDataFile = JSON.parse(fs.readFileSync('data.json', 'utf-8'))
let argv = process.argv
let argv_content = argv.slice(2)
let todo_test = new Todo(argv, argv_content)

todo_test.Help(argv_content)


