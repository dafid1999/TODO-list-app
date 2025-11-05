// DEV flag to optionally inject mock tasks in development
(globalThis as any).DEV_MOCK_TASKS = false;

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
