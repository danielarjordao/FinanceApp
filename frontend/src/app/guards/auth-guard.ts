import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  // Verifica se o utilizador está logado no Supabase
  const user = await authService.getCurrentUser();

  console.log('AuthGuard check - user:', user);

  if (!user) {
    // Não está logado, rredireciona para a página de login
    return router.createUrlTree(['/auth/login']);
  }
  return true;
};
