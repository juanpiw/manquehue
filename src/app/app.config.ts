import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { APP_ROUTES, ROUTING_CONFIG } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      APP_ROUTES,
      withRouterConfig(ROUTING_CONFIG),
      withEnabledBlockingInitialNavigation() // opcional, pero útil
    ),
    provideClientHydration(),
    provideHttpClient(withFetch(), withInterceptors([])),
  ]
};
