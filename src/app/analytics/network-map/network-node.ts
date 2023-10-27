export class NetworkNode {
  ip_address: string = "";
  mac_address: string = "";
  name: string = "";
  vendor: string = "";
  color: string = "";
  ping: number = 0;
  display: boolean = true;
  detailsVisible: boolean = false;

  constructor(ip_address: string, mac_address: string, name: string, vendor: string, color: string, ping: number, display: boolean) {
    this.ip_address = ip_address;
    this.mac_address = mac_address;
    this.name = name;
    this.vendor = vendor;
    this.color = color;
    this.ping = ping;
    this.display = display;
  }
  }
  