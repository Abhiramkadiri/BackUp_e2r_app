import {Page, Modal, NavController, NavParams,Alert,ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {Component} from '@angular/core';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {InAppBrowser, File} from 'ionic-native';
@Component({
  templateUrl: 'build/pages/employee/profile/shortlist_candidate/shortlist.html'
})

export class SelectJob {
  private is_owner:boolean=false;
  private userData:any={};
  private profilePicture:string;
  private _image:any;
  private canShow:any=false;
  private jobs_list:any=[];
  private selectedJob:any={};
  http:Http;
  constructor(http:Http, private params: NavParams, private nav: NavController, private server:HyperService,private viewCtrl:ViewController,private param:NavParams) {
    CONFIG._NAV=this.nav;
    this.http = http;
  }
  ionViewWillEnter(){
    // this.getJobs();
    this.userData = this.param.data.employee;
    this.jobs_list = this.param.data.jobs;
    this.selectedJob=this.jobs_list[0];
  }
  private close(){
    this.viewCtrl.dismiss({status:'cancel'});
  }
  private getJobs(){
      this.server.get('jobs')
      .then((data)=>{
          console.log(data);
          if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0){
              this.jobs_list=data.result.data;
              this.selectedJob=this.jobs_list[0];
          }else{
              this.jobs_list=[];
          }
      })
  }

  private htmlToPlaintext(text){
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  private selectCandidate(selectedjob){
            let Shortlist={
              'job':selectedjob._id.$id,
              'employee':this.userData.email,
              'offered':false
            };
            this.server.post("ShortList",Shortlist,true)
            .then(res=>{
              console.log(res);
              localStorage.setItem('isShortListed','true');
              this.nav.pop();
            });
    //   this.viewCtrl.dismiss({status:'ShortListed',job:selectedjob});
  }

}
