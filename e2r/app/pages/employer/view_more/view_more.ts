import {Page, NavController,NavParams,ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
import {CONFIG} from '../../../config';
import {LoginPage} from '../../login/login';
import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {KLST} from '../../../services/klst';
import {ProfilePage} from '../../employee/profile/profile';

import {OfferDetails} from '../../../pages/employer/offer_details/offer_details';

@Component({
  templateUrl: 'build/pages/employer/view_more/view_more.html'
})

export class ViewMore {
  private viewItem:any;
  private Title:any;

  constructor(public nav:NavController, public server:HyperService,public param:NavParams,public viewCtrl:ViewController) {
        this.viewItem=param.data.Employee;
        console.log(this.viewItem);
        // this.Title=this.viewItem.offer_status+' : '+this.viewItem.employee.firstname+' '+this.viewItem.employee.lastname;
  }
  ionViewWillEnter(){

  }

  private close(){
    this.viewCtrl.dismiss();
  }

  private setCurrCompany(exp,val){
    if(exp!=undefined){
      for(var i=0;i<exp.length;i++){
          if(exp[i].present_work){
            if(val=='company'){
              return exp[i].company_name;
            }
            else if(val=='description'){
              return exp[i].title;
            }
          }
      }
    }
    else{
      return '';
    }
  }

  private onShowEmployeeProfile(){
      this.nav.push(ProfilePage,{employee:this.viewItem.employee})
  } 
  
}
