import {Page, NavController, NavParams} from 'ionic-angular';
import {LocalStorage} from '../../../services/ls_srvs';
import {InAppBrowser} from 'ionic-native';
import {Component} from '@angular/core';

import {HyperService} from '../../../services/http_service';

import {CompanyProfilePage} from '../../../pages/employer/company_profile/company_profile';

@Component({
  templateUrl: 'build/pages/employee/view_offer/view_offer.html'
})

export class ViewOfferPage {
  private current_offer:any={};
  private show_btn_accept:boolean=true;
  private show_btn_interested:boolean=true;
  private show_btn_reject:boolean=true;
  constructor(private nav:NavController, private param:NavParams, private server:HyperService) {
    this.current_offer=this.param.data.current_offer;
    console.log(this.current_offer);
  }

  private getEmployerProfilePicture(profile_pictureUrl){
    if(profile_pictureUrl!=undefined && profile_pictureUrl!='' && profile_pictureUrl!=null){
      return profile_pictureUrl;
    }else{
      return "img/user.jpg";
    }
  }

  private onViewEmployerProfile(){
    this.nav.push(CompanyProfilePage,{type:'other',user_data:this.current_offer.employer});
  }

  private onOpenJobDescription(job_descriptionUrl){
    let inappreff:any;
    inappreff =InAppBrowser.open(job_descriptionUrl,"_blank","location=yes,clearsessioncache=yes");
  }
// offers/rejectall
  private onUpdateOfferStatus(action_status){
    let send_data:any={};
    send_data.job=this.current_offer.job._id.$id;
    send_data.employer=this.current_offer.employer.email
    this.server.post("offers/"+action_status,send_data)
    .then((data)=>{
      console.log(data);

      if(data.status==200 && data.result.response=="success"){
        if(action_status=='accept'){
          this.server.post("offers/rejectall",null)
          .then(res=>{
              console.log('reject',res);
              this.nav.pop();
          });
        }
        else{
          this.nav.pop();
        }
        // this.showActionButtons(action_status)
      }else{

      }
    })    
  }
  private showActionButtons(action_status){
      switch (action_status){
        case "accept":
              this.show_btn_accept=false;
              this.show_btn_interested=true;
              this.show_btn_reject=true;
        break;
        case "interested":
              this.show_btn_accept=true;
              this.show_btn_interested=false;
              this.show_btn_reject=true;
        break;
        case "reject":
              this.show_btn_accept=true;
              this.show_btn_interested=true;
              this.show_btn_reject=false;
        break;                    
      }
  }
  private initializeActionButtons(action_status){
      console.log('initializeActionButtons',action_status);
      switch (action_status){
        case "Offered":
              this.show_btn_accept=true;
              this.show_btn_interested=true;
              this.show_btn_reject=true;
        break;
        case "Accepted":
              this.show_btn_accept=false;
              this.show_btn_interested=true;
              this.show_btn_reject=true;
        break;
        case "Interested":
              this.show_btn_accept=true;
              this.show_btn_interested=false;
              this.show_btn_reject=true;
        break;                    
        case "Rejected":
              this.show_btn_accept=true;
              this.show_btn_interested=true;
              this.show_btn_reject=false;
        break;                    
      }
  }



}
