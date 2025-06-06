import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  navItems = [
    { path: '/home', label: 'Home' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' }
  ];
} 