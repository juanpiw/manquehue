import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../i18n/t.pipe';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  @Input() userName: string = '';
  @Input() userImage?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showName: boolean = true;
}


