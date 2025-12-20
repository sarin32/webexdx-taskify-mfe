import { Component } from '@angular/core';
import { ModeToggle } from '../mode-toggle/mode-toggle';

@Component({
  selector: 'app-navbar',
  imports: [ModeToggle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  logout() {
    throw new Error('Method not implemented.');
  }
}
