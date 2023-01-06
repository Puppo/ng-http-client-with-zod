import { Component } from '@angular/core';
import { BehaviorSubject, debounceTime, iif, of, switchMap } from 'rxjs';
import { GitHubUsersService } from './core/users/github-users.service';

@Component({
  selector: 'ng-http-with-zod-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private searchTermSub = new BehaviorSubject<string>('');
  private searchTerm$ = this.searchTermSub.asObservable();

  users$ = this.searchTerm$.pipe(
    debounceTime(500),
    switchMap((searchTerm) =>
      iif(
        () => searchTerm?.length > 0,
        this.gitHubUsersService.searchUsers(searchTerm),
        of([])
      )
    )
  );

  constructor(private readonly gitHubUsersService: GitHubUsersService) {}

  searchUsers(searchTerm: string) {
    this.searchTermSub.next(searchTerm);
  }
}
