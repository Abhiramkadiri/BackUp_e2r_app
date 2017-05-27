import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {FormBuilder} from '@angular/forms';

import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/specialities.html'
})

export class SpecialitiesPage {
  private userData:any={};
  private editData:any={};
  //private industry_list;
  private uiValues;
  public specialitiesInputs = {
    summary_specialities:"",
    industry:"",
    company_size:"",
    founded:"",
    company_type:""
  }
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService) {
  	this.http = http;
    let temp_user_data=LocalStorage.getValue('userData');
    this.userData = (typeof(temp_user_data)!='string') ? temp_user_data : JSON.parse(temp_user_data);
    this.specialitiesInputs.summary_specialities = (this.userData.summary_specialities!=undefined) ? this.userData.summary_specialities : "";
    this.specialitiesInputs.industry = (this.userData.industry!=undefined) ? this.userData.industry : "";
    this.specialitiesInputs.company_size = (this.userData.company_size!=undefined && this.userData.company_size!=0) ? this.userData.company_size : '';
    this.specialitiesInputs.founded = (this.userData.founded!=undefined) ? this.userData.founded : "";
    this.specialitiesInputs.company_type = (this.userData.company_type!=undefined) ? this.userData.company_type : "";
    let temp_ui_values=LocalStorage.getValue('valueLists');
    this.uiValues =(typeof(temp_ui_values)!='string') ? temp_ui_values : JSON.parse(temp_ui_values);
  }
  /*ionViewWillEnter(){
      if(LocalStorage.getValue('industryListsLoaded')=="true" || LocalStorage.getValue('industryListsLoaded')==true){
             this.industry_list = JSON.parse(LocalStorage.getValue('industryLists'));
            }else{
              this.getIndustrys();
            }
    }*/

 /* private getIndustrys(){
          this.nav.present(KLST.showLoading());
            this.server.get('lists/industry')
                .then(response => {
                  KLST.hideLoading()
                    this.industry_list = response.result.data[0].industry;
                    //LocalStorage.setValue('industryLists', JSON.stringify(response.result.data));
                    //LocalStorage.setValue('industryListsLoaded', true);
                    
                });
  }*/
  private saveSpecialistEdit(values){
      // this.nav.present(KLST.showLoading());
      console.log(values);
      this.editData = {
        "summary_specialities":values.summary_specialities, 
        "industry":values.industry, 
        "company_type":values.company_type,
        "company_size":(values.company_size!='')?parseInt(values.company_size):0, 
        "founded":values.founded
      }
    console.log(this.editData);
      this.server.edit('user',  this.editData)
      .then(data => (
        this.specialisteditResult(data)
        ));
  }
  private specialisteditResult(response){
    KLST.hideLoading();
      if(response.status==200){
        if(response.result.response=='success'){
              setTimeout(()=>{this.dismiss();},500);
              
            }else{
                this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }

      private dismiss() {
        this.viewCtrl.dismiss({});
      }
}

class SpecialitiesEdit{
  private editVal;
  public summary_specialities;
  public industry;
  public company_size;
  public founded;
  public company_type;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.summary_specialities=(this.editVal.summary_specialities==undefined) ? '':this.editVal.summary_specialities; 
    this.industry=(this.editVal.industry==undefined || this.editVal.industry.length==0) ? '':this.editVal.industry;
    this.company_size=(this.editVal.company_size==undefined) ? '':this.editVal.company_size;
    this.founded=(this.editVal.founded==undefined) ? '':this.editVal.founded;
    this.company_type = (this.editVal.company_type==undefined) ? '':this.editVal.company_type;
  }
}