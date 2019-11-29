import { Component, OnDestroy } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Colors } from 'ng2-charts';
import { Subscription } from 'rxjs/internal/Subscription';

import { ChartUpdateActionsMetaData } from './../../models/chart-update-actions-meta-data.model';
import { Months, transformMonthNumberToMonthsName } from './../../enumerations/months.enum';
import { ChartDataUpdateService } from './../../services/chart-data-update.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnDestroy {

  barChartOptions: ChartOptions = {
    responsive: false,
    scales: { xAxes: [{}], yAxes: [{}] },
  };

  barChartLabels: Label[] = [];

  barChartType: ChartType = 'line';

  colors: Colors[] = [];

  barChartLegend = true;

  barChartData: ChartDataSets[] = this.getBarChartDataAsPerMonth();

  chartUpdateActionsMetaData: ChartUpdateActionsMetaData;

  dateFormat = 'MMMM YYYY';

  private subscriptions: Subscription = new Subscription();

  constructor(private chartDataUpdateService: ChartDataUpdateService
  ) {
    this.subscriptions.add(
      this.chartDataUpdateService.onChartDataUpdate
        .subscribe(chartUpdateActionsMetaData => {
          this.chartUpdateActionsMetaData = chartUpdateActionsMetaData;
          this.generateChartConfig();
        })
    );
  }

  changeChartType(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }

  private generateChartConfig() {

    const loopUp = {
      [Months.JANUARY]: [],
      [Months.FEBRUARY]: [],
      [Months.MARCH]: [],
      [Months.APRIL]: [],
      [Months.MAY]: [],
      [Months.JUN]: [],
      [Months.JULY]: [],
      [Months.AUGUST]: [],
      [Months.SEPTEMBER]: [],
      [Months.OCTOBER]: [],
      [Months.NOVEMBER]: [],
      [Months.DECEMBER]: []
    };
    const loopUpMap: Map<number, Map<Months, number>> = new Map();
    const barChartLabels: Label[] = [];

    this.chartUpdateActionsMetaData.metricDetails.forEach((metric) => {

      if (!loopUpMap.has(metric.year)) {
        loopUpMap.set(metric.year, new Map());
      }

      loopUpMap.set(metric.year, loopUpMap.get(metric.year).set(transformMonthNumberToMonthsName(metric.month), metric.value));
    });

    loopUpMap.forEach((monthsMap, year) => {
      barChartLabels.push(`${year}`);
      loopUp[Months.JANUARY].push(monthsMap.get(Months.JANUARY) || 0);
      loopUp[Months.FEBRUARY].push(monthsMap.get(Months.FEBRUARY) || 0);
      loopUp[Months.MARCH].push(monthsMap.get(Months.MARCH) || 0);
      loopUp[Months.APRIL].push(monthsMap.get(Months.APRIL) || 0);
      loopUp[Months.MAY].push(monthsMap.get(Months.MAY) || 0);
      loopUp[Months.JUN].push(monthsMap.get(Months.JUN) || 0);
      loopUp[Months.JULY].push(monthsMap.get(Months.JULY) || 0);
      loopUp[Months.AUGUST].push(monthsMap.get(Months.AUGUST) || 0);
      loopUp[Months.SEPTEMBER].push(monthsMap.get(Months.SEPTEMBER) || 0);
      loopUp[Months.OCTOBER].push(monthsMap.get(Months.OCTOBER) || 0);
      loopUp[Months.NOVEMBER].push(monthsMap.get(Months.NOVEMBER) || 0);
      loopUp[Months.DECEMBER].push(monthsMap.get(Months.DECEMBER) || 0);
    });

    const barChartData: ChartDataSets[] = this.getBarChartDataAsPerMonth(
      loopUp[Months.JANUARY],
      loopUp[Months.FEBRUARY],
      loopUp[Months.MARCH],
      loopUp[Months.APRIL],
      loopUp[Months.MAY],
      loopUp[Months.JUN],
      loopUp[Months.JULY],
      loopUp[Months.AUGUST],
      loopUp[Months.SEPTEMBER],
      loopUp[Months.OCTOBER],
      loopUp[Months.NOVEMBER],
      loopUp[Months.DECEMBER]
    );

    this.barChartLabels = barChartLabels;
    this.barChartData = barChartData;
  }

  private getBarChartDataAsPerMonth(
    jan: number[] = [],
    feb: number[] = [],
    mar: number[] = [],
    apr: number[] = [],
    may: number[] = [],
    jun: number[] = [],
    jul: number[] = [],
    aug: number[] = [],
    sep: number[] = [],
    oct: number[] = [],
    nov: number[] = [],
    dec: number[] = []

  ): ChartDataSets[] {
    return [
      {
        data: jan,
        label: Months.JANUARY.toString()
      },
      {
        data: feb,
        label: Months.FEBRUARY.toString()
      },
      {
        data: mar,
        label: Months.MARCH.toString()
      },
      {
        data: apr,
        label: Months.APRIL.toString()
      },
      {
        data: may,
        label: Months.MAY.toString()
      },
      {
        data: jun,
        label: Months.JUN.toString()
      },
      {
        data: jul,
        label: Months.JULY.toString()
      },
      {
        data: aug,
        label: Months.AUGUST.toString()
      },
      {
        data: sep,
        label: Months.SEPTEMBER.toString()
      },
      {
        data: oct,
        label: Months.OCTOBER.toString()
      },
      {
        data: nov,
        label: Months.NOVEMBER.toString()
      },
      {
        data: dec,
        label: Months.DECEMBER.toString()
      }
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
