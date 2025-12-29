import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workspace-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workspace-welcome.component.html',
  styleUrl: './workspace-welcome.component.css',
})
export class WorkspaceWelcomeComponent {
  @Input() title = 'مرحباً بك';
  @Input() subtitle = 'يرجى اختيار عنصر من القائمة أو إنشاء عنصر جديد';
  @Input() imageSrc = "assets/images/bro.svg";
}
