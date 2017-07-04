//Includes
import { BUTemplate } from './BUTemplate'

export class BUScore extends BUTemplate{
	
	collection: string
	
	value: number
	highest: boolean

	constructor(value: number, collection?: string) {
		super()
		this.value = value
		this.collection = collection
	}
	
	pload(){
		
		//Add optional fields
		if (this.value !== undefined){ this.push('value', this.value) }
		if (this.highest !== undefined){ this.push('highest', this.highest) }
		
		super.upload(this.collection || 'Scores')
	}
}
