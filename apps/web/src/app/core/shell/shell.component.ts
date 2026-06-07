import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../auth/auth.service';

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { path: '/transactions', icon: 'receipt_long', label: 'Transactions' },
  { path: '/budgets', icon: 'savings', label: 'Budgets' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);

  readonly navItems = NAV_ITEMS;
  readonly user = this.auth.user;
  readonly loggingOut = signal(false);

  logout() {
    this.loggingOut.set(true);
    this.auth.logout().subscribe({
      error: () => {
        this.auth.clearSession();
      },
    });
  }
}
