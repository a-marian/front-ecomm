import { Injectable } from '@angular/core';
import {map, Observable, of} from "rxjs";
import {Country} from "../common/country";
import {HttpClient} from "@angular/common/http";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesURl = 'http://localhost:8080/api/countries';
  private statesURl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) { }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let year = startYear; year <= endYear; year++){
      data.push(year);
    }
    return  of(data);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for (let tempMonth = startMonth; tempMonth <= 12; tempMonth++) {
      data.push(tempMonth);
    }
    return of(data);
  }

  getCountries() : Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesURl).pipe(
      map(response => response._embedded.countries));
  }

  getStates(countryCode: string): Observable<State[]>{

    const searchStateUrl = `${this.statesURl}/search/findByCountryCode?code=${countryCode}`;

   return this.httpClient.get<GetResponseStates>(this.statesURl) .pipe(
     map(response => response._embedded.states));
  }

}


interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
