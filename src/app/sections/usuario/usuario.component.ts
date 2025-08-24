import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../i18n/t.pipe';
import { ModalComponent, ModalConfig } from '../../shared/modal/modal.component';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'editor';
  avatar?: string;
  phone?: string;
  company?: string;
  position?: string;
  bio?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ModalComponent
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
  
  // Datos del usuario
  userProfile: UserProfile = {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    role: 'admin',
    avatar: 'assets/logo1.png',
    phone: '+56 9 1234 5678',
    company: 'Empresa Inmobiliaria SPA',
    position: 'Administrador General',
    bio: 'Administrador con más de 5 años de experiencia en gestión inmobiliaria y desarrollo de proyectos.',
    isActive: true,
    lastLogin: '2024-06-20T10:30:00Z',
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2024-06-20T10:30:00Z'
  };

  // Estados del componente
  isEditing = false;
  isSaving = false;
  showPasswordModal = false;
  isUploadingAvatar = false;
  
  // Datos temporales para edición
  tempProfile: UserProfile = { ...this.userProfile };
  
  // Configuración del modal de contraseña
  passwordModalConfig: ModalConfig = {
    title: 'Cambiar Contraseña',
    message: 'Ingresa tu nueva contraseña:',
    inputPlaceholder: 'Nueva contraseña',
    confirmText: 'Cambiar',
    cancelText: 'Cancelar',
    showInput: true,
    showCancel: true,
    confirmButtonType: 'primary'
  };

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    // Aquí se cargarían los datos del usuario desde el servicio
    console.log('Cargando perfil de usuario...');
  }

  // Métodos de edición
  startEditing() {
    this.tempProfile = { ...this.userProfile };
    this.isEditing = true;
  }

  cancelEditing() {
    this.tempProfile = { ...this.userProfile };
    this.isEditing = false;
  }

  async saveProfile() {
    this.isSaving = true;
    
    try {
      // Simular llamada al servicio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.userProfile = { ...this.tempProfile };
      this.userProfile.updatedAt = new Date().toISOString();
      this.isEditing = false;
      
      console.log('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      this.isSaving = false;
    }
  }

  // Métodos para el modal de contraseña
  openPasswordModal() {
    this.showPasswordModal = true;
  }

  onPasswordConfirm(newPassword: string) {
    console.log('Contraseña cambiada:', newPassword);
    this.showPasswordModal = false;
  }

  onPasswordCancel() {
    this.showPasswordModal = false;
  }

  onPasswordClose() {
    this.showPasswordModal = false;
  }

  // Métodos para el avatar
  onAvatarClick() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.uploadAvatar(file);
      }
    };
    fileInput.click();
  }

  async uploadAvatar(file: File) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      console.error('El archivo debe ser una imagen');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('La imagen no debe superar los 5MB');
      return;
    }

    this.isUploadingAvatar = true;

    try {
      // Convertir a base64 para previsualizar
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.isEditing) {
          this.tempProfile.avatar = e.target.result;
        } else {
          this.userProfile.avatar = e.target.result;
          this.userProfile.updatedAt = new Date().toISOString();
        }
      };
      reader.readAsDataURL(file);

      // Simular subida al servidor
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Avatar actualizado exitosamente');
    } catch (error) {
      console.error('Error al subir el avatar:', error);
    } finally {
      this.isUploadingAvatar = false;
    }
  }

  removeAvatar() {
    if (this.isEditing) {
      this.tempProfile.avatar = undefined;
    } else {
      this.userProfile.avatar = undefined;
      this.userProfile.updatedAt = new Date().toISOString();
    }
  }

  // Utilidades
  getRoleText(role: string): string {
    switch (role) {
      case 'admin': return 'usuario.role_admin';
      case 'user': return 'usuario.role_user';
      case 'editor': return 'usuario.role_editor';
      default: return 'usuario.role_unknown';
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'user': return 'role-user';
      case 'editor': return 'role-editor';
      default: return 'role-unknown';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
