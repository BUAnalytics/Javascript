//Includes
import { Timestamp } from '../'
import { BUTemplate } from './BUTemplate'

export class BUQuestion extends BUTemplate{
	
	collection: string
	
	started = Timestamp()
	ended: number
	
	name: string
	question: string
	answer: string
	correct: boolean
	
	constructor(name: string, collection?: string) {
		super()
		this.name = name
		this.collection = collection
	}
	
	ask(question: string){
		this.question = question
		this.started = Timestamp()
	}
	
	respond(answer: string, correct: boolean){
		this.answer = answer
		this.correct = correct
		this.ended = Timestamp()
	}
	
	start(){
		this.started = Timestamp()
	}
	
	end(){
		this.ended = Timestamp()
	}
	
	upload(){
		
		//Add required fields
		this.concat({
			'started': this.started,
			'ended': this.ended || Timestamp(),
			'length': (this.ended || Timestamp()) - this.started
		})
		
		//Add optional fields
		if (this.name !== undefined){ this.push('name', this.name) }
		if (this.question !== undefined){ this.push('question', this.question) }
		if (this.answer !== undefined){ this.push('answer', this.answer) }
		if (this.correct !== undefined){ this.push('correct', this.correct) }
		
		super.upload(this.collection || 'Questions')
	}
}