import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../i18n/t.pipe';
import { ModalComponent, ModalConfig } from '../../shared/modal/modal.component';

interface ScreenDevice {
  id: string;
  name: string;
  location: string;
  type: 'touch' | 'tv' | 'led' | 'monitor';
  brand: string;
  model: string;
  size: string;
  resolution: string;
  orientation: 'horizontal' | 'vertical';
  operatingSystem: 'windows' | 'android' | 'ios' | 'linux' | 'other';
  processor?: string;
  memory?: string;
  storage?: string;
  responsible: {
    name: string;
    email: string;
    phone?: string;
  };
  networkInfo: {
    ip: string;
    mac: string;
    wifi: boolean;
    ethernet: boolean;
  };
  software: {
    version: string;
    lastUpdate: string;
    status: 'up_to_date' | 'needs_update' | 'error';
  };
  status: 'online' | 'offline' | 'maintenance' | 'error';
  assignedProject?: {
    id: string;
    name: string;
    lastSync: string;
  };
  accessories: {
    roku?: boolean;
    xiaomiTvBox?: boolean;
    chromecast?: boolean;
    other?: string[];
  };
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  assignedScreens: string[];
}

interface ScreenStatsSummary {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
  error: number;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslatePipe,
    ModalComponent
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss'
})
export class ConfiguracionComponent implements OnInit {
  // Datos de pantallas
  screens: ScreenDevice[] = [
    {
      id: '1',
      name: 'Nogales (Carmen)',
      location: 'Nogales',
      type: 'touch',
      brand: 'Touch',
      model: 'Touch 50"',
      size: '50"',
      resolution: '1920x1080',
      orientation: 'horizontal',
      operatingSystem: 'windows',
      processor: 'Intel Core i5',
      memory: '8GB RAM',
      storage: '256GB SSD',
      responsible: {
        name: 'Carmen Gutiérrez',
        email: 'carmen.gutierrez@empresa.cl',
        phone: '+56 9 8765 4321'
      },
      networkInfo: {
        ip: '192.168.1.101',
        mac: '00:1B:44:11:3A:B7',
        wifi: true,
        ethernet: false
      },
      software: {
        version: 'Windows 11 Pro',
        lastUpdate: '2024-06-20T10:30:00Z',
        status: 'up_to_date'
      },
      status: 'online',
      assignedProject: {
        id: 'proj-1',
        name: 'Residencial Las Condes',
        lastSync: '2024-06-20T10:30:00Z'
      },
      accessories: {
        roku: false,
        xiaomiTvBox: false,
        chromecast: false,
        other: []
      },
      lastSeen: '2024-06-20T10:30:00Z',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-06-20T10:30:00Z'
    },
    {
      id: '2',
      name: 'Alto La Cruz',
      location: 'Alto La Cruz',
      type: 'tv',
      brand: 'Samsung',
      model: 'UN50AU7090GXZS',
      size: '50"',
      resolution: '4K 3840x2160',
      orientation: 'horizontal',
      operatingSystem: 'android',
      responsible: {
        name: 'Roberto Silva',
        email: 'roberto.silva@empresa.cl',
        phone: '+56 9 7654 3210'
      },
      networkInfo: {
        ip: '192.168.1.102',
        mac: '00:1B:44:11:3A:B8',
        wifi: true,
        ethernet: true
      },
      software: {
        version: 'T-KSU2EUAABC-22209',
        lastUpdate: '2024-06-19T15:45:00Z',
        status: 'up_to_date'
      },
      status: 'online',
      assignedProject: {
        id: 'proj-2',
        name: 'Centro Comercial Providencia',
        lastSync: '2024-06-20T09:15:00Z'
      },
      accessories: {
        roku: false,
        xiaomiTvBox: false,
        chromecast: true,
        other: []
      },
      lastSeen: '2024-06-20T09:15:00Z',
      createdAt: '2024-02-20T09:00:00Z',
      updatedAt: '2024-06-19T15:45:00Z'
    },
    {
      id: '3',
      name: 'Vicuña Mackenna 50"',
      location: 'Vicuña Mackenna',
      type: 'tv',
      brand: 'LG',
      model: 'Google TV',
      size: '50"',
      resolution: '4K 3840x2160',
      orientation: 'horizontal',
      operatingSystem: 'android',
      responsible: {
        name: 'Patricia Morales',
        email: 'patricia.morales@empresa.cl',
        phone: '+56 9 6543 2109'
      },
      networkInfo: {
        ip: '192.168.1.103',
        mac: '00:1B:44:11:3A:B9',
        wifi: true,
        ethernet: false
      },
      software: {
        version: 'Android TV M',
        lastUpdate: '2024-06-18T12:20:00Z',
        status: 'needs_update'
      },
      status: 'online',
      assignedProject: {
        id: 'proj-3',
        name: 'Proyecto Residencial Ñuñoa',
        lastSync: '2024-06-20T08:45:00Z'
      },
      accessories: {
        roku: false,
        xiaomiTvBox: true,
        chromecast: false,
        other: ['Xiaomi TV Box MiTV-AEKRO']
      },
      lastSeen: '2024-06-20T08:45:00Z',
      createdAt: '2024-03-10T10:00:00Z',
      updatedAt: '2024-06-18T12:20:00Z'
    },
    {
      id: '4',
      name: 'Ñuñoa Touch',
      location: 'Ñuñoa',
      type: 'touch',
      brand: 'Touch',
      model: 'Touch 42"',
      size: '42"',
      resolution: '1920x1080',
      orientation: 'vertical',
      operatingSystem: 'windows',
      processor: 'Intel Core i7',
      memory: '16GB RAM',
      storage: '512GB SSD',
      responsible: {
        name: 'Benjamín Carrasco',
        email: 'benjamin.carrasco@empresa.cl',
        phone: '+56 9 5432 1098'
      },
      networkInfo: {
        ip: '192.168.1.104',
        mac: '00:1B:44:11:3A:BA',
        wifi: false,
        ethernet: true
      },
      software: {
        version: 'Windows 11 Pro',
        lastUpdate: '2024-06-20T11:00:00Z',
        status: 'up_to_date'
      },
      status: 'online',
      assignedProject: {
        id: 'proj-4',
        name: 'Complejo Deportivo Ñuñoa',
        lastSync: '2024-06-20T11:00:00Z'
      },
      accessories: {
        roku: false,
        xiaomiTvBox: false,
        chromecast: false,
        other: []
      },
      lastSeen: '2024-06-20T11:00:00Z',
      createdAt: '2024-04-05T14:00:00Z',
      updatedAt: '2024-06-20T11:00:00Z'
    },
    {
      id: '5',
      name: 'Víctor Rae (Ximena)',
      location: 'Víctor Rae',
      type: 'touch',
      brand: 'Touch',
      model: 'Touch 50"',
      size: '50"',
      resolution: '1920x1080',
      orientation: 'vertical',
      operatingSystem: 'windows',
      processor: 'Intel Core i5',
      memory: '8GB RAM',
      storage: '256GB SSD',
      responsible: {
        name: 'Ximena Rojas',
        email: 'ximena.rojas@empresa.cl',
        phone: '+56 9 4321 0987'
      },
      networkInfo: {
        ip: '192.168.1.105',
        mac: '00:1B:44:11:3A:BB',
        wifi: true,
        ethernet: true
      },
      software: {
        version: 'Windows 10 Pro',
        lastUpdate: '2024-06-19T16:30:00Z',
        status: 'needs_update'
      },
      status: 'maintenance',
      assignedProject: {
        id: 'proj-5',
        name: 'Centro Comercial Las Condes',
        lastSync: '2024-06-19T16:30:00Z'
      },
      accessories: {
        roku: false,
        xiaomiTvBox: false,
        chromecast: false,
        other: []
      },
      lastSeen: '2024-06-19T16:30:00Z',
      createdAt: '2024-05-12T11:00:00Z',
      updatedAt: '2024-06-19T16:30:00Z'
    },
    {
      id: '6',
      name: 'Agua Piedra (Luciano y Paula)',
      location: 'Agua Piedra',
      type: 'led',
      brand: 'LED',
      model: 'LED 42"',
      size: '42"',
      resolution: '1920x1080',
      orientation: 'horizontal',
      operatingSystem: 'android',
      responsible: {
        name: 'Luciano Torres',
        email: 'luciano.torres@empresa.cl',
        phone: '+56 9 3210 9876'
      },
      networkInfo: {
        ip: '192.168.1.106',
        mac: '00:1B:44:11:3A:BC',
        wifi: true,
        ethernet: false
      },
      software: {
        version: 'Android TV',
        lastUpdate: '2024-06-20T07:15:00Z',
        status: 'up_to_date'
      },
      status: 'online',
      assignedProject: {
        id: 'proj-6',
        name: 'Residencial Agua Piedra',
        lastSync: '2024-06-20T07:15:00Z'
      },
      accessories: {
        roku: true,
        xiaomiTvBox: false,
        chromecast: false,
        other: []
      },
      lastSeen: '2024-06-20T07:15:00Z',
      createdAt: '2024-06-01T09:00:00Z',
      updatedAt: '2024-06-20T07:15:00Z'
    }
  ];

  // Proyectos disponibles
  projects: Project[] = [
    { id: 'proj-1', name: 'Residencial Las Condes', status: 'active', assignedScreens: ['1'] },
    { id: 'proj-2', name: 'Centro Comercial Providencia', status: 'active', assignedScreens: ['2'] },
    { id: 'proj-3', name: 'Proyecto Residencial Ñuñoa', status: 'active', assignedScreens: ['3'] },
    { id: 'proj-4', name: 'Complejo Deportivo Ñuñoa', status: 'active', assignedScreens: ['4'] },
    { id: 'proj-5', name: 'Centro Comercial Las Condes', status: 'inactive', assignedScreens: ['5'] },
    { id: 'proj-6', name: 'Residencial Agua Piedra', status: 'active', assignedScreens: ['6'] }
  ];

  // Estados del componente
  filteredScreens: ScreenDevice[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  typeFilter: string = 'all';
  locationFilter: string = 'all';
  selectedScreen: ScreenDevice | null = null;
  isEditing = false;
  showAddModal = false;
  showEditModal = false;
  showAssignModal = false;
  hoveredScreen: string | null = null;

  // Configuración de modales
  addModalConfig: ModalConfig = {
    title: 'Agregar Nueva Pantalla',
    message: 'Completa la información de la nueva pantalla:',
    confirmText: 'Agregar',
    cancelText: 'Cancelar',
    showInput: true,
    showCancel: true,
    confirmButtonType: 'primary'
  };

  editModalConfig: ModalConfig = {
    title: 'Editar Pantalla',
    message: 'Modifica la información de la pantalla:',
    confirmText: 'Guardar',
    cancelText: 'Cancelar',
    showInput: true,
    showCancel: true,
    confirmButtonType: 'primary'
  };

  assignModalConfig: ModalConfig = {
    title: 'Asignar Proyecto',
    message: 'Selecciona el proyecto a asignar:',
    confirmText: 'Asignar',
    cancelText: 'Cancelar',
    showInput: false,
    showCancel: true,
    confirmButtonType: 'primary'
  };

  ngOnInit() {
    this.filteredScreens = [...this.screens];
    this.loadScreenData();
  }

  loadScreenData() {
    // Aquí se cargarían los datos desde el servicio
    console.log('Cargando datos de pantallas...');
  }

  // Métodos de filtrado
  applyFilters() {
    this.filteredScreens = this.screens.filter(screen => {
      const matchesSearch = screen.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           screen.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           screen.brand.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || screen.status === this.statusFilter;
      const matchesType = this.typeFilter === 'all' || screen.type === this.typeFilter;
      const matchesLocation = this.locationFilter === 'all' || screen.location === this.locationFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesLocation;
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.statusFilter = target.value;
    this.applyFilters();
  }

  onTypeFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.typeFilter = target.value;
    this.applyFilters();
  }

  onLocationFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.locationFilter = target.value;
    this.applyFilters();
  }

  // Métodos de gestión
  addScreen() {
    this.showAddModal = true;
  }

  editScreen(screen: ScreenDevice) {
    this.selectedScreen = screen;
    this.showEditModal = true;
  }

  assignProject(screen: ScreenDevice) {
    this.selectedScreen = screen;
    this.showAssignModal = true;
  }

  // Métodos para selección y hover
  selectScreen(screen: ScreenDevice, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedScreen = this.selectedScreen?.id === screen.id ? null : screen;
  }

  onScreenHover(screenId: string | null) {
    this.hoveredScreen = screenId;
  }

  clearSelection() {
    this.selectedScreen = null;
  }

  onBackgroundClick(event: Event) {
    // Este método ya no se usa, el overlay invisible maneja la deselección
    this.clearSelection();
  }

  isScreenSelected(screen: ScreenDevice): boolean {
    return this.selectedScreen?.id === screen.id;
  }

  isScreenHovered(screen: ScreenDevice): boolean {
    return this.hoveredScreen === screen.id;
  }

  // Métodos de modales
  onAddConfirm(data: string) {
    console.log('Agregando nueva pantalla:', data);
    this.showAddModal = false;
  }

  onEditConfirm(data: string) {
    console.log('Editando pantalla:', data);
    this.showEditModal = false;
    this.selectedScreen = null;
  }

  onAssignConfirm() {
    console.log('Asignando proyecto a pantalla');
    this.showAssignModal = false;
    this.selectedScreen = null;
  }

  onModalCancel() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showAssignModal = false;
    this.selectedScreen = null;
  }

  onModalClose() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showAssignModal = false;
    this.selectedScreen = null;
  }

  // Utilidades
  getStatusClass(status: string): string {
    switch (status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      case 'maintenance': return 'status-maintenance';
      case 'error': return 'status-error';
      default: return 'status-unknown';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'online': return 'configuracion.status_online';
      case 'offline': return 'configuracion.status_offline';
      case 'maintenance': return 'configuracion.status_maintenance';
      case 'error': return 'configuracion.status_error';
      default: return 'configuracion.status_unknown';
    }
  }

  getTypeText(type: string): string {
    switch (type) {
      case 'touch': return 'configuracion.type_touch';
      case 'tv': return 'configuracion.type_tv';
      case 'led': return 'configuracion.type_led';
      case 'monitor': return 'configuracion.type_monitor';
      default: return 'configuracion.type_unknown';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'touch': return 'touch-screen';
      case 'tv': return 'television';
      case 'led': return 'led-display';
      case 'monitor': return 'monitor';
      default: return 'television';
    }
  }

  getOSIcon(os: string): string {
    switch (os) {
      case 'windows': return 'windows';
      case 'android': return 'android';
      case 'ios': return 'apple';
      case 'linux': return 'linux';
      default: return 'computer';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'configuracion.just_now';
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'configuracion.minute_ago' : 'configuracion.minutes_ago'}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'configuracion.hour_ago' : 'configuracion.hours_ago'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ${diffInDays === 1 ? 'configuracion.day_ago' : 'configuracion.days_ago'}`;
  }

  getSoftwareStatusClass(status: string): string {
    switch (status) {
      case 'up_to_date': return 'software-up-to-date';
      case 'needs_update': return 'software-needs-update';
      case 'error': return 'software-error';
      default: return 'software-unknown';
    }
  }

  getSoftwareStatusText(status: string): string {
    switch (status) {
      case 'up_to_date': return 'configuracion.software_up_to_date';
      case 'needs_update': return 'configuracion.software_needs_update';
      case 'error': return 'configuracion.software_error';
      default: return 'configuracion.software_unknown';
    }
  }

  getUniqueLocations(): string[] {
    return [...new Set(this.screens.map(screen => screen.location))];
  }

  getUniqueTypes(): string[] {
    return [...new Set(this.screens.map(screen => screen.type))];
  }

  getUniqueStatuses(): string[] {
    return [...new Set(this.screens.map(screen => screen.status))];
  }

  getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  getScreenStats(): ScreenStatsSummary {
    const total = this.screens.length;
    const online = this.screens.filter(s => s.status === 'online').length;
    const offline = this.screens.filter(s => s.status === 'offline').length;
    const maintenance = this.screens.filter(s => s.status === 'maintenance').length;
    const error = this.screens.filter(s => s.status === 'error').length;

    return { total, online, offline, maintenance, error };
  }

}
