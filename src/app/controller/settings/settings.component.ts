import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
import { settingsTags } from 'src/app/controller/settings/settings.service';
import { ConfirmDialogComponent } from '../confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  DHCP: any;

  constructor(private http: HttpClient, public settingsSocket: settingsTags, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getNetwork()
    document.getElementById("DuroTime")!.innerHTML = "00:00:00"
    var previousGateway = ""
    var previousSubmask = ""
    this.settingsSocket.connect()
    this.settingsSocket.subscribeTags(['Duro1.Network.LAN.ip', 'Duro1.Network.LAN.netmask', 'Duro1.Network.LAN.gateway', 'Duro1.DateTime.Date.date', 'Duro1.DateTime.Time.time', 'Duro1.DateTime.Time.offsetUTC']);
    this.DHCP = false
    // grab gateway tag value after nearly 4 seconds of init
    setTimeout(() => {previousGateway = this.settingsSocket.tagValues['Duro1.Network.LAN.gateway']; 
                      previousSubmask = this.settingsSocket.tagValues['Duro1.Network.LAN.submask']}, 3900)
    // place gateway tag value in input box if value changes from the socket
    setTimeout(() => {
      setInterval(() => {
        if (this.settingsSocket.tagValues['Duro1.Network.LAN.gateway'] != previousGateway) {
          (document.getElementById("DuroGateway") as HTMLInputElement).value = this.settingsSocket.tagValues['Duro1.Network.LAN.gateway']
        }
        if (this.settingsSocket.tagValues['Duro1.Network.LAN.submask'] != previousSubmask) {
          (document.getElementById("DuroSubmask") as HTMLInputElement).value = this.settingsSocket.tagValues['Duro1.Network.LAN.submask']
        }
        previousGateway = this.settingsSocket.tagValues['Duro1.Network.LAN.gateway']
        previousSubmask = this.settingsSocket.tagValues['Duro1.Network.LAN.submask']
      }, 2000)
    }, 4000)
  }

  setTime() {
    var checkBox = document.getElementById("ntp") as HTMLInputElement;
    var ntp = "false"
    if (checkBox.checked == true) {
      ntp = "true"
    } else {
      ntp = "false"
    }
    var date = new Date()
    var month = Number(date.getUTCMonth()) + 1
    var dateStr = date.getUTCFullYear() + "-"
    if (month < 10) {
      dateStr = dateStr + "0" + month + "-"
    } else {
      dateStr = dateStr + month + "-"
    }
    if (date.getUTCDate() < 10) {
      dateStr = dateStr + "0" + date.getUTCDate()
    } else {
      dateStr = dateStr + date.getUTCDate()
    }
    dateStr = dateStr + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds()
    dateStr = dateStr.split(' ').join('%20');
    this.http.post(environment.http + "/systemTime?ntp=false" + "&date=" + dateStr, { observe: 'response' })
      .subscribe(
        res => {
          console.log('time change success')
        },
        err => {
          console.log('date set error ', dateStr)

          console.log("Error occured");
          console.log(err);
        }
      );
  }

  ntpActive() {
    var date = new Date()
    var month = Number(date.getUTCMonth()) + 1
    var dateStr = date.getUTCFullYear() + "-"
    if (month < 10) {
      dateStr = dateStr + "0" + month + "-"
    } else {
      dateStr = dateStr + month + "-"
    }
    if (date.getUTCDate() < 10) {
      dateStr = dateStr + "0" + date.getUTCDate()
    } else {
      dateStr = dateStr + date.getUTCDate()
    }
    dateStr = dateStr + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds()
    dateStr = dateStr.split(' ').join('%20');

    var checkBox = document.getElementById("ntp") as HTMLInputElement;;
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true) {
      (document.getElementById('setTimeButton') as HTMLInputElement).disabled = true
      this.http.post(environment.http + "/systemTime?ntp=true", { observe: 'response' })
        .subscribe(
          res => {
            console.log("change to ntp on successful")
          },
          err => {
            console.log("Error occured");
            console.log(err);
          }
        );
    } else {
      (document.getElementById('setTimeButton') as HTMLInputElement).disabled = false
      this.http.post(environment.http + "/systemTime?ntp=false" + "&date=nah", { observe: 'response' })
        .subscribe(
          res => {
            console.log(res)
            console.log("change to ntp off successful")
          },
          err => {
            console.log("Error occured");
            console.log(err);
          }
        );
    }
  }

  getTime() {
    var checkBox = document.getElementById("ntp") as HTMLInputElement;
    this.http.get(environment.http + "/systemTime", { observe: 'response' })
      .pipe(first()).subscribe((resp:any) => {
        if (resp.status === 200) {
          var r = String(resp.body['ntp'])
          var active = r.indexOf("NTP service: ") + 13
          var activeOrInactive = r.substring(active, active + 2)
          if (activeOrInactive == "ac") {
            checkBox.checked = true;
            (document.getElementById('setTimeButton') as HTMLInputElement).disabled = true

          } else {
            checkBox.checked = false;
            (document.getElementById('setTimeButton') as HTMLInputElement).disabled = false

          }
        }
      }), (err:any) => {
        console.log("error ", err)
      };
  }

  setDHCP() {
    this.DHCP = !this.DHCP
    if (this.DHCP == false) {
      for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
        if (document.getElementsByTagName("input")[i].type == "text") {
          document.getElementsByTagName("input")[i].disabled = false
        }
      }
      (document.getElementById('submitNetwork') as HTMLInputElement).disabled = false

    } else {
      for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
        if (document.getElementsByTagName("input")[i].type == "text") {
          document.getElementsByTagName("input")[i].disabled = true
        }
      }
    }
  }

  IPMask(e:any) {
    // count period characters
    var periodCount = 0
    for (let index = 0; index < (e.target.value + e.key).length; index++) {
      if ((e.target.value + e.key)[index] == '.') {
        periodCount = periodCount + 1
      }
    }
    // keydown is a number
    if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
      // in first octet
      if (!e.target.value.includes(".")) {
        if (Number(e.target.value + e.key) < 256) {
          console.log()
        }
        else {
          e.target.value = e.target.value + "." + e.key
          e.preventDefault()
        }
      }
      else {
        var strSplit = (e.target.value + e.key).split('.')
        var lastOctet = strSplit[strSplit.length - 1]
        if (Number(lastOctet) == 0 && periodCount < 3) {
          e.preventDefault()
          e.target.value += '0.'
        }
        else if (lastOctet == '0' && periodCount == 3) {
          e.target.value += '0'
          e.preventDefault()
        }
        else if (Number(lastOctet) >= 0 && Number(lastOctet) < 256) {
          console.log()
        }
        else {
          if (periodCount < 3)
            e.target.value = e.target.value + "." + e.key
          e.preventDefault()
        }
      }

      if (e.target.value[e.target.selectionStart - 1] != '.') {
        var index = e.target.selectionStart - 1
        var firstPeriodIndex = index
        var lastPeriodIndex = index
        while (e.target.value[firstPeriodIndex] != '.' && firstPeriodIndex > -1) {
          firstPeriodIndex--
        }
        while (e.target.value[lastPeriodIndex] != '.' && lastPeriodIndex < e.target.value.length) {
          lastPeriodIndex++
        }
        var s = e.target.value.substring(firstPeriodIndex + 1, lastPeriodIndex)
        for (var i = 0; i < s.length; i++) {
          if (s[i] != '0') {
            break
          }
        }
        if (i == s.length) {
          s = "0"
        } else {
          s = s.substring(i)
        }
        e.target.value = e.target.value.substring(0, firstPeriodIndex + 1) + s + e.target.value.substring(lastPeriodIndex, e.target.value.length)
      }
    }
    else if ((e.keyCode == 8 || e.keyCode == 190 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 9) && periodCount < 4) {
      console.log()
    }
    else {
      e.preventDefault()
    }
  }

  validateParams(ip:any, submask:any, gateway:any) {
    var ipSplit = ip.split('.')
    var submaskSplit = submask.split('.')
    var gatewaySplit = gateway.split('.')
    if (ipSplit.length != 4 || gatewaySplit.length != 4 || submaskSplit.length != 4) {
      return false
    }
    for (var i = 0; i < ipSplit.length; i++) {
      if (Number(ipSplit[i] < 0 || ipSplit[i] > 255 || ipSplit[i] == '')) {
        return false
      }
    }
    for (var i = 0; i < submaskSplit.length; i++) {
      if (Number(submaskSplit[i] < 0 || submaskSplit[i] > 255 || submaskSplit[i] == '')) {
        return false
      }
    }
    for (var i = 0; i < gatewaySplit.length; i++) {
      if (Number(gatewaySplit[i] < 0 || gatewaySplit[i] > 255 || gatewaySplit[i] == '')) {
        return false
      }
    }
    var subMaskBinary = ''
    subMaskBinary = subMaskBinary + Number(submask.substring(0, 3)).toString(2)
    subMaskBinary = subMaskBinary + Number(submask.substring(4, 7)).toString(2)
    subMaskBinary = subMaskBinary + Number(submask.substring(8, 11)).toString(2)
    subMaskBinary = subMaskBinary + Number(submask.substring(12)).toString(2)
    var firstZero = false
    for (var i = 0; i < subMaskBinary.length; i++) {
      if (firstZero) {
        if (subMaskBinary.substring(i).includes('1')) {
          console.log("bad submask")
          return false
        }
      }
      if (subMaskBinary[i] == '0') {
        firstZero = true
      }
    }
    return true
  }

  popupConfirmBox(item:any) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to change ' + item
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result === true && item == 'the network') {
        this.setNetwork()
      }
      else if (result === true && item == 'the system time') {
        this.setTime()
      }
    });
  }

  setNetwork() {
    var ip = document.getElementsByTagName('input')[1].value
    var submask = document.getElementsByTagName('input')[2].value
    var gateway = document.getElementsByTagName('input')[3].value
    var dhcp = document.getElementsByTagName('input')[4].checked
    var spinner = document.getElementById("spinner")!
    var dhcpString = "yes"
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = { headers, responseType: 'text' as 'json' };
    if (dhcp == true) {
      ip = "0"
      submask = "/24"
      gateway = "0"
      dhcpString = 'yes'
      spinner.style.display = 'block'
      for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
        if (document.getElementsByTagName("input")[i].type == "text") {
          document.getElementsByTagName("input")[i].value = ''
          document.getElementsByTagName("input")[i].disabled = true
        }
      }

      this.http.post(environment.http + "/setNetwork?ip=" + ip + "?submask=" + submask + "?gateway=" + gateway + "?dhcp=" + dhcpString, '', options)
        .subscribe(
          res => {
            spinner.style.display = 'none'
            setTimeout(() => {
              if (String(res).substring(0, 7) === "invalid") {
                alert("IP is already being used");
              } else {
                alert("Network has successfully been changed to DHCP");
              }
            }, 200)
          },
          err => {
            spinner.style.display = 'none'
            setTimeout(() => {
              console.log("Error occured");
              console.log(err);
            }, 200)
          }
        );
    } else {
      var valid = this.validateParams(ip, submask, gateway)
      if (valid) {
        for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
          if (document.getElementsByTagName("input")[i].type == "text") {
            document.getElementsByTagName("input")[i].disabled = true
          }
        }

        spinner.style.display = 'block'
        var subMaskBinary = ''
        subMaskBinary = subMaskBinary + Number(submask.substring(0, 3)).toString(2)
        subMaskBinary = subMaskBinary + Number(submask.substring(4, 7)).toString(2)
        subMaskBinary = subMaskBinary + Number(submask.substring(8, 11)).toString(2)
        subMaskBinary = subMaskBinary + Number(submask.substring(12)).toString(2)
        var count = 0
        for (var i = 0; i < subMaskBinary.length; i++) {
          if (subMaskBinary[i] == '1') {
            count = count + 1
          } else {
            break
          }
        }
        var subm = '/' + count.toString()
        dhcpString = 'no'
        this.http.post(environment.http + "/setNetwork?ip=" + ip + "?submask=" + subm + "?gateway=" + gateway + "?dhcp=" + dhcpString, '', options)
          .subscribe(
            res => {
              for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
                if (document.getElementsByTagName("input")[i].type == "text") {
                  document.getElementsByTagName("input")[i].disabled = false
                }
              }
              spinner.style.display = 'none'
              setTimeout(() => {
                if (String(res).substring(0, 7) === "invalid") {
                  alert("IP is already being used");
                  console.log(res)
                } else {
                  alert("Network change is successful")
                  console.log(res)
                }
              }, 200)
            },
            err => {
              for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
                if (document.getElementsByTagName("input")[i].type == "text") {
                  document.getElementsByTagName("input")[i].disabled = false
                }
              }
              spinner.style.display = 'none'
              setTimeout(() => {
                alert("Error occured");
              }, 200)
            }
          );
      }
      else {
        alert("invalid network request")
      }
    }
  }

  getNetwork() {
    var dhcp = document.getElementsByTagName('input')[4]
    this.http.get(environment.http + "/setNetwork", { responseType: 'text' })
      .subscribe(res => {
        if (res.includes('DHCP')) {
          dhcp.checked = true
          this.DHCP = true
          for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
            if (document.getElementsByTagName("input")[i].type == "text") {
              document.getElementsByTagName("input")[i].disabled = true
            }
          }
          (document.getElementById('DHCP') as HTMLInputElement).checked = true;
          (document.getElementById('submitNetwork') as HTMLInputElement).disabled = true
        }
        else {
          dhcp.checked = false
          this.DHCP = false
          for (var i = 0; i < document.getElementsByTagName("input").length; i++) {
            if (document.getElementsByTagName("input")[i].type == "text") {
              document.getElementsByTagName("input")[i].disabled = false
            }
          }
          (document.getElementById('DHCP') as HTMLInputElement).checked = false;
          (document.getElementById('submitNetwork') as HTMLInputElement).disabled = false
        }
      }), (err:any) => {
        console.log("error ", err)
      };
  }

  ngOnDestroy() {
    this.settingsSocket.disconnect()
  }
}
