import { Metrics } from './../app/enumerations/metrics.enum';
import { Locations } from './../app/enumerations/locations.enum';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  fetchMetricDetailsBasedOnLocation: (location: Locations, metric: Metrics) => `https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice/${metric}-${location}.json`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
