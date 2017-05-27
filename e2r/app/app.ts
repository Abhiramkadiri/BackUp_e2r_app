import 'es6-shim';
import {App, Platform, MenuController, ionicBootstrap} from 'ionic-angular';
import {Component,ViewChild} from '@angular/core';

import {StatusBar,Device} from 'ionic-native';
import {HyperService} from './services/http_service';
import {Plugins} from './services/plugins_service';
import {CONFIG} from './config';
import {KLST} from './services/klst';
import {HomePage} from './pages/home/home';
import {LocalStorage} from './services/ls_srvs';
import {LoginPage} from './pages/login/login';

import {DashboardPage} from './pages/employee/dashboard/dashboard';
import {ProfilePage} from './pages/employee/profile/profile';
import {EmploymentOffers} from './pages/employee/employment_offers/employment_offers';

import {DashboardEmployerPage} from './pages/employer/dashboard/dashboard';
import {CompanyProfilePage} from './pages/employer/company_profile/company_profile';
import {JobsList} from './pages/employer/jobs/jobs_list';
import {ShortListed} from './pages/employer/shortlisted/shortlisted';
import {ShortlistedCandidatePage} from './pages/employer/shortlisted_candidates/shortlisted_candidates';
import {OffersSent} from './pages/employer/offers_sent/offers_sent';

import {SubmitOffer} from './pages/employer/submit_offer/submit_offer';

import {SearchPage} from './pages/employer/search/search';


@Component({
  templateUrl: 'build/menu.html'
})

export class MyApp {
  private rootPage: any;
  private nav_pages:any={};

  constructor(private menu: MenuController, platform: Platform, public server:HyperService) {
    this.nav_pages={employee_dashboard:DashboardPage,employee_profile:ProfilePage,employment_offers:EmploymentOffers,employer_dashboard:DashboardEmployerPage,employer_profile:CompanyProfilePage,employer_jobs:JobsList,employer_short_listed:ShortListed,offers_sent:OffersSent,employer_search:SearchPage,settings:null,contact_us:null,help:null,promote:null};
    this.server = server;
    //this.includeGRCaptcha();
    this.initial();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      CONFIG.deviceId = Device.device.uuid;
      StatusBar.show();
       document.addEventListener('backbutton', () => {
          /*if (!this.nav.canGoBack()) {
            this.platform.exitApp()
            return;
        }
        this.nav.pop();*/
      }, false);
    });            
  }

  private initial(){
      if(LocalStorage.isSetJWT()){
        LocalStorage.loadJWT();
        if(LocalStorage.getValue('loggedIn')==true || LocalStorage.getValue('loggedIn')=='true'){
            this.getLists();
        }else{
          this.rootPage = LoginPage;
        }
      }else{
        LocalStorage.createJWT();
        this.rootPage = LoginPage;
      }
  }

  private getLists(){
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

  private pageRidirect(){
    if(Number(LocalStorage.getValue('userType'))==CONFIG.USER_EMPLOYEE){
                this.rootPage = DashboardPage;
                CONFIG.isEmployer = false;
              }else{
                //this.rootPage = CompanyProfilePage;
                this.rootPage = DashboardEmployerPage;
                CONFIG.isEmployer = true;
              }
  }
  private isEmployer(){
    return CONFIG.isEmployer;
  }

  private onMenuClick(clicked_menu){
    console.log(clicked_menu);
    if(this.nav_pages[clicked_menu]!=null){
      CONFIG._NAV.setRoot(this.nav_pages[clicked_menu]);
    }
    
  }
	private signOut(){
		this.server.get("logout")
		.then((res)=>{
		if(res.status=="200" && res.result.response=="success"){
			LocalStorage.createJWT();
			CONFIG._NAV.setRoot(LoginPage);
		}
		});
	}  
}

ionicBootstrap(MyApp, [HyperService,Plugins], {
  tabbarPlacement: 'bottom'
});


 