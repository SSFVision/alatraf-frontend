import { Component } from '@angular/core';
import { ReportsDropdownSelectComponent } from "../reports-dropdown-select/reports-dropdown-select.component";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-main-reports-page',
  imports: [ReportsDropdownSelectComponent, RouterModule],
  templateUrl: './main-reports-page.component.html',
  styleUrl: './main-reports-page.component.css',
})
export class MainReportsPageComponent {}
