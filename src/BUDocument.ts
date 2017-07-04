//Includes
import { Json } from './'

export class BUDocument{
	
	contents: Json
	
	constructor(contents?: Json){
		this.contents = contents === undefined ? {} : contents
	}
	
	push(key: string, value: any){
		this.contents[key] = value
	}
	
	concat(contents: Json){
		Object.keys(contents).forEach(key => {
			this.contents[key] = contents[key]
		})
	}
}