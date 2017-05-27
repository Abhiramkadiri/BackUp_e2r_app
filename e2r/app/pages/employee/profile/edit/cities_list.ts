import {Page, Modal, Alert, Platform, NavController, NavParams, ViewController} from 'ionic-angular';
import {CONFIG} from '../../../../config';
import {HTTP_PROVIDERS, Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {LocalStorage} from '../../../../services/ls_srvs';
import {Component} from '@angular/core';
import {HyperService} from '../../../../services/http_service';
@Component({
  templateUrl: 'build/pages/employee/profile/edit/cities_list.html'
})
export class citiesPage {
    searchQuery: string = '';
    items;
    private allCities;
    private cities_list;
    private searchedText;
  http:Http;
  constructor(http:Http, public nav :NavController, public platform: Platform, public viewCtrl: ViewController,public param:NavParams,private server:HyperService) {
    this.http = http;
    // this.allCities = this.param.get("cities");
    // this.cities_list = this.param.get("cities");
    this.getCities(this.param.data.country)
  }

  private getCities(country){
      this.server.get('location/'+country)
      .then(data => {
          let cities = data.result.data.cities;
          cities.sort();
          this.allCities = cities;
          this.cities_list = cities;
      });
  }
  
  refreshList(){
    this.cities_list = this.allCities;
  }

  getItems(searchbar) {
    var q = searchbar.target.value;
    this.searchedText = q;
    this.refreshList();
    if (q.trim() == '') {
      return;
    }
    this.cities_list = [];
    this.cities_list = this.allCities.filter((v) => {
      if (v.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        this.cities_list.push(v);
        return true;
      }else{
        return false;
      }
      
    })
  }
  selectedCity(value){
    this.searchedText = value;
    this.dismiss();
  }
  dismiss() {
    this.viewCtrl.dismiss({"citytext":this.searchedText});
  }
}