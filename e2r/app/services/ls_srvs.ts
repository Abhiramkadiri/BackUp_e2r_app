
export class LocalStorage{

	private static jwtString:string='';
	private static local_json=null;

	static isSetJWT(){
		var val = localStorage.getItem('jwt');
		if(val==null || val==undefined || val=='') return false;
		return true;
	}

	static createJWT(){
		this.local_json = {};
		this.saveJWT();
	}

	static loadJWT(){
		this.jwtString = localStorage.getItem('jwt');
		try{
			this.local_json = JSON.parse(this.jwtString);
		}catch(e){
			console.log('jwt parse error ' + e.message);
		}
	}

	static saveJWT(){
		localStorage.setItem('jwt', JSON.stringify(this.local_json));
	}

	static getValue(itm:string){
		if( this.local_json != null ){
			return this.local_json[itm];
		}else{
			console.log('LocalStorage.getValue('+itm+') is called when local_json is empty');
			return null;
		}
	}

	static setValue(itm:string, val){
		if( this.local_json != null ) {
			this.local_json[itm] = val;	
			this.saveJWT();
		}else{
			console.log('LocalStorage.setValue('+itm+','+val+') is called when local_json is empty');
		};
	}

}