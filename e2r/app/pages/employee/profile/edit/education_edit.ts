import {Page, Modal, Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {AddEducationPage} from '../edit/add_education';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/education_edit.html'
})
export class EducationEditPage {
  private screen_type:string="view";
  private userData;
  static existEducationData;
  static editIndex;
  http:Http;
  private is_owner:boolean=true;
  constructor(http:Http, public nav:NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
    this.http = http;
    this.screen_type=this.param.data.type;
    this.is_owner=this.param.data.is_owner;
    if(this.is_owner){
      this.userData = JSON.parse(LocalStorage.getValue('userData'));
    }else{
      this.userData = (this.param.data.user_data!=undefined) ? this.param.data.user_data : [];
    }
    
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }
   getUserValues(){ 
     this.nav.present(KLST.showLoading());
        this.server.get('user')
        .then(res => {
          KLST.hideLoading();
          this.userData = res.result.data;
          LocalStorage.setValue('userData', JSON.stringify(this.userData));
        }); 
  }

  private onOpenEducation(type,edu_item=null){
  	let modal = Modal.create(AddEducationPage,{type:type,edu_data:this.userData.education,edu_item:edu_item});
    modal.onDismiss(data =>{
      this.getUserValues();
    })
    this.nav.present(modal);    
  }

  /*private onEditEducation(values,index){
    EducationEditPage.existEducationData = values;
    EducationEditPage.editIndex = index;
  	let modal = Modal.create(AddEducationPage);
    modal.onDismiss(data =>{
      this.getUserValues();
    })
    this.nav.present(modal);
  }*/

  private onRemoveEducation(edu_index){
    console.log(edu_index);
    let confirmation_data:any={}
    confirmation_data.title="Confirmation";
    confirmation_data.message="Are you sure to remove this education?";
    confirmation_data.onaction=(data)=>{
      if(data){
        this.userData.education.splice(edu_index,1);
        this.server.post("user",{education:this.userData.education})
        .then((data)=>{
          /*console.log(data);
          if(data.status==200 && data.result.response=="success"){
          }*/
        })        
      }
    }
    this.nav.present(KLST.showConfirmation(confirmation_data));    
  }
}