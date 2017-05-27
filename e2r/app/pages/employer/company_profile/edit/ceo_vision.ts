import {Page, Modal, ActionSheet, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Plugins} from '../../../../services/plugins_service';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/ceo_vision.html'
})

export class CEOVisionPage {
  private editData:any={};
  private show:boolean;
  private edit:boolean;
  private userData:any={};
  private ceo_pictureUrl:string="img/user.jpg";
  private _image:any;
  private sliderImages:any;
  private ceo_picture_changed:boolean=false;
  public ceoInputs = {
    ceo_name:'',
    ceo_role:'',
    ceo_vision:''
  };
  http:Http;
  public is_owner:boolean=true;
  constructor(http:Http, private plugins: Plugins, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService, private param:NavParams) {
  	this.http = http;
    this.is_owner=(this.param.data.is_employee) ? false : true;
    //this.getSliderImages();
  }
  ionViewWillEnter(){
      this.show = true;
      if(this.is_owner){
        this.userData = JSON.parse(LocalStorage.getValue('userData')); 
      }else{
        if(this.param.data.user_data!=undefined){
          this.userData=this.param.data.user_data;
          //this.userData.ceo_pictureUrl=this.param.data.user_data.ceo_pictureUrl;
          this.userData.ceo_vision= this.param.data.user_data.ceo_vision;
        }
      }
      //if(this.userData.ceo_pictureUrl){this.getProfilePic()}else{this.loadDefaultimg()}
      if(this.userData.ceo_vision){
        this.ceoInputs.ceo_name = this.userData.ceo_vision.name;
        this.ceoInputs.ceo_role = this.userData.ceo_vision.title;
        this.ceoInputs.ceo_vision = this.userData.ceo_vision.aboutme;
      }
      this.getProfilePic()        
    }

    private getProfilePic(){
      if(this.userData.profile_pictureUrl!=undefined || this.userData.profile_pictureUrl!=''){
        KLST.setUserProfilePicture(this.userData.profile_pictureUrl,"profile",(data)=>{
          if(data.image_url!=undefined){
            this.ceo_pictureUrl = data.image_url;
          }else{
            this.ceo_pictureUrl=this.userData.profile_pictureUrl;
          }
        })
      }else{
        this.ceo_pictureUrl="img/user.jpg";
      }      
    /*this.ceo_pictureUrl= this.userData.ceo_pictureUrl+"?r=" + (new Date()).getTime();
    this._image = new Image();
    this._image.src = this.ceo_pictureUrl;
    this._image.onload = (() => console.log("ok ok"));
    this._image.onerror = (() => this.loadDefaultimg());*/
  }
  /*private loadDefaultimg(){
    this.ceo_pictureUrl = '';
    this.ceo_pictureUrl="img/user.jpg";
  }*/

  private enable(){
    if(this.show == true){
      this.show = false;
      this.edit = true;
    }else{
      this.show = true;
      this.edit = false;
    }
  }
  private addField(){
     this.edit = true;
     this.show = false;
  }
  private saveCeoEdit(values){
      this.nav.present(KLST.showLoading());
      this.editData = {"ceo_vision":{"name" :values.ceo_name, "title":values.ceo_role,"aboutme":values.ceo_vision}}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.ceoeditResult(data)
        ));
  }
  private ceoeditResult(response){
      if(response.status==200){
        if(response.result.response=='success'){
          this.upload();
        }else{
            KLST.hideLoading()
            this.nav.present(KLST.showAlert(response.result.message))
        }
      }else{
        KLST.hideLoading()
      }
    }

      private dismiss() {
        this.viewCtrl.dismiss({});
      }

      /*Upload Ceo Image */
      private presentActionSheet() {
  let actionSheet = ActionSheet.create({
    title: 'Choose',
    buttons: [
      {
        text: 'Camera',
        role: 'camera',
        handler: () => {
         // this.openCameraGallery("camera");
         this.openCamera();
        }
      },{
        text: 'Gallery',
        role: 'gallery',
        handler: () => {
          this.openAlbums();
          //this.openCameraGallery("gallery");
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
  
  
  openAlbums = () : void => {
        this.plugins.albums.open().then((imageUrl) => { 
          if(imageUrl){
            this.ceo_picture_changed=true; 
              var options = null;
              window['plugins'].crop.promise(imageUrl,options)
              .then((data)=>{
                this.ceo_pictureUrl = data;
              })
              .catch((data)=>{
              })             
          }
                    
           //this.ceo_pictureUrl = imageUrl;
        });        
    }
      
    openCamera = () : void => { 
        this.plugins.camera.open().then((imageUrl) => { 
          if(imageUrl){
            this.ceo_picture_changed=true; 
              var options = null;
              window['plugins'].crop.promise(imageUrl,options)
              .then((data)=>{
                this.ceo_pictureUrl = data;
              })
              .catch((data)=>{
              })             
          }
          //this.ceo_pictureUrl = imageUrl;
      });
    }

    upload = () : void => {
      if(this.ceo_picture_changed){
        this.plugins.file.upload("uploadfiles/ceopicture", this.ceo_pictureUrl, ()=>{this.success()}, ()=>{this.failed()}, ()=>{this.onProgress()});
      }else{
        KLST.hideLoading()
        setTimeout(()=>{this.dismiss()},500);
      } 
    }

    private success(){
      console.log("upload success");
      KLST.hideLoading()
      setTimeout(()=>{this.dismiss()},500);
      //this.dismiss();
    }
    private failed(){
      KLST.hideLoading()
      alert("File size to large.")
      console.log("failiure");
    }
    private onProgress()
    {
      console.log("loading");
    }

    /*get slider images */
    /*getSliderImages(){
    this.nav.present(KLST.showLoading());
     this.server.get('employergallery')
    .then(data => (this.sliderresult(data)));
  }
  sliderresult(res){
            KLST.hideLoading();
            this.sliderImages = res.result.data;
  }*/
}

