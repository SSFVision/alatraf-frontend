import {
  Component,
  EventEmitter,
  Output,
  signal,
  input,
  output,
} from '@angular/core';
import { UserListItemDto } from '../../Models/Users/user-list-item.dto';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users = input<UserListItemDto[]>([]);
  loading = input<boolean>(false);
  selectUser = output<UserListItemDto>();

  selectedId = signal<number | string | null>(null);

  onSelect(user: UserListItemDto) {
    this.selectedId.set(user.userId as any);
    this.selectUser.emit(user);
  }
}
