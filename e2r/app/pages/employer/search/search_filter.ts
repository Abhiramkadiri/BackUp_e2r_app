import {Page, Modal, ActionSheet, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {File} from 'ionic-native';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {Plugins} from '../../../services/plugins_service';
import {FilterListPage} from './filter_list';
import * as $ from 'jquery';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/search/search_filter.html'
})

export class SearchfilterPage {
  private expreance_value:any={lower:10,upper:15};

  private experience:any=[];
  private education:any=[];
  private skills:any=[];
  private job_type:any=[];
  private relocation:any='All';

  private values_list:any={}
  constructor(http:Http, private plugins: Plugins, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService,public param:NavParams) {
    if(typeof(LocalStorage.getValue('valueLists'))=="string"){
      this.values_list=JSON.parse(LocalStorage.getValue('valueLists'))[0];
    }else{
      this.values_list=LocalStorage.getValue('valueLists')[0];
    }    
  }
  ionViewWillEnter() {
    this.assignFilters();
    console.log(this.values_list); 
    /*if(LocalStorage.getValue('valueLists')==undefined){
      this.server.get("lists")
      .then((data)=>{
        console.log(data);
        if(data.status==200 && data.result.data!=undefined && data.result.data.length >0){
          LocalStorage.setValue('valueLists',data.result.data);
          this.values_list=data.result.data[0];
          this.assignFilters(); 
        }
      });
    }else{
      this.values_list=JSON.parse(LocalStorage.getValue('valueLists'))[0];
      console.log(this.values_list);
      this.assignFilters(); 
    }*/      
  }

  private assignFilters(){
    if(CONFIG.employee_filter.experience!=undefined && CONFIG.employee_filter.experience.length > 0){
      this.setExperience();
    }
    if(CONFIG.employee_filter.education!=undefined && CONFIG.employee_filter.education.length > 0){
      this.setQualification();
    } 
    if(CONFIG.employee_filter.job_type!=undefined && CONFIG.employee_filter.job_type.length > 0){
      this.setJobType();
    }    
    if(CONFIG.employee_filter.skills!=undefined && CONFIG.employee_filter.skills.length > 0){
      this.skills=CONFIG.employee_filter.skills;
    } 
  }

  private setExperience(){
    this.expreance_value={lower:CONFIG.employee_filter.experience[0],upper:CONFIG.employee_filter.experience[CONFIG.employee_filter.experience.length-1]};
    this.experience=CONFIG.employee_filter.experience;
    console.log(this.values_list);
  }
  
  private setQualification(){
    CONFIG.employee_filter.education.forEach((value_ecu)=>{
      this.values_list.qualification.forEach((value,index)=>{
        if(value_ecu==value.name) value.status=true;
      })      
    })
    console.log(this.values_list);
  }
  private setJobType(){
    CONFIG.employee_filter.job_type.forEach((value_jt)=>{
      this.values_list.job_status.forEach((value,index)=>{
        if(value_jt==value.name) value.status=true;
      })      
    })
    console.log(this.values_list);
  }  

  private dismiss() {
      this.viewCtrl.dismiss({});
  }
  private onChangeExpFilter(){
    this.experience=[];
    for(let i=this.expreance_value.lower; i <= this.expreance_value.upper; i++){
      this.experience.push(i+"");
    }
  }
  private clearFilter(){
    this.expreance_value={lower:10,upper:15};
    this.experience=[];
    this.skills=[];
    this.values_list.qualification.forEach((value,index)=>{
      value.status=false;
    })
    this.values_list.job_status.forEach((value,index)=>{
      value.status=false;
    })
    CONFIG.employee_filter={};    
  }
  private applyFilter(){
    this.values_list.qualification.forEach((value,index)=>{
      if(value.status==true) this.education.push(value.name);
    })
    this.values_list.job_status.forEach((value,index)=>{
      if(value.status==true) this.job_type.push(value.name);
    })
    if(this.relocation=='All'){
      CONFIG.employee_filter={education:this.education,experience: this.experience,job_type:this.job_type,skills:this.skills}; 
    }
    else{
      CONFIG.employee_filter={education:this.education,experience: this.experience,job_type:this.job_type,skills:this.skills,relocation:this.relocation}; 
    }
    this.nav.pop();
    /*let send_data:any={}
    send_data.filter={education:this.education,experience: this.experience,job_type:this.job_type,skills:this.skills}
    this.server.post("find/employees",send_data)
    .then((data)=>{
      if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0 ){
      }else{
      }
    })*/
  }


  private onShowList(list_type){
    console.log(this.values_list);
    switch(list_type){
      case "education":
        this.nav.push(FilterListPage,{type:'education',data:this.values_list.qualification});
      break;
      case "employement":
        this.nav.push(FilterListPage,{type:'employement',data:this.values_list.job_status});
      break;
      case "skill":
        this.nav.push(FilterListPage,{type:'skill',data:this.skills});
      break;            
    }
  }

  private onRemoveFileterEdu(education){
    education.status=false;
  }
  private onRemoveFileterJobStatus(job_status){
    job_status.status=false;
  }

  private onRemoveFileterSkills(skill_index){
    this.skills.splice(skill_index,1);
  }
}

