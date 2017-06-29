//Includes
import { BUAPI, BUMethod } from './BUAPI'

export class BUID {
    
    timer: any
    
    //Singleton
    
    private static _instance: BUID
	public static get instance(){ return this._instance || (this._instance = new this()) }
	private constructor(){}
	
    //Store identifiers
    private identifiers: string[] = []
    
    //Upload timer interval
    interval = 2000
    size = 100

    //Return first id in cache list and remove
    generate(){
    
        //Check whether identifiers are depleted
        if (this.identifiers.length <= 0){
        
            //Log error
            console.log('[BUAnalytics] Identifier cache has been depleted, please adjust your BUID cache size or interval')
        
            //Generate backup identifier
            return this.UUID()
        }
    
        //Grab identifier and remove from cache
        return this.identifiers.shift()
    }
    
    //Start caching identifiers
    start(size = 100){
        this.size = size
        this.refreshPerform()
    }
    
    //Push documents in all collections to backend server
    private refreshPerform(timer?: any){
        
        //Only refresh if identifier cache is a quarter empty
        if (this.identifiers.length < ((this.size / 4) * 3)){
            this.refresh()
        }
        
        //Create timer to push all collections every x seconds
        if (this.interval > 0){
	        setInterval(() => {
		        this.refreshPerform()
	        }, this.interval)
        }
    }
    refresh(){
        
        //Upload data to server using api request
        const count = this.size - this.identifiers.length
        BUAPI.instance.requestPath('/projects/collections/documents/ids/' + count, BUMethod.GET, {}, (code) => {
            
            //Log error code
            console.log('[BUAnalytics] Failed to refresh ' + count + ' identifiers from server with error code ' + code)
            
        }, (response) => {
            
            //Cast and add identifiers from response
            this.identifiers = this.identifiers.concat(response.ids)
        })
    }
    
    //Generate bacup random identifier
	UUID(){
		let d = new Date().getTime()
		if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
			d += performance.now()
		}
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			let r = (d + Math.random() * 16) % 16 | 0
			d = Math.floor(d / 16)
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
		})
	}
}
