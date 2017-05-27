import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/stack_holder.html'
})

export class StackHolderPage {
  private editData;
  private show;
  private edit;
  public stackholderInputs = new stackholderEdit();
  http:Http;
  public is_owner:boolean=true;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
  	this.http = http;
    this.show = true;
    this.is_owner=(this.param.data.is_employee) ? false : true;
    if(!this.is_owner){
      this.stackholderInputs.stakeholders=(this.param.data.user_data.stakeholders!=undefined) ? this.param.data.user_data.stakeholders: "";
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

  saveStackholderEdit(values){
      this.nav.present(KLST.showLoading());
      this.editData = {"stakeholders":values.stakeholders}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.stackholdereditResult(data)
        ));
  }
  stackholdereditResult(response){
      KLST.hideLoading();
      if(response.status==200){
        if(response.result.response=='success'){
              setTimeout(()=>{this.dismiss()},500);
            }else{
                this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }

      dismiss() {
        this.viewCtrl.dismiss({});
      }
}

class stackholderEdit{
  private editVal;
  public stakeholders;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.stakeholders=(this.editVal.stakeholders==undefined) ? '':this.editVal.stakeholders; 
  }
}