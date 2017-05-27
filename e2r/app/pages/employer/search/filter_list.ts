import {Page, Modal, ActionSheet, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {File} from 'ionic-native';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {Plugins} from '../../../services/plugins_service';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/search/filter_list.html'
})

export class FilterListPage {
  private search_text:string="";
  private list_title:string="";
  private filter_type:string="";
  private filter_list:any=[];
  private filter_skills:any=[];
  constructor(http:Http, private plugins: Plugins, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, public param:NavParams) {
    this.filter_type=param.data.type;
    switch(this.filter_type){
      case "education":
        this.list_title="Education";
      break;
      case "employement":
        this.list_title="Employement Type";
      break;
      case "skill":
        this.list_title="Skills";
      break;            
    }
    //this.filter_list=param.data.data;    
    if(this.filter_type!="skill"){
      this.filter_list=param.data.data;
    }else{
      this.filter_skills=param.data.data;
      this.server.get("skills")
      .then((data)=>{
        if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0 ){
          //this.filter_list=data.result.data;
          this.filter_list=this.compareSkills(data.result.data);
        }else{
          this.filter_list=[];
        }
      })
    }
  }
  private dismiss() {
      this.viewCtrl.dismiss({});
  }

  private onSearchFilterItem(){
    let get_url=(this.search_text.length == 0) ? "skills" : "skills/search/"+this.search_text;
    this.server.get(get_url)
    .then((data)=>{
      if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0 ){
        this.filter_list=this.compareSkills(data.result.data);
      }else{
        this.filter_list=[];
      }
    })      
  }

  private selectedFilters(item,index){
    //console.log(item);
    if(item.status==undefined || item.status==false){
      item.status=true;
      if(this.filter_type=="skill") this.filter_skills.push(item.name);
    }else{
      item.status=false;
      if(this.filter_type=="skill"){
        let skill_index=this.filter_skills.indexOf(item.name);
        if( skill_index > -1){
          this.filter_skills.splice(skill_index,1);
        }
      }
    }
    //console.log(this.filter_skills);
  }

  private clear(){
    this.filter_list.forEach((value,index)=>{
      //console.log(value);
      if(value.status) value.status=false;
    })
  }

  private compareSkills(skill_data){
    let out_data:any=[];
    //console.log(this.filter_skills);
    if(this.filter_skills.length > 0 && skill_data.length > 0){
      skill_data.forEach((value,index)=>{
        let skill_name=value.name;
        //console.log(skill_name)
        if(this.filter_skills.indexOf(skill_name) > -1){
          value.status=true;
          out_data.push(value);
        }else{
          out_data.push(value);
        }
      });
    }else{
      out_data=skill_data;
    }
    return out_data;
  }
  private onClearSkillFilter(){
    this.filter_skills=[];
  }
}

