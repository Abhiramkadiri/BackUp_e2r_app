import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/contactinfo.html'
})

export class ContactinfoPage {
  private editData;
  private desired_salaryData;
  private preffered_jobStatus;
  private cities_list;
  //public countries_select;
  //public cities_select;
  public contactsInputs = new ContactEdit();
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService) {
  	this.http = http;
  }
  saveContactEdit(values){
     this.nav.present(KLST.showLoading());
      this.editData = {"phone":{"mobile":values.phone}, "email":values.email, "linkedin":values.linkedin,"portal":values.portal}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.contactlisteditResult(data)
        ));
  }
  contactlisteditResult(response){
    KLST.hideLoading();
      if(response.status==200){
        if(response.result.response=='success'){
              setTimeout(()=>{this.dismiss();},500) 
            }else{
                this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }
 
      dismiss() {
        this.viewCtrl.dismiss({});
      }
}

class ContactEdit{
  private editVal;
  public phone;
  public email;
  public linkedin;
  public portal;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.phone=(this.editVal.phone==undefined) ? '':this.editVal.phone.mobile; 
    this.email=(this.editVal.email==undefined) ? '':this.editVal.email;
    this.linkedin=(this.editVal.linkedin==undefined) ? '':this.editVal.linkedin; 
    this.portal=(this.editVal.portal==undefined) ? '':this.editVal.portal;
    if(this.editVal.phone){
      if(this.editVal.phone.mobile!=undefined){
          this.phone = this.editVal.phone.mobile;
      }
      else if(this.editVal.phone.home!=undefined){
          this.phone = this.editVal.phone.home;
      }
      else if(this.editVal.phone.work!=undefined){
          this.phone = this.editVal.phone.work;
      }
      else{
          this.phone = '';
      }
    }
  }
}