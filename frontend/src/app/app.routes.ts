import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { Transactions } from './components/transactions/transactions';
import { Accounts } from './components/accounts/accounts';
import { Past12Months } from './components/past-12-months/past-12-months';
import { Forecast } from './components/forecast/forecast';
import { Goals } from './components/goals/goals';
import { Categories } from './components/categories/categories';
import { Budgets } from './components/budgets/budgets';
import { Settings } from './components/settings/settings';
import { Terms } from './components/terms/terms';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';
import { Profile } from './components/profile/profile';
import { TransactionForm } from './components/transaction-form/transaction-form';

const LOGIN_PATH = '/auth/login';

// Agrupa rotas protegidas para reduzir repeticao.
const protectedRoutes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'transactions', component: Transactions },
  { path: 'transactions/new', component: TransactionForm },
  { path: 'transactions/edit/:id', component: TransactionForm },
  { path: 'accounts', component: Accounts },
  { path: 'past-12-months', component: Past12Months },
  { path: 'forecast', component: Forecast },
  { path: 'goals', component: Goals },
  { path: 'categories', component: Categories },
  { path: 'budgets', component: Budgets },
  { path: 'profile', component: Profile },
  { path: 'settings', component: Settings },
].map(route => ({
  ...route,
  canActivate: [authGuard],
}));

export const routes: Routes = [
  { path: 'auth/login', component: Login, canActivate: [guestGuard] },
  ...protectedRoutes,
  { path: 'terms', component: Terms },
  { path: '', redirectTo: LOGIN_PATH, pathMatch: 'full' },
  { path: '**', redirectTo: LOGIN_PATH },
];
