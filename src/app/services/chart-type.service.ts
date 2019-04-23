import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartTypeService {
  chartType: BehaviorSubject<any> = new BehaviorSubject<any>('LINE');
  constructor() {}
}
