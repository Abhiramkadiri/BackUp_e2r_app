import {Page, Modal, NavController} from 'ionic-angular';
import {CONFIG} from '../../../config';
import {LocalStorage} from '../../../services/ls_srvs';
import {HTTP_PROVIDERS, Http, Request, RequestOptions, RequestMethod, Headers, Response} from '@angular/http';
import {SubmitOffer} from '../../employer/submit_offer/submit_offer';
import {Rating} from '../../employer/rating/rating';

import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/offer_details/offer_details.html'
})

export class OfferDetails {
	http:Http
	private profilePicture;
	private _image;
	private userData;
  private skill = false;
  private offer = false;
  private experience=false;
  private experienceSummary = false;
  constructor(http:Http, public nav:NavController) {
  	this.http = http;
  	this.nav = nav;
  	this.userData = JSON.parse(LocalStorage.getValue('userData')); 
  	this.getProfilePic();
  }
  getProfilePic(){
    this.profilePicture = CONFIG.SERVICE_URL+"profilepicture/"+this.userData._id.$id+"?r=" + (new Date()).getTime();
    this._image = new Image();
    this._image.src = this.profilePicture;
    this._image.onload = (() => console.log("ok ok"));
    this._image.onerror = (() => this.loadDefaultimg());
  }
  loadDefaultimg(){
    this.profilePicture = '';
    this.profilePicture="img/user.jpg";
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
  private submitoffer(){
    this.nav.push(SubmitOffer)
  }
  private ratingPage(){
    this.nav.push(Rating)
  }
}
