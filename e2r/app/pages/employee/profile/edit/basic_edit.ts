import {Page, Modal, Alert, ActionSheet, Platform, NavController, ViewController,Toast} from 'ionic-angular';
import {File,Camera} from 'ionic-native';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Plugins} from '../../../../services/plugins_service';
import {ProfilePage} from '../../../employee/profile/profile';
import {DashboardPage} from '../../../employee/dashboard/dashboard';
//import * as $ from 'jquery';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/basic_edit.html'
})
export class BasicEditPage {
	private editData;
	private basicInputs = new BasicEdit();
  private profilePicture;
  private arrBuff;
  private pictureData;
  private userData;
  private imagePath;
  private _image;
  private change_profile_picture:boolean=false;
  private viewCtrl:ViewController
	http:Http;
  constructor(http:Http, private plugins: Plugins, public nav :NavController, public platform: Platform, viewCtrl: ViewController, private server:HyperService) {
    this.http = http;
    this.server = server;
    this.viewCtrl=viewCtrl;
    let tempData=LocalStorage.getValue('userData')
    this.userData = (typeof(tempData)=='object')?tempData:JSON.parse(LocalStorage.getValue('userData'));
    console.log(typeof(tempData));
    this.basicInputs.numberType = "home";
    this.basicInputs.msg = "skype";
    this.getProfilePic();
    this.basicInputs.phone = (this.userData.phone!=undefined)?this.userData.phone:{};
    let msg={
        "skype":'',
        "aim":'',
        "live":'',
        "icq":'',
        "qq":''
    }
    this.basicInputs.messenger = (this.userData.messenger!=undefined)?this.userData.messenger:{};
    // if(this.userData.phone){
    //   if(this.userData.phone.mobile!=undefined){
    //       this.basicInputs.numberType='mobile';
    //       this.basicInputs.phone = this.userData.phone.mobile;
    //   }
    //   else if(this.userData.phone.home!=undefined){
    //       this.basicInputs.numberType='home';
    //       this.basicInputs.phone = this.userData.phone.home;
    //   }
    //   else if(this.userData.phone.work!=undefined){
    //       this.basicInputs.numberType='work';
    //       this.basicInputs.phone = this.userData.phone.work;
    //   }
    //   else{
    //       this.basicInputs.numberType='';
    //       this.basicInputs.phone = '';
    //   }
    // }
  }
  getProfilePic(){

    //this.profilePicture = this.userData.profile_pictureUrl;
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
    /*this._image = new Image();
    this._image.src = this.profilePicture;
    this._image.onload = (() => console.log("ok ok"));
    this._image.onerror = (() => this.loadDefaultimg());*/
  }
  /*loadDefaultimg(){
    this.profilePicture = '';
    this.profilePicture="img/user.jpg";
  }*/
  dismiss() {
    this.viewCtrl.dismiss({});
  }
  presentActionSheet() {
  let actionSheet = ActionSheet.create({
    title: 'Choose',
    buttons: [
      {
        text: 'Camera',
        role: 'camera',
        handler: () => {
          //this.openCameraGallery("camera");
          this.openCamera();
        }
      },{
        text: 'Gallery',
        role: 'gallery',
        handler: () => {
          this.openAlbums();
        }
      },{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  this.nav.present(actionSheet);
  }
  

   openAlbums() {
        this.plugins.albums.open().then((imageUrl) => { 
          this.change_profile_picture=true;           
            var options = null;
            window['plugins'].crop.promise(imageUrl,options)
            .then((data)=>{
              this.imagePath = data;
              this.profilePicture = data;
            })
            .catch((data)=>{
            }) 
        });        
    }
      
    openCamera(){ 
        this.plugins.camera.open().then((imageUrl) => { 
          if(imageUrl) {
            this.change_profile_picture=true;
            var options = null;
            window['plugins'].crop.promise(imageUrl,options)
            .then((data)=>{
              this.imagePath = data;
              this.profilePicture = data;
            })
            .catch((data)=>{
            })            
          }
      });
    }

    upload (image: string){ 
        this.plugins.file.upload("uploadfiles/profilepicture", image, (fs)=>{this.success(fs)}, (f)=>{this.failed(f)}, ()=>{this.onProgress()});
    }

    success(filesuccess){
      console.log("success");
      this.userData.profile_pictureUrl=this.profilePicture+"?r=" + (new Date()).getTime();
      LocalStorage.setValue('userData',this.userData);
      KLST.hideLoading();
      setTimeout(()=>{
        this.viewCtrl.dismiss();
      },500);      
    }
    failed(filefail){
      KLST.hideLoading();
      alert("File size to large.")
    }
    onProgress(){
      //console.log("loading");
    }
  saveBasicEdit(values){
      this.nav.present(KLST.showLoading());
      // let typeObj;
      // if(this.userData.phone){
      //   typeObj = this.userData.phone;
      // }else{
      //   typeObj={}
      // }
      // typeObj[values.numberType] = values.phone;
      // console.log(typeObj); 
      this.editData = {"firstname":values.firstName, "lastname":values.lastName, "email":values.email, "phone":values.phone, "linked_in":values.linked_in, "facebook":values.facebook,"messenger":values.messenger}
      this.server.edit('user',  this.editData)
    .then(res => (this.basiceditResult(res)));
  }
  basiceditResult(response){
      if(response.status==200){
        if(response.result.response=='success'){
          if(this.change_profile_picture){
            this.upload(this.imagePath) 
          }else{
            LocalStorage.setValue('userData',this.userData);
            KLST.hideLoading();
            setTimeout(()=>{
              this.viewCtrl.dismiss();
            },1000)
            // this.dismissModel();
          }
        }else{
            KLST.hideLoading();
            this.nav.present(KLST.showAlert(response.result.message));
        }
      }
    }
 
      getcontactType(type){
        console.log(type);
        if(type == 'mobile'){
          this.basicInputs.phone = (this.userData.phone.mobile==undefined || this.userData.phone==undefined) ? '':this.userData.phone.mobile;
        }else if(type == 'work'){
          this.basicInputs.phone = (this.userData.phone.work==undefined || this.userData.phone==undefined) ? '':this.userData.phone.work;
        }else{
          this.basicInputs.phone = (this.userData.phone.home==undefined || this.userData.phone==undefined) ? '':this.userData.phone.home;
        }
      }
      dismissModel(){
        setTimeout(()=>{this.dismiss()},500);
      }
}

class BasicEdit{
	private editVal = JSON.parse(LocalStorage.getValue('userData'));
  public numberType;
  public msg;
  private firstName=(this.editVal.firstname==undefined) ? '':this.editVal.firstname;
	private lastName=(this.editVal.lastname==undefined) ? '':this.editVal.lastname;
  private email=(this.editVal.email==undefined) ? '':this.editVal.email;
	public phone=(this.editVal.phone==undefined) ? '':this.editVal.phone;
  private linked_in=(this.editVal.linked_in==undefined) ? '':this.editVal.linked_in;
  private facebook=(this.editVal.facebook==undefined) ? '':this.editVal.facebook;
  public messenger=(this.editVal.messenger==undefined) ? '':this.editVal.messenger;
}

