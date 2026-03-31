import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from, map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth } from './auth';
import { Tag, TagDeleteResponse, TagListResponse, TagResponse } from '../models/tag';

@Injectable({ providedIn: 'root' })
export class TagService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(Auth);
  private readonly apiUrl = `${environment.apiUrl}/tags`;

  // Executa requisicoes reaproveitando token e header de autenticacao.
  private withAuthHeaders<T>(requestFactory: (headers: HttpHeaders) => Observable<T>): Observable<T> {
    return from(this.authService.getAccessToken()).pipe(
      switchMap(token => requestFactory(this.buildAuthHeaders(token))),
    );
  }

  // Monta o header Authorization quando o token existe.
  private buildAuthHeaders(token?: string): HttpHeaders {
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Retorna tags associadas a um perfil.
  getTags(profileId: string): Observable<Tag[]> {
    return this.withAuthHeaders(headers => {
      const params = new HttpParams().set('profile_id', profileId);

      return this.http.get<TagListResponse>(this.apiUrl, { headers, params }).pipe(
        map(response => response.data || []),
      );
    });
  }

  // Cria uma tag para o perfil ativo.
  createTag(tagData: Partial<Tag>): Observable<Tag> {
    return this.withAuthHeaders(headers =>
      this.http.post<TagResponse>(this.apiUrl, tagData, { headers }).pipe(
        map(response => response.data),
      ),
    );
  }

  // Atualiza uma tag existente.
  updateTag(id: string, tagData: Partial<Tag>): Observable<Tag> {
    return this.withAuthHeaders(headers =>
      this.http.patch<TagResponse>(`${this.apiUrl}/${id}`, tagData, { headers }).pipe(
        map(response => response.data),
      ),
    );
  }

  // Remove uma tag existente.
  deleteTag(id: string): Observable<boolean> {
    return this.withAuthHeaders(headers =>
      this.http.delete<TagDeleteResponse>(`${this.apiUrl}/${id}`, { headers }).pipe(
        map(response => response.status === 'success'),
      ),
    );
  }
}
