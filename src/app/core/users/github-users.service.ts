import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { z, ZodSchema } from 'zod';

const GitHubUser = z.object({
  login: z.string(),
  id: z.string(),
  avatar_url: z.string(),
  url: z.string(),
  repos_url: z.string(),
  type: z.union([z.literal('User'), z.literal('Organization')]),
});

type GitHubUser = z.infer<typeof GitHubUser>;

const GitHubUserSearchResponse = z.object({
  items: z.array(GitHubUser),
  total_count: z.number(),
});

type GitHubUserSearchResponse = z.infer<typeof GitHubUserSearchResponse>;

const zodValidation =
  <T extends ZodSchema>(schema: T) =>
  (source: Observable<unknown>): Observable<z.infer<T>> =>
    source.pipe(map((obj) => schema.parse(obj)));

@Injectable({ providedIn: 'root' })
export class GitHubUsersService {
  constructor(private httpClient: HttpClient) {}

  searchUsers(query: string): Observable<GitHubUser[]> {
    return this.httpClient
      .get(`https://api.github.com/search/users?q=${query}`)
      .pipe(
        zodValidation(GitHubUserSearchResponse),
        map((response) => response.items)
      );
  }
}
