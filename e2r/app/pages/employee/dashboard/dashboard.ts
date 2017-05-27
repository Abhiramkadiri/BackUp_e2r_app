import {Page, NavController} from 'ionic-angular';
import {CONFIG} from '../../../config';
import {Component} from '@angular/core'
import {HTTP_PROVIDERS, Http, Request, RequestOptions, RequestMethod, Headers, Response} from '@angular/http';

import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';

import {ViewOfferPage} from '../../employee/view_offer/view_offer'
import {ProfilePage} from '../profile/profile'
import {KLST} from '../../../services/klst';

@Component({
  templateUrl: 'build/pages/employee/dashboard/dashboard.html'
})

export class DashboardPage {
	http:Http
  private userData;
  private userType;
  private profilePicture;
  private offers_list:any=[];
  private ProfileStrength:any='Bad';
  constructor(public nav:NavController, private server:HyperService) {
    CONFIG._NAV=this.nav;
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
    this.userType = LocalStorage.getValue('userType');
  	this.nav = nav;
    this.setProfileStrength(this.userData);
    this.getProfilePic();
  }
  
  ionViewWillEnter(){
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
    //console.log(this.userData);
    this.getOffers();
  }

  getProfilePic(){
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
  private getOffers(){
    this.server.get("offers/offered")
    .then(data=>{
      //console.log(data);
      if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0 ){
        this.offers_list=data.result.data;
      }else{
        this.offers_list=[];
      }
      //console.log(this.offers_list);
    })
  }

  private getEmployerProfilePicture(profile_pictureUrl){
    if(profile_pictureUrl!=undefined && profile_pictureUrl!='' && profile_pictureUrl!=null){
      return profile_pictureUrl;
    }else{
      return "img/user.jpg";
    }
  }

  private onViewOffer(current_offer){
    this.nav.push(ViewOfferPage,{current_offer:current_offer});
  }

  profilePage(){
    this.nav.push(ProfilePage);
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
  /*loadDefaultimg(){
    this.profilePicture = '';
    setTimeout(() => {
      this.profilePicture="img/user.jpg";
    }, 10000);
    
  }
  

  viewofferPage(){
    this.nav.push(ViewOfferPage);
  }
  searchPage(){
    this.nav.push(SearchPage);
  }
  companyProfilePage(){
    this.nav.push(CompanyProfilePage);
  }
  shortlistCandidatePage(){
    this.nav.push(ShortlistedCandidatePage);
  }
  logout(){
  	this.logoutServer().subscribe((res: Response) => {
                if (res) {
                    LocalStorage.setValue('loggedIn', false)
                    localStorage.clear();
  					        this.nav.setRoot(LoginPage);
                }
            }); 
  } 
  logoutServer(){
      let headers:Headers = new Headers();
      let requestoptions:RequestOptions;

      headers.append("Content-Type", 'application/json');
      requestoptions = new RequestOptions({
          method: RequestMethod.Get,
          url: CONFIG.SERVICE_URL+'logout',
          headers: headers
      })
      return this.http.request(new Request(requestoptions)) 
  }*/   
}
