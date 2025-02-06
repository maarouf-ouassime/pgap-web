import { Injectable } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateAdapter {

  isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }

  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   */
  fromModel(value: string | null): NgbDateStruct | null {

    /*return (date && this.isInteger(date.year) && this.isInteger(date.month) && this.isInteger(date.day)) ?
        {year: date.year, month: date.month, day: date.day} :
        null;*/
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() };
  }

  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   */
  toModel(date: NgbDateStruct | null): string | null {
    return (date && this.isInteger(date.year) && this.isInteger(date.month) && this.isInteger(date.day)) ?
      date.year + '/' + ('0' + date.month).slice(-2) + '/' + ('0' + date.day).slice(-2) : null;
  }
}
