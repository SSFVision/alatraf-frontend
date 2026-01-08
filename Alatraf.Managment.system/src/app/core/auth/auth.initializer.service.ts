import { firstValueFrom } from 'rxjs';
import { AuthFacade } from './auth.facade';

export function authInitializer(authFacade: AuthFacade) {
  return () => firstValueFrom(authFacade.autoLogin());
}
