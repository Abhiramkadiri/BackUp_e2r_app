import {Page, Modal, NavController, ViewController} from 'ionic-angular';
import {LocalStorage} from '../../../services/ls_srvs';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {SearchfilterPage} from '../../employer/search/search_filter';
import {HyperService} from '../../../services/http_service';
import {KLST} from '../../../services/klst';

import {Jobs} from '../../employer/jobs/jobs';

import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/jobs/jobs_list.html'
})

export class JobsList {
    private jobs_list:any=[];
    private masterList:any=[];
    private searchTerm:any;
    constructor(public nav :NavController, public viewCtrl: ViewController, public server:HyperService) {
    }
    
    ionViewWillEnter(){
        this.getJobs();
    }

    private getJobs(){
        this.server.get('jobs')
        .then((data)=>{
            console.log(data);
            if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0){
                this.jobs_list=data.result.data;
                this.masterList=data.result.data;
            }else{
                this.jobs_list=[];
            }
        })
    }
    private onOpenJob(type,item){
        console.log('onOpenJob');
        this.nav.push(Jobs,{type:type,EditItem:item})
    }

    private onSearchJobs(){
        this.jobs_list=[];
        let tempData=KLST.listFilter(this.masterList,null,this.searchTerm);
        this.jobs_list=tempData;
    }
}