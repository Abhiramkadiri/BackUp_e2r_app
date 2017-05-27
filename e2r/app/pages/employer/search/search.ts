import {Page, Modal, NavController, ViewController,NavParams,Alert} from 'ionic-angular';
import {LocalStorage} from '../../../services/ls_srvs';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {SearchfilterPage} from '../../employer/search/search_filter';
import {HyperService} from '../../../services/http_service';
import {KLST} from '../../../services/klst';
import {SelectJob} from '../../employee/profile/shortlist_candidate/shortlist';
import {ProfilePage} from '../../employee/profile/profile';

import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/search/search.html'
})

export class SearchPage {
	http:Http;
    private employees_list:any=[];
    private jobs_list:any=[];
    private search_text:string="";
    private isApplied:string="";
    private status_highlight:any=["","userProfessional","userGood","userAvg","userPoor"];
    constructor(http:Http,public nav :NavController, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
        this.http = http;
        this.nav = nav;
        this.isApplied='#446fa8';
        CONFIG.employee_filter={};
        this.getJobs();
    }

    ionViewWillEnter(){
        if(this.search_text.length > 0){
            this.getEmployees(this.search_text);
        }else{
            this.getEmployees();
        } 
        //this.employees_list=CONFIG.search_fileter_result;    
    }

    private getEmployees(search_text:string=""){
        let send_data:any={}
        let filter:any={};
        let filter_status=this.isFilterApplied();
        console.log(filter_status);
        // console.log(Object.getOwnPropertyNames(CONFIG.employee_filter).length === 0);
        // console.log(CONFIG.employee_filter);
        if(search_text==''){
            send_data.filter=CONFIG.employee_filter;
        }else{
            send_data.filter=CONFIG.employee_filter;
            send_data.search_string=search_text;
        }
        if(filter_status || search_text!=''){
            this.server.post("find/employees",send_data)
            .then((data)=>{
                if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0){
                    this.employees_list=data.result.data;
                }else{
                    this.employees_list=[];
                }
            })
        }else{
            this.employees_list=[];
        }
    }

    private isFilterApplied(){
        let isEmpty=(Object.getOwnPropertyNames(CONFIG.employee_filter).length === 0);
        if(isEmpty){
                console.log('not applied');
                this.isApplied='#446fa8';
                return false;
        }
        else{
            let obj=CONFIG.employee_filter;
            if(obj.education.length>0 || obj.experience.length>0 || obj.job_type.length>0 || obj.skills.length>0 || obj.relocation!=undefined){
                    console.log('applied');
                    this.isApplied='#008000'
                    return true;
            }
            else{
                 console.log('not applied');
                 this.isApplied='#446fa8';
                 return false;
            }
        }
        
    }

    private onSearchEmployee(){
        if(this.search_text.length > 0){
            this.getEmployees(this.search_text);
        }else{
            this.getEmployees();
        }
    }

    private getStatusHighLight(rating_value:number=1){
        return this.status_highlight[rating_value];
    }

    private getCurrentCompany(experience){
        let current_company="";
        if(experience!=undefined){
            experience.forEach((value,index)=>{
                if(value.present_work){
                    current_company=value.company_name;
                }
            })
            return current_company;
        }else{
            return current_company;
        }
    }

    private openFilter(){
        this.nav.push(SearchfilterPage,{data:this.employees_list});
    } 

    private onShowEmployeeProfile(employee){
        this.nav.push(ProfilePage,{employee:employee,fromSearch:true})
    }   

    private getJobs(){
      this.server.get('jobs')
      .then((data)=>{
          console.log(data);
          if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0){
              this.jobs_list=data.result.data;
          }else{
              this.jobs_list=[];
          }
      })
  }
  
  private ShortListCandidate(employee){	

    if(this.jobs_list.length>0){      
      localStorage.setItem('isShortListed','false');
      this.nav.push(SelectJob,{employee:employee,jobs:this.jobs_list});
    }
    else{

      let confirm = Alert.create({
          message: 'Please create a job to Shortlist candidate.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
              }
            }
          ]
      });
      this.nav.present(confirm);
    }

  }
}
