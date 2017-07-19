//Includes
import { BUError } from './BUError'
import { BUCollection } from './BUCollection'
import { BUDocument } from './BUDocument'

export class BUCollectionManager {
    
    timer: any
    
    //Singleton
    
    private static _instance: BUCollectionManager
	public static get instance(){ return this._instance || (this._instance = new this()) }
	private constructor(){ this.uploadAllPerform() }
	    
    //Store collections
    collections: { [key: string]: BUCollection } = {}
    
    //Upload timer interval
    interval = 2000.0

    //Events
    error: (collection: BUCollection, error: BUError) => void
    success: (collection: BUCollection, uploaded: number) => void
    
    //Create collections from array of name
    create(names: string[]){
        for (const name of names){
            
            //Check name doesn't exists in collections
            if (Object.keys(this.collections).includes(name)){
	            continue
            }
            
            //Create new collection if name doesnt exist
            this.collections[name] = new BUCollection(name)
        }
    }
    
    //Convenience method for adding a document to a collection and creating the collection if non-existant
    push(collection: string, document: BUDocument){
        
        //Check whether document exists and create
        if (!Object.keys(this.collections).includes(name)){
            this.collections[collection] = new BUCollection(collection)
        }
        
        //Add document to collection
        this.collections[collection].push(document)
    }
    
    //Push documents in all collections to backend server
    private uploadAllPerform(timer?: any){
        this.uploadAll()
        
        //Create timer to push all collections every x seconds
        if (this.interval > 0){
	        setTimeout(() => {
		        this.uploadAllPerform()
	        }, this.interval)
        }
    }
    uploadAll(){
        
        //Push all collections
        Object.keys(this.collections).forEach(key => {
	        const collection = this.collections[key]
            collection.upload((code: BUError) => {
                
                //Notify error
                if (this.error !== undefined){
                    this.error(collection, code)
                }
                
            }, (count: number) => {
                
                //Notify success
                if (this.success !== undefined){
                    this.success(collection, count)
                }
            })
        })
    }
}
