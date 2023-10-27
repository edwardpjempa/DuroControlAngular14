// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  ws: "ws://localhost:5556",
  chartsWS: "ws://localhost:3500",
  netMapWS: "ws://localhost:5556/netMap",
  http: ""

  /*ws: "ws://192.168.1.99:5556",
  http: "http://192.168.1.99:80",
  chartsWS: "ws://192.168.1.99:3500"*/

  // http: "http://10.10.10.231:80",
  // ws: "ws://10.10.10.231:5556",
  // chartsWS: "ws://10.10.10.231:3500",


   //http: "http://10.10.10.104:4001",
   //ws: "ws://10.10.10.104:5556",
   //chartsWS: "ws://10.10.10.104:3500",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
