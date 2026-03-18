import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { IndexComponent } from './core/components/index/index.component';
import { ProfileComponent } from './core/components/profile/profile.component';
import { ProductSalesComponent } from './core/components/product-sales/product-sales.component';
import { PeriodicReportFilterComponent } from './core/components/periodic-report-filter/periodic-report-filter.component';
import { LayoutComponent } from './core/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { AspNetRolesComponent } from './core/components/asp-net-roles/asp-net-roles.component';
import { AspNetRoleClaimsComponent } from './core/components/asp-net-role-claims/asp-net-role-claims.component';
import { AspNetUsersComponent } from './core/components/asp-net-users/asp-net-users.component';
import { AspNetUserClaimsComponent } from './core/components/asp-net-user-claims/asp-net-user-claims.component';
import { AspNetUserLoginsComponent } from './core/components/asp-net-user-logins/asp-net-user-logins.component';
import { AspNetUserRolesComponent } from './core/components/asp-net-user-roles/asp-net-user-roles.component';
import { AspNetUserTokensComponent } from './core/components/asp-net-user-tokens/asp-net-user-tokens.component';
import { UserRefreshTokensComponent } from './core/components/user-refresh-tokens/user-refresh-tokens.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'index',            component: IndexComponent },
      { path: 'profile',          component: ProfileComponent },
      { path: 'product-sales',    component: ProductSalesComponent },
      { path: 'periodic-report',  component: PeriodicReportFilterComponent },
      { path: 'asp-net-roles',        component: AspNetRolesComponent },
      { path: 'asp-net-role-claims',  component: AspNetRoleClaimsComponent },
      { path: 'asp-net-users',        component: AspNetUsersComponent },
      { path: 'asp-net-user-claims',  component: AspNetUserClaimsComponent },
      { path: 'asp-net-user-logins',  component: AspNetUserLoginsComponent },
      { path: 'asp-net-user-roles',   component: AspNetUserRolesComponent },
      { path: 'asp-net-user-tokens',  component: AspNetUserTokensComponent },
      { path: 'user-refresh-tokens',  component: UserRefreshTokensComponent },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
