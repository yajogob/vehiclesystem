import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'vs-car-rental-search',
  templateUrl: './car-rental-search.component.html',
  styleUrls: ['./car-rental-search.component.scss'],
})
export class CarRentalSearchComponent implements OnInit {
  @Input() immediate: '0' | '1' = '1'; // 1：Execute Search Now; 0：Search on user click
  @Input() placeholder = 'searchByPlateNumber';
  @Output() carRentalSearchEvent: EventEmitter<string> = new EventEmitter<string>();

  searchName = '';

  ngOnInit(): void {
    if(this.immediate === '1') {
      this.searchCompanyList();
    }
  }

  searchCompanyList(): void {
    const searchNameTrim = this.searchName.trim();
    this.carRentalSearchEvent.emit(searchNameTrim);
  }
}
