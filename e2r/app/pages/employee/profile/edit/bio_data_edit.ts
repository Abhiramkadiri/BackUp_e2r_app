import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardPage} from '../../../employee/dashboard/dashboard';
import {countriesPage} from '../edit/countries_list';
import {citiesPage} from '../edit/cities_list';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/bio_data_edit.html'
})

export class BioEditPage {
  private editData;
  private desired_salaryData;
  private preffered_jobStatus;
  private cities_list;
  private userData;
  private uiValues;
  //public countries_select;
  //public cities_select;
  public bioInputs = {
    current_country:"Select Country",
    current_location:"Select City",
    desired_salary:0,
    amountType:"",
    preffered_job_status:"",
    desired_job_type:"",
    eligibilty_status:"",
    cities_select:"Select City",
    countries_select:"Select Country",
    relocation:false
  }
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService) {
  	this.http = http;
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
    let uiData=(LocalStorage.getValue('valueLists'));
    this.uiValues =(typeof(uiData)=='string')?JSON.parse(uiData):uiData;
    console.log('userData',this.userData);
    this.bioInputs.countries_select = (this.userData.preffered_country!=undefined && this.userData.preffered_country!='')?this.userData.preffered_country:'Select Country';
    // if(this.bioInputs.countries_select!='Select Country'){
    //   this.defaultCountryValue(this.bioInputs.countries_select,'countries_select');
    // }
    this.bioInputs.current_country = (this.userData.current_country!=undefined && this.userData.current_country!='')?this.userData.current_country:"Select Country";
    // if(this.bioInputs.current_country!='Select Country'){
    //   this.defaultCountryValue(this.bioInputs.current_country,'current_country');
    // }
    this.bioInputs.current_location = (this.userData.current_location!=undefined && this.userData.current_location!='')?this.userData.current_location:'Select City';
    this.bioInputs.cities_select = (this.userData.preffered_location!=undefined && this.userData.preffered_location!='')?this.userData.preffered_location:'Select City';
    this.bioInputs.desired_salary = (this.userData.desired_salary.amount==undefined) ? 0:parseInt(this.userData.desired_salary.amount);
    this.bioInputs.preffered_job_status = (this.userData.preffered_job_status!=undefined)?this.userData.preffered_job_status:'';
    this.bioInputs.desired_job_type = (this.userData.desired_job_type!=undefined)?this.userData.desired_job_type:'';
    this.bioInputs.eligibilty_status = (this.userData.eligibilty_status!=undefined)?this.userData.eligibilty_status:'';
    this.bioInputs.amountType = (this.userData.desired_salary.currency==undefined) ? "":this.userData.desired_salary.currency;
    this.bioInputs.relocation = (this.userData.relocation==undefined) ? false:(this.userData.relocation=='Yes')?true:false;
  }
  ionViewWillEnter(){
  }

  defaultCountryValue(country){
         this.server.get('location/'+country)
        .then(data => (this.getCitiesList(data)));
  }

  countryValue(item){
    let modal = Modal.create(countriesPage);
      modal.onDismiss(data =>{
        if(data.countrytext != undefined && data.countrytext != ''){
          if(item=='preffered' && data.countrytext !=this.bioInputs.countries_select){
            this.bioInputs.countries_select = data.countrytext;
            this.bioInputs.cities_select='Select City';
          }
          else if(item=='current' && data.countrytext !=this.bioInputs.current_country){
            this.bioInputs.current_country = data.countrytext;
            this.bioInputs.current_location='Select City';
          }

        }
        
         this.server.get('location/'+this.bioInputs.countries_select)
        .then(data => (this.getCitiesList(data)));
      })
      this.nav.present(modal);
  }

  getCitiesList(response){
    let cities = response.result.data.cities;
    cities.sort();
    return cities;
  }

  cityValue(country,item){
    // let cityList=this.defaultCountryValue(country);
    let modal = Modal.create(citiesPage, {"country": country});
      modal.onDismiss(data =>{
        if(data.citytext != undefined && data.citytext != ''){
          if(item=='preffered'){
            this.bioInputs.cities_select = data.citytext;
          }
          else if(item=='current'){
            this.bioInputs.current_location = data.citytext;
          }
        }
      })
      this.nav.present(modal);
  }

  dismiss() {
    this.viewCtrl.dismiss({});
  }
  
 
  saveBioEdit(values){
    console.log(this.bioInputs);
    this.nav.present(KLST.showLoading());
    let current_country=(this.bioInputs.current_country=="Select Country")?'':this.bioInputs.current_country;
    let current_location=(this.bioInputs.current_location=="Select City")?'':this.bioInputs.current_location;
    let cities_select=(this.bioInputs.cities_select=="Select City")?'':this.bioInputs.cities_select;
    let countries_select=(this.bioInputs.countries_select=="Select Country")?'':this.bioInputs.countries_select;
    let relocation=(this.bioInputs.relocation)?'Yes':'No';
      let amountStr = values.desired_salary+'';
      this.editData = {"current_country":current_country,"current_location":current_location, "desired_salary":{"amount":amountStr,"currency":values.amountType}, "desired_job_type":values.desired_job_type,"preffered_job_status":values.preffered_job_status, "eligibilty_status":values.eligibilty_status,"preffered_country":countries_select, "preffered_location":cities_select, "relocation":relocation}
      this.server.edit('user',  this.editData)
      .then(data => (this.bioeditResult(data)));
  }
  bioeditResult(response){
      KLST.hideLoading();
      if(response.status==200){
        if(response.result.response=='success'){
              this.onCloseModel();
            }else{
                this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }

    private onCloseModel(){
      setTimeout(()=>{this.dismiss()},500)
    }
}

/*class BioEdit{
  private editVal;
  public currentLocation;
  public desired_salary;
  public jobStatus;
  public desired_job_type;
  public eligibilty_status;
  public preffered_location;
  public countries_select;
  public cities_select;
  public amountType;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.currentLocation=(this.editVal.current_location==undefined) ? '':this.editVal.current_location; 
    this.desired_salary=(this.editVal.desired_salary==undefined) ? 0:parseInt(this.editVal.desired_salary.amount);
    this.jobStatus=(this.editVal.preffered_job_status==undefined) ? '0':this.editVal.preffered_job_status;
    this.desired_job_type=(this.editVal.desired_job_type==undefined) ? '':this.editVal.desired_job_type;
    this.eligibilty_status=(this.editVal.eligibilty_status==undefined) ? '':this.editVal.eligibilty_status;
    this.cities_select=(this.editVal.preffered_location==undefined) ? 'Select Cities':this.editVal.preffered_location;
    this.countries_select=(this.editVal.preffered_country==undefined) ? 'Select Country':this.editVal.preffered_country;
  }
}*/