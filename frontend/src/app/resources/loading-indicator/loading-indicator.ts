import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  templateUrl: './loading-indicator.html',
  styleUrls: ['./loading-indicator.css'],
})
export class LoadingIndicator {
  @Input() message = 'Loading...';
}
