export enum Months {
    JANUARY = 'JANUARY',
    FEBRUARY = 'FEBRUARY',
    MARCH = 'MARCH',
    APRIL = 'APRIL',
    MAY = 'MAY',
    JUN = 'JUN',
    JULY = 'JULY',
    AUGUST = 'AUGUST',
    SEPTEMBER = 'SEPTEMBER',
    OCTOBER = 'OCTOBER',
    NOVEMBER = 'NOVEMBER',
    DECEMBER = 'DECEMBER'
}

export function transformMonthNumberToMonthsName(month: number) {

    switch (month) {
        case 1: return Months.JANUARY;
        case 2: return Months.FEBRUARY;
        case 3: return Months.MARCH;
        case 4: return Months.APRIL;
        case 5: return Months.MAY;
        case 6: return Months.JUN;
        case 7: return Months.JULY;
        case 8: return Months.AUGUST;
        case 9: return Months.SEPTEMBER;
        case 10: return Months.OCTOBER;
        case 11: return Months.NOVEMBER;
        case 12: return Months.DECEMBER;
    }
}
