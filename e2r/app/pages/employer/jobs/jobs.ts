import {Page, Modal, NavController, ViewController, NavParams,Toast} from 'ionic-angular';
import {LocalStorage} from '../../../services/ls_srvs';
import {CONFIG} from '../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {SearchfilterPage} from '../../employer/search/search_filter';
import {HyperService} from '../../../services/http_service';
import {KLST} from '../../../services/klst';

//import {ProfilePage} from '../../employee/profile/profile';
import {Component,ElementRef} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/jobs/jobs.html'
})

export class Jobs {
    private screen_type:string="new";
    private screen_title:string="New Job";
    private actionText:string="SUBMIT";
    private currentStep:any=1;
    private positionList:any=[];
    private currencyList:any=[];
    private jobTypeList:any=[];
    private desription_Doc:any=[];
    private JobDetails:any={
        'position':'',
        'job_type':'',
        'minimun_experience':'',
        'max_ctc':'',
        'currency':'',
        'status':'',
        'skill':'',
        'job_responsibilites':'',
        'job_description':''
    };
    
    constructor(public nav :NavController, public viewCtrl: ViewController, public server:HyperService, private param:NavParams, private element:ElementRef) {
        this.screen_type=this.param.data.type;
        if(this.screen_type=='new'){
            this.screen_title="New Job";
            this.actionText="SUBMIT";
            // this.JobDetails=this.newJob;
        }
        else{
            this.screen_title="Edit Job";
            this.actionText="UPDATE";
            localStorage.setItem('EditJob',JSON.stringify(param.data.EditItem));
            this.JobDetails=JSON.parse(localStorage.getItem('EditJob'));
            localStorage.removeItem('EditJob');
            this.JobDetails.job_responsibilites=this.htmlToPlaintext(this.JobDetails.job_responsibilites);
            this.JobDetails.job_description=this.htmlToPlaintext(this.JobDetails.job_description);
        }
        console.log(param.data);
        console.log(this.JobDetails);
        this.getJobPositions();
        
        this.pageSlideFunction();
    }

    private nextStep(){
        if(this.validateData()){
            this.currentStep++;
            this.pageSlideFunction();
        }
    }

    private prevStep(){
        this.currentStep--;
        this.pageSlideFunction();
    }

    private pageSlideFunction(){
        for(var i=1;i <= 2; i++){
            if(i == this.currentStep){
                this["step"+i+"_Left"]='0%';
            }else if(i < this.currentStep){
                this["step"+i+"_Left"]='-100%';
            }
            else{
                this["step"+i+"_Left"]='100%';
            }
        }
    }
    
    private getJobPositions(){
        this.nav.present(KLST.showLoading());
        this.positionList=[];
        this.server.get('lists/job_type')
        .then(response => {
            console.log(response);
            this.positionList = response.result.data[0].job_type;
            this.getCurrency();
        });
    }
    private getCurrency(){
        this.currencyList=[];
        this.server.get('lists/currency')
        .then(response => {
            console.log(response);
            this.currencyList = response.result.data[0].currency;
            this.getJobType();
        });
    }
    private getJobType(){
        this.jobTypeList=[];
        this.server.get('lists/job_status')
        .then(response => {
            console.log(response);
            this.jobTypeList = response.result.data[0].job_status;
            KLST.hideLoading();
        });
    }

    private validateData(){
        switch(this.currentStep){
            case 1:
                if(this.JobDetails.position!='' && this.JobDetails.job_type!=''  && this.JobDetails.minimun_experience!=''  && this.JobDetails.minimun_experience >= 0 && this.JobDetails.minimun_experience <= 40 && this.JobDetails.max_ctc!='' && this.JobDetails.currency!='' && this.JobDetails.status!=''){
                    return true;
                }
                else{
                    if(this.JobDetails.minimun_experience!='' && this.JobDetails.minimun_experience > 40){
                            this.showMsg('Minimun Experience should be between 0-40');
                    }
                    else{
                        this.showMsg('Please fill all the required fields');
                    }
                }
                break;
            case 2:
                if(this.JobDetails.skill!='' && this.JobDetails.job_responsibilites!='' && this.JobDetails.job_description!=''){
                     return true;
                }
                else{
                    this.showMsg('Please fill all the required fields');
                }
            break;
        }

    }

    private onKeypress(event){
        if(this.JobDetails.minimun_experience.length>=2){
            event.preventDefault();
        }
    }

    private showMsg(msg){
      let alert = Toast.create({
        message: msg,
        duration: 2000,
        dismissOnPageChange:true,
        position: 'top'
      });
      this.nav.present(alert);
    }
    private htmlToPlaintext(text){
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }

    private uploadDocument(){
          let fileInput = this.element.nativeElement.querySelector('#job_description');
          this.desription_Doc = fileInput.files[0];
          console.log('document::', this.desription_Doc );
        //   if (this.desription_Doc == undefined) {
        //       alert("Please choose file");
        //       return;
        //   } else if (this.desription_Doc == null) {
        //       return;
        //   }
        //   let reader = new FileReader();
        //   reader.readAsArrayBuffer(this.desription_Doc);;
        //   reader.onloadend = ((e) => {
        //   });
        //   reader.onerror = (() => console.log("error"));
  }


  private SaveNewJob(){
      console.log('SaveNewJob',this.screen_type);
      console.log(this.desription_Doc,this.JobDetails);

      if(this.validateData()){
        if(this.screen_type=='new'){
            this.server.postFiles("jobs",{file:this.desription_Doc,data:this.JobDetails},true,null)
            .then(data=>{
                console.log(data);
                this.nav.pop();
            })
        }
        else{
            let id=this.JobDetails._id.$id;
            let job={
                'position':this.JobDetails.position,
                'job_type':this.JobDetails.job_type,
                'minimun_experience':this.JobDetails.minimun_experience,
                'max_ctc':this.JobDetails.max_ctc,
                'currency':this.JobDetails.currency,
                'status':this.JobDetails.status,
                'skill':this.JobDetails.skill,
                'job_responsibilites':this.JobDetails.job_responsibilites,
                'job_description':this.JobDetails.job_description
            }
            this.server.postFiles("jobs/"+id,{file:this.desription_Doc,data:job},true,null)
            .then(data=>{
                console.log(data);
                this.nav.pop();
            })
        }
      }
  }
}
