import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  selectedButton: string = '';

  ngOnInit() {
    const storedSelectedButton = localStorage.getItem('selectedButton');
    if (storedSelectedButton) {
      this.selectedButton = storedSelectedButton;
    }
  }

  selectButton(buttonName: string) {
    this.selectedButton = buttonName;
    localStorage.setItem('selectedButton', buttonName);
  }

  isSelected(buttonName: string): boolean {
    return this.selectedButton === buttonName;
  }
}
