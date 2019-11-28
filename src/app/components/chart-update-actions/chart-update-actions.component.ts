import { ChartDataUpdateService } from './../../services/chart-data-update.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Metrics } from './../../enumerations/metrics.enum';
import { MetricSelectConfig } from '../../models/metrics-select-config.model';
import { Locations } from './../../enumerations/locations.enum';
import { environment } from './../../../environments/environment';
import { MetricDetails } from './../../dtos/metric-details.dto';


const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-chart-update-actions',
  templateUrl: './chart-update-actions.component.html',
  styleUrls: ['./chart-update-actions.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ChartUpdateActionsComponent implements OnInit, OnDestroy {

  chartUpdateActionsForm: FormGroup;

  minDateForSelection: Moment;

  maxDateForSelection: Moment;

  readonly chartUpdateActionsFormControlNames = {
    location: 'location',
    metric: 'metric',
    startMonthYear: 'startMonthYear',
    endMonthYear: 'endMonthYear'
  };

  readonly locations: Locations[] = [Locations.UK, Locations.England, Locations.Scotland, Locations.Wales];

  readonly metrics: MetricSelectConfig[] = [
    {
      displayText: 'Temperature(Min)',
      value: Metrics.Tmin
    },
    {
      displayText: 'Temperature (Max)',
      value: Metrics.Tmax
    },
    {
      displayText: 'Rainfall (mm)',
      value: Metrics.Rainfall
    }
  ];

  private readonly preSelectedLocations: Locations = Locations.UK;

  private readonly preSelectedMetric: Metrics = Metrics.Tmin;

  private fetchedMetricDetails: MetricDetails[] = [];

  private subscriptions: Subscription = new Subscription();

  public get isStartAndEndDateValid(): boolean {
    return !moment(this.startMonthYearFormControl.value).isSameOrAfter(this.endMonthYearFormControl.value);
  }
  private get locationFormControl(): FormControl {
    return this.chartUpdateActionsForm.controls[this.chartUpdateActionsFormControlNames.location] as FormControl;
  }

  private get metricFormControl(): FormControl {
    return this.chartUpdateActionsForm.controls[this.chartUpdateActionsFormControlNames.metric] as FormControl;
  }

  private get startMonthYearFormControl(): FormControl {
    return this.chartUpdateActionsForm.controls[this.chartUpdateActionsFormControlNames.startMonthYear] as FormControl;
  }

  private get endMonthYearFormControl(): FormControl {
    return this.chartUpdateActionsForm.controls[this.chartUpdateActionsFormControlNames.endMonthYear] as FormControl;
  }

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private matSnackBar: MatSnackBar,
    private chartDataUpdateService: ChartDataUpdateService) {

    this.chartUpdateActionsForm = this.formBuilder.group({
      [this.chartUpdateActionsFormControlNames.location]: new FormControl(this.preSelectedLocations),
      [this.chartUpdateActionsFormControlNames.metric]: new FormControl(this.preSelectedMetric),
      [this.chartUpdateActionsFormControlNames.startMonthYear]: new FormControl(moment()),
      [this.chartUpdateActionsFormControlNames.endMonthYear]: new FormControl(moment())
    });

    this.subscriptions.add(
      this.locationFormControl.valueChanges
        .subscribe((changedLocation) => {
          this.fetchDetails(changedLocation, this.metricFormControl.value);
        })
    );

    this.subscriptions.add(
      this.metricFormControl.valueChanges
        .subscribe((changedMetric) => {
          this.fetchDetails(this.locationFormControl.value, changedMetric);
        })
    );

    this.subscriptions.add(
      this.startMonthYearFormControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe((changedStartMonthYear) => {
          console.log('changedStartMonthYear - ', changedStartMonthYear);
          this.updateChartsDataAsPerSelectedStartAndEndDate();
        })
    );

    this.subscriptions.add(
      this.endMonthYearFormControl.valueChanges
        .pipe(debounceTime(1000))
        .subscribe((changedEndMonthYear) => {
          console.log('changedEndMonthYear - ', changedEndMonthYear);
          this.updateChartsDataAsPerSelectedStartAndEndDate();
        })
    );
  }

  ngOnInit() {
    this.fetchDetails();
  }

  chosenStartYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.startMonthYearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.startMonthYearFormControl.setValue(ctrlValue);
  }

  chosenStartMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.startMonthYearFormControl.value;
    ctrlValue.month(normalizedMonth.month());
    this.startMonthYearFormControl.setValue(ctrlValue);
    datepicker.close();
  }

  chosenEndYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.endMonthYearFormControl.value;
    ctrlValue.year(normalizedYear.year());
    this.endMonthYearFormControl.setValue(ctrlValue);
  }

  chosenEndMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.endMonthYearFormControl.value;
    ctrlValue.month(normalizedMonth.month());
    this.endMonthYearFormControl.setValue(ctrlValue);
    datepicker.close();
  }

  private fetchDetails(location: Locations = this.preSelectedLocations, metric: Metrics = this.preSelectedMetric) {
    console.log('fetchDetails - location - ', location);
    console.log('fetchDetails - metric - ', metric);

    this.fetchedMetricDetails = [];

    this.subscriptions.add(
      this.httpClient.get<MetricDetails[]>(environment.fetchMetricDetailsBasedOnLocation(location, metric)).subscribe((metricDetails) => {
        this.fetchedMetricDetails = metricDetails;
        this.updateMinAndMaxValidationForDatePickers();

        this.matSnackBar.open('Metric details fetched successfully.', undefined, {
          duration: 3000
        });

      }, () => {
        this.matSnackBar.open('Failed to fetch Metric details.', undefined, {
          duration: 3000
        });
      })
    );
  }

  private updateMinAndMaxValidationForDatePickers() {
    // Note - As fetched data is always sorted we are not sorting it again
    if (this.fetchedMetricDetails.length > 0) {
      const metricDetailsForStartMonthYearFormControl: MetricDetails = this.fetchedMetricDetails[0];
      const momentStart: Moment = moment().year(metricDetailsForStartMonthYearFormControl.year).month(metricDetailsForStartMonthYearFormControl.month - 1);
      this.startMonthYearFormControl.setValue(momentStart);
      this.minDateForSelection = momentStart;

      const metricDetailsForEndMonthYearFormControl: MetricDetails = this.fetchedMetricDetails[this.fetchedMetricDetails.length - 1];
      const momentEnd: Moment = moment().year(metricDetailsForEndMonthYearFormControl.year).month(metricDetailsForEndMonthYearFormControl.month - 1);
      this.endMonthYearFormControl.setValue(momentEnd);
      this.maxDateForSelection = momentEnd;
    }
  }

  private updateChartsDataAsPerSelectedStartAndEndDate() {

    if (this.isStartAndEndDateValid) {
      const filteredMetricDetailsfilteredMetricDetails: MetricDetails[] = this.fetchedMetricDetails.filter((metricDetail) => {
        return moment(moment().year(metricDetail.year).month(metricDetail.month - 1))
          .isBetween(this.startMonthYearFormControl.value, this.endMonthYearFormControl.value, 'days', '[]');
      });
      this.chartDataUpdateService.onChartDataUpdate.next(filteredMetricDetailsfilteredMetricDetails);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
