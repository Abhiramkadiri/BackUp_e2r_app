import {Page, Modal, NavController,NavParams} from 'ionic-angular';
import {CONFIG} from '../../../config';
import {LocalStorage} from '../../../services/ls_srvs';
import {HTTP_PROVIDERS, Http, Request, RequestOptions, RequestMethod, Headers, Response} from '@angular/http';
import {BidHistoryPage} from './bid_history';
import {SubmitOffer} from '../../employer/submit_offer/submit_offer';
import {Rating} from '../../employer/rating/rating';
import {ProfilePage} from '../../employee/profile/profile';
import {Component} from '@angular/core';
import {HyperService} from '../../../services/http_service';
@Component({
  templateUrl: 'build/pages/employer/shortlisted_candidates/shortlisted_candidates.html'
})

export class ShortlistedCandidatePage {
	http:Http
	private profilePicture;
	private _image;
	private userData;
  private skill = false;
  private offer = false;
  private experience=false;
  private experienceSummary = false;
  private rating = 0;
  private ProfileStrength:any='Bad';
  constructor(http:Http, public nav:NavController,private param:NavParams,private server:HyperService) {
    console.log(param.data);
  	this.http = http;
  	this.nav = nav;
    this.userData = param.data.item.employee; 
    this.setProfileStrength(this.userData);
    this.setRating();
  	// this.getProfilePic();
  }
  // getProfilePic(){
  //   this.profilePicture = CONFIG.SERVICE_URL+"profilepicture/"+this.userData._id.$id+"?r=" + (new Date()).getTime();
  //   this._image = new Image();
  //   this._image.src = this.profilePicture;
  //   this._image.onload = (() => console.log("ok ok"));
  //   this._image.onerror = (() => this.loadDefaultimg());
  // }

  private setRating(){
    if(this.userData.key_skills!=undefined){
      for(var i=0;i<this.userData.key_skills.length;i++){
        this.rating=this.rating+this.userData.key_skills[0].rating;
        // console.log(i,this.rating);
      }
    }

  }
  private setCurrCompany(exp,val){
    let tempArray:any=[];

    if(exp!=undefined){
      exp.forEach(function(value){
        if(value.present_work){
          tempArray.push(value);
        }
      })
      if(tempArray.length==0){
           return 'No details found.';
      }
      else{
        for(var i=0;i<exp.length;i++){
            if(exp[i].present_work){
                return exp[i][val];
            }
        }
      }
    }
    else{
      return 'No details found.';
    }
  }

  private isTrue(exp){
    // console.log('isTrue',exp);
    return exp.present_work;
  }

  private onReviewProfile(){
    this.nav.push(ProfilePage,{employee:this.userData})
  }

  private onRemoveCandidate(){
      let employee_email=(typeof(this.param.data.item.employee)=="object") ? this.param.data.item.employee.email :this.param.data.item.employee;
      let job_coed=(typeof(this.param.data.item.job)=="object") ? this.param.data.item.job._id.$id : this.param.data.item.job;
      this.server.DeleteFiles("ShortList",{employee:employee_email,job:job_coed},true)
      .then(data=>{
        console.log(data);
          if(data.status==200 && data.result.response=="success"){
            this.nav.pop();
          }
      });
  }
  
  loadDefaultimg(){
    this.profilePicture = '';
    this.profilePicture="img/user.jpg";
  }

  openBidHistory(){
    let modal = Modal.create(BidHistoryPage);
      modal.onDismiss(data =>{
      })
      this.nav.present(modal);
  }
  skillShow(){
    this.offer = false;
    this.experience = false;
    this.experienceSummary=false;
    this.skill = !this.skill;
  }
  offerShow(){
    this.skill = false;
    this.experience = false;
    this.experienceSummary=false;
    this.offer = !this.offer;
  }
  experienceShow(){
    this.skill = false;
    this.offer = false;
    this.experienceSummary=false;
    this.experience=!this.experience;
  }
  experiencesummaryShow(){
    this.skill = false;
    this.offer = false;
    this.experience =false;
    this.experienceSummary=!this.experienceSummary;
  }
  private submitoffer(){
    // this.nav.push(SubmitOffer)
    let modal=Modal.create(SubmitOffer,{item:this.param.data.item});
    this.nav.present(modal);
    modal.onDismiss(res=>{
        console.log(res);
        if(res.status=='submitted'){
          this.nav.pop();
        }
    });
  }
  private ratingPage(){
    this.nav.push(Rating)
  }
  private setProfileStrength(data){
    // console.log(data);
    let dataLen=0;
      for(let item in data){
        // console.log(item);
        if(data[item]!='' && data[item]!=undefined){
          dataLen++;
        }
      }
      let percent=Math.round((dataLen/31)*100);
      // console.log('dataLen',dataLen);
      // console.log('percent',percent);
      percent=(percent>100)?100:percent;
      if(percent<50){
          this.ProfileStrength='Bad';
      }
      else if(percent>=50 && percent<80){
          this.ProfileStrength='Good';
      }
      else if(percent>=80){
          this.ProfileStrength='Excellent';
      }
      // console.log('Strength',this.ProfileStrength);
  } 
}
