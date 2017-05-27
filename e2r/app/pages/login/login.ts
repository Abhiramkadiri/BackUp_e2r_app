import {Page, Alert, Loading, NavController} from 'ionic-angular';
import {Toast} from 'ionic-native';
import {DashboardPage} from '../employee/dashboard/dashboard';
import {DashboardEmployerPage} from '../employer/dashboard/dashboard';
import {SignUpPage} from '../sign_up/sign_up';
import {LocalStorage} from '../../services/ls_srvs';
import {HyperService} from '../../services/http_service';
import {CONFIG} from '../../config';
import {KLST} from '../../services/klst';
import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl} from '@angular/common';

import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/login/login.html'
})

export class LoginPage{
	private loginInputs = new Users();
  private username_field_validate:boolean=true;
  private userType;
  constructor(public nav: NavController, public server:HyperService){
    CONFIG._NAV = this.nav;
  }

  ionViewWillEnter(){
    if(LocalStorage.getValue('valueLists')==undefined){
      this.server.get("lists")
      .then((data)=>{
        if(data.status==200 && data.result.data!=undefined && data.result.data.length >0){
          LocalStorage.setValue('valueLists',data.result.data);
        }
      });
    }
  }

  private onFieldValidate(){
    if(this.loginInputs.userName!=undefined && this.loginInputs.userName!='' ){
      this.username_field_validate=KLST.isEmail(this.loginInputs.userName);
    }
  }

  private onLogin() {
   // this.nav.setRoot(DashboardPage);
    let postData = {
      "email":this.loginInputs.userName,
      "pwd":this.loginInputs.password,
      "type":"device"
    }

    this.server.post('login',  postData)
    .then(data => (this.loginResult(data)));

  } 

  private loginResult(response){
    	if(response.status==200){
    		if(response.result.response=='success'){
                //console.log(response.result.data);
                LocalStorage.setValue('userData', JSON.stringify(response.result.data));
                LocalStorage.setValue('userType', response.result.data.type);
                LocalStorage.setValue('token', response.result.token);
                LocalStorage.setValue('loggedIn', true);
                if(Number(response.result.data.type) == CONFIG.USER_EMPLOYEE){
                  CONFIG.isEmployer=false;
                  this.nav.setRoot(DashboardPage);
                }else if(Number(response.result.data.type) == CONFIG.USER_EMPLOYER){
                  CONFIG.isEmployer=true;
                  this.nav.setRoot(DashboardEmployerPage);
                }else{
                  this.doAlert("Username and Password Mismatch");
                }
            }else{
                this.doAlert("Username and Password Mismatch");
            }
    	}else{
        this.doAlert("Oops! somthing went wrong");
      }
    	
    }
    private signupPage(){
        this.nav.push(SignUpPage);
      }
    private isEmail(email) {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(email);
      }
    private forgotLogin(){
      let prompt = Alert.create({
      title: 'Forgot Login',
      message: "Enter Email",
      inputs: [
        {
          name: 'Email',
          placeholder: 'Email'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            if (this.isEmail(data.Email)) {
              this.forgotLoginRestCall(data.Email)
             }else{
             Toast.show("Invalid Email", "5000", "center").subscribe(
              toast => {
                console.log(toast);
              }
              );
             }
          }
        }
      ]
    });
    this.nav.present(prompt);
   }
   private forgotLoginRestCall(emailId){
    let postData = {"email":emailId}

    this.server.post('forgot',  postData)
    .then(data => (this.forgotPwdRes(data)));
   }

   private forgotPwdRes(response){
      if(response.result.response == 'success'){
        this.doAlert("Email Sent!");
      }else if(response.result.response == 'failed'){
        this.doAlert("Email is not registered with us");
      }else{
        this.doAlert("Oops! somthing went wrong");
      }
    }

    private doAlert(param) {
        let alert = Alert.create({
          title: 'Login',
          message: param,
          buttons: ['Ok']
        });
        this.nav.present(alert);
      }

}
class Users{
	//public userName:string='us.ranjith@gmail.com';
	//public password:string='ranjith';
  public userName:string='';
  public password:string='';
}