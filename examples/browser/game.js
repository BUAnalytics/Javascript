var stage
var button = new createjs.Shape()

var clicksRemaining
var startTime
var delayTime
var target
var attempts
var sessionStart

var play = function(){
	
	//Reset variables
	clicksRemaining = 5
	startTime = 0
	delayTime = 0
	target = { x: 0, y: 0 }
	attempts = []
	sessionStart = +new Date()
	
	//Set session start
    sessionStart = +new Date()
    
    //Generate unique session identifier
    sessionId = BU.ID.instance.generate()
    
    delayButton()
}

var game = function(){
	
	//Create canvas
	stage = new createjs.Stage('canvas')
	
	//Create background
	var shape = new createjs.Shape()
	shape.graphics.beginFill('#e5e5e5').drawRect(0, 0, 800, 600)
	stage.addChild(shape)
	shape.on('click', function(ev){
		attempts.push({ x: parseFloat(ev.stageX.toFixed(6)), y: parseFloat(ev.stageY.toFixed(6)) })
	})
	
	//Create button
	stage.addChild(button)
	stage.update()
	button.on('click', function(ev){
		clicksRemaining -= 1
        
        //Calculate speed and accuracy data
        var accuracy = { x: parseFloat(Math.abs(target.x + 100 - ev.stageX).toFixed(6)), y: parseFloat(Math.abs(target.y + 100 - ev.stageY).toFixed(6)) }
        var clickTime = ((+new Date()) - startTime) / 1000
        
        //Create new click and add it to list
        var clickDoc = new BU.Document({
            sessionId: sessionId,
            userId: userId,
            clickTime: clickTime,
            delayTime: delayTime,
            accuracy: accuracy,
            target: target,
            attempts: attempts
        })
        
        //Add click to collection
        BU.CollectionManager.instance.collections['Clicks'].push(clickDoc)
        
        delayButton()
	})
}

var delayButton = function(){
	
	//No more clicks remaining
    if (clicksRemaining <= 0){
        
        //Create new session in collection
        var sessionDoc = new BU.Document({
            sessionId: sessionId,
            userId: userId,
            start: sessionStart,
            end: +new Date()
        })
        
        //Add documents to collections
        BU.CollectionManager.instance.collections['Sessions'].push(sessionDoc)
        
        //Make sure collections are uploaded incase of closure
        BU.CollectionManager.instance.uploadAll()
        
		//Reset menu
        $('#start').text('Play!')
		$('#name').val('')
		$('#age').val('')
		$('#gender').val(0)
		
        //Return to menu
        $('#menu').show()
		$('#canvas').hide()
		
        return
    }
    
    //Reset all previous attempts
    attempts = []
    
    //Hide button from screen
    button.graphics.clear().beginFill('green').drawRect(-200, -200, 200, 200)
    stage.update()
         
    //Calculate random delay and wait
    delayTime = randomDoubleBetween(0.5, 4)
    setTimeout(function(){
	    showButton()
	}, delayTime * 1000)
}

var showButton = function(){
	startTime = +new Date()
	
    //Show button in random position on screen
    target.x = randomDoubleBetween(0, 800 - 200)
    target.y = randomDoubleBetween(0, 600 - 200)
    
    //Draw new button to screen
    button.graphics.clear()
    	.beginFill('green').drawRect(target.x, target.y, 200, 200)
    	.beginFill('transparent').beginStroke('black').drawCircle(target.x + 100, target.y + 100, 4)
    stage.update()
}