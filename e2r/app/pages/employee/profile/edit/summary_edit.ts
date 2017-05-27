import {Page, Modal, Alert, Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardPage} from '../../../employee/dashboard/dashboard';
import {ProfilePage} from '../../../employee/profile/profile';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/summary_edit.html'
})
export class SummaryEditPage {
  private editData;
  private show;
  private edit;
  private summaryInput = new SummaryEdit();
  private is_owner:boolean=true;
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
  	this.server = server;
    this.http = http;
    this.show = true;
    this.is_owner=this.param.data.is_owner;
    if(!this.is_owner){
      this.summaryInput.text=(this.param.data.summary_data!=undefined) ? this.param.data.summary_data : "";
    }
  }

  enable(){
    if(this.show == true){
      this.show = false;
      this.edit = true;
    }else{
      this.show = true;
      this.edit = false;
    }
  }
  addField(){
     this.edit = true;
     this.show = false;
  }
  dismiss() {
    this.viewCtrl.dismiss({});
    //this.getUserValues();
  }

 
  saveSummaryEdit(values){
      this.editData = {"summary":values.text}
      console.log(this.editData);
       this.server.edit('user',  this.editData)
      .then(data => (this.summaryeditResult(data)));
  }
  summaryeditResult(response){
      if(response.status==200){
        if(response.result.response=='success'){
              setTimeout((data)=>{this.dismiss();},500);
            }else{
               this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }

   
}
class SummaryEdit{
	private editVal;
	public text;
  constructor(){
    this.editVal = JSON.parse(LocalStorage.getValue('userData'));
    this.text = (this.editVal.summary==undefined) ? '' : this.editVal.summary;
  }
}