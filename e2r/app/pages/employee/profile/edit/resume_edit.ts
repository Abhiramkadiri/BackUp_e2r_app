
import {Component} from "@angular/core";
import {Nav,NavParams,Alert,Modal,ViewController,Toast} from 'ionic-angular';
import {HyperService} from '../../../../services/http_service';
import {CONFIG} from '../../../../config';
import {Storage, LocalStorage} from 'ionic-angular';
import {KLST} from '../../../../services/klst';

import {SocialSharing,InAppBrowser, File} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/employee/profile/edit/resume_edit.html'
})

export class EditResume{
 
  private ws:any;
  private nav:any;
  private ShowEdit:boolean=false;
  private local: Storage = new Storage(LocalStorage);

  private file:any;
  private fileName:any;
  private resumeURL:any;
  private uniqID:any;
  private newResume:any;
  private userData:any;

  constructor(private viewCtrl: ViewController,private param:NavParams,private service:HyperService,private Nav:Nav) {
        this.ws=service;
        this.nav=Nav;
        this.userData=param.data.user;
  }

  private viewResume(){
      let isWeb=(window.navigator.platform=="Win32") ? true :false;
      if(isWeb){
          window.open(this.userData.resumeUrl,"_blank","clearcache=no,toolbar=yes");
      }
      else{
          InAppBrowser.open(this.userData.resumeUrl,"_system","location=yes,toolbar=yes");
      }
  }


  private uploadDocument(){
    this.nav.present(KLST.showLoading());
    let fileInput:any = document.getElementById("document");
    this.newResume = fileInput.files[0];
    this.ws.postFiles("uploadfiles/resume", { file: this.newResume }, true,null)
    .then(res=>{
        KLST.hideLoading();
        if(res.response=="success"){
               this.userData.resumeUrl=res.data.resumeUrl; 
        }
        else{
            this.alert('Please try again later.');
        }
        console.log(res);
    });
  }

  private alert(message){
     let alert = Alert.create({
                  title: 'Resume',  
                  subTitle: message,
                  buttons: ['OK']
    });
    this.nav.present(alert);
  }


}