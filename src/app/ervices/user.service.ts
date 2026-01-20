import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { User } from '../models/user.model';
import { HttpApiService } from './http-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USERS_ENDPOINT = '/users';

  constructor(private httpApi: HttpApiService) { }

  /**
   * Fetches all users from the API
   * Uses centralized HttpApiService for all HTTP operations
   * @returns Observable of User array
   */
  getUsers(): Observable<User[]> {
    return this.httpApi.get<User[]>(this.USERS_ENDPOINT).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error);
        return of([]);
      })
    );
  }
}
