import {Page, Modal, Platform, Alert, NavController, ViewController,NavParams} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {ProfilePage} from '../../../employee/profile/profile';
import {AddSkillPage} from '../edit/add_skills';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import * as $ from 'jquery';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/skills_edit.html'
})
export class SkillsEditPage {

  private screen_type:string="view";
  private user_skills:any=[];
  private is_owner:boolean=true;
  constructor(http:Http,public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService,private param:NavParams) {
    console.log(this.param.data);
    this.is_owner=this.param.data.is_owner;
    if(this.param.data.type!=undefined) this.screen_type=this.param.data.type;
    if(this.param.data.user_skills!=undefined && this.param.data.user_skills.length > 0){
      this.user_skills=this.param.data.user_skills;
    }else{
      this.user_skills=[]
    }

  }

  private dismiss() {
    this.viewCtrl.dismiss({});
  }
  
  private addNewSkill() {
    if(this.user_skills==undefined ) this.user_skills=[];
    let modal = Modal.create(AddSkillPage,{user_skills:this.user_skills});
    this.nav.present(modal);
    modal.onDismiss(data =>{
      console.log(data);
      console.log(this.user_skills);
    })
  }

  private deleteSkill(skill){
    let confirmation_data:any={}
    confirmation_data.title="Confirmation";
    confirmation_data.message="Are you sure to remove this skill?";
    confirmation_data.onaction=(data)=>{
      if(data){
        console.log(skill);
        this.user_skills.forEach((value,index)=>{
          if(skill.skill_name.toLowerCase()==value.skill_name.toLowerCase()){
            this.user_skills.splice(index,1)
          }
        });
        this.server.post("user",{key_skills:this.user_skills})
        .then((data)=>{
          
        })        
      }
    }
    this.nav.present(KLST.showConfirmation(confirmation_data));
  }
}