import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/company_perks.html'
})

export class CompanyPerksPage {
  private editData;
  private show;
  private edit;
  public companyperksInputs = new perksEdit();
  http:Http;
  public is_owner:boolean=true;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
  	this.http = http;
    this.show = true;
    this.is_owner=(this.param.data.is_employee) ? false : true;
    if(!this.is_owner){
      this.companyperksInputs.company_perks=(this.param.data.user_data.company_perks!=undefined) ? this.param.data.user_data.company_perks: "";
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

  saveCompanyPerksEdit(values){
    this.nav.present(KLST.showLoading());
      this.editData = {"company_perks":values.company_perks}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.perkseditResult(data)
        ));
  }
  perkseditResult(response){
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

class perksEdit{
  private editVal;
  public company_perks;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.company_perks=(this.editVal.company_perks==undefined) ? '':this.editVal.company_perks; 
  }
}