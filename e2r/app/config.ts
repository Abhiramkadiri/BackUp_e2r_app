import {LocalStorage} from "./services/ls_srvs"

export class CONFIG {

	//Local properties
	private static _deviceId:string="";
	static searchFilter={};
	private static _url:string = "http://ec2-52-10-22-178.us-west-2.compute.amazonaws.com/services/_api/";
	private _loggedIn:boolean = false;

	public static _NAV:any;

	public static USER_EMPLOYEE:number=1;
	public static USER_EMPLOYER:number=2;

	public static isEmployer:boolean;
	
	public static search_fileter_result:any=[];
	public static employee_filter:any={}
	//public static propterties
	static get SERVICE_URL():string{
		 if(location.hostname==undefined || location.hostname=='' || location.hostname==null){
		 	this._url= "http://52.10.22.178/services/_api/";
		 }
		return this._url;
	}

	static get deviceId(){
		return this._deviceId;
	} 

	static set deviceId(id:string){
		this._deviceId = id;
	}

	static set loggedIn(status:boolean){
		LocalStorage.setValue('loggedIn', status);
	}

	static get loggedIn():boolean{
		return LocalStorage.getValue('loggedIn')=='true';
	}	
}