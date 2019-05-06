import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from "./_models/places";
import { ENV } from "./_global/global";

const API = ENV.debug.apiurl;

@Injectable({
  providedIn: 'root'
})
export class AutocompleterService {

  constructor(
  	private http: HttpClient) { }

  autoCompleteCity(cityname: string): Observable<City[]> {
  	if (cityname.length < 2) {
  		return of([])
  	}
  	return this.http.get(API+"/autocomplete/city?search="+cityname).pipe(
  		map(result => {
  			if (result["success"] === true) {
					let cities: City[] = []
  				let data = result["data"]
  				for (var i = 0 ; i < data.length ; i++) {
  					let item = data[i]
  					let newCity = new City()
  					newCity.id = item["city_id"]
  					newCity.name = item["city_name"]
  					newCity.state = item["state_name"]
  					newCity.country = item["country_name"]
  					newCity.countryCode = item["country_code"]
  					cities.push(newCity)
  				}
  				return cities
  			} else {
  				return []
  			}
  		})
  	)
  }
}
