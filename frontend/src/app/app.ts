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
  // DestroyRef: encerra subscriptions automaticamente ao destruir o componente.
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Rotas que não devem mostrar o "app shell" (header/sidebar/footer).
  private readonly shellHiddenRoutes = ['/auth/login', '/terms'];

  // Estado que controla se o shell aparece na tela atual.
  showAppShell = false;

  constructor() {
    // Define o estado inicial do shell com base na URL já carregada.
    // Isso evita "piscar" layout errado no primeiro render.
    this.showAppShell = this.shouldShowAppShell(this.router.url);

    // Escuta mudanças de rota durante a navegação.
    // Filtra apenas NavigationEnd para reagir quando a rota já foi resolvida.
    // takeUntilDestroyed garante cleanup automático da subscription.
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(event => {
      // Recalcula se o shell deve aparecer após cada navegação concluída.
      this.showAppShell = this.shouldShowAppShell(event.urlAfterRedirects);
    });
  }

  // Regra central de layout:
  // - remove query string e hash para comparar apenas o caminho da rota
  // - se começar por alguma rota "oculta", não mostra shell
  // - caso contrário, mostra shell completo
  private shouldShowAppShell(url: string): boolean {
    const normalizedUrl = url.split('?')[0].split('#')[0];
    return !this.shellHiddenRoutes.some(route => normalizedUrl.startsWith(route));
  }
}
