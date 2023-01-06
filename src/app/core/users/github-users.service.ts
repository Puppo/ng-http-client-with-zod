import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface GitHubUser {
  login: string;
  id: string;
  avatar_url: string;
  url: string;
  repos_url: string;
  type: 'User';
}

interface GitHubUserSearchResponse {
  items: GitHubUser[];
  total_count: number;
}

@Injectable({ providedIn: 'root' })
export class GitHubUsersService {
  constructor(private httpClient: HttpClient) {}

  searchUsers(query: string): Observable<GitHubUser[]> {
    return this.httpClient
      .get<GitHubUserSearchResponse>(
        `https://api.github.com/search/users?q=${query}`
      )
      .pipe(map((response) => response.items));
  }
}
