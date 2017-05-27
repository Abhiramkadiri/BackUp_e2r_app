import {Page, Modal, Alert, Platform, NavController, ViewController, NavParams} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {ProfilePage} from '../../../employee/profile/profile';
import {DashboardPage} from '../../../employee/dashboard/dashboard';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/add_skills.html'
})
export class AddSkillPage {
  private search_text:string="";
  private skills_list:any=[];
  private user_skills:any=[];
  private selected_skills:any=[];
  private removed_skills:any=[];
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
    if(this.param.data.user_skills!=undefined){
      this.selected_skills=[];
      this.user_skills=this.param.data.user_skills;
      this.user_skills.forEach((value,index)=>{
        this.selected_skills.push(value.skill_name);
      })
    }else{
      this.user_skills=[];
      this.selected_skills=[];
    }
    this.onSearchFilterItem();
  }

  private onSearchFilterItem(){
    let get_url=(this.search_text.length == 0) ? "skills" : "skills/search/"+this.search_text;
    this.server.get(get_url)
    .then((data)=>{
      if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0 ){
        this.skills_list=this.compareSkills(data.result.data);
      }else{
        this.skills_list=[];
      }
    })      
  }

  private compareSkills(skill_data){
    let out_data:any=[];
    if(this.selected_skills.length > 0 && skill_data.length > 0){
      skill_data.forEach((value,index)=>{
        let skill_name=value.name;
        if(this.selected_skills.indexOf(skill_name) > -1){
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

  private addSkill(skill){
    if(skill.status==undefined || skill.status==false){
      skill.status=true;
      this.selected_skills.push(skill.name);
      let skill_index=this.removed_skills.indexOf(skill.name);
      if(skill_index > -1){
        this.removed_skills.splice(skill_index,1);
      }      
    }else{
      skill.status=false;
      this.removed_skills.push(skill.name);
      let skill_index=this.selected_skills.indexOf(skill.name);
      if(skill_index > -1){
        this.selected_skills.splice(skill_index,1);
      }
    }
  }
  private addUserSkills(){
    console.log(this.selected_skills,this.user_skills)
      this.selected_skills.forEach((value,index)=>{
        let skill_exist=false;
        this.user_skills.forEach((value_skill_use,index)=>{
          if(value.toLowerCase()==value_skill_use.skill_name.toLowerCase()){
            skill_exist=true;
          }
        })
        if(!skill_exist){
          this.user_skills.push({skill_name:value,rating:0});
        }
      })
      this.removed_skills.forEach((value,index)=>{
        let skill_exist=false;
        let skill_index:number;
        this.user_skills.forEach((value_skill_use,skill_use_index)=>{
          if(value.toLowerCase()==value_skill_use.skill_name.toLowerCase()){
            skill_exist=true;
            skill_index=skill_use_index;
          }
        }) 
        if(skill_exist){
          this.user_skills.splice(skill_index,1);
        }               
      })
      console.log('after each',this.user_skills);
      //setTimeout(()=>{this.dismiss()},500);
      this.server.post("user",{key_skills:this.user_skills})
      .then((data)=>{
        setTimeout(()=>{this.dismiss()},500);
      })
  }  
  private dismiss() {
    this.viewCtrl.dismiss({});
  }


}