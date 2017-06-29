//Modules
const prompt = require('prompt')
const os = require('os')

//Library
const { ID, API, AccessKey, CollectionManager, Document } = require('../../dist/module.js')

//Set backend api url and authentication details
API.instance.auth = new AccessKey('5950ce44326970000ca959be', 'de35d3ec10d97667a1fa1d32b07133e3908923d4bd8c7258e384b5e5dfb91ec0')
//API.instance.url = 'https://192.168.0.69' //Defaults to https://bu-games.bmth.ac.uk

//Start loading a cache of 200 unique identifiers from backend
ID.instance.start(200)

//Create collections with names
CollectionManager.instance.create([ 'Users', 'Sessions', 'Clicks' ])

//Subscribe to collection errors
CollectionManager.instance.error = (collection, code) => {
    console.log('[BUAnalytics][' + collection.name + '] Failed to upload with error code ' + code)
}

//Subscribe to collection uploads
CollectionManager.instance.success = (collection, count) => {
    console.log('[BUAnalytics][' + collection.name + '] Successfully uploaded ' + count + ' documents')
}

//Configure collection upload interval
CollectionManager.instance.interval = 4000
ID.instance.interval = 4000

//Start prompt and ask questions
prompt.start()
const ask = function(){
	prompt.get([{
		name: 'name',
		description: 'Please enter your name'
	}, {
		name: 'age',
		description: 'Please enter your age'
	}, {
		name: 'gender',
		description: 'Please enter your gender (M or F)'
	}], function (err, result) {
	
		//Check the name field as been filled
		if (result.name.length <= 0){
			console.log('Please enter a valid name')
			ask()
			return
		}
	
		//Check age field has been filled and is numeric
		if (isNaN(result.age)){
			console.log('Please enter a valid age')
			ask()
			return
		}
		
		//Check the name field as been filled
		const gender = result.gender.trim().toLowerCase()
		if (gender !== 'm' && gender !== 'f'){
			console.log('Please enter a valid gender')
			ask()
			return
		}
	
		//Create new user in collection
		var userDoc = new Document({
			userId: ID.instance.generate(),
			name: result.name,
			age: parseInt(result.age),
			gender: gender === 'm' ? 0 : 1,
			device: {
				type: 'Node',
				name: os.hostname(),
				model: os.type() + ' ' + os.release()
			}
		})
		
		//Add documents to collections
	    CollectionManager.instance.collections['Users'].push(userDoc)
	    
	    console.log('Thanks!')
	    
	    ask()
	})
}
ask()