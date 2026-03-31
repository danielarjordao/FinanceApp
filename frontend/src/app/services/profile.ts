import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, map, switchMap, of, shareReplay, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';
import { Profile } from '../models/profile';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private authService = inject(Auth);
  private apiUrl = `${environment.apiUrl}/profiles`;

  // Holds the currently active profile state
  private currentProfileSubject = new BehaviorSubject<Profile | null>(null);

  // Observable emitting the currently selected profile for components to react
  currentProfile$ = this.currentProfileSubject.asObservable();

  // Observable emitting the user's profile list, fetching from backend and caching
  allProfiles$: Observable<Profile[]> = this.authService.currentUser$.pipe(
    switchMap(user => {
      // If no authenticated user, return an empty array immediately
      if (!user) return of([]);

      return from(this.authService.getAccessToken()).pipe(
        switchMap(token => {
          let headers = new HttpHeaders();
          if (token) headers = headers.set('Authorization', `Bearer ${token}`);

          // Fetch profiles for the authenticated user, filtering by user_id
          const params = new HttpParams().set('user_id', user.id);

          return this.http.get<{ status: string; data: Profile[] }>(this.apiUrl, { headers, params }).pipe(
            map(response => response.data || []),
            tap(profiles => {
              // If no active profile is set and profiles exist, set the first as active
              if (profiles.length > 0 && !this.currentProfileSubject.value) {
                this.updateActiveProfile(profiles[0]);
              }
            })
          );
        })
      );
    }),
    shareReplay(1) // Reactive cache: prevents duplicate HTTP calls
  );

  /**
   * Centralized helper to prevent NG0100 errors using setTimeout.
   * This ensures state changes happen outside the current CD cycle.
   */
  private updateActiveProfile(profile: Profile | null): void {
    setTimeout(() => {
      this.currentProfileSubject.next(profile);
    }); // 0ms timeout
  }

  // Allows components to change the active profile
  switchProfile(profile: Profile): void {
    this.updateActiveProfile(profile);
  }

  // Creates a new profile, sends to backend, and updates local state if needed
  createProfile(profileData: Partial<Profile>): Observable<Profile> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http.post<{ status: string; data: Profile }>(this.apiUrl, profileData, { headers }).pipe(
          map(response => response.data),
          tap(newProfile => {
            // If it's the first profile created, set it as active immediately
            if (!this.currentProfileSubject.value) {
              this.updateActiveProfile(newProfile);
            }
          })
        );
      })
    );
  }

  // Updates an existing profile and instantly reacts if it's the active one
  updateProfile(id: string, profileData: Partial<Profile>): Observable<Profile> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http.patch<{ status: string; data: Profile }>(`${this.apiUrl}/${id}`, profileData, { headers }).pipe(
          map(response => response.data),
          tap(updatedProfile => {
            // If the updated profile is the currently active one, update the Subject
            if (this.currentProfileSubject.value?.id === updatedProfile.id) {
              this.updateActiveProfile(updatedProfile);
            }
          })
        );
      })
    );
  }

  // Performs a soft delete and clears state if the deleted profile was active
  deleteProfile(id: string): Observable<boolean> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap(token => {
        let headers = new HttpHeaders();
        if (token) headers = headers.set('Authorization', `Bearer ${token}`);

        return this.http.delete<{ status: string; message: string }>(`${this.apiUrl}/${id}`, { headers }).pipe(
          map(response => response.status === 'success'),
          tap(success => {
            // Clear the active profile from UI if the user just deleted the one they were viewing
            if (success && this.currentProfileSubject.value?.id === id) {
              this.updateActiveProfile(null);
            }
          })
        );
      })
    );
  }
}
