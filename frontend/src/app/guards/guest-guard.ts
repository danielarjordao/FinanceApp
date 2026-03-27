import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// 1. Muda o nome para guestGuard
export const guestGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const user = await authService.getCurrentUser();

  console.log('GuestGuard check - user:', user);
  if (user) {
    // Se já está logado, bloqueia a página de login e manda para o dashboard
    return router.createUrlTree(['/dashboard']);
  }
  // Se NÃO está logado, deixa entrar na página de Login
  return true;
};
