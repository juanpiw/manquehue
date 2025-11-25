import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';

interface FeaturedProject {
  id: number;
  name: string;
  location: string;
  progress: number;
  status: 'venta' | 'construccion' | 'entrega';
  image: string;
}

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss'
})
export class ResumenComponent {
  @Output() navigate = new EventEmitter<'nuevoProyecto' | 'proyectos'>();

  currentDate = new Date();
  projectsCount = 4;
  projectsMax = 12;
  projectsProgress = Math.round((this.projectsCount / this.projectsMax) * 100);

  featuredProjects: FeaturedProject[] = [
    {
      id: 1,
      name: 'Cumbres de la Dehesa',
      location: 'Lo Barnechea · RM',
      progress: 85,
      status: 'venta',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Edificio Vista Golf',
      location: 'Piedra Roja · Chicureo',
      progress: 40,
      status: 'construccion',
      image: 'https://images.unsplash.com/photo-1600596542815-2495db969ef8?q=80&w=2075&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Condominio Los Olivos',
      location: 'Chamisero · Colina',
      progress: 100,
      status: 'entrega',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  goNuevo() {
    this.navigate.emit('nuevoProyecto');
  }
}
