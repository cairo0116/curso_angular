import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'; 
import { routes } from './app.routes';
import { TituloConSufijo } from './compartido/titulo';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()), 
    { provide: TitleStrategy, useClass: TituloConSufijo },
  ],
};
