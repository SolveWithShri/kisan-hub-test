import { Moment } from 'moment';

import { MetricSelectConfig } from './metrics-select-config.model';
import { Locations } from './../enumerations/locations.enum';
import { MetricDetails } from '../dtos/metric-details.dto';

export interface ChartUpdateActionsMetaData {
    metricDetails: MetricDetails[];
    location: Locations;
    metricSelectConfig: MetricSelectConfig;
    startMonthYear: Moment;
    endMonthYear: Moment;
}
