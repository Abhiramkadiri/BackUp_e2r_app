import {Page, Modal, Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {AddExperiencePage} from '../edit/add_experience';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/experience_edit.html'
})
export class ExperienceEditPage {
  private screen_type:string="view";
  private userData;
  static editIndex;
  http:Http;
  private is_owner:boolean=true;
  constructor(http:Http, public nav:NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
    this.http = http;
    this.screen_type=this.param.data.type;
    this.is_owner=this.param.data.is_owner;
    if(this.is_owner){
      this.userData = JSON.parse(LocalStorage.getValue('userData'));
    }else{
      this.userData = (this.param.data.user_data!=undefined) ? this.param.data.user_data : [];
    }    
  }

  private dismiss() {
    this.viewCtrl.dismiss({});
  }

  private onOpenExperience(type,exp_item=null){
  	let modal = Modal.create(AddExperiencePage,{type:type,exp_data:this.userData.experience,exp_item:exp_item});
    modal.onDismiss(data =>{
      this.getUserValues();
    })
    this.nav.present(modal);    
  }

  private onRemoveExperience(exp_index){
    let confirmation_data:any={}
    confirmation_data.title="Confirmation";
    confirmation_data.message="Are you sure to remove this experience?";
    confirmation_data.onaction=(data)=>{
      if(data){        
        this.userData.experience.splice(exp_index,1)
        this.onCalculateTotalExp();
        this.server.post("user",{experience:this.userData.experience,total_experience:this.userData.total_experience})
        .then((data)=>{
          /*console.log(data);
          if(data.status==200 && data.result.response=="success"){
          }*/
        })        
      }
    }
    this.nav.present(KLST.showConfirmation(confirmation_data));      
  }

  private onCalculateTotalExp(){
      let total_exp_month=0;
      this.userData.experience.forEach((value,index)=>{
        let yearval=value.worked_period.split(" Year");
        if(isNaN(Number(yearval[0]))){
            let month_val=yearval[0].split(" month");
            if(!isNaN(Number(month_val[0]))){
                total_exp_month+=Number(month_val[0]);
            }
        }else{
            total_exp_month+=Number(yearval[0])*12;
            let month_val=yearval[1].split(" month");
            if(!isNaN(Number(month_val[0]))){
                total_exp_month+=Number(month_val[0]);
            }                
        }                 
      })
      let year_string="Years";
      let month_string="months";
      if(total_exp_month>11){
          let exp_year=Math.floor(total_exp_month/12);
          let exp_month=total_exp_month % 12;
          if(exp_month==0){
              if(exp_year==0 || exp_year==1) year_string="Year";
              this.userData.total_experience=exp_year+" "+year_string;
          }else{
              if(exp_year==0 || exp_year==1) year_string="Year";
              if(exp_month==0 || exp_month==1) month_string="month";
              this.userData.total_experience=exp_year+" "+year_string+" "+exp_month+" "+month_string;
          }
      }else{
        if(total_exp_month==0 || total_exp_month==1) month_string="month"
          this.userData.total_experience=total_exp_month+" "+month_string;
      }
  }
   getUserValues(){ 
        this.server.get('user')
        .then(res => {
          this.userData = res.result.data;
          LocalStorage.setValue('userData', JSON.stringify(this.userData));
        }); 
  }
  /*openAddExperience(values,index)
  {
    //ExperienceEditPage.existExperienceData = values;
    ExperienceEditPage.editIndex = index;
  	let modal = Modal.create(AddExperiencePage);
    modal.onDismiss(data =>{
      this.getUserValues();
    })
    this.nav.present(modal);
  }*/
}