import { Component, input, output } from '@angular/core';
import { TechnicianIndustrialPartDto } from '../../../Organization/Doctors/Models/technicians/technician-industrial-part.dto';

@Component({
  selector: 'app-technician-industrial-parts-card',
  imports: [],
  templateUrl: './technician-industrial-parts-card.component.html',
  styleUrl: './technician-industrial-parts-card.component.css'
})
export class TechnicianIndustrialPartsCardComponent {
 parts = input.required<TechnicianIndustrialPartDto[]>();

  loading = input<boolean>(false);

  partClicked = output<TechnicianIndustrialPartDto>();
  onCardClick(part: TechnicianIndustrialPartDto): void {
    this.partClicked.emit(part);
  }
}
