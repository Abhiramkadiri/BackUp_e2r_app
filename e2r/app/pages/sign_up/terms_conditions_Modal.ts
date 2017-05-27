import {Page, Modal, Platform, ViewController} from 'ionic-angular';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/sign_up/terms_conditions_Modal.html'
})
export class TermsConditionPage {
  constructor(
      public platform: Platform,
      public viewCtrl: ViewController
  ) {
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}