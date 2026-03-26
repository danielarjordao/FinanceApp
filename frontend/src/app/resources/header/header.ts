import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { GreetingPipe } from '../../utils/pipes/greeting-pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, DatePipe, GreetingPipe],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  // Dados do utilizador
  // TODO: Estes dados devem ser obtidos a partir de um serviço de autenticação real
  userName: string = 'Daniela';
  userFullName: string = 'Daniela Jordão';
  userEmail: string = 'appfinancas.suporte@gmail.com';
  userInitial: string = this.userName.charAt(0).toUpperCase();

  // Data atual para exibir no header
  currentDate = new Date();

  // Perfis disponíveis e perfil ativo
  // TODO: Estes dados devem ser obtidos a partir de um serviço de utilizadores real, permitindo que o utilizador tenha múltiplos perfis e possa alternar entre eles
  activeProfile: string = 'Personal';
  availableProfiles: string[] = ['Personal', 'Freelance', 'Business'];

  // Estados para controlar a visibilidade dos menus dropdown
  isUserMenuOpen: boolean = false;
  isProfileMenuOpen: boolean = false;

  toggleProfileMenu(event: Event) {
    event.stopPropagation(); // Impede o clique de chegar ao HostListener
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
    this.isUserMenuOpen = false; // Fecha o outro menu se estiver aberto
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation(); // Impede o clique de chegar ao HostListener
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isProfileMenuOpen = false; // Fecha o outro menu se estiver aberto
  }

  selectProfile(profile: string) {
    this.activeProfile = profile;
    this.isProfileMenuOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.isProfileMenuOpen = false;
    this.isUserMenuOpen = false;
  }
}
