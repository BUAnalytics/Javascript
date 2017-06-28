var menu = function(){
	
	//Set backend api url and authentication details
    BG.API.instance.auth = new BG.AccessKey('5950ce44326970000ca959be', 'de35d3ec10d97667a1fa1d32b07133e3908923d4bd8c7258e384b5e5dfb91ec0')
    //BG.API.instance.url = 'https://192.168.0.69' //Defaults to https://bu-games.bmth.ac.uk
	
	//Create collections with names
	BG.CollectionManager.instance.create([ 'Users', 'Sessions', 'Clicks' ])
	
	//Subscribe to collection errors
    BG.CollectionManager.instance.error = (collection, code) => {
        console.log('[BUAnalytics][' + collection.name + '] Failed to upload with error code ' + code)
    }
    
    //Subscribe to collection uploads
    BG.CollectionManager.instance.success = (collection, count) => {
        console.log('[BUAnalytics][' + collection.name + '] Successfully uploaded ' + count + ' documents')
    }
    
    //Configure collection upload interval
    BG.CollectionManager.instance.interval = 4000

	//Wait for game to start
	$('#start').click(function(){
		start()
	})
}

var start = function(){

	//Check if countdown begun
	if ($('#start').text() !== 'Play!'){
		return
	}
	
	//Check the name field as been filled
	if ($('#name').val().length <= 0){
		alert('Please enter a valid name')
		return
	}
	
	//Check age field has been filled and is numeric
	if (isNaN($('#age').val())){
		alert('Check age field has been filled and is numeric')
		return
	}
	
	//Check the name field as been filled
	if ($('#gender').val().length <= 0){
		alert('Please select a gender')
		return
	}
	
	//Generate user id hash from two unique bits of information
	const userId = MD5($('#name').val() + $('#gender').val())
	
	//Create new user in collection
	var userDoc = new BG.Document({
		userId: userId,
		name: $('#name').val(),
		age: parseInt($('#age').val()),
		gender: $('#gender').val(),
		device: {
			type: 'Website',
			model: navigator.userAgent
		}
	})
	
	//Add documents to collections
    BG.CollectionManager.instance.collections['Users'].push(userDoc)
	
	//Start countdown
	$('#start').text('3')
	setTimeout(() => {
		$('#start').text('2')
		setTimeout(() => {
			$('#start').text('1')
			setTimeout(() => {
				
				//Hide menu and show canvas
				$('#menu').hide()
				$('#canvas').show()
				
				play()
				
			}, 1000)
		}, 1000)
	}, 1000)
}