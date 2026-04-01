import { Component, DestroyRef, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Sidebar } from './resources/sidebar/sidebar';
import { Header } from './resources/header/header';
import { Footer } from './resources/footer/footer';
import { ConfirmModalComponent } from './resources/confirm-modal/confirm-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Header, Footer, ConfirmModalComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly shellHiddenRoutes = ['/auth/login', '/terms'];
  showAppShell = false;

  constructor() {
    this.showAppShell = this.shouldShowAppShell(this.router.url);

    // Escuta navegacoes para controlar layout com ou sem shell.
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(event => {
      this.showAppShell = this.shouldShowAppShell(event.urlAfterRedirects);
    });
  }

  // Define se a rota atual deve usar header/sidebar/footer.
  private shouldShowAppShell(url: string): boolean {
    const normalizedUrl = url.split('?')[0].split('#')[0];
    return !this.shellHiddenRoutes.some(route => normalizedUrl.startsWith(route));
  }
}
