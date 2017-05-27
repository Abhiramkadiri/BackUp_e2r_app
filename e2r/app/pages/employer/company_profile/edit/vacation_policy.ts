import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/vacation_policy.html'
})

export class VactionPolicyPage {
  private editData;
  private show;
  private edit;
  public vacationInputs = new vacationEdit();
  public is_owner:boolean=true;
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
  	this.http = http;
    this.show = true;
    this.is_owner=(this.param.data.is_employee) ? false : true;
    if(!this.is_owner){
      this.vacationInputs.vacation_policy=(this.param.data.user_data.vacation_policy!=undefined) ? this.param.data.user_data.vacation_policy: "";
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

  saveVacationEdit(values){
      this.nav.present(KLST.showLoading());
      this.editData = {"vacation_policy":values.vacation_policy}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.vacationeditResult(data)
        ));
  }
  vacationeditResult(response){
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

class vacationEdit{
  private editVal;
  public vacation_policy;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.vacation_policy=(this.editVal.vacation_policy==undefined) ? '':this.editVal.vacation_policy; 
  }
}