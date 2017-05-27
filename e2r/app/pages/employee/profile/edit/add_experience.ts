import {Page, Modal, Alert, Platform, NavController, ViewController, NavParams,Toast} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {ProfilePage} from '../../../employee/profile/profile';
import {DashboardPage} from '../../../employee/dashboard/dashboard';
import {ExperienceEditPage} from '../../../employee/profile/edit/experience_edit';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/add_experience.html'
})
export class AddExperiencePage {
  private button_text:string="Save";
  private page_title:string="Add Experience";
  private screen_type:string;  
	private experience_inputs = {company_name:"",title:"",location:"",from_month:"",from_year:"",to_month:"",to_year:"",worked_period:"",present_work:false}; 
  private experience_data:any={};
  private user_experience:any=[]; 
  private yearListFrom:any=[];
  private monthListFrom:any=[];
  private yearListTo:any=[];
  private monthListTo:any=[];  
  private educations_list:any=[];
  private validate_field_empty:any={}; 
  private feild_validated:boolean=true;
  private total_experience:string=""; 
  /*private addData;
  private userData;
  private submitText;
  private editIndex;
  private experienceTitle;
  private successMessage;
  private deleteData;
  private yearListFrom;
  private monthListFrom;
  private yearListTo;
  private monthListTo;
  private total_experience;
  private experienceInputs = {
    company_name:"",
    title:"",
    location:"",
    from_year:"",
    from_month:"",
    to_year:"",
    to_month:"",
    worked_period:"",
    present_work:false
  };
  http:Http;*/
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
    this.screen_type=(this.param.data.type!=undefined) ? this.param.data.type : "create";
    this.user_experience=(this.param.data.exp_data!=undefined) ? this.param.data.exp_data : [];
    if(this.screen_type=="create"){
      this.button_text="Save";
      this.page_title="Add Experience";
      this.experience_data=this.experience_inputs;
    }else{
      this.button_text="Update";
      this.page_title="Edit Experience";
      this.experience_data=(this.param.data.exp_item!=undefined && this.param.data.exp_item!=null) ? this.user_experience[this.param.data.exp_item] : this.experience_inputs;
    }
    let eduItem=LocalStorage.getValue('valueLists');
    this.educations_list=(typeof(eduItem)!='object')?JSON.parse(eduItem)[0].qualification:eduItem[0].qualification;  
   	/*this.http = http;
    this.server = server; 
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
   // this.existEditVal = ExperienceEditPage.existExperienceData;
    this.editIndex = ExperienceEditPage.editIndex;
    this.experienceInputs = this.userData.experience[this.editIndex];
    if(this.experienceInputs ==undefined){
      this.experienceInputs = {
            company_name:"",
            title:"",
            location:"",
            from_year:"",
            from_month:"",
            to_year:"",
            to_month:"",
            worked_period:"",
            present_work:false
      };
      this.submitText ="Add";
      this.experienceTitle ="Add Experience";
      this.successMessage = "Added Successfully";
    }else{
      this.submitText ="Update";
      this.experienceTitle ="Edit Experience";
      this.successMessage = "Updated Successfully";
    }*/
  }

  ionViewWillEnter(){
    this.yearListFrom = KLST.getYearList();
    this.monthListFrom = KLST.getMonthList("short");
    this.yearListTo = KLST.getYearList();
    this.monthListTo = KLST.getMonthList("short");
  }

  private setToPeriod(){
    if(!this.experience_data.present_work){
      this.experience_data.to_month="";
      this.experience_data.to_year="";
    }
  }

  private onExperienceCalculate(){
    this.calculatecurrentExperience();
  }

  private calculatecurrentExperience(){
    let from_date:any;
    let to_date:any;
    if(this.experience_data.present_work){
      if(this.experience_data.from_month!='' && this.experience_data.from_year!=''){
        from_date=new Date(this.experience_data.from_month+"/"+this.experience_data.from_year);
        to_date=new Date();
        console.log(from_date,to_date,from_date<to_date);
        if(from_date<to_date){
          this.experience_data.worked_period=KLST.dateDifference(from_date,to_date,"YM"); 
        }
        else{
          this.showToastMsg("From Period cannot be greater than Today's Date")
        }
      }else{
        this.experience_data.worked_period="";
      }
    }else{
      if((this.experience_data.from_month!='' && this.experience_data.from_year!='') && (this.experience_data.to_month!='' && this.experience_data.to_year!='')){
        from_date=new Date(this.experience_data.from_month+"/"+this.experience_data.from_year);
        to_date=new Date(this.experience_data.to_month+"/"+this.experience_data.to_year);
        console.log(from_date,to_date,from_date<to_date);
        if(from_date<to_date){
        this.experience_data.worked_period=KLST.dateDifference(from_date,to_date,"YM");
        }
        else{
          this.showToastMsg('From Period cannot be greater than To Period')
        }
      }else{
        // console.log('exp details',this.experience_data);
        // from_date=new Date(this.experience_data.from_month+"/"+this.experience_data.from_year);
        // to_date=new Date();
        // this.experience_data.worked_period=KLST.dateDifference(from_date,to_date,"YM"); 
        // this.experience_data.worked_period="";
      } 
    }
    if(from_date<to_date){
      this.onCalculateTotalExp();
    }
  }    


  private onCalculateTotalExp(){
      let total_exp_month=0;
      this.user_experience.forEach((value,index)=>{
        if(value.worked_period!=''){
          let yearval=value.worked_period.toLowerCase().split(" year");
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
        }
      })
      let year_string="Years";
      let month_string="months";
      if(total_exp_month>11){
          let exp_year=Math.floor(total_exp_month/12);
          let exp_month=total_exp_month % 12;
          if(exp_month==0){
            if(exp_year==0 || exp_year==1) year_string="Year";
              this.total_experience=exp_year+" "+year_string;
          }else{
              if(exp_year==0 || exp_year==1) year_string="Year";
              if(exp_month==0 || exp_month==1) month_string="month";
              this.total_experience=exp_year+" "+year_string+" "+exp_month+" "+month_string;
          }
      }else{
          if(total_exp_month==0 || total_exp_month==1) month_string="month"
          this.total_experience=total_exp_month+" "+month_string;
      }
  }   

  private onSaveExperience(){
    this.feild_validated=this.isFieldValidated();
    if(this.feild_validated){
      if(this.screen_type=="create"){
        this.user_experience.push(this.experience_data);
      }
      this.onCalculateTotalExp();
      console.log('save Exp',this.user_experience);

        let TempArray:any;
      if(this.experience_data.present_work && this.user_experience.lentgth>1){
        TempArray=this.setCurrentCompany();
      }
      else{
        TempArray=this.user_experience;
      }
      this.server.post("user",{experience:TempArray,total_experience:this.total_experience})
      .then((data)=>{
        if(data.status==200 && data.result.response=="success"){
          setTimeout(()=>{this.dismiss()},500);
        }
      })      
    }
  }

  private isFieldValidated(){
    this.validate_field_empty={};
    let feild_validate_status:boolean=true;
    for(let key in this.experience_data){
      if(this.experience_data.present_work){
        if(key!="to_month" && key!="to_year"){
          if(this.experience_data[key]=='' || this.experience_data[key]==null) this.validate_field_empty[key]=true;
        }
      }else{
        if(key!='present_work' && (this.experience_data[key]=='' || this.experience_data[key]==null)) this.validate_field_empty[key]=true;
      }
      
    }
    if(!this.experience_data.present_work){
      if(((this.experience_data.from_month!=undefined &&  this.experience_data.from_month!='') && (this.experience_data.from_year!=undefined &&  this.experience_data.from_year!='')) && ((this.experience_data.to_month!=undefined &&  this.experience_data.to_month!='') && (this.experience_data.to_year!=undefined &&  this.experience_data.to_year!=''))){
        let from_date=new Date(this.experience_data.from_month+"/"+this.experience_data.from_year);
        let to_date=new Date(this.experience_data.to_month+"/"+this.experience_data.to_year);
        if(from_date >= to_date){
          this.validate_field_empty.invalied_date=true;
        }    
      }
      for(let key in this.validate_field_empty){
        return false;
      } 
    }
    return true;
  }

  private dismiss() {
    this.viewCtrl.dismiss({});
  }

  private setCurrentCompany(){
    for(var i=0;i<this.user_experience.length;i++){
      console.log(i,this.param.data.exp_item,this.user_experience[i].present_work);
        if(i!=this.param.data.exp_item && this.user_experience[i].present_work){
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            this.user_experience[i].present_work=false;
            let m=new Date().getMonth();
            this.user_experience[i].to_month=monthNames[m];
            this.user_experience[i].to_year=new Date().getFullYear().toString();
        }
    }
    return this.user_experience;
  }
  private showToastMsg(msg){
      let alert = Toast.create({
        message: msg,
        duration: 2000,
        dismissOnPageChange:true,
        position: 'top'
      });
      this.nav.present(alert);
  }
  /*ionViewWillEnter(){
    this.yearListFrom = KLST.getYearList();
    this.monthListFrom = KLST.getMonthList("short");
    this.yearListTo = KLST.getYearList();
    this.monthListTo = KLST.getMonthList("short");
    this.calculatecurrentExperience();
  }

  private calculatecurrentExperience(){
    let from_date=new Date(this.experienceInputs.from_month+"/"+this.experienceInputs.from_year);
    let to_date=new Date(this.experienceInputs.to_month+"/"+this.experienceInputs.to_year);
    this.experienceInputs.worked_period=KLST.dateDifference(from_date,to_date,"YM"); 
    console.log(this.experienceInputs.worked_period);
    this.onCalculateTotalExp();
  }


    private onCalculateTotalExp(){
        let total_exp_month=0;
        //$(this.userData.experience).each(function(index,value){
          this.userData.experience[this.editIndex] = this.experienceInputs;
          this.userData.experience.forEach((value,index)=>{
            let yearval=value.worked_period.split(" Year");
            if(isNaN(Number(yearval[0]))){
                let month_val=yearval[0].split(" Month");
                if(!isNaN(Number(month_val[0]))){
                    total_exp_month+=Number(month_val[0]);
                }
            }else{
                total_exp_month+=Number(yearval[0])*12;
                let month_val=yearval[1].split(" Month");
                if(!isNaN(Number(month_val[0]))){
                    total_exp_month+=Number(month_val[0]);
                }                
            }                 
        })
        if(total_exp_month>11){
            let exp_year=Math.floor(total_exp_month/12);
            let exp_month=total_exp_month % 12;
            if(exp_month==0){
                this.total_experience=exp_year+" Year";
            }else{
                this.total_experience=exp_year+" Year " +exp_month+" Month";
            }
        }else{
            this.total_experience=total_exp_month+" Month";
        }
        console.log(this.total_experience);
        //this.userData.total_experience=this.total_experience;
    } 

  
  dismiss() {
    this.viewCtrl.dismiss({});
  }*/
  

 
 /* addExperience(addValues){
    this.saveExperience(addValues).subscribe((res: Response) => {
                if (res) {
                    this.addExperienceResult({ status: res.status, result: res.json() });
                }
            }); 
  }*/
  /*saveExperience(values){
    this.nav.present(KLST.showLoading());
      if(this.submitText == "Add")
      {
        if(this.userData.experience == null || this.userData.experience =="" || this.userData.experience ==undefined){
            this.userData.experience = [];
            this.userData.experience.push({"title":values.title,"company_name":values.company_name, "location":values.location, "from_year":values.from_year, 'from_month':values.from_month, "to_year":values.from_year, 'to_month':values.from_month, "present_work":values.present_work,"worked_period":values.worked_period})
        }else{
            this.userData.experience.push({"title":values.title,"company_name":values.company_name, "location":values.location, "from_year":values.from_year, 'from_month':values.from_month, "to_year":values.from_year, 'to_month':values.from_month, "present_work":values.present_work,"worked_period":values.worked_period})
        }
      }else{
            this.userData.experience[this.editIndex] = {"title":values.title,"company_name":values.company_name, "location":values.location, "from_year":values.from_year, 'from_month':values.from_month, "to_year":values.to_year, 'to_month':values.to_month, "present_work":values.present_work,"worked_period":values.worked_period};
      }
      this.addData = {"experience":this.userData.experience, "total_experience":this.total_experience};
      this.server.edit('user',  this.addData)
      .then(data => (this.addExperienceResult(data)));
  }
  addExperienceResult(response){
    KLST.hideLoading();
      if(response.status==200){
        if(response.result.response=='success'){
              this.dismiss();
            }else{
               this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }*/


     /*deleteExperience(){
       this.nav.present(KLST.showLoading());
          this.userData.experience.splice(this.editIndex, 1)
          this.deleteData = {"experience":this.userData.experience};
           this.server.edit('user',  this.deleteData)
          .then(data => (this.addExperienceResult(data)));
      }*/
}

