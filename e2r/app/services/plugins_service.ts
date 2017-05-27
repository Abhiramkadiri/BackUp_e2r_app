import {Injectable} from "@angular/core";
import {Camera, ImagePicker, File, Transfer} from 'ionic-native';
import {CONFIG} from '../config';
import {LocalStorage} from "../services/ls_srvs"
import * as _ from 'underscore';

@Injectable()
export class Plugins {
    
    constructor() { }     
     albums = {       
        open (type:string="") : Promise<any>  {
            let options:any = {
                destinationType: 1,
                sourceType: 0,
                encodingType: 0,
                quality:75,              
                allowEdit: false,
                saveToPhotoAlbum: true,            
                correctOrientation: true,
            }; 
            if(type=="team"){
                options.targetWidth=550;
                options.targetHeight=160;
            }else if(type=="gallery"){
                options.targetWidth=325;
                options.targetHeight=180;
            }                   
            return Camera.getPicture(options).then((imgUrl) => {
                //console.log(imgUrl);
                return imgUrl;
            }, (err) => {                
                if(err.error == "cordova_not_available") {
                    alert("Cordova is not available, please make sure you have your app deployed on a simulator or device");            
                } else {
                    if(err!=undefined && err.error!=undefined) alert("Failed to open camera: " + err.error);                
                }    
            });
        } 
    }
    
    camera = {       
        open (type:string="") : Promise<any>  {          
            let options:any = {
                destinationType: 1,
                sourceType: 1,
                encodingType: 0,
                quality:75,               
                allowEdit: false,
                saveToPhotoAlbum: true,            
                correctOrientation: true,
            };
            if(type=="team"){
                options.targetWidth=550;
                options.targetHeight=160;
            }else if(type=="gallery"){
                options.targetWidth=325;
                options.targetHeight=180;
            }                     
            return Camera.getPicture(options).then((imgUrl) => {
                console.log(imgUrl);
                return imgUrl;
            }, (err) => {                
                if(err.error == "cordova_not_available") {
                    alert("Cordova is not available, please make sure you have your app deployed on a simulator or device");            
                } else {
                    if(err!=undefined && err.error!=undefined) alert("Failed to open camera: " + err.error);                
                }    
            });
        } 
    }  
    
    file = {
        upload (url: string, image: string, onSuccess: any, onFailed: any, onProgress: any) : void {
            let URL = CONFIG.SERVICE_URL+url
            console.log(URL);  
            let ft = new Transfer();                       
            let options = {
                fileKey: 'files',
                mimeType: 'image/jpeg',
                chunkedMode: false,
                headers: {
                    'Content-Type' : undefined,
                    "Authorization" : 'Bearer ' + LocalStorage.getValue('token')
                },
                params: {}                
            }
            ft.upload(image, encodeURI(URL), options, false)
            .then((result: any) => {
                console.log(result);
                onSuccess(result);
            }).catch((error: any) => {
                console.log(error);
                onFailed(error);
            });             
        }
    }  
}