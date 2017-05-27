import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {LocalStorage} from "../services/ls_srvs"
import {CONFIG} from '../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import * as $ from 'jquery';

@Injectable()
export class HyperService{

	constructor (public http:Http) {
      this.http = http;
  }

  post(endPoint:string, data:any, isJSON:boolean=true){
    let headers:Headers = new Headers();
    let requestoptions:RequestOptions;
    let theBody:any;

    if(isJSON){
    	theBody = JSON.stringify(data);
    }else{
    	theBody = data
    }

    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + LocalStorage.getValue('token'));
    requestoptions = new RequestOptions({
        method: RequestMethod.Post,
        url: CONFIG.SERVICE_URL+endPoint,
        headers: headers,
        body: theBody
    })
 
    return this.http.request(new Request(requestoptions))
    	.toPromise()
    	.then(res => ({ status: res.status, result: res.json() }), err => err);

    /*.map((res: Response) => {
        if (res) {
            this.serverResponse();
        }
  	}).catch(this.handleError)*/
  }

  get(endPoint:string){
    let headers:Headers = new Headers();
    let requestoptions:RequestOptions;
    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + LocalStorage.getValue('token'));
    requestoptions = new RequestOptions({
        method: RequestMethod.Get,
        url: CONFIG.SERVICE_URL+endPoint,
        headers: headers
    })
 
    return this.http.request(new Request(requestoptions))
      .toPromise()
      .then(res => ({ status: res.status, result: res.json() }), err => err);

    /*.map((res: Response) => {
        if (res) {
            this.serverResponse();
        }
    }).catch(this.handleError)*/
  }

  googleGet(endPoint:string){
    let headers:Headers = new Headers();
    let requestoptions:RequestOptions;
    headers.append("Content-Type", 'application/json');
    //headers.append("Authorization", 'Bearer ' + LocalStorage.getValue('token'));
    requestoptions = new RequestOptions({
        method: RequestMethod.Post,
        url: endPoint,
        headers: headers
    })
 
    return this.http.request(new Request(requestoptions))
      .toPromise()
      .then(res => ({ status: res.status, result: res.json() }), err => err);

    /*.map((res: Response) => {
        if (res) {
            this.serverResponse();
        }
    }).catch(this.handleError)*/
  }  

  edit(endPoint:string, data:any, isJSON:boolean=true) {
    let headers:Headers = new Headers();
    let requestoptions:RequestOptions;
    let theBody:any;

    if(isJSON){
      theBody = JSON.stringify(data);
    }else{
      theBody = data
    }

    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + LocalStorage.getValue('token'));
    requestoptions = new RequestOptions({
        method: RequestMethod.Post,
        url: CONFIG.SERVICE_URL+endPoint,
        headers: headers,
        body: theBody
    })
 
    return this.http.request(new Request(requestoptions))
      .toPromise()
      .then(res => ({ status: res.status, result: res.json() }), err => err);
  }

  DeleteFiles(endPoint:string, data:any, isJSON:boolean=true) {
    let headers:Headers = new Headers();
    let requestoptions:RequestOptions;
    let theBody:any;

    if(isJSON){
      theBody = JSON.stringify(data);
    }else{
      theBody = data
    }

    headers.append("Content-Type", 'application/json');
    headers.append("Authorization", 'Bearer ' + LocalStorage.getValue('token'));
    requestoptions = new RequestOptions({
        method: RequestMethod.Delete,
        url: CONFIG.SERVICE_URL+endPoint,
        headers: headers,
        body: theBody
    })
 
    return this.http.request(new Request(requestoptions))
      .toPromise()
      .then(res => ({ status: res.status, result: res.json() }), err => err);
  }

  handleError(error){
  	console.error(error);
      return Observable.throw(error.json().error || 'Server error');
  }


//   postFiles(endPoint:string, data:any, tokenRequired, callBack) {
//         var xhr;
//         if (window.hasOwnProperty('XMLHttpRequest')){
//             xhr=new XMLHttpRequest();
//         }else{
//             xhr=new ActiveXObject("Microsoft.XMLHTTP");
//         }
//         var formData = new FormData();
//          formData.append('files',data.file);
//         if(data.data!=undefined && data.data!=''){
//             $.each(data.data,function(key,value){
//                 formData.append(key,value);
//             })
//         }

//         console.log('qwerty::',LocalStorage.getValue('token'));
//     //    xhr.setRequestHeader("Authorization", 'Bearer ' + LocalStorage.getValue('token'));
//         xhr.upload.addEventListener("progress", function(e) {
//             if (e.lengthComputable) {
//                 //var percentage = Math.round((e.loaded * 100) / e.total);
//             }
//         }, false);
//         xhr.upload.addEventListener("loadstart", function(e){

//         }, false);
//         xhr.upload.addEventListener("load", function(e){
            
//         }, false);
//         xhr.onreadystatechange = function(e){
//             if(xhr.responseText!=""){
//                 let recivedData=JSON.parse(xhr.responseText);
//                 if(callBack!=undefined) callBack(recivedData);
//             }
//         };
//         xhr.open("POST", CONFIG.SERVICE_URL+endPoint);
//         //xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
//         xhr.send(formData);        
//     }


        postFiles(endPoint:string, data:any, tokenRequired, callBack){
            var formData = new FormData();
            formData.append('files', data.file);
            if (data.data != undefined && data.data != '') {
                $.each(data.data, function (key, value) {
                    formData.append(key, value);
                })
            }
            return $.ajax({
                url: CONFIG.SERVICE_URL+endPoint,
                data: formData,
                contentType: false,
                headers:{
                    "Authorization":'Bearer ' + LocalStorage.getValue('token')
                },
                processData: false,
                type: 'POST',
                success: function(data){
                    // if(callBack!=undefined) callBack(data);
                    return data;
                }
            });
        }
} 