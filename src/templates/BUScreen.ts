//Includes
import { Timestamp } from '../'
import { BUTemplate } from './BUTemplate'

export class BUScreen extends BUTemplate{
	
	collection: string
	
	started = Timestamp()
	ended: number
	
	name: string
	
	constructor(name: string, collection?: string) {
		super()
		this.name = name
		this.collection = collection
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
		
		super.upload(this.collection || 'Screens')
	}
}
