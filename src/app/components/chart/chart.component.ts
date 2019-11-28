import { Months, transformMonthNumberToMonthsName } from './../../enumerations/months.enum';
import { Component, OnDestroy } from '@angular/core';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label, Colors } from 'ng2-charts';
import { Subscription } from 'rxjs/internal/Subscription';

import { MetricDetails } from './../../dtos/metric-details.dto';
import { ChartDataUpdateService } from './../../services/chart-data-update.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnDestroy {

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'line';
  colors: Colors[] = [];
  barChartLegend = true;

  barChartData: ChartDataSets[] = [
    {
      data: [],
      label: Months.JANUARY.toString()
    },
    {
      data: [],
      label: Months.FEBRUARY.toString()
    },
    {
      data: [],
      label: Months.MARCH.toString()
    },
    {
      data: [],
      label: Months.APRIL.toString()
    },
    {
      data: [],
      label: Months.MAY.toString()
    },
    {
      data: [],
      label: Months.JUN.toString()
    },
    {
      data: [],
      label: Months.JULY.toString()
    },
    {
      data: [],
      label: Months.AUGUST.toString()
    },
    {
      data: [],
      label: Months.SEPTEMBER.toString()
    },
    {
      data: [],
      label: Months.OCTOBER.toString()
    },
    {
      data: [],
      label: Months.NOVEMBER.toString()
    },
    {
      data: [],
      label: Months.DECEMBER.toString()
    }
  ];

  private subscriptions: Subscription = new Subscription();

  constructor(private chartDataUpdateService: ChartDataUpdateService) {
    this.subscriptions.add(
      this.chartDataUpdateService.onChartDataUpdate
        .subscribe(metricDetails => this.generateChartConfig(metricDetails))
    );
  }

  changeChartType(): void {
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }

  private generateChartConfig(metricDetails: MetricDetails[] = []) {

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

    metricDetails.forEach((metric) => {

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
      loopUp[Months.OCTOBER].push(monthsMap.get(Months.SEPTEMBER) || 0);
      loopUp[Months.NOVEMBER].push(monthsMap.get(Months.SEPTEMBER) || 0);
      loopUp[Months.DECEMBER].push(monthsMap.get(Months.SEPTEMBER) || 0);
    });

    const barChartData: ChartDataSets[] = [
      {
        data: loopUp[Months.JANUARY],
        label: Months.JANUARY.toString()
      },
      {
        data: loopUp[Months.FEBRUARY],
        label: Months.FEBRUARY.toString()
      },
      {
        data: loopUp[Months.MARCH],
        label: Months.MARCH.toString()
      },
      {
        data: loopUp[Months.APRIL],
        label: Months.APRIL.toString()
      },
      {
        data: loopUp[Months.MAY],
        label: Months.MAY.toString()
      },
      {
        data: loopUp[Months.JUN],
        label: Months.JUN.toString()
      },
      {
        data: loopUp[Months.JULY],
        label: Months.JULY.toString()
      },
      {
        data: loopUp[Months.AUGUST],
        label: Months.AUGUST.toString()
      },
      {
        data: loopUp[Months.SEPTEMBER],
        label: Months.SEPTEMBER.toString()
      },
      {
        data: loopUp[Months.OCTOBER],
        label: Months.OCTOBER.toString()
      },
      {
        data: loopUp[Months.NOVEMBER],
        label: Months.NOVEMBER.toString()
      },
      {
        data: loopUp[Months.DECEMBER],
        label: Months.DECEMBER.toString()
      }
    ];

    console.log('barChartData - ', barChartData);

    this.barChartLabels = barChartLabels;
    this.barChartData = barChartData;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
