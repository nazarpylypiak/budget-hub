import { Route } from '@angular/router';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
    ],
  },
];
