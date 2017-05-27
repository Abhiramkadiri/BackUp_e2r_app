import {Page, Modal, ActionSheet, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {File} from 'ionic-native';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Plugins} from '../../../../services/plugins_service';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/basic_edit.html'
})

export class EmployerbasiceditPage {
  private editData;
  private arrBuff;
  private userData;
  private _image;
  private teamPicture:any;
  private profilePicture:string="img/user.jpg";
  private pictureType:any;

  private change_profile_image:boolean=false;
  private change_team_image:boolean=false;
  private profile_image_upload_status:boolean=false;
  private team_image_upload_status:boolean=false;

  public basicInputs = new BasicEdit();
  http:Http;
  constructor(http:Http, private plugins: Plugins, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService) {
  	this.http = http;
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
  }
  
  ionViewWillEnter(){
    console.log(this.userData);
    this.getProfilePic();
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
  } */

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
  }    

  private saveBasicEdit(values){
      this.nav.present(KLST.showLoading());
      this.editData = {"name":values.name, "location":values.location}
      this.server.edit('user',  this.editData)
      .then(data => (
        this.basiceditResult(data)
        ));
  }
  private basiceditResult(response){
      if(response.status==200){
        if(response.result.response=='success'){
              this.upload();
            }else{
                this.nav.present(KLST.showAlert(response.result.message))
            }
      }
    }
  private presentActionSheet(type) {
    this.pictureType = type;
    let actionSheet = ActionSheet.create({
      title: 'Choose',
      buttons: [
        {
          text: 'Camera',
          role: 'camera',
          handler: () => {
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
  
  
  private openAlbums() {
        this.plugins.albums.open(this.pictureType).then((imageUrl) => {            
            if(this.pictureType == 'profile'){
              this.change_profile_image=true;
              var options = null;
              window['plugins'].crop.promise(imageUrl,options)
              .then((data)=>{
                this.profilePicture= data;
                this.userData.profile_pictureUrl = data;
              })
              .catch((data)=>{
              })              
             //this.userData.profile_pictureUrl= imageUrl;
           }else{
             this.change_team_image=true;
             this.userData.team_pictureUrl= imageUrl;
           }
        });        
    }
      
  private openCamera(){ 
        this.plugins.camera.open(this.pictureType).then((imageUrl) => { 
          if(imageUrl) {
           if(this.pictureType == 'profile'){
             this.change_profile_image=true;
              var options = null;
              window['plugins'].crop.promise(imageUrl,options)
              .then((data)=>{
                this.profilePicture= data;
                this.userData.profile_pictureUrl = data;
              })
              .catch((data)=>{
              })              
             //this.userData.profile_pictureUrl= imageUrl;
           }else{
             this.change_team_image=true;
             this.userData.team_pictureUrl= imageUrl;
           }
          }
      });
    }

  private upload(){ 
    if(!this.change_profile_image && !this.change_team_image){
      KLST.hideLoading();
      LocalStorage.setValue('userData',this.userData);
      setTimeout(()=>{this.dismiss()},500);
    }else{
      if(this.change_profile_image) this.plugins.file.upload("uploadfiles/profilepicture", this.userData.profile_pictureUrl, (fs)=>{this.profile_picture_success(fs)}, (f)=>{this.profile_picture_faild()}, ()=>{this.onProgress()});
      if(this.change_team_image) this.plugins.file.upload("uploadfiles/teampicture", this.userData.team_pictureUrl, (fs)=>{this.team_image_success(fs)}, ()=>{this.team_image_faild()}, ()=>{this.onProgress()});
    }
  }

  private profile_picture_success(fs){
    console.log(fs);
    this.profile_image_upload_status=true;
    let res_data=(fs.response!=undefined) ? JSON.parse(fs.response) : null;
    console.log(res_data);
    if(res_data!=null){
      this.userData.profile_pictureUrl=res_data.data.profile_pictureUrl;
      console.log(this.userData.profile_pictureUrl);
      LocalStorage.setValue('userData',this.userData);
    }    
    this.fileUploadSucces();
      //this.plugins.file.upload("uploadfiles/teampicture", this.teamPicture, ()=>{this.successTeam()}, ()=>{this.failedTeam()}, ()=>{this.onProgress()});
  }
  private profile_picture_faild(){
    console.log("failiure");
    KLST.hideLoading();
    alert("File size to large.")
  }
  private onProgress(){
    console.log("loading");
  }
  private team_image_success(fs){
    this.team_image_upload_status=true;
    let res_data=(fs.response!=undefined) ? JSON.parse(fs.response) : null;
    console.log(res_data);
    if(res_data!=null){
      this.userData.team_pictureUrl=res_data.data.team_pictureUrl;
      console.log(this.userData.team_pictureUrl);
      LocalStorage.setValue('userData',this.userData);
    }
    this.fileUploadSucces();
  }
  private team_image_faild(){
      KLST.hideLoading();
      alert("File size to large.")
  }
  private dismiss() {
    this.viewCtrl.dismiss({});
  }

  private fileUploadSucces(){
    KLST.hideLoading();
    if(this.change_profile_image && this.change_team_image){
      this.change_profile_image=false;
      this.change_team_image=false;
      if(this.profile_image_upload_status && this.team_image_upload_status){
        this.profile_image_upload_status=false;
        this.team_image_upload_status=false;
        setTimeout(()=>{this.dismiss()},500)
      }else{
        this.profile_image_upload_status=false;
        this.team_image_upload_status=false;       
        setTimeout(()=>{this.dismiss()},500)
      }
    }else{
      this.change_profile_image=false;
      this.change_team_image=false;    
      setTimeout(()=>{this.dismiss()},500)
    }
  }
}

class BasicEdit{
  private editVal;
  public name;
  public location;
  constructor(){
    this.editVal=JSON.parse(LocalStorage.getValue('userData'));
    this.name=(this.editVal.name==undefined) ? '':this.editVal.name; 
    this.location=(this.editVal.location==undefined) ? 0:this.editVal.location;
  }
}