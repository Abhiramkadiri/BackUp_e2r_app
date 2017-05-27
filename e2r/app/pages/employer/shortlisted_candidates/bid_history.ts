import {Page, Modal, ActionSheet, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {File} from 'ionic-native';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {DashboardEmployerPage} from '../../employer/dashboard/dashboard';
import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {Plugins} from '../../../services/plugins_service';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/shortlisted_candidates/bid_history.html'
})

export class BidHistoryPage {
  private editData;
  private arrBuff;
  private userData;
  private profilePicture;
  private imagePath;
  private Bids=[];
  public basicInputs = new BasicEdit();
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService,private param:NavParams) {
  	this.http = http;
    this.nav = nav;
    this.userData = JSON.parse(LocalStorage.getValue('userData'));
    this.Bids=param.data.bids;
    console.log(param.data);
    // this.profilePicture = "http://ec2-52-10-22-178.us-west-2.compute.amazonaws.com/services/_api/profilepicture/"+this.userData._id.$id+"?r=" + (new Date()).getTime();
  }


  dismiss() {
      this.viewCtrl.dismiss({});
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