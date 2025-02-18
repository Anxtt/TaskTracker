import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
    private date!: Date;
    private day!: number;
    private month!: number;
    private year!: number;
    
    currentDate!: string;

    constructor() {
        this.date = new Date();
        this.day = this.date.getDate();
        this.month = this.date.getMonth() + 1;
        this.year = this.date.getFullYear();

        this.currentDate = `${this.year}-${this.month < 10 ? '0' + this.month : this.month}-${this.day < 10 ? '0' + this.day : this.day}`
    }
}
