import {Page, NavController} from 'ionic-angular';
import {Component} from '@angular/core';
//import {HTTP_PROVIDERS, Http, Request, RequestOptions, RequestMethod, Headers, Response} from '@angular/http';

import {CONFIG} from '../../../config';
import {LoginPage} from '../../login/login';
import {LocalStorage} from '../../../services/ls_srvs';
import {HyperService} from '../../../services/http_service';
import {KLST} from '../../../services/klst';

import {ShortlistedCandidatePage} from '../../employer/shortlisted_candidates/shortlisted_candidates';

@Component({
  templateUrl: 'build/pages/employer/shortlisted/shortlisted.html'
})

export class ShortListed {

  private shorted_list:any=[];
  private searchTerm:any=[];
  private masterList:any=[];

  constructor(public nav:NavController, public server:HyperService) {

  }
  ionViewWillEnter(){
    this.getShortLists();
  }

  private getShortLists(){
    this.nav.present(KLST.showLoading());
    this.server.get("ShortList")
    .then((data)=>{
      console.log(data);
      if(data.status==200 && data.result!=undefined){
        if(data.result.data!=undefined && data.result.data.length > 0 ){
          this.shorted_list=data.result.data;
          this.masterList=this.shorted_list;
        }else{
          this.shorted_list=[];
          this.masterList=[];
        }
      }else{
        this.shorted_list=[];
        this.masterList=[];
      }
      KLST.hideLoading();
    })
  }

  private onShowShortedEmployee(list_item,list_index){
    console.log(list_item);
    console.log(list_index);
    this.nav.push(ShortlistedCandidatePage,{item:list_item});
  } 

  private onSearch(){
    this.shorted_list=[];
    let tempData=KLST.listFilter(this.masterList,null,this.searchTerm);
    this.shorted_list=tempData;
  }  
}
