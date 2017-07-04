//Includes
import { BUDocument } from '../BUDocument'
import { BUID } from '../BUID'
import { BUCollectionManager } from '../BUCollectionManager'

export enum BUUserGender{
	Male, Female
}

export class BUUser extends BUDocument{
	
	collection: string
	
	static current: BUUser
	
	userId = BUID.instance.generate()
	
	username: string
	name: string
	firstName: string
	lastName: string
	email: string
	phone: string
	age: number
	gender: BUUserGender
	
	constructor(collection?: string) {
		super()
		this.collection = collection
	}
	
	upload(){
		
		//Add required fields
		this.push('userId', this.userId)
		
		//Add optional fields
		if (this.username !== undefined){ this.push('username', this.username) }
		if (this.name !== undefined){ this.push('name', this.name) }
		if (this.firstName !== undefined){ this.push('first_name', this.firstName) }
		if (this.lastName !== undefined){ this.push('last_name', this.lastName) }
		if (this.email !== undefined){ this.push('email', this.email) }
		if (this.phone !== undefined){ this.push('phone', this.phone) }
		if (this.age !== undefined){ this.push('age', this.age) }
		if (this.gender !== undefined){ this.push('gender', this.gender) }
		
		//Add to collection manager
		BUCollectionManager.instance.push(this.collection || 'Users', this)
		
		//Remove current if self
		if (BUUser.current === this){
			BUUser.current = undefined
		}
	}
}