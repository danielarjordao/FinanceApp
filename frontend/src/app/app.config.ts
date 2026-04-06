import { ApplicationConfig, provideBrowserGlobalErrorListeners, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt-PT';

import { routes } from './app.routes';

// Registra locale base da aplicacao.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    // Provedor para capturar erros globais no navegador e exibi-los no console.
    provideBrowserGlobalErrorListeners(),
    // Provedor para configurar as rotas da aplicação.
    provideRouter(routes),
    // Provedor para configurar o cliente HTTP para fazer requisições à API.
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'pt-PT' },
  ],
};
