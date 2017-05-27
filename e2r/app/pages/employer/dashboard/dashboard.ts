import {Page, NavController,Modal} from 'ionic-angular';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Request, RequestOptions, RequestMethod, Headers, Response} from '@angular/http';
import {LoginPage} from '../../login/login';
import {CompanyProfilePage} from '../../employer/company_profile/company_profile';

import {ShortlistedCandidatePage} from '../../employer/shortlisted_candidates/shortlisted_candidates';
import {ShortListed} from '../../../pages/employer/shortlisted/shortlisted';
import {OffersSent} from '../../../pages/employer/offers_sent/offers_sent';
// import {OfferDetails} from '../../../pages/employer/offer_details/offer_details';
import {ViewMore} from '../../../pages/employer/view_more/view_more';

//import {SpecialitiesPage} from '../../employer/company_profile/edit/specialities';
//import {SearchPage} from '../../employer/search/search';
import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {KLST} from '../../../services/klst';

import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/dashboard/dashboard.html'
})

export class DashboardEmployerPage {
	http:Http
  private userData:any={};
  
  private _image;
  private teamPicture:any;
  private profilePicture:string="img/user.jpg";
  private shorted_list:any=[];
  private offers_list:any=[];

  constructor(http:Http, public nav:NavController, public server:HyperService) {
    CONFIG._NAV=this.nav;
    this.http = http;
  }
  ionViewWillEnter(){
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
    this.getUserValues();
    this.getShortLists();
    this.getOffersSent();
  } 
  /*private getTeamImage(team_image){
    if(team_image!=undefined && team_image!=''){
      let img=new Image()
      img.src=this.userData.team_pictureUrl+"?r"+new Date().getTime();      
      let image_url=this.userData.team_pictureUrl     
      return {'background-image':'url('+image_url+')'};
    }else{
      return {'background-image':'url(img/team.jpg)'};
    }
  } 
  private getUserImage(user_image){
    console.log(user_image);
    if(user_image!=undefined && user_image!=''){
      let img=new Image()
      img.src=this.userData.profile_pictureUrl+"?r"+new Date().getTime();
      let image_url=this.userData.profile_pictureUrl;
      return image_url;
    }else{
      return "img/user.jpg";
    }    
  }*/    
  private getUserValues(){
    this.nav.present(KLST.showLoading());
     this.server.get('user')
    .then(data => (this.getUserValuesresult(data)));
  }  
  private getUserValuesresult(res){
    KLST.hideLoading();
    this.userData = res.result.data;
    LocalStorage.setValue('userData', JSON.stringify(res.result.data))
    this.getProfilePic();
  } 

  private getProfilePic(){
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
    if(this.userData.team_pictureUrl!=undefined && this.userData.team_pictureUrl!=''){
      KLST.setUserProfilePicture(this.userData.team_pictureUrl,"team",(data)=>{
        if(data.image_url!=undefined){
          this.teamPicture={'background-image':'url('+data.image_url+')'};
        }else{
          this.teamPicture={'background-image':'url('+this.userData.team_pictureUrl+')'};
        }
      })      
      
    }else{
      this.teamPicture={'background-image':'url('+"img/team.jpg"+')'};
    }
  }

  private getShortLists(){
    this.server.get("ShortList")
    .then((data)=>{
      if(data.status==200 && data.result!=undefined){
        if(data.result.data!=undefined && data.result.data.length > 0 ){
         this.shorted_list=data.result.data;
        }else{
          this.shorted_list=[];
        }
      }else{
        this.shorted_list=[];
      }
    })
  }  

  private onShowProfile(){
    this.nav.push(CompanyProfilePage);
  }
  private onShowShortedList(){
    this.nav.push(ShortListed);
  }

  private onShowShortedEmployee(list_item,list_index){
    console.log(list_item);
    console.log(list_index);
    this.nav.push(ShortlistedCandidatePage,{item:list_item});
  }

  private getOffersSent(){
    this.server.get("offers")
    .then((data)=>{
      if(data.status==200 && data.result!=undefined){
        if(data.result.data!=undefined && data.result.data.length > 0 ){
         this.offers_list=data.result.data;
         console.log(this.offers_list);
        }else{
          this.offers_list=[];
        }
      }else{
        this.offers_list=[];
      }
    })    
  }
  private onShowOffersSent(){
    this.nav.push(OffersSent);
  }

  private onShowOfferDetails(list_item,list_index){
    console.log(list_item);
    console.log(list_index);
    let modal=Modal.create(ViewMore,{Employee:list_item});
    this.nav.present(modal);
  }      
}
