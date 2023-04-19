import { Injectable } from '@angular/core';
import {map, Observable, of} from "rxjs";
import {Country} from "../common/country";
import {HttpClient} from "@angular/common/http";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesURl = 'http://localhost/api/countries';
  private statesURl = 'http://localhost/api/states';

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
    return this.httpClient.get<Country[]>(this.countriesURl);
  }

  getStates(countryCode: string): Observable<State[]>{
    const searchStateUrl = `${this.statesURl}/country/${countryCode}`;
    return this.httpClient.get<State[]>(searchStateUrl);
  }

}
