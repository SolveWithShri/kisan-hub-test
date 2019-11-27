import { Locations } from 'src/app/enumerations/locations.enum';
import { Metrics } from 'src/app/enumerations/metrics.enum';

export const environment = {
  production: true,
  fetchMetricDetailsBasedOnLocation: (location: Locations, metric: Metrics) => `https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice/${metric}-${location}.json`
};
