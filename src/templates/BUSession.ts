//Includes
import { Timestamp } from '../'
import { BUDocument } from '../BUDocument'
import { BUID } from '../BUID'
import { BUCollectionManager } from '../BUCollectionManager'
import { BUUser } from './BUUser'

export class BUSession extends BUDocument{
	
	collection: string
	
	static current: BUSession
	
	sessionId = BUID.instance.generate()
	userId = BUUser.current !== undefined ? BUUser.current.userId : undefined
	
	started = Timestamp()
	ended: number
	
	ip: string
	device: string
	system: string
	version: string
	
	constructor(collection?: string) {
		super()
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
			'sessionId': this.sessionId,
			'started': this.started,
			'ended': this.ended || Timestamp(),
			'length': (this.ended || Timestamp()) - this.started
		})
		
		//Add optional fields
		if (this.userId !== undefined){ this.push('userId', this.userId) }
		if (this.ip !== undefined){ this.push('ip', this.ip) }
		if (this.device !== undefined){ this.push('device', this.device) }
		if (this.system !== undefined){ this.push('system', this.system) }
		if (this.version !== undefined){ this.push('version', this.version) }
		
		//Add to collection manager
		BUCollectionManager.instance.push(this.collection || 'Sessions', this)
		
		//Remove current if self
		if (BUSession.current === this){
			BUSession.current = undefined
		}
	}
}