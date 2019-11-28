import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MetricDetails } from './../dtos/metric-details.dto';

@Injectable({
  providedIn: 'root'
})
export class ChartDataUpdateService {

  onChartDataUpdate: Subject<MetricDetails[]> = new Subject();
}
