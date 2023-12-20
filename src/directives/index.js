/**
 * Configure and register global directives
 */
import { permissionDirective } from './permission';
import { loadingDirective } from './loading';

export function setupGlobDirectives(app) {
  app.directive('permission', permissionDirective);
  app.directive('ui-loading', loadingDirective);
}
