//Includes
import { BUDocument } from '../BUDocument'
import { BUCollectionManager } from '../BUCollectionManager'
import { BUUser } from './BUUser'
import { BUSession } from './BUSession'

export class BUTemplate extends BUDocument{
	
	userId: string = BUUser.current !== undefined ? BUUser.current.userId : undefined
	sessionId: string = BUSession.current !== undefined ? BUSession.current.sessionId : undefined
	
	upload(collection: string){
		
		//Add optional linking fields
		if (this.userId !== undefined){ this.push('userId', this.userId) }
		if (this.sessionId !== undefined){ this.push('sessionId', this.sessionId) }
		
		//Add to collection manager
		BUCollectionManager.instance.push(collection, this)
	}
}
