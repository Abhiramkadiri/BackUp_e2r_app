import {Page, Modal, Alert, Platform, NavController, NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {Component} from '@angular/core';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/countries_list.html'
})
export class countriesPage {
    searchQuery: string = '';
    items;
    private allCountries;
    private countries_list;
    private searchedText;
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController,public param:NavParams) {
    this.http = http;
    this.initializeItems();
  }
   initializeItems() {
    let requestoptions:RequestOptions;
      requestoptions = new RequestOptions({
          method: RequestMethod.Get,
          url: 'data/localdata.json'
      })
      this.http.request(new Request(requestoptions)).subscribe((res: Response) => {
                if (res) {
                  var result = res.json();
                  this.getCountries();
                }
            });
  }

  getCountries(){
    let requestoptions:RequestOptions;
      requestoptions = new RequestOptions({
          method: RequestMethod.Get,
          url: 'data/locations.json'
      })
      this.http.request(new Request(requestoptions)).subscribe((res: Response) => {
                if (res) {
                  var result = res.json();
                  this.countries_list = result.countries;
                  this.allCountries = result.countries;
                }
            });
  }

  refreshList(){
    this.countries_list = this.allCountries;
   // this.items.push({Id: this.allSkills.length+1, skill: this.searchedText})
  }

  getItems(searchbar) {
    var q = searchbar.target.value;
    this.searchedText = q;
    this.refreshList();
    if (q.trim() == '') {
      return;
    }
    this.countries_list = [];
    this.countries_list = this.allCountries.filter((v) => {
      if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        this.countries_list.push(v);
        return true;
      }else{
        return false;
      }
      
    })
  }
  selectedCountry(value){
    this.searchedText = value;
    this.dismiss();
  }
  dismiss() {
    this.viewCtrl.dismiss({"countrytext":this.searchedText});
  }
}