import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ChartUpdateActionsMetaData } from '../models/chart-update-actions-meta-data.model';

@Injectable({
  providedIn: 'root'
})
export class ChartDataUpdateService {

  onChartDataUpdate: Subject<ChartUpdateActionsMetaData> = new Subject();
}
