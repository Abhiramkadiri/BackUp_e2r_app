import {Page, Modal, Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {HyperService} from '../../../../services/http_service';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {ElementRef} from '@angular/core';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
import * as $ from 'jquery';
import {InAppBrowser, File} from 'ionic-native';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/supporting_docs_edit.html'
})
export class SupportingDocsEditPage {
  private screen_type:string="view";
  private file_warn:boolean=false;
  private file_limit_warn:boolean=false;
	searchQuery: string = '';
  	items;
    private fileSelect:any;
    private userData;
    private documentInputs ={
      document_description:'',
      document_name:''
    }
  private is_owner:boolean=true;
  constructor(http:Http, public nav:NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private element: ElementRef, private param:NavParams) {
    this.screen_type=this.param.data.type;
    this.is_owner=this.param.data.is_owner;
    if(this.is_owner){
      this.userData = JSON.parse(LocalStorage.getValue('userData'));
    }else{
      this.userData = (this.param.data.user_data!=undefined) ? this.param.data.user_data : [];
    }    
  }

  private dismiss() {
    this.viewCtrl.dismiss();
  }
  private addDocuments(){
    this.file_warn=false;
    this.file_limit_warn=false;
    let fileInput = this.element.nativeElement.querySelector('#suppoting_document');
    if(fileInput.files.length > 0){
      console.log(fileInput.files[0].size);
      let limit = (1024 * 1024) * 1;
      if(fileInput.files[0].size < limit){
        this.documentInputs.document_name = fileInput.files[0].name;
        let postData = {"file":fileInput.files[0], "data":this.documentInputs}
        this.server.postFiles('uploadfiles/document',postData, true, null)
        .then((data)=>{
          if(data.response=='success'){
            if(data.data!=undefined && data.data.length > 0){
              this.userData.documents=data.data;
              this.documentInputs ={
                document_description:'',
                document_name:''
              }
              this.element.nativeElement.querySelector('#suppoting_document').value='';
            }else{
              this.userData.documents=[];
            }
          }
        });     
      }else{
        this.file_limit_warn=true
      }
    }else{
      this.file_warn=true;
    } 
  }

   private deleteDocument(doc,doc_index){
     let postData = {"file_name":doc.document_name}
    this.server.DeleteFiles('removefiles/document',postData)
      .then((data)=>{
        if(data.status==200 && data.result.response=='success'){
          this.userData.documents.splice(this.userData.documents,1);
          this.getUserValues();
        }
      });
   } 

   private getUserValues(){
      this.nav.present(KLST.showLoading());
      this.server.get('user')
      .then(response => {
        KLST.hideLoading()
          this.userData = response.result.data;
          LocalStorage.setValue('userData', JSON.stringify(this.userData)) 
          this.userData = JSON.parse(LocalStorage.getValue('userData'));
      });
  }

  private viewDocs(url){
      console.log(url);
      let isWeb=(window.navigator.platform=="Win32") ? true :false;
      if(isWeb){
          window.open(url,"_blank","clearcache=no,toolbar=yes");
      }
      else{
          InAppBrowser.open(url,"_system","location=yes,toolbar=yes");
      }
  }
  private setDate(d){
    let options={
        month: 'long',
        year: 'numeric', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'   
    }
    let date=new Date(d).toLocaleString('en-US', options);
      return date;
  }
}