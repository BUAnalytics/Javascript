//Modules
import * as popsicle from 'popsicle'

//Includes
import { BUError } from './BUError'
import { BUAccessKey } from './BUAccessKey'
import { Json } from './'

export enum BUMethod{
	GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
}

export class BUAPI{
	
	url = 'https://bu-games.bmth.ac.uk'
	path = '/api/v1'
	auth: BUAccessKey
	
	//URL prefix for HTTP requests
	get hostPrefix(){
		return (this.url || '') + (this.path || '')
	}
	
	//Singleton
	
	private static _instance: BUAPI
	public static get instance(){ return this._instance || (this._instance = new this()) }
	private constructor(){}
	
	//! Request Methods
	
	//Convenience methods for url and path appended requests
	public requestPath(path: string, method: BUMethod, body?: Json, error?: (error: BUError) => void, success?: (response: Json) => void){
		return this.makeRequestWrap(this.hostPrefix + path, method, body, error, success)
	}
	
	//Convenience methods for url appended requests
	public requestUrl(url: string, method: BUMethod, body?: Json, error?: (error: BUError) => void, success?: (response: Json) => void){
		return this.makeRequestWrap(this.url + url, method, body, error, success)
	}
	
	//Wrap generic request in a promise if closers were not specified
	private makeRequestWrap(url: string, method: BUMethod, body: Json, error?: (error: BUError) => void, success?: (response: Json) => void){
		if (error !== undefined || success !== undefined){
			this.makeRequest(url, method, body, error, success)
		}else{
			
			//Create and return promise
			return new Promise<Json>(resolve => {
				this.makeRequest(url, method, body, error => {
					throw error
				}, respose => {
					resolve(respose)
				})
			})
		}
	}
	
	//Make a generic request to the backend server url, response is sent to error and success closures
	private makeRequest(url: string, method: BUMethod, body: Json, error?: (error: BUError) => void, success?: (response: Json) => void){
		
		//Create request object
		const request = {
			method: BUMethod[method],
			url, body,
			headers: { 'Content-Type': 'application/json; charset=utf-8' }
		}
		
		//Authenticate request with access key and secret
		if (this.auth !== undefined){
			request.headers['AuthAccessKey'] = this.auth.key
			request.headers['AuthAccessSecret'] = this.auth.secret
		}
		
		//Execute http request
		popsicle.request(request)
			.then(response => {
				
				//Check whether response contains error message
				if (response.hasOwnProperty('error') && error !== undefined){
					const code = BUError[BUError[response.error]]
					if (typeof code !== undefined){
						error(code)
					}else{
						error(BUError.Unknown)
					}
					return
				}
				
				//Return the successful json object
				if (success !== undefined){
					success(JSON.parse(response.body))
				}				
			})
			.catch(err => {
				
				//Check error code
				if (error !== undefined){
					if (err.code === 'EUNAVAILABLE'){
						error(BUError.NotFound)
					}else if (err.code === 'ESTRINGIFY' || err.code === 'EPARSE'){
						error(BUError.Json)
					}else{
						error(BUError.Server)
					}
				}
			})
	}
}