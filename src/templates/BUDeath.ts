//Includes
import { BUTemplate } from './BUTemplate'

export class BUDeath extends BUTemplate{
	
	collection: string
	
	location: { x: number, y: number, z?: number }
	
	constructor(location: { x: number, y: number, z?: number }, collection?: string) {
		super()
		this.location = location
		this.collection = collection
	}
	
	upload(){
		
		//Add optional fields
		if (this.location !== undefined){ this.push('location', this.location) }
		
		super.upload(this.collection || 'Deaths')
	}
}
