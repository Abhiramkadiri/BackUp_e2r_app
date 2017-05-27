import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
import {VideoFrame} from '../../../../services/video';
import {InAppBrowser} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/profile_video.html'
})

export class EmployerProfileVideo {
    private user_data:any=JSON.parse(LocalStorage.getValue('userData'));
    private videoId:string = ''; 

    constructor(public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService) {
        this.user_data.profile_video=(this.user_data.profile_video==undefined || this.user_data.profile_video=='' ) ? "" : this.user_data.profile_video;
        this.videoId=(this.user_data.profile_video!='')?this.user_data.profile_video.split('embed/')[1]:'';
        VideoFrame.setURL('youtubeFrame', this.user_data.profile_video);
    }
 
    private dismiss() {
        this.viewCtrl.dismiss({});
    }

    private loadVideo(){
        let ytURL = 'https://www.youtube.com/embed/'+this.videoId
        this.user_data.profile_video = ytURL;
        VideoFrame.setURL('youtubeFrame', this.user_data.profile_video);
    }

    private saveProfileVideo(){
        this.nav.present(KLST.showLoading());
        let send_data = {
            "profile_video":this.user_data.profile_video
        };
        
        this.server.edit('user', send_data)
        .then((data) => {
            KLST.hideLoading();
            if(data.status==200){
                if(data.result.response=='success'){
                    setTimeout(()=>{this.dismiss();},500) 
                }else{
                    this.nav.present(KLST.showAlert(data.result.message))
                }
            }            
        });        
    } 
  private openYouTube(video_url){
    if(video_url!=undefined && video_url!=''){
      InAppBrowser.open(video_url,"_system","location=yes,toolbar=yes");
    }

  }      
}
