import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Inicializa a aplicacao Angular.
bootstrapApplication(App, appConfig).catch((error: unknown) => {
  console.error('Application bootstrap failed:', error);
});
