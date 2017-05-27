import {Page, Modal, Alert, NavController} from 'ionic-angular';
import {CONFIG} from '../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LoginPage} from '../login/login';
import {TermsConditionPage} from '../sign_up/terms_conditions_Modal';
import {DashboardPage} from '../employee/dashboard/dashboard';
import {DashboardEmployerPage} from '../employer/dashboard/dashboard';
import {LocalStorage} from '../../services/ls_srvs';
import {HyperService} from '../../services/http_service';
import {Component} from '@angular/core';

@Component({
  templateUrl: 'build/pages/sign_up/sign_up.html'
})

export class SignUpPage {
  private signupInputs = new SignUpUsers()
  private userType: string;
  private userTypeData;
  private captchaUrl;
  private grCapthca: any;
  private currencyList:any;
  private industry_list:any=[];
  private salRange:any = {}

  http: Http;
  passwordShow: boolean = false;
  constructor(http: Http, public nav: NavController, public server: HyperService) {
    this.http = http;
    this.captchaUrl = CONFIG.SERVICE_URL + 'captcha';
    this.salRange.minSal = 1000000
    this.salRange.maxSal = 10000000
    this.salRange.salInc = 25000
    LocalStorage.setValue('userType', '1');
    this.userType = '1';
    //this.includeGRCaptcha();
    this.getIndustryType();
    this.getCurrencyList()
    //this.getCaptcha();
  }

  private getIndustryType(){
    this.server.get('lists/industry')
    .then((data)=>{
      console.log(data);
      if(data.status==200 && data.result.data!=undefined && data.result.data.length > 0){
        this.industry_list=data.result.data[0].industry;
      }else{
        this.industry_list=[];
      }
      console.log(this.industry_list);
    })
  }

  private getCurrencyList(){
     this.server.get('lists/currency').then(response => {
            this.currencyList = response.result.data[0].currency;
        }); 
  }

  private includeGRCaptcha() {

    window["onloadCallback"] = () => {
      this.grCapthca = window['grecaptcha'].render('grcaptcha' + this.userType, {
        'sitekey': '6Leq6yUTAAAAAENh5ntEZJ1W02GGZfFrquBfvOpx',
        'size': 'compact'
      });
    }

    var doc = document.body;
    var script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit'
    script.async = true;
    script.defer = true;
    doc.appendChild(script);
  }

  signupType(userTypeVal) {
    LocalStorage.setValue('userType', userTypeVal);
    this.userType = userTypeVal;
    this.signupInputs = new SignUpUsers();
    /*setTimeout(() => {
      this.grCapthca = window['grecaptcha'].render('grcaptcha' + this.userType, {
        'sitekey': '6Leq6yUTAAAAAENh5ntEZJ1W02GGZfFrquBfvOpx',
        'size': 'compact'
      });
    }, 100);*/
    // this.nav.push(LoginPage);
  }

  onSignup(userValues) {
    let datapassed: any = this.saveUser(userValues)

    if (datapassed != 'failed') {
      datapassed.subscribe((res: Response) => {
        if (res) {
          this.signupResult({ status: res.status, result: res.json() });
        }
      });
    }
  }
  saveUser(user): any {
    //user.captcha = window['grecaptcha'].getResponse(this.grCapthca);
    user.captcha='mobile';
    if (user.captcha == '') {
      this.doAlert("Please verify captcha...");
      return 'failed';
    } else if (user.password != user.confirmPassword) {
      this.doAlert("Password Mismatch");
      return 'failed';
    } else {
      let headers: Headers = new Headers();
      let requestoptions: RequestOptions;
      headers.append("Content-Type", 'application/json');
      //this.headers.append("Authorization", 'Bearer ' + localStorage.getItem('id_token'))
      if (this.userType == '1') {
        this.userTypeData = {
          "type": '1',
          "fname": user.firstName,
          "lname": user.lastName,
          "email": user.email,
          "password": user.password,
          "captcha": user.captcha,
          desired_salary: {
            amount:user.desired_salary.amount,
            currency:user.desired_salary.currency
          }
        }
      } else {
        this.userTypeData = { "type": '2', "name": user.companyName, "location": user.companyLocation, "industry": user.companyIndustry, "phone": user.phone, "email": user.email, "password": user.password, "captcha": user.captcha }
      }
      requestoptions = new RequestOptions({
        method: RequestMethod.Post,
        url: CONFIG.SERVICE_URL + 'signup',
        headers: headers,
        body: JSON.stringify(this.userTypeData)
      })
      return this.http.request(new Request(requestoptions))
    }
  }
  signupResult(response) {
    if (response.status == 200) {
      if (response.result.response == 'success') {
        this.doAlert("Registered");
      } else {
        if (response.result.message == "This user alredy exists" || response.result.message =="Email domain was not valid.") {
          this.doAlert(response.result.message);
        } else if (response.result.message == "captcha") {
          this.doAlert("Entered captcha is incorrect");
        }
      }
    }
  }

  private onCurrencySel(curr){
    switch(curr){
      case 'INR':
        this.salRange.minSal = 1000000
        this.salRange.maxSal = 10000000
        this.salRange.salInc = 25000
        break;
      case 'USD':
        this.salRange.minSal = 10000
        this.salRange.maxSal = 100000
        this.salRange.salInc = 500
        break;
      case 'AUD':
        this.salRange.minSal = 10000
        this.salRange.maxSal = 100000
        this.salRange.salInc = 500
        break;
    }
    this.signupInputs.desired_salary.amount = this.salRange.maxSal/2 
  }

  passwordEye() {
    this.passwordShow = !this.passwordShow;
  }
  openTerms() {
    let modal = Modal.create(TermsConditionPage);
    this.nav.present(modal);
  }
  doAlert(param) {
    let alert = Alert.create({
      title: 'Signup',
      message: param,
      buttons: [{
        text: 'OK',
        handler: () => {
          if (param != "Registered") {
            return;
          } else {
            this.signupSuccess();
          }

        }
      }]
    });
    this.nav.present(alert);
  }

  signupSuccess() {
    let postData = {
      "email": this.signupInputs.email,
      "pwd": this.signupInputs.password
    }
    this.server.post('login', postData)
      .then(data => (
        this.doLogin(data)
      ));
  }

  doLogin(response) {
    if (response.status == 200) {
      if (response.result.response == 'success') {
        console.log(response.result.data);
        LocalStorage.setValue('userData', JSON.stringify(response.result.data));
        LocalStorage.setValue('token', response.result.token);
        LocalStorage.setValue('loggedIn', true);
        console.log(response.result.data.type);
        if (Number(response.result.data.type) == 1) {
          CONFIG.isEmployer=false;
          this.nav.setRoot(DashboardPage);
        } else {
          CONFIG.isEmployer=true;
          this.nav.setRoot(DashboardEmployerPage);
        }
      } else {
        this.doAlert("Username and Password Mismatch");
      }
    } else {
      this.doAlert("Oops! somthing went wrong");
    }

  }
}
class SignUpUsers {
  public firstName: string = '';
  public lastName: string = '';
  public companyName: string = '';
  public companyLocation: string = '';
  public phone:any={mobile:'',work:''};
  public companyIndustry: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public desired_salary:any = {amount:1000000, currency:'INR'};
}

