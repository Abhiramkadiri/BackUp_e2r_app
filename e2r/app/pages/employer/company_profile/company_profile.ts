import {Page, Modal, Alert, NavController, Slides, NavParams } from 'ionic-angular';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Request, RequestOptions, RequestMethod, Headers, Response} from '@angular/http';
import {SpecialitiesPage} from '../../employer/company_profile/edit/specialities';
import {ContactinfoPage} from '../../employer/company_profile/edit/contactinfo';
import {CompanyHistoryPage} from '../../employer/company_profile/edit/company_history';
import {CEOVisionPage} from '../../employer/company_profile/edit/ceo_vision';
import {OverviewPage} from '../../employer/company_profile/edit/overview';
import {BenefitsPage} from '../../employer/company_profile/edit/benefits';
import {OtherbenefitsPage} from '../../employer/company_profile/edit/other_benefits';
import {VactionPolicyPage} from '../../employer/company_profile/edit/vacation_policy';
import {CompanyPerksPage} from '../../employer/company_profile/edit/company_perks';
import {StackHolderPage} from '../../employer/company_profile/edit/stack_holder';
import {FundingTypePage} from '../../employer/company_profile/edit/funding_type';
import {EmployerbasiceditPage} from '../../employer/company_profile/edit/basic_edit';
import {EmployerContactPerson} from '../../employer/company_profile/edit/contact_person';
import {EmployerProfileVideo} from '../../employer/company_profile/edit/profile_video';
import {EmployerGalleryPhoto} from '../../employer/company_profile/edit/gallery_photo';
import {InAppBrowser} from 'ionic-native';

import {VideoFrame} from '../../../services/video'

import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {KLST} from '../../../services/klst';
import * as $ from 'jquery';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/company_profile.html'
})

export class CompanyProfilePage {
  private userData: any = {};
  private _image: any;
  private teamPicture: any;
  private profilePicture: string = "";
  private profileVideo: string = "";
  private gallary_images: any = [];
  private is_employee: boolean = false;
  private video_loaded_status=false;
  private employer_video:any;
  http: Http
  constructor(http: Http, public nav: NavController, public server: HyperService, private param: NavParams) {
    CONFIG._NAV = this.nav;
    this.http = http;
    this.is_employee = (this.param.data.type != undefined) ? true : false;
  }

  ionViewWillEnter() {
    this.userData = (this.is_employee) ? this.param.data.user_data : JSON.parse(LocalStorage.getValue('userData'));
    console.log(this.userData);
    this.getUserValues();
    this.getGallery();
    //this.getVideo();
  }

  private getProfilePic() {
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
    if (this.userData.team_pictureUrl != undefined && this.userData.team_pictureUrl != '') {
      KLST.setUserProfilePicture(this.userData.team_pictureUrl,"team",(data)=>{
        if(data.image_url!=undefined){
          this.teamPicture={'background-image':'url('+data.image_url+')'};
        }else{
          this.teamPicture={'background-image':'url('+this.userData.team_pictureUrl+')'};
        }
      })       
    } else {
      this.teamPicture = { 'background-image': 'url(' + "img/team.jpg"+ ')' };
    }
    /*if(this.userData.profile_video!=undefined && this.userData.profile_video!=''){
    }*/
  }

  private getVideo(){
    if (this.userData.profile_video != undefined && this.userData.profile_video != '') {
      let embedCode='<iframe src="'+this.userData.profile_video+'" frameborder="0"></iframe>';
      this.employer_video=document.write(embedCode);
    }
  }
  private getVideoData() {
    if (this.userData.profile_video != undefined && this.userData.profile_video != '') {
      VideoFrame.setURL('profile_video', this.userData.profile_video);
    }
  }

  private getGallery() {
    this.server.get('employergallery')
      .then((data) => {
        if (data.status == 200 && data.result.data != undefined && data.result.data.length > 0) {
          this.gallary_images = data.result.data;
        } else {
          this.gallary_images = [];
        }
        console.log(this.gallary_images);
      });
  }

  private loadDefaultimg() {
    this.profilePicture = '';
    this.profilePicture = "img/user.jpg";
  }
  private openSpecialistedit() {
    let modal = Modal.create(SpecialitiesPage);
    modal.onDismiss((data) => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openContactinfoedit() {
    let modal = Modal.create(ContactinfoPage);
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openCompanyHistory() {
    let modal = Modal.create(CompanyHistoryPage, { is_employee: this.is_employee, history_data: this.userData.company_history });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openCeoVision() {
    let modal = Modal.create(CEOVisionPage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openOverview() {
    let modal = Modal.create(OverviewPage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openbenefits() {
    let modal = Modal.create(BenefitsPage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openotherbenefits() {
    let modal = Modal.create(OtherbenefitsPage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openvacationpolicy() {
    let modal = Modal.create(VactionPolicyPage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private opencompanyperks() {
    let modal = Modal.create(CompanyPerksPage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openstackholder() {
    let modal = Modal.create(StackHolderPage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openfundingtype() {
    let modal = Modal.create(FundingTypePage, { is_employee: this.is_employee, user_data: this.userData });
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }
  private openbasic() {
    if (!this.is_employee) {
      let modal = Modal.create(EmployerbasiceditPage);
      modal.onDismiss(data => {
        this.getUserValues();
      })
      this.nav.present(modal);
    }
  }
  private getUserValues() {
    if (!this.is_employee) {
      this.nav.present(KLST.showLoading());
      this.server.get('user')
        .then(data => (this.getUserValuesresult(data)));
    } else {
      this.getProfilePic();
      this.getVideoData();
    }
  }
  private openContactPersonEdit() {
    let modal = Modal.create(EmployerContactPerson);
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }

  private openVideoEdit() {
    let modal = Modal.create(EmployerProfileVideo);
    modal.onDismiss(data => {
      this.getUserValues();
    })
    this.nav.present(modal);
  }

  private openPhotoEdit() {
    let modal = Modal.create(EmployerGalleryPhoto);
    modal.onDismiss(data => {
      this.getGallery();
    })
    this.nav.present(modal);
  }

  private getUserValuesresult(res) {
    KLST.hideLoading();
    this.userData = res.result.data;
    console.log(this.userData);
    LocalStorage.setValue('userData', JSON.stringify(res.result.data))
    this.getProfilePic();
    this.getVideoData();
  }

  private openYouTube(video_url){
    if(video_url!=undefined && video_url!=''){
      InAppBrowser.open(video_url,"_system","location=yes,toolbar=yes");
    }

  }
}


