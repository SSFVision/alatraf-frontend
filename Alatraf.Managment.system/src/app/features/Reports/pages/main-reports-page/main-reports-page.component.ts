import { Component } from '@angular/core';
import { ReportsDropdownSelectComponent } from "../reports-dropdown-select/reports-dropdown-select.component";

@Component({
  selector: 'app-main-reports-page',
  imports: [ReportsDropdownSelectComponent],
  templateUrl: './main-reports-page.component.html',
  styleUrl: './main-reports-page.component.css',
})
export class MainReportsPageComponent {}
