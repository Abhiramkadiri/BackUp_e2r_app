import {CONFIG} from '../config';
import {Loading, Alert, NavController} from 'ionic-angular';
import {LocalStorage} from '../services/ls_srvs';
import {LoginPage} from '../pages/login/login';
import {File,Transfer} from 'ionic-native';
declare var cordova: any;
export class KLST {

	public static monthfull = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	public static monthsort = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

	public static loader:any;
	public static option_window:any;
	public static alert_window:any;

	public static setUserProfilePicture(file_url,type,callBack){
		let storage_variable={profile:"profile_image_version",team:"team_image_version",ceo:"ceo_image_version"}
		// if(callBack!=undefined) callBack({image_url:file_url});
		let fs:string = cordova.file.dataDirectory;
		File.checkDir(fs, 'user_data')
		.then((data)=>{
			let fileTransfer = new Transfer();
			let utl_values=file_url.split("/");
			utl_values=utl_values[utl_values.length-1].split("?r=");
			let file_name=utl_values[0];
			let version_value=(utl_values.length >1) ? utl_values[1] : "";
			let target_file=fs+"/user_data/"+file_name;
			if(LocalStorage.getValue(storage_variable[type])!=version_value){
				LocalStorage.setValue(storage_variable[type],version_value);
				fileTransfer.download(file_url,target_file)
				.then((data)=>{
					if(callBack!=undefined) callBack({image_url:target_file+"?r=" + (new Date()).getTime()});
				})
				.catch((error)=>{
					if(callBack!=undefined) callBack({image_url:''});
				})
			}else{
				if(callBack!=undefined) callBack({image_url:target_file+"?r=" + (new Date()).getTime()});
			}
		})
		.catch((err) =>{
			File.createDir(fs, "user_data", true);
			let fileTransfer = new Transfer();
			let utl_values=file_url.split("/");
			utl_values=utl_values[utl_values.length-1].split("?r=")[0];
			let file_name=utl_values[0];
			let version_value=(utl_values.length >1) ? utl_values[1] : "";
			let target_file=fs+"/user_data/"+file_name;
			LocalStorage.setValue(storage_variable[type],version_value);
			fileTransfer.download(file_url,target_file)
			.then((data)=>{
				if(callBack!=undefined) callBack({image_url:target_file+"?r=" + (new Date()).getTime()});
			})
			.catch((error)=>{
				if(callBack!=undefined) callBack({image_url:''});
			})
		});
	}

	public static dateFormat(date_string,format_string):string{	
		let cdate:Date=new Date(date_string);
		let dd:number=cdate.getDate();
		let dd_str=(dd < 10) ? "0"+dd : dd;
		let mm:number=cdate.getMonth()+1;
		let mm_str=((mm+1) < 10) ? "0"+mm : mm;
		let yy=cdate.getFullYear();	
		let df=null;
		switch (format_string){
			case "dd-mmm-yyyy":
				df=dd_str+"-"+ this.monthsort[cdate.getMonth()]+"-"+yy;
			break;
			case "dd-MMM-yyyy":
				df=dd_str+"-"+ this.monthfull[cdate.getMonth()]+"-"+yy;
			break;		
			case "dd-mm-yyyy":
				df=dd_str+"-"+ mm_str +"-"+yy;
			break;
			case "DD MMM YYYY":
				df=this.monthfull[cdate.getMonth()]+" "+dd_str+" "+yy;
			break;					
		}
		return df;
	}

	public static isEmail(email):boolean{
		var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		return re.test(email);	
	}

	public static dateDifference(from_date, to_date, format_string):string{	
		let out_data="";
	    let seconds=Math.abs(to_date - from_date) / 1000;
	    let minutes = Math.floor(seconds/60);
	    let hours = Math.floor(minutes/60);
	    let days = Math.floor(hours/24);
	    let weeks = Math.floor(days/7);
	    let month = Math.floor(days/30);
	    let year = Math.floor(month/12);
		let year_string="Years";
		let month_string="months";
	    switch (format_string){
	        case "YM":
	            //if(month>11){
	                month = month % 12;
					if(year==0 || year==1) year_string="Year";
					if(month==0 || month==1) month_string="month";
	                out_data=year+" Year "+ month+" "+month_string;
	            /*}else{
					if(month==0 || month==1) month_string="month";
	                out_data=month+" "+month_string;
	            }*/
	        break;
	    }
	    return out_data;
	}


	public static showAlert(param){
		this.alert_window = Alert.create({
          title: 'E2R',
          message: param,
          buttons: [{
          text: 'OK',
          handler: data => {
            this.alert_window.dismiss();
          }
        }]
        });
    	return this.alert_window;
	}

	



	public static isValueExist(items,itemvalue):boolean{
		let _parent:any=this;
		let status:boolean=false;
		if(items.length==0) return status;
		items.forEach(function(value,index){
			if(typeof(value)=="object"){
				if(items.constructor===Array){
					if(_parent.valueExistInObject(value,itemvalue)){
						status=(!status) ? true : false;
					}else{
						
					} 
				}else{

				}
			}else{
				if(typeof(itemvalue)=="object"){
					console.log("I am object 2")
				}else{
					if(value==itemvalue){
						status=(!status) ? true : false;
					}else{
						status=(status) ? true : false;
					}
				}
			}
		});
		return status;
	}

	private static valueExistInObject(items,item_value){
		let status:boolean=false;
		for(let key in items){
			if(typeof(item_value)=="object"){
				if(items[key]==item_value[key]){
					status=(!status) ? true : false;
				}else{
					status=(status) ? true : false;
				}
			}else{
				if(items[key]==item_value){					
					status=(!status) ? true : false;
				}else{
					status=(status) ? true : false;
				}
			}	
		}
		return status;		
	}

	public static getPostedTime(data):string{
		let time_str="";
		//console.log(data);
		return time_str;
	}

	public static showLoading():any{
	    this.loader = Loading.create({
	    	//spinner:'show',
	    	//content: "<div class='custom-spinner-container'><div class='custom-spinner-box'></div></div>",
	    });
	    return this.loader;
	}
	public static hideLoading():any{
		this.loader.dismiss();
	}	

	public static showOption(data):any{
		let selectedValue:string;
		let options:any=[];
		let optiondata=data;
		optiondata.data.forEach((value,index)=>{
			if(optiondata.default==undefined && optiondata.default==null && optiondata.default==''){
				options.push({type:"radio", label:value.name, value:value.value})
			}else{
				if(data.default==value.value){
					selectedValue=data.default;
					options.push({type:"radio", label:value.name, value:value.value,checked:true})						
				}else{
					options.push({type:"radio", label:value.name, value:value.value})	
				}
			}
			
		})

		this.option_window=Alert.create({
			title:'Filter',
			inputs:options,
			buttons:[{
				text:'Cancel',
				handler:()=>{
				}
			},
			{
				text:'Done',
				handler:(data)=>{
					if(optiondata.callback!=undefined) optiondata.callback(data);
					//console.log(data);
				}
			}]
		});
		return this.option_window;
	}

	public static hideOption():any{
		this.option_window.dismiss();
	}

	public static showSelect(data):any{
		//console.log(data);
		this.option_window=Alert.create({
			title:(data.title!=undefined) ? data.title : "Title"
		});
		let btn:any;
		let inp:any;
		switch (data.type){
			case "radio":
				data.data.forEach((value,index)=>{
					inp={
						type:data.type,
						label:value[data.text],
						value:value[data.value],
						checked:(data.default==value[data.value]) ? true : false,
						//handler:()=>{if(data.click!=undefined) data.click(value[data.value])}
					}
					this.option_window.addInput(inp);
				})
				btn={
					text:'Cancel',
                    cssClass:"select_window_cancel", 
					handler:()=>{if(data.callback!=undefined) data.callback()}
				}				
				this.option_window.addButton(btn);
			break;
			case "buttons":
				data.data.forEach((value,index)=>{
					btn={
						text:value[data.text],
						cssClass:(data.default==value[data.value]) ? "btn_option_selected" : "btn_option",
						handler:()=>{if(data.click!=undefined) data.click({value:value[data.value],text:value[data.text]})}
					}
					this.option_window.addButton(btn);
				})
				btn={
					text:'Cancel',
					cssClass:"select_window_cancel",
					handler:()=>{if(data.callback!=undefined) data.callback()}
				}				
				this.option_window.addButton(btn);
			break;			
		}
		return this.option_window;
	}	
	public static hideSelect():any{
		this.option_window.dismiss();
	}

	public static getPostDifference(postDate):any{
		
		/*postDate = postDate.split(' +')[0];
		postDate = postDate.split('/').join('-')
		let moment = new Moment();
		let pDate = moment.tz(pDate,'YYYY-MM-DD hh:mm:ss', 'Londan');
		console.log(pDate);*/
	}

	public static getMonthList(month_type="m"){
    let out_data=[];
    switch (month_type.toLowerCase()){
        case "full":
            out_data=["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
        break;
        case "short":
            out_data=["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        break;                 
        case "mm":
            out_data=["01", "02", "03", "04", "05", "06","07", "08", "09", "10", "11", "12"];
        break;  
        case "m":
            out_data=["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
        break;
    }
    return out_data;
} 
public static getYearList(list_length = 50){
    let out_data=[];
    let current_year=Number(new Date().getFullYear());
    for(let i=0; i < list_length; i++){
        out_data.push((current_year-i)+"")
    }
    return out_data;
}

public static showConfirmation(data):any{		
	let confirmWindow = Alert.create({
		title: (data.title!=undefined) ? data.title : "Title",
		message: (data.message!=undefined) ? data.message : "",
		buttons: [
			{
			text: 'Yes',
			handler: () => {
				if(data.onaction!=undefined) data.onaction(true);
			}
			},
			{
			text: 'No',
			handler: () => {
				if(data.onaction!=undefined) data.onaction(false);
			}
			}
		]
		}); 
	return confirmWindow;
}

	public static listFilter(source_list,existing_list,search_string):any{
		if(search_string=="") return source_list;
		let out_data:any=[];
		if(existing_list==null){
			source_list.forEach((value,index)=>{
				for(let key in value){
					if(typeof(value[key])=="string"){
						if(value[key].toLowerCase().indexOf(search_string.toLowerCase()) > -1){
							if(out_data.indexOf(source_list[index])==-1){
								out_data.push(source_list[index]);
							}
							break;
						}
					}
					if(typeof(value[key])=="object"){
						let cur_obj=value[key];
						for(let subkey in cur_obj){
							if(typeof(cur_obj[subkey])=="string"){
								if(cur_obj[subkey].toLowerCase().indexOf(search_string.toLowerCase()) > -1){
										if(out_data.indexOf(source_list[index])==-1){
											out_data.push(source_list[index]);
										}
									break;
								}
							}
						}
					}					
				}
			})
			return out_data;
		}else{

		}
	}
}