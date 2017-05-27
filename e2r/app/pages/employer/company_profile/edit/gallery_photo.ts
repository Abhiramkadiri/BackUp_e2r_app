import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController, ActionSheet} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
import {Plugins} from '../../../../services/plugins_service';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/gallery_photo.html'
})

export class EmployerGalleryPhoto {
    private gallery_data:any=[];
    private change_gallery_image=false;
    private gallery_image:any;    
    constructor(public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService,private plugins: Plugins) {
        this.getGallery();
    }

  private getGallery(){
    this.server.get('employergallery')
    .then((data)=>{
      if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0){
          this.gallery_data=data.result.data;     
      }else{
        this.gallery_data=[];
      }
      console.log(this.gallery_data);
    });    
  }
  private presentActionSheet(type) {
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
 
  private openAlbums = () : void => {
        this.plugins.albums.open('gallery').then((imageUrl) => {            
          if(imageUrl) {
            this.change_gallery_image=true;
            this.gallery_image= imageUrl;
            this.saveGaleryPhoto();
          }
        });        
    }
      
  private openCamera = () : void => { 
        this.plugins.camera.open('gallery').then((imageUrl) => { 
          if(imageUrl) {
            this.change_gallery_image=true;
            this.gallery_image= imageUrl;
            this.saveGaleryPhoto();
          }
      });
    }

    private dismiss() {
        this.viewCtrl.dismiss({});
    }

    private saveGaleryPhoto(){
        this.nav.present(KLST.showLoading());
        if(this.change_gallery_image) this.plugins.file.upload("uploadfiles/gallerypicture", this.gallery_image, (data)=>{this.gallery_image_success(data)}, (data)=>{this.gallery_image_faild(data)}, ()=>{this.onProgress()});      
    }

    private gallery_image_success(data){
        if(data.responseCode==200){
            let res=JSON.parse(data.response);
            if(res.response=="success"){
                if(this.gallery_data.indexOf(res.data.gallery_imageUrl)  == -1) this.gallery_data.push(res.data.gallery_imageUrl);
            }
        }
        KLST.hideLoading();
    }
    private gallery_image_faild(data){
        console.log("Faild");
        console.log(data);
        KLST.hideLoading();
    }

    private onProgress(){

    }

    private onRemoveGalleryImage(image_link,img_index){
        console.log(image_link);
        let img_str_arr=image_link.split("/");
        let image_name=img_str_arr[img_str_arr.length-1]
        console.log(image_name);
        this.server.DeleteFiles("removefiles/gallery",{file_name:image_name})
        .then((data)=>{
            console.log(data);
            if(data.status==200 && data.result.response=="success"){
                this.gallery_data.splice(img_index,1);
            }
        });
    }

    //removefiles/gallery
}
