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
}