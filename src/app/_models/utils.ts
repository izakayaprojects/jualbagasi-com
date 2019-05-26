import { NgbDate, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class DateConverter {

	dateToNgbDate(date: Date): NgbDateStruct {
		return { day: date.getUTCDate(), month: date.getUTCMonth()+1, year: date.getUTCFullYear() }
	}

	ngbDateToDate(ngbDate: NgbDateStruct): Date {
		return new Date(ngbDate.year, ngbDate.month-1, ngbDate.day)
	}

	yyyyMMdd(dt: NgbDateStruct): string {
		return dt.year+"-"+(dt.month+1)+"-"+dt.day
	}
 
	toMySqlTimestamp(dt: Date): string {
		return dt.getUTCFullYear()+"-"+(dt.getUTCMonth()+1)+"-"+dt.getDate()
	}

}

export class ApiResponse<T> {
	success: boolean
	errorId: number
	data: T
}