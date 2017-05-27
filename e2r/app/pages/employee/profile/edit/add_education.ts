import {Page, Modal, Alert, Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {ProfilePage} from '../../../employee/profile/profile';
import {DashboardPage} from '../../../employee/dashboard/dashboard';
import {EducationEditPage} from '../../../employee/profile/edit/education_edit';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/add_education.html'
})
export class AddEducationPage {
  private button_text:string="Save";
  private educationTitle:string="Add Eductaion";
  private screen_type:string;
	private educationInputs = {school:"",degree:"",field:"",from_month:"",from_year:"",to_month:"",to_year:""}; 
  private education_data:any={};
  private user_education:any=[]; 
  private yearList:any=[];
  private monthList:any=[];
  private educations_list:any=[];
  private validate_field_empty:any={};  
  /*private addData;
  private userData;
  private existEditVal;
  private submitText;
  private editIndex;
  private successMessage;
  private deleteData;
  private uiValues;

	http:Http;*/
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
    console.log(this.param.data);
    this.screen_type=(this.param.data.type!=undefined) ? this.param.data.type : "create";
    this.user_education=(this.param.data.edu_data!=undefined) ? this.param.data.edu_data : [];
    if(this.screen_type=="create"){
      this.button_text="Save";
      this.educationTitle="Add Education";
      this.education_data=this.educationInputs;
    }else{
      this.button_text="Update";
      this.educationTitle="Edit Education";
      this.education_data=(this.param.data.edu_item!=undefined && this.param.data.edu_item!=null) ? this.user_education[this.param.data.edu_item] : this.educationInputs;
    }
    let eduItem=LocalStorage.getValue('valueLists');
    this.educations_list=(typeof(eduItem)!='object')?JSON.parse(eduItem)[0].qualification:eduItem[0].qualification;
    console.log(this.educations_list);
    /*this.server = server;
    this.http = http;
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
    this.uiValues = JSON.parse(LocalStorage.getValue('valueLists'));
    console.log(this.userData);
    this.existEditVal = EducationEditPage.existEducationData;
    this.editIndex = EducationEditPage.editIndex;*/
  }
  ionViewWillEnter(){
    this.yearList = KLST.getYearList();
    this.monthList = KLST.getMonthList("short");
  }
    
  private onSaveEducation(){
    if(this.isFieldValidated()){
      if(this.screen_type=="create"){
        this.user_education.push(this.education_data);
      }
      this.server.post("user",{education:this.user_education})
      .then((data)=>{
        console.log(data);
        if(data.status==200 && data.result.response=="success"){
          setTimeout(()=>{this.dismiss()},500);
        }
      })
    }
  }

  private isFieldValidated(){
    this.validate_field_empty={};
    let feild_validate_status:boolean=true;
    for(let key in this.education_data){
      if(this.education_data[key]=='' || this.education_data[key]==null) this.validate_field_empty[key]=true;
    }
    if(((this.education_data.from_month!=undefined &&  this.education_data.from_month!='') && (this.education_data.from_year!=undefined &&  this.education_data.from_year!='')) && ((this.education_data.to_month!=undefined &&  this.education_data.to_month!='') && (this.education_data.to_year!=undefined &&  this.education_data.to_year!=''))){
      let from_date=new Date(this.education_data.from_month+"/"+this.education_data.from_year);
      let to_date=new Date(this.education_data.to_month+"/"+this.education_data.to_year);
      if(from_date >= to_date){
        this.validate_field_empty.invalied_date=true;
		  }    
    }
    for(let key in this.validate_field_empty){
      return false;
    } 
    return true;
  }

  private dismiss() {
    this.viewCtrl.dismiss({});
  }
  
  /*ionViewWillEnter(){
    this.yearList = KLST.getYearList();
    this.monthList = KLST.getMonthList("short");
    if(this.existEditVal != ''){
      this.educationInputs.school =this.existEditVal.school;
      this.educationInputs.degree =this.existEditVal.degree;
      this.educationInputs.field =this.existEditVal.field;
      this.educationInputs.from_month =this.existEditVal.from_month;
      this.educationInputs.from_year =this.existEditVal.from_year;
      this.educationInputs.to_month =this.existEditVal.to_month;
      this.educationInputs.to_year =this.existEditVal.to_year;
      this.submitText ="Update";
      this.educationTitle ="Edit Education";
      this.successMessage ="Updated Successfully";
    }else{
      this.submitText ="Add";
      this.educationTitle ="Add Education";
      this.successMessage ="Added Successfully"
    }
  }*/
  

  saveEducation(values){
    /*this.nav.present(KLST.showLoading());
      if(this.submitText == "Add")
      {
        if(this.userData.education == null || this.userData.education =="" || this.userData.education == undefined){
            this.userData.education = [];
            this.userData.education.push({"school":values.school, "degree":values.degree, "field":values.field, 'from_year':values.from_year, "from_month":values.from_month, 'to_year':values.to_year, "to_month":values.to_month})
        }else{
            this.userData.education.push({"school":values.school, "degree":values.degree, "field":values.field, 'from_year':values.from_year, "from_month":values.from_month, 'to_year':values.to_year, "to_month":values.to_month})
        }
      }else{
            this.userData.education[this.editIndex] = {"school":values.school, "degree":values.degree, "field":values.field, 'from_year':values.from_year, "from_month":values.from_month, 'to_year':values.to_year, "to_month":values.to_month};
      }
      this.addData = {"education":this.userData.education};
      this.server.edit('user',  this.addData)
      .then(data => (this.addEducationResult(data)));*/ 
  }
  addEducationResult(response){
    KLST.hideLoading();
      if(response.status==200){
        if(response.result.response=='success'){
              setTimeout(()=>{this.dismiss();},500);
            }else{
               this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }


     /*deleteEducation(){
          this.nav.present(KLST.showLoading());
          let headers:Headers = new Headers();
          let requestoptions:RequestOptions;
          headers.append("Content-Type", 'application/json');
          headers.append("Authorization", 'Bearer ' + LocalStorage.getValue('token'));
          this.userData.education.splice(this.editIndex, 1)
          console.log("ok :"+this.userData.education);
          this.deleteData = {"education":this.userData.education};
          this.server.edit('user',  this.deleteData)
          .then(data => (this.addEducationResult(data))); 
      }*/
}

