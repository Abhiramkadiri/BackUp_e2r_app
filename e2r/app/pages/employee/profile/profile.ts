import {Page, Modal, NavController, NavParams,Alert} from 'ionic-angular';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {Component} from '@angular/core';
import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {BasicEditPage} from '../../employee/profile/edit/basic_edit';
import {BioEditPage} from '../../employee/profile/edit/bio_data_edit';
import {SummaryEditPage} from '../../employee/profile/edit/summary_edit';
import {SkillsEditPage} from '../../employee/profile/edit/skills_edit';
import {EducationEditPage} from '../../employee/profile/edit/education_edit';
import {ExperienceEditPage} from '../../employee/profile/edit/experience_edit';
import {SupportingDocsEditPage} from '../../employee/profile/edit/supporting_docs_edit';
import {EditResume} from '../../employee/profile/edit/resume_edit';
import {SelectJob} from '../profile/shortlist_candidate/shortlist';
import {KLST} from '../../../services/klst';
import {SocialSharing,InAppBrowser, File} from 'ionic-native';
@Component({
  templateUrl: 'build/pages/employee/profile/profile.html'
})

export class ProfilePage {
  private is_owner:boolean=false;
  private userData:any=[];
  private profilePicture:string="img/user.jpg";
  private _image:any;
  private canShow:any=false;
  private ProfileStrength:any;
  private education:any=[];
  private experience:any=[];
  private documents:any=[];
  private jobs_list:any=[];

  http:Http;
  constructor(http:Http, private params: NavParams, private nav: NavController, private server:HyperService) {
    CONFIG._NAV=this.nav;
    this.http = http;
    localStorage.setItem('isShortListed','false');
    this.getJobs();
  }

  ionViewWillEnter(){
    if(this.params.data.employee!=undefined){
      this.is_owner=false;
      this.userData=this.params.data.employee;
      this.getProfilePic();

      if(this.params.data.fromSearch!=undefined){
          this.canShow=this.params.data.fromSearch;
          let isShortListed=localStorage.getItem('isShortListed');
          localStorage.removeItem('isShortListed');
          if(isShortListed=='true'){
            setTimeout(()=>{
              this.nav.pop();
            },500)
          }
      }
    }else{
      this.is_owner=true;
      this.userData = JSON.parse(LocalStorage.getValue('userData'));
      this.getUserValues();
    }
     console.log('user',this.userData);
    this.setFilterList();
    this.setProfileStrength(this.userData);
  }
  getProfilePic(){
    console.log(this.userData.profile_pictureUrl);
    if(this.userData.profile_pictureUrl!=undefined && this.userData.profile_pictureUrl!=''){
      KLST.setUserProfilePicture(this.userData.profile_pictureUrl,"profile",(data)=>{
        if(data.image_url!=undefined){
          this.profilePicture = data.image_url;
        }else{
          this.profilePicture=this.userData.profile_pictureUrl;
        }
      })
    }else{
      this.profilePicture="img/user.jpg";
    }
  }
  summaryText(str){
    if(str.length > 50) str = str.substring(0,80);
    return str+'..';
  }
  getUserValues(){
    if(this.is_owner){
      this.nav.present(KLST.showLoading());
      this.server.get('user')
      .then(response => {
        KLST.hideLoading()
          this.userData = response.result.data;
          //console.log(this.userData);
          LocalStorage.setValue('userData', JSON.stringify(this.userData)) 
          this.getProfilePic();
      });
    }else{
       this.getProfilePic();
    }
  }

  openBasicEdit() {
    let modal = Modal.create(BasicEditPage);
    this.nav.present(modal);
    modal.onDismiss(data =>{
      this.getUserValues();
    })  
  }
  openBioEdit() {
    let modal = Modal.create(BioEditPage);
    this.nav.present(modal);
    modal.onDismiss(data =>{
      this.getUserValues();
    })
  }
  openSummaryEdit() {
    let modal = Modal.create(SummaryEditPage,{is_owner:this.is_owner,summary_data:this.userData.summary});
    this.nav.present(modal);
    modal.onDismiss(data =>{
      this.getUserValues();
    })
  }
  private openSkills(type) {

    this.nav.push(SkillsEditPage,{type:type,is_owner:this.is_owner,user_skills:this.userData.key_skills});
    /*let modal = Modal.create(SkillsEditPage);
    this.nav.present(modal)
     modal.onDismiss(data =>{
      this.getUserValues();
    })*/
  }
  openEducationEdit(type) {
    this.nav.push(EducationEditPage,{type:type,is_owner:this.is_owner,user_data:this.userData});
    // let modal = Modal.create(EducationEditPage,{type:type,is_owner:this.is_owner,user_data:this.userData});
    // this.nav.present(modal);
    // modal.onDismiss(data =>{
    //   this.getUserValues();
    // })
  }
  openExperienceEdit(type) {
    this.nav.push(ExperienceEditPage,{type:type,is_owner:this.is_owner,user_data:this.userData});
    // let modal = Modal.create(ExperienceEditPage,{type:type,is_owner:this.is_owner,user_data:this.userData});
    // this.nav.present(modal);
    // modal.onDismiss(data =>{
    //   this.getUserValues();
    // })
  }
  openSupportingDocsEdit(type){
  	let modal = Modal.create(SupportingDocsEditPage,{type:type,is_owner:this.is_owner,user_data:this.userData});
    this.nav.present(modal);
    modal.onDismiss(data =>{
      this.getUserValues();
    })
  }

  private viewDocs(url){
      console.log(url);
      let isWeb=(window.navigator.platform=="Win32") ? true :false;
      if(isWeb){
          window.open(url,"_blank","clearcache=no,toolbar=yes");
      }
      else{
          InAppBrowser.open(url,"_system","location=yes,toolbar=yes");
      }
  }



  ////Oprtion for Employer 
  private BlockCandidate(){
    console.log(this.userData.email);

        let confirm = Alert.create({
        message: 'Are you sure you want to block this candidate?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
            }
          },
          {
            text: 'OK',
            handler: () => {
                let send_data:any={
                  'employee':this.userData.email,
                  'reson':"",
                  'description':""
                };
                this.server.post("BlockList",send_data,true)
                .then(res=>{
                  console.log('Blocked');
                  this.nav.pop()
                })
            }
          }
        ]
    });
    this.nav.present(confirm);
  }

  private ShortListCandidate(){	

    if(this.jobs_list.length>0){      
      localStorage.setItem('isShortListed','false');
      this.nav.push(SelectJob,{employee:this.userData,jobs:this.jobs_list});
    }
    else{

      let confirm = Alert.create({
          message: 'Please create a job to Shortlist candidate.',
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
              }
            }
          ]
      });
      this.nav.present(confirm);
    }

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
      // // console.log('dataLen',dataLen);
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
  } 


  private setFilterList(){
      this.education=this.userData.education.filter((item, index) => index < 3 );
      this.experience=this.userData.experience.filter((item, index) => index < 3 )
      this.documents=this.userData.documents.filter((item, index) => index < 3 )
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

  private setDate(d){
    let options={
       month: 'long',
       year: 'numeric', 
       day: 'numeric',
       hour: 'numeric',
       minute: 'numeric'   
    }
    let date=new Date(d).toLocaleString('en-US', options);
      return date;
  }
  private openLink(link){
      InAppBrowser.open(link,"_system","location=yes,toolbar=yes");
  }  

  private viewResume(){
        let isWeb=(window.navigator.platform=="Win32") ? true :false;
        if(this.userData.resumeUrl!=undefined && this.userData.resumeUrl!=""){
            if(isWeb){
                window.open(this.userData.resumeUrl,"_blank","clearcache=no,toolbar=yes");
            }
            else{
                InAppBrowser.open(this.userData.resumeUrl,"_system","location=yes,toolbar=yes");
            }
        }
        else{            
            let alert = Alert.create({
                          // title: 'Resume',  
                          subTitle: "No Resume to view",
                          buttons: ['OK']
                        });
            this.nav.present(alert);
        }
  } 

  private editResume(){
      this.nav.push(EditResume,{user:this.userData});
  }
  private onSkype(id){
    console.log("skype://"+id+"?call");
      window.location.href="skype://"+id+"?call";
  }
}
