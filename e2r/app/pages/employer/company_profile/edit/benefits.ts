import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/benefits.html'
})

export class BenefitsPage {
  private editData;
  private show;
  private edit;
  public benefitsInputs = new benefitsEdit();
  public is_owner:boolean=true;
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
  	this.http = http;
    this.show = true;
    this.is_owner=(this.param.data.is_employee) ? false : true;
    if(!this.is_owner){
      this.benefitsInputs.benefits=(this.param.data.user_data.benefits!=undefined) ? this.param.data.user_data.benefits: "";
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

  saveBenefitsEdit(values){
    this.nav.present(KLST.showLoading());
      this.editData = {"benefits":values.benefits}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.benefitseditResult(data)
        ));
  }
  benefitseditResult(response){
      KLST.hideLoading()
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

class benefitsEdit{
  private editVal;
  public benefits;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.benefits=(this.editVal.benefits==undefined) ? '':this.editVal.benefits; 
  }
}