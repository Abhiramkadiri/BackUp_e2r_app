import {Page, NavController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {DashboardPage} from '../employee/dashboard/dashboard';
import {DashboardEmployerPage} from '../employer/dashboard/dashboard';
import {LocalStorage} from '../../services/ls_srvs';
import {HyperService} from '../../services/http_service';
import {KLST} from '../../services/klst';


import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/home/home.html'
})

export class HomePage {
	nav:NavController;
  constructor(nav:NavController, public server:HyperService) {
  	this.nav = nav;
    this.server = server;
    this.initial();
  }

  initial(){
      if(LocalStorage.isSetJWT()){
        LocalStorage.loadJWT();
        console.log(LocalStorage.getValue('userType'))
        if(LocalStorage.getValue('loggedIn')==true || LocalStorage.getValue('loggedIn')=='true'){
         // KLST.showLoading();
            if(LocalStorage.getValue('valueListsLoaded')=="true" || LocalStorage.getValue('valueListsLoaded')==true){
              this.pageRidirect();
            }else{
              this.getLists();
            }
        }else{
          this.nav.setRoot(LoginPage);
        }
      }else{
        LocalStorage.createJWT();
        this.nav.setRoot(LoginPage);
      }
  }

  getLists(){
       this.server.get('lists')
        .then(res => {
            //KLST.hideLoading();
            if(res.result.response=='success'){
                //console.log(res.result.data);
              LocalStorage.setValue('valueLists', JSON.stringify(res.result.data));
              LocalStorage.setValue('valueListsLoaded', true);
              this.pageRidirect();
          }
        }); 
  }

  pageRidirect(){
    if(LocalStorage.getValue('userType')=='1'){
                this.nav.setRoot(DashboardPage);
              }else{
                this.nav.setRoot(DashboardEmployerPage);
              }
  }
}
