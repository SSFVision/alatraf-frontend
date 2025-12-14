import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-industrial-part-worke-space-view-page.component',
  imports: [],
  templateUrl: './industrial-part-worke-space-view-page.component.component.html',
  styleUrl: './industrial-part-worke-space-view-page.component.component.css'
})
export class IndustrialPartWorkeSpaceViewPageComponentComponent {
  isLoading = signal(false);

}
