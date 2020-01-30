import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'awesome-project';
  public xmlItems: any;
  constructor(private _http: HttpClient) { }
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  url_debut = 'https://cors-anywhere.herokuapp.com/https://doccismef.chu-rouen.fr/CISMeFacservice/REST/autoComplete/'
  fin_url = 'T_DESC_CISMEF_STRATEGIE,T_DESC_CISMEF_META_TERME,T_DESC_CISMEF_TYPE_RESSOURCE,T_DESC_MESH_DESCRIPTEUR,T_DESC_MESH_PUBLICATION_TYPE,T_DESC_MESH_SUPPLEMENTARY_CONCEPT'


  loadXML(concept, lang) {
    var t0 = performance.now();
    var url_final = this.url_debut + concept + '/' + lang +'/' + this.fin_url;
    this._http.get(url_final,
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml'),
        responseType: 'text'
      })
      .subscribe((data) => {
        this.parseXML(data)
          .then((data) => {
            this.xmlItems = data;
          });
      });
      var t1 = performance.now();
      console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
  }

  parseXML(data) {
    const json = JSON.parse(data);
    return new Promise(resolve => {
      var x: string | number
      var i: string | number
      var k: string | number,
      arr = []
        for (k in json) {
          var obj = json[k];
          for (i in obj) {
            var item = Object.values(obj[i]);
            var valeur =Object.values(item[1])[0];
            arr.push({
              autocomplete : valeur
            })
          }
        }
        resolve(arr);
    })
  }

  ngOnInit() {
 this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
 
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(filterValue)
    this.loadXML(filterValue, 'fr')
    return this.xmlItems
  }

}


