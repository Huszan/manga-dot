import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/data/auth.service';

export const generateGenericHeaders = (
  _authService: AuthService
): HttpHeaders => {
  let headers = new HttpHeaders();
  const authToken = _authService.currentUser$.value?.authToken;
  return headers.set('Authorization', `Bearer ${authToken}`);
};
