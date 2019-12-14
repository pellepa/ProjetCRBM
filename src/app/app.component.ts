import { Component } from '@angular/core';
import xml2js from 'xml2js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'awesome-project';
  public xmlItems: any;
  constructor(private _http: HttpClient) { this.loadXML(); }

  loadXML() {
    this._http.get('./assets/AutoComplete.xml',
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'text/xml')
          .append('Access-Control-Allow-Methods', 'GET')
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
        responseType: 'text'
      })
      .subscribe((data) => {
        this.parseXML(data)
          .then((data) => {
            this.xmlItems = data;
          });
      });
  }

  parseXML(data) {
    return new Promise(resolve => {
      var x: string | number,
      var i: string | number,
      var k: string | number,
        arr = [],
        parser = new xml2js.Parser(
          {
            trim: true,
            explicitArray: true
          });
      parser.parseString(data, function (err, result) {
        for (k in result) {
          var obj = result[k];
          console.log(obj);
          for (i in obj) {
            var item = Object.values(obj[i]);
            console.log(item);
             for (x in item) {
              if(item.length > 1){
                var valeur =Object.values(item[x]);
                
                console.log( Object.values(Object.values(Object.values(valeur[3]))[0]));
                arr.push({
                  id: Object.values(valeur[0]),
                  des: Object.values(Object.values(valeur[2])[0])[0],
                  lb2ID: Object.values(Object.values(Object.values(valeur[2]))[0])[1].id,
                  lb2LA: Object.values(Object.values(Object.values(valeur[2]))[0])[1].la,
                  tiSynonyme: Object.values(Object.values(valeur[3])[0])[0],
                  tiLA: Object.values(Object.values(Object.values(valeur[3]))[0])[1].la,
                  an: Object.values(valeur[4])
                });
              }

            }
          }
        }
        resolve(arr);
      });
    })
  }

}


