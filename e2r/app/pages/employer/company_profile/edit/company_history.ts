import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/company_history.html'
})

export class CompanyHistoryPage {
  private editData;
  private edit;
  private show;
  public is_owner:boolean=true;
  public historyInputs = new historyEdit();
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService,private param:NavParams) {
  	this.http = http;
    this.show = true;
    this.is_owner=(this.param.data.is_employee) ? false : true;
    if(!this.is_owner){
      this.historyInputs.company_history=(this.param.data.history_data!=undefined) ? this.param.data.history_data : "";
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
  saveHistoryEdit(values){
    this.nav.present(KLST.showLoading());
      this.editData = {"company_history":values.company_history}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.historyeditResult(data)
        ));
  }
  historyeditResult(response){
    KLST.hideLoading();
      console.log(response);
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

class historyEdit{
  private editVal;
  public company_history;
  constructor(){
      this.editVal=JSON.parse(LocalStorage.getValue('userData'));
      this.company_history=(this.editVal.company_history==undefined) ? '':this.editVal.company_history; 
  }
}