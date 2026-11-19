import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { routes } from './app.routes';

/**
 * AppConfig sets up all foundational providers for the application:
 * - provideRouter: sets up Angular client-side routing
 * - provideHttpClient: enables HTTP calls (ready for Fastify backend)
 * - provideAnimationsAsync: provides smooth animations for UI components
 * - providePrimeNG: registers PrimeNG 22 with the modern Aura theme
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none' // Enforces our Dreamy Lavender pastel palette
        }
      },
      ripple: true
    })
  ]
};
