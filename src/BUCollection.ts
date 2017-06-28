//Includes
import { Json } from './'
import { BUError } from './BUError'
import { BUAPI, BUMethod } from './BUAPI'
import { BUDocument } from './BUDocument'

export class BUCollection{
	
	name: string
	
	constructor(name: string){
		this.name = name
	}
	
	//Document properties, sending data is moved from documents to buffer
	private documents: BUDocument[] = []
	private buffer: BUDocument[] = []
	
	//Check whether any documents exist and if any are being uploaded
	get isUploading(){ return this.buffer.length > 0 }
	get isEmpty(){ return this.documents.length <= 0 }
	
	//Add single or multiple documents to collection
	push(document: BUDocument | BUDocument[]){
		if (this.documents instanceof Array){
			this.documents = this.documents.concat(document)
		}else{
			(this.documents as any).push(document)
		}
	}
	
	//Upload pending documents to backend server
	upload(error?: (error: BUError) => void, success?: (count: number) => void){
		if (error !== undefined || success !== undefined){
			this.makeUpload(error, success)
		}else{
			
			//Create and return promise
			return new Promise<Number>(resolve => {
				this.makeUpload(error => {
					throw error
				}, count => {
					resolve(count)
				})
			})
		}
	}
	private makeUpload(error?: (error: BUError) => void, success?: (count: number) => void){
		
		//Make sure there are documents available and is not already uploading
		if (this.isUploading || this.isEmpty){
			return
		}
		
		//Move documents to buffer
		this.buffer = this.buffer.concat(this.documents)
		this.documents = []
		
		//Convert documents to objects list
		const objects: Json[] = []
		for (const document of this.buffer){
			objects.push(document.contents)
		}
		
		//Upload data to server using api request
		const body = { 'documents': objects }
		BUAPI.instance.requestPath('/projects/collections/' + this.name + '/documents', BUMethod.POST, body, (code: BUError) => {

			//Log error code
			console.log('[BUAnalytics][' + this.name + '] Failed to push ' + this.buffer.length + ' documents to server with error code ' + code)
			
			//Move buffer back to documents list
			this.documents = this.documents.concat(this.buffer)
			this.buffer = []
			
			//Notify error
			if (error !== undefined){
				error(code)
			}
			
		}, (response: Json) => {
			
			//Notify success
			if (success !== undefined){
				success(this.buffer.length)
			}
			
			//Remove buffer contents
			this.buffer = []
		})
	}
}