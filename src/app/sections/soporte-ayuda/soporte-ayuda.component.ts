import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../i18n/t.pipe';

// Interfaces para el componente
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful?: number;
  notHelpful?: number;
}

interface ContactMethod {
  id: string;
  type: 'phone' | 'email' | 'chat' | 'whatsapp' | 'website';
  label: string;
  value: string;
  icon: string;
  availability: string;
  urgent?: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'article' | 'download';
  url: string;
  duration?: string;
  size?: string;
}

interface SupportTicket {
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  email: string;
  attachments?: File[];
}

@Component({
  selector: 'app-soporte-ayuda',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './soporte-ayuda.component.html',
  styleUrl: './soporte-ayuda.component.scss'
})
export class SoporteAyudaComponent implements OnInit {
  // Estado del componente
  activeTab: string = 'faq';
  searchTerm: string = '';
  selectedCategory: string = 'all';
  expandedFAQ: string | null = null;
  
  // Datos de FAQ
  faqItems: FAQItem[] = [
    {
      id: '1',
      question: '¿Cómo creo un nuevo proyecto?',
      answer: 'Para crear un nuevo proyecto, ve a la sección "Proyectos" en el menú principal y haz clic en el botón "Crear Proyecto". Completa el formulario con la información requerida como nombre, descripción y configuraciones iniciales.',
      category: 'projects',
      tags: ['proyecto', 'crear', 'nuevo']
    },
    {
      id: '2',
      question: '¿Cómo configuro una pantalla nueva?',
      answer: 'En la sección "Configuración", haz clic en "Agregar Pantalla". Deberás proporcionar información como ubicación, marca, modelo, resolución y asignar un responsable. El sistema detectará automáticamente la pantalla cuando se conecte.',
      category: 'configuration',
      tags: ['pantalla', 'configuración', 'hardware']
    },
    {
      id: '3',
      question: '¿Por qué mi pantalla aparece como offline?',
      answer: 'Una pantalla puede aparecer offline por varios motivos: problemas de conexión a internet, falta de energía, configuración de red incorrecta, o falla del hardware. Verifica la conexión y reinicia el dispositivo.',
      category: 'troubleshooting',
      tags: ['offline', 'conexión', 'problemas']
    },
    {
      id: '4',
      question: '¿Cómo sincronizo contenido con las pantallas?',
      answer: 'El contenido se sincroniza automáticamente cada 5 minutos. Para forzar una sincronización manual, ve al proyecto correspondiente y haz clic en "Sincronizar Ahora" en las opciones avanzadas.',
      category: 'content',
      tags: ['sincronización', 'contenido', 'pantallas']
    },
    {
      id: '5',
      question: '¿Qué formatos de archivo son compatibles?',
      answer: 'Soportamos imágenes (JPG, PNG, WebP), videos (MP4, WebM), y contenido web (HTML, CSS, JS). Los archivos deben ser menores a 100MB y optimizados para la resolución de tus pantallas.',
      category: 'content',
      tags: ['formatos', 'archivos', 'compatibilidad']
    },
    {
      id: '6',
      question: '¿Cómo gestiono los usuarios y permisos?',
      answer: 'En la sección "Usuario" puedes ver tu perfil. Los administradores pueden gestionar otros usuarios desde el panel de administración, asignando roles como Administrador, Editor o Visualizador.',
      category: 'users',
      tags: ['usuarios', 'permisos', 'roles']
    }
  ];

  // Métodos de contacto
  contactMethods: ContactMethod[] = [
    {
      id: '1',
      type: 'phone',
      label: 'Teléfono de Soporte',
      value: '+56 2 2345 6789',
      icon: 'phone',
      availability: '8:00 - 18:00 hrs (Lun-Vie)',
      urgent: true
    },
    {
      id: '2',
      type: 'email',
      label: 'Email de Soporte',
      value: 'soporte@dashmanqu.cl',
      icon: 'email',
      availability: 'Respuesta en 24 hrs'
    },
    {
      id: '3',
      type: 'whatsapp',
      label: 'WhatsApp Business',
      value: '+56 9 8765 4321',
      icon: 'whatsapp',
      availability: '9:00 - 17:00 hrs (Lun-Vie)'
    },
    {
      id: '4',
      type: 'chat',
      label: 'Chat en Vivo',
      value: 'Disponible',
      icon: 'chat',
      availability: '9:00 - 17:00 hrs (Lun-Vie)'
    },
    {
      id: '5',
      type: 'website',
      label: 'Sitio Web',
      value: 'https://www.dashmanqu.cl',
      icon: 'website',
      availability: '24/7'
    }
  ];

  // Recursos de ayuda
  resources: Resource[] = [
    {
      id: '1',
      title: 'Guía de Inicio Rápido',
      description: 'Aprende los conceptos básicos para empezar a usar DashManqué en menos de 10 minutos.',
      type: 'pdf',
      url: '/assets/docs/guia-inicio-rapido.pdf',
      size: '2.5 MB'
    },
    {
      id: '2',
      title: 'Tutorial: Creación de Proyectos',
      description: 'Video paso a paso para crear y configurar tu primer proyecto.',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=demo',
      duration: '8 min'
    },
    {
      id: '3',
      title: 'Configuración Avanzada de Pantallas',
      description: 'Documentación técnica para configuraciones complejas y solución de problemas.',
      type: 'article',
      url: '/help/configuracion-avanzada'
    },
    {
      id: '4',
      title: 'Manual de Usuario Completo',
      description: 'Documentación completa con todas las funcionalidades del sistema.',
      type: 'pdf',
      url: '/assets/docs/manual-usuario-completo.pdf',
      size: '15.8 MB'
    }
  ];

  // Formulario de ticket
  supportTicket: SupportTicket = {
    subject: '',
    category: 'general',
    priority: 'medium',
    description: '',
    email: ''
  };

  ngOnInit() {
    // Inicialización del componente
  }

  // Métodos de navegación
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Métodos de búsqueda y filtrado
  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value.toLowerCase();
  }

  onCategoryChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedCategory = target.value;
  }

  get filteredFAQs() {
    return this.faqItems.filter(item => {
      const matchesSearch = this.searchTerm === '' || 
        item.question.toLowerCase().includes(this.searchTerm) ||
        item.answer.toLowerCase().includes(this.searchTerm) ||
        item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));
      
      const matchesCategory = this.selectedCategory === 'all' || 
        item.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  get categories() {
    const cats = [...new Set(this.faqItems.map(item => item.category))];
    return cats.map(cat => ({
      value: cat,
      label: this.getCategoryLabel(cat)
    }));
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'projects': 'Proyectos',
      'configuration': 'Configuración',
      'troubleshooting': 'Solución de Problemas',
      'content': 'Contenido',
      'users': 'Usuarios'
    };
    return labels[category] || category;
  }

  // Métodos de FAQ
  toggleFAQ(id: string) {
    this.expandedFAQ = this.expandedFAQ === id ? null : id;
  }

  isFAQExpanded(id: string): boolean {
    return this.expandedFAQ === id;
  }

  markHelpful(faq: FAQItem, helpful: boolean) {
    if (helpful) {
      faq.helpful = (faq.helpful || 0) + 1;
    } else {
      faq.notHelpful = (faq.notHelpful || 0) + 1;
    }
  }

  // Métodos de contacto
  openContact(method: ContactMethod) {
    switch (method.type) {
      case 'phone':
        window.open(`tel:${method.value}`);
        break;
      case 'email':
        window.open(`mailto:${method.value}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${method.value.replace(/[\s\+\-\(\)]/g, '')}`);
        break;
      case 'website':
        window.open(method.value, '_blank');
        break;
      case 'chat':
        this.openLiveChat();
        break;
    }
  }

  openLiveChat() {
    // Implementar integración con sistema de chat
    alert('Chat en vivo: Esta funcionalidad se integrará con su sistema de chat preferido.');
  }

  // Métodos de recursos
  openResource(resource: Resource) {
    if (resource.type === 'video') {
      window.open(resource.url, '_blank');
    } else {
      // Implementar descarga o vista de documento
      window.open(resource.url, '_blank');
    }
  }

  // Métodos de ticket de soporte
  onSubmitTicket() {
    if (this.isTicketValid()) {
      console.log('Enviando ticket de soporte:', this.supportTicket);
      // Aquí se implementaría el envío real del ticket
      alert('Ticket enviado exitosamente. Te contactaremos pronto.');
      this.resetTicketForm();
    }
  }

  isTicketValid(): boolean {
    return !!(this.supportTicket.subject.trim() && 
             this.supportTicket.description.trim() && 
             this.supportTicket.email.trim());
  }

  resetTicketForm() {
    this.supportTicket = {
      subject: '',
      category: 'general',
      priority: 'medium',
      description: '',
      email: ''
    };
  }

  // Utilidades
  getContactIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'phone': '📞',
      'email': '✉️',
      'whatsapp': '💬',
      'chat': '💭',
      'website': '🌐'
    };
    return icons[type] || '📞';
  }

  getResourceIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'video': '🎥',
      'pdf': '📄',
      'article': '📖',
      'download': '⬇️'
    };
    return icons[type] || '📄';
  }

  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      'low': '#10b981',
      'medium': '#f59e0b',
      'high': '#ef4444',
      'urgent': '#dc2626'
    };
    return colors[priority] || '#6b7280';
  }
}
