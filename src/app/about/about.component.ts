import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { environment } from 'src/environments/environment';
import { first, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})


export class AboutComponent implements OnInit {

  firmwareVer: string = "0.0.0";
  url: any = "/softwareupdate";

  constructor( private http: HttpClient,
    public dialogRef: MatDialogRef<AboutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    let params: any = {task: "firmwareVer"}
    // console.log(params)
    console.log(environment.http + this.url + "?" + this.encodeData(params))
    this.http.get(environment.http + this.url + "?" + this.encodeData(params), { observe: 'response' })
      .pipe(first()).subscribe((resp:any) => {
        // console.log(resp.body["date"])
        if (resp.status === 200) {
          if(resp.body.hasOwnProperty("version_major") && resp.body.hasOwnProperty("version_minor") && resp.body.hasOwnProperty("release")){
            this.firmwareVer = resp.body["version_major"] + "." + resp.body["version_minor"]  + "." + (resp.body["release"])
          }
        } else {}
      }), (err:any) => {};
    }

  closeDialog(): void {
    this.dialogRef.close('Dialog closed');
  }

  encodeData(data:any) {
    return Object.keys(data).map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }  
}

