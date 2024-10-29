import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss'],
})
export class ReadMoreComponent {
  @Input() text: string = '';
  @Input() maxLength: number = 100; // Default length

  isExpanded: boolean = false;

  get trimmedText(): string {
    return this.text.length > this.maxLength
      ? this.text.substring(0, this.maxLength)
      : this.text;
  }

  toggleReadMore(): void {
    this.isExpanded = !this.isExpanded;
  }
}
