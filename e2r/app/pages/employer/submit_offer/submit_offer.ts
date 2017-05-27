import {Page, Modal, NavController,ViewController,NavParams,Toast} from 'ionic-angular';
import {CONFIG} from '../../../config';
import {LocalStorage} from '../../../services/ls_srvs';
import {HTTP_PROVIDERS, Http, Request, RequestOptions, RequestMethod, Headers, Response} from '@angular/http';
import {HyperService} from '../../../services/http_service';
import {BidHistoryPage} from '../shortlisted_candidates/bid_history';


import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/submit_offer/submit_offer.html'
})

export class SubmitOffer {
	http:Http
	private profilePicture;
	private _image;
	private userData;
  private skill = false;
  private offer = false;
  private experience=false;
  private experienceSummary = false;
  private item:any=[];
  private employee:any=[];
  private myOffer={amount:'',currency:'',expiry:''};
  private canSubmit=true;
  private LastBid:any;
  private offered_file:any=[];
  private currencyList:any=[];
  private minDate:any;
  constructor(http:Http, public nav:NavController,private viewCtrl:ViewController,private param:NavParams,private server:HyperService) {
  	this.http = http;
  	this.nav = nav;
  	this.userData = JSON.parse(LocalStorage.getValue('userData'));
    this.item=param.data.item;
    this.LastBid=(this.item.offers!=undefined)?this.item.offers[this.item.offers.length-1]:{offer_amount:'',offer_currency:''};
    this.employee=this.item.employee;
    this.canSubmit=true;
    this.minDate=new Date().toISOString();
    this.myOffer.expiry=this.minDate;
    console.log(this.item);
    this.getCurrency();
  }

  close(){
      this.viewCtrl.dismiss({status:'cancel'});
  }

  // private getLastBid(obj){
  //    this.LastBid=this.item.offers[this.item.offers.length-1][obj];
  // }
  private htmlToPlaintext(text){
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  private canSubmitOffer(){
    // Amount must be higer then last bid amount or Desired Salary.
    console.log(this.myOffer,this.LastBid);
    if(this.LastBid.offer_amount!=''){
      let isTrue=(parseInt(this.myOffer.amount)<parseInt(this.LastBid.offer_amount));
      console.log(isTrue);
      this.canSubmit=isTrue;
    }
    else{
      let isTrue=(parseInt(this.myOffer.amount)<parseInt(this.employee.desired_salary.amount));
      console.log(isTrue);
      this.canSubmit=isTrue;
    }
  }

  private onSubmitOffer(){
    if(parseInt(this.myOffer.amount)==parseInt(this.LastBid.offer_amount)||parseInt(this.myOffer.amount)<=parseInt(this.employee.desired_salary.amount)){
      this.showToastMsg('Amount must be higer then last bid amount or Desired Salary.');
    }
    else{
      if(this.myOffer.currency==''){
        this.showToastMsg('Please select the currency');
      }
      else{
        let offered_data={
          'employee':this.employee.email,
          'job':this.item.job._id.$id,
          'offer_amount':this.myOffer.amount+"",
          'offer_currency':this.myOffer.currency,
          'offer_description':this.item.job.job_description,
          'offer_last_date':this.myOffer.expiry,
          'offer_status':"Offered"
        }
        console.log(offered_data);
        this.server.postFiles("offers",{file:this.offered_file,data:offered_data},true,null)
        .then(response=>{
          console.log(response);
          this.viewCtrl.dismiss({status:'submitted'});
            if(response.response=="success"){
            }
        });
        this.showToastMsg('Success');
      }
    }
  }
  private showToastMsg(msg){
      let alert = Toast.create({
        message: msg,
        duration: 2000,
        dismissOnPageChange:true,
        position: 'top'
      });
      this.nav.present(alert);
  }
  private getCurrency(){
      this.currencyList=[];
      this.server.get('lists/currency')
      .then(response => {
          console.log(response);
          this.currencyList = response.result.data[0].currency;
      });
  }
  loadDefaultimg(){
    this.profilePicture = '';
    this.profilePicture="img/user.jpg";
  }

  openBidHistory(){
      let modal = Modal.create(BidHistoryPage,{bids:this.item.offers});
      modal.onDismiss(data =>{
      })
      this.nav.present(modal);
  }
  skillShow(){
    this.offer = false;
    this.experience = false;
    this.experienceSummary=false;
    this.skill = !this.skill;
  }
  offerShow(){
    this.skill = false;
    this.experience = false;
    this.experienceSummary=false;
    this.offer = !this.offer;
  }
  experienceShow(){
    this.skill = false;
    this.offer = false;
    this.experienceSummary=false;
    this.experience=!this.experience;
  }
  experiencesummaryShow(){
    this.skill = false;
    this.offer = false;
    this.experience =false;
    this.experienceSummary=!this.experienceSummary;
  }
}
