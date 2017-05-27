import {Page, NavController, NavParams,Slides,Modal} from 'ionic-angular';
import {LocalStorage} from '../../../services/ls_srvs';
import {Component,ViewChild} from '@angular/core';
import {ProfilePage} from '../../employee/profile/profile';
import {HyperService} from '../../../services/http_service';
import {ViewMore} from '../../../pages/employer/view_more/view_more';
import {CompanyProfilePage} from '../../../pages/employer/company_profile/company_profile';
import * as $ from "jquery"; 
import {ViewOfferPage} from '../../employee/view_offer/view_offer'
@Component({
  templateUrl: 'build/pages/employee/employment_offers/employment_offers.html'
})

export class EmploymentOffers {

  private tabs:any=[];
  private offers_list:any=[];
  private isExpand:any=-1;

  @ViewChild('mySlider') slider:Slides;
  constructor(public nav:NavController, public server:HyperService) {
    this.tabs=[{title:"Offers"},{title:"Accepted"},{title:"Interested"},{title:"Rejected"}]
    this.offers_list.Offered=[];
    this.offers_list.Accepted=[];
    this.offers_list.Interested=[];
    this.offers_list.Rejected=[];
  }
  ionViewWillEnter(){
    this.offers_list.Offered=[];
    this.offers_list.Accepted=[];
    this.offers_list.Interested=[];
    this.offers_list.Rejected=[];
    this.getOffersSent();
  }
  private getOffersSent(){
    this.server.get("offers")
    .then((data)=>{
      console.log(data);
      if(data.status==200 && data.result!=undefined){
        if(data.result.data!=undefined && data.result.data.length > 0 ){
         this.setOffersList(data.result.data);
        }
      else{
        setTimeout(()=>{
          this.slider.getSlider().update();
          let index = this.slider.getActiveIndex();
          this.setActivetab(index);
        },100);
      }
      }
    })    
  } 

  private setOffersList(list){
    this.offers_list.Offered=[];
    this.offers_list.Accepted=[];
    this.offers_list.Interested=[];
    this.offers_list.Rejected=[];

    for(var i=0;i<list.length;i++){
      let status=list[i].offer_status;
        switch(status){
          case 'Offered': 
            this.offers_list.Offered.push(list[i]);
          break;
          case 'Accepted': 
            this.offers_list.Accepted.push(list[i]);
          break;
          case 'Interested': 
            this.offers_list.Interested.push(list[i]);
          break;
          case 'Rejected': 
            this.offers_list.Rejected.push(list[i]);
          break;
        }
    }
    setTimeout(()=>{
      this.slider.getSlider().update();
      let index = this.slider.getActiveIndex();
      this.setActivetab(index);
    },100);
  }

  private onTabClick(tab){
      this.slider.slideTo(tab,300);
      this.slider.getSlider().update();
  }

  private onViewMore(emp){
    let modal=Modal.create(ViewMore,{Employee:emp});
    this.nav.present(modal);
  }

  private onShowEmployeeProfile(employee){
      this.nav.push(ProfilePage,{employee:employee})
  }  

  onSlideChanged(){
    let index = this.slider.getActiveIndex();
    this.setActivetab(index);
    let currentIndex = this.slider.getActiveIndex();
    let pos=document.getElementById('Slider1').scrollLeft;
    $('scroll-content').scrollTop(0);
    if(currentIndex>2){
      document.getElementById('Slider1').scrollLeft=pos+100;
    }
    else{
      document.getElementById('Slider1').scrollLeft=pos-200;
    }
    
  }

  private setActivetab(index){
      for(var i=0;i<this.tabs.length;i++){
          document.getElementById('tab_'+i).className='tabsTitle';
      }
      document.getElementById('tab_'+index).className='tabsTitle CurrentTab'
  }

  private onViewOffer(current_offer){
    this.nav.push(ViewOfferPage,{current_offer:current_offer});
  }
  private getEmployerProfilePicture(profile_pictureUrl){
    if(profile_pictureUrl!=undefined && profile_pictureUrl!='' && profile_pictureUrl!=null){
      return profile_pictureUrl;
    }else{
      return "img/user.jpg";
    }
  }
}