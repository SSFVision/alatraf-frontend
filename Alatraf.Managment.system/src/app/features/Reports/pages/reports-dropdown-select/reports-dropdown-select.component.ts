import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { ReportsNavigationFacade } from '../../../../core/navigation/reports-navigation.facade';
import {
  ReportType,
  ReportCriteria,
  REPORTS_CRITERIA,
} from '../../reports.criteria';

@Component({
  selector: 'app-reports-dropdown-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports-dropdown-select.component.html',
  styleUrl: './reports-dropdown-select.component.css',
})
export class ReportsDropdownSelectComponent {
  private navigation = inject(ReportsNavigationFacade);
  private auth = inject(AuthFacade);

  selectedReportKey: ReportType | '' = '';

  get enabledReports(): ReportCriteria[] {
    return REPORTS_CRITERIA.filter(
      (report) =>
        !report.permission || this.auth.hasPermission(report.permission)
    );
  }

  onSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const reportKey = target.value;
    if (!reportKey) return;

    this.selectedReportKey = reportKey as ReportType;
    this.navigation.goToReport(reportKey as ReportType);
  }
}
