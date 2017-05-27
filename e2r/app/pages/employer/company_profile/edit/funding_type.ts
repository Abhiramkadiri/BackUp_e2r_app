import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/funding_type.html'
})

export class FundingTypePage {
  private editData;
  private show;
  private edit;
  public fundInputs = new fundEdit();
  http:Http;
  public is_owner:boolean=true;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
  	this.http = http;
    this.show = true;
    this.is_owner=(this.param.data.is_employee) ? false : true;
    if(!this.is_owner){
      this.fundInputs.funding_type=(this.param.data.user_data.funding_type!=undefined) ? this.param.data.user_data.funding_type: "";
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

  saveFundEdit(values){
    this.nav.present(KLST.showLoading());
      this.editData = {"funding_type":values.funding_type}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.fundeditResult(data)
        ));
  }
  fundeditResult(response){
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

class fundEdit{
  private editVal;
  public funding_type;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.funding_type=(this.editVal.funding_type==undefined) ? '':this.editVal.funding_type; 
  }
}