import {Page, Modal, Alert, Platform, NavController,NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {HyperService} from '../../../../services/http_service';
import {KLST} from '../../../../services/klst';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employer/company_profile/edit/contact_person.html'
})

export class EmployerContactPerson {
    private user_data:any=JSON.parse(LocalStorage.getValue('userData'));
    private contact_person:any={};
    constructor(public nav :NavController, public platform: Platform, public viewCtrl: ViewController, public server:HyperService) {
        this.contact_person.name="";
        this.contact_person.contact_number="";
        this.contact_person.email="";
        if(this.user_data.contact_person!=undefined){
            this.contact_person.name=(this.user_data.contact_person.name!=undefined) ? this.user_data.contact_person.name : "";
            this.contact_person.contact_number=(this.user_data.contact_person.contact_number!=undefined) ? this.user_data.contact_person.contact_number : "";
            this.contact_person.email=(this.user_data.contact_person.email!=undefined) ? this.user_data.contact_person.email : "";          
        }
    }
 
    private dismiss() {
        this.viewCtrl.dismiss({});
    }

    private savContactPerson(){
        console.log(this.contact_person);
        this.nav.present(KLST.showLoading());
        let send_data = {"contact_person":this.contact_person};
        this.server.edit('user', send_data)
        .then((data) => {
            KLST.hideLoading();
            if(data.status==200){
                if(data.result.response=='success'){
                    setTimeout(()=>{this.dismiss();},500) 
                }else{
                    this.nav.present(KLST.showAlert(data.result.message))
                }
            }            
        });        
    }   
}
