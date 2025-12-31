import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-doctor-header-info',
  standalone: true,
  imports: [CommonModule],  templateUrl: './doctor-header-info.component.html',
  styleUrl: './doctor-header-info.component.css'
})
export class DoctorHeaderInfoComponent {
  doctorName = input.required<string | undefined >();

  sectionName = input.required<string | undefined>();

  roomName = input<string | null | undefined>();

  itemCount = input.required<number>();

  itemCountLabel = input.required<string>();

  
  settingsClicked = output<void>();

  onSettingsClick(): void {
    this.settingsClicked.emit();
  }
}
