from pathlib import Path

TEMPLATE = """<div class="config-premium">
  <header class="config-premium__hero">
    <div class="config-premium__intro">
      <div class="config-premium__breadcrumb">
        <span>Sistema</span>
        <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
        <span class="highlight">Dispositivos</span>
      </div>
      <h1>
        Configuración de Pantallas
        <svg viewBox="0 0 100 100">
          <path d="M20,80 Q50,10 80,80" />
        </svg>
      </h1>
      <p class="subtitle">{{ 'configuracion.subtitle' | t }}</p>
      <p class="handwriting">Gestiona y monitorea la red de visualización digital.</p>
    </div>
    <div class="config-premium__hero-actions">
      <button type="button" class="btn ghost" (click)="applyFilters()">
        <svg viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        {{ 'configuracion.refresh' | t }}
      </button>
      <button type="button" class="btn solid" (click)="addScreen()">
        <svg viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
        {{ 'configuracion.add_screen' | t }}
      </button>
    </div>
  </header>

  <div class="config-premium__canvas custom-scrollbar">
    <section class="stat-grid">
      <article class="stat-card stat-card--total">
        <div>
          <p>{{ 'configuracion.total_screens' | t }}</p>
          <strong>{{ getScreenStats().total | number:'2.0-0' }}</strong>
          <span class="chip">Red Manquehue</span>
        </div>
        <div class="halo"></div>
      </article>
      <article class="stat-card">
        <header>
          <div>
            <p>{{ 'configuracion.online_screens' | t }}</p>
            <strong>{{ getScreenStats().online }}<span>/{{ getScreenStats().total }}</span></strong>
          </div>
          <div class="stat-icon stat-icon--green">
            <svg viewBox="0 0 24 24"><path d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
          </div>
        </header>
        <div class="progress">
          <div
            class="progress__bar"
            [style.width.%]="getScreenStats().total ? (getScreenStats().online / getScreenStats().total) * 100 : 0">
          </div>
        </div>
      </article>
      <article class="stat-card">
        <header>
          <div>
            <p>{{ 'configuracion.maintenance_screens' | t }}</p>
            <strong class="text-orange">{{ getScreenStats().maintenance }}</strong>
          </div>
          <div class="stat-icon stat-icon--orange">
            <svg viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </header>
        <small class="pill pill--warning">1 ticket activo</small>
      </article>
      <article class="stat-card stat-card--soft">
        <p>Salud de Red</p>
        <div class="stat-card__status">
          Estable
          <span>- Sin errores críticos</span>
        </div>
        <svg viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
      </article>
    </section>

    <section class="filter-pill">
      <div class="filter-pill__search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>
        <input
          type="text"
          [placeholder]="'configuracion.search_placeholder' | t"
          [(ngModel)]="searchTerm"
          (input)="onSearchChange($event)" />
      </div>
      <div class="filter-pill__divider"></div>
      <div class="filter-pill__selects no-scrollbar">
        <label class="sr-only" for="statusFilter">{{ 'configuracion.status' | t }}</label>
        <div class="filter-pill__select">
          <select
            id="statusFilter"
            [(ngModel)]="statusFilter"
            (change)="onStatusFilterChange($event)">
            <option value="all">{{ 'configuracion.all_statuses' | t }}</option>
            <option value="online">{{ 'configuracion.status_online' | t }}</option>
            <option value="offline">{{ 'configuracion.status_offline' | t }}</option>
            <option value="maintenance">{{ 'configuracion.status_maintenance' | t }}</option>
            <option value="error">{{ 'configuracion.status_error' | t }}</option>
          </select>
        </div>
        <label class="sr-only" for="typeFilter">{{ 'configuracion.device_type' | t }}</label>
        <div class="filter-pill__select">
          <select
            id="typeFilter"
            [(ngModel)]="typeFilter"
            (change)="onTypeFilterChange($event)">
            <option value="all">{{ 'configuracion.all_types' | t }}</option>
            <option value="touch">{{ 'configuracion.type_touch' | t }}</option>
            <option value="tv">{{ 'configuracion.type_tv' | t }}</option>
            <option value="led">{{ 'configuracion.type_led' | t }}</option>
            <option value="monitor">{{ 'configuracion.type_monitor' | t }}</option>
          </select>
        </div>
        <label class="sr-only" for="locationFilter">{{ 'configuracion.location' | t }}</label>
        <div class="filter-pill__select">
          <select
            id="locationFilter"
            [(ngModel)]="locationFilter"
            (change)="onLocationFilterChange($event)">
            <option value="all">{{ 'configuracion.all_locations' | t }}</option>
            <option *ngFor="let location of getUniqueLocations()" [value]="location">{{ location }}</option>
          </select>
        </div>
      </div>
    </section>

    <ng-container *ngIf="filteredScreens.length; else emptyState">
      <section class="screens-grid">
        <article class="screen-card" *ngFor="let screen of filteredScreens">
          <div class="screen-card__status-line"
               [ngClass]="{
                 'is-online': screen.status === 'online',
                 'is-maintenance': screen.status === 'maintenance',
                 'is-offline': screen.status === 'offline',
                 'is-error': screen.status === 'error'
               }"></div>
          <div class="screen-card__header">
            <div class="screen-card__device">
              <div class="screen-card__icon" [ngClass]="getTypeIcon(screen.type)">
                <svg *ngIf="getTypeIcon(screen.type) === 'touch-screen'" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" ry="2"/><circle cx="12" cy="10" r="2"/><path d="M12 14v2"/></svg>
                <svg *ngIf="getTypeIcon(screen.type) === 'television'" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="10" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                <svg *ngIf="getTypeIcon(screen.type) === 'led-display'" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><circle cx="8" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="16" cy="12" r="1.5"/></svg>
                <svg *ngIf="getTypeIcon(screen.type) === 'monitor'" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div>
                <p class="eyebrow">{{ getTypeText(screen.type) | t }}</p>
                <h3>{{ screen.name }}</h3>
                <span class="location">
                  <svg viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {{ screen.location }}
                </span>
              </div>
            </div>
            <div class="badge" [class]="getStatusClass(screen.status)">
              <span></span>{{ getStatusText(screen.status) | t }}
            </div>
          </div>
          <div class="screen-card__specs">
            <span>{{ screen.brand }} · {{ screen.model }}</span>
            <span>{{ screen.size }} · {{ screen.resolution }}</span>
            <span class="spec-pill">{{ screen.orientation | titlecase }}</span>
          </div>
          <div class="screen-card__grid">
            <div class="chip">
              <span class="chip__label">IP</span>
              <strong>{{ screen.networkInfo.ip }}</strong>
              <div class="chip__connections">
                <span *ngIf="screen.networkInfo.wifi">WiFi</span>
                <span *ngIf="screen.networkInfo.ethernet">Ethernet</span>
              </div>
            </div>
            <div class="chip">
              <span class="chip__label">{{ 'configuracion.resolution' | t }}</span>
              <strong>{{ screen.resolution }}</strong>
            </div>
            <div class="chip chip--os">
              <div>
                <span class="chip__label">{{ 'configuracion.software' | t }}</span>
                <strong>{{ screen.software.version }}</strong>
                <span class="alert" *ngIf="screen.software.status === 'needs_update'">
                  {{ 'configuracion.software_needs_update' | t }}
                </span>
              </div>
              <div class="chip__os" [ngSwitch]="getOSIcon(screen.operatingSystem)">
                <svg *ngSwitchCase="'windows'" viewBox="0 0 24 24"><path d="M3 5.5L10.5 4.5V11H3V5.5Z" /><path d="M11.5 4.3L21 3V11H11.5V4.3Z" /><path d="M3 12H10.5V18.5L3 17.5V12Z" /><path d="M11.5 12H21V20L11.5 18.7V12Z" /></svg>
                <svg *ngSwitchCase="'android'" viewBox="0 0 24 24"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.65 5.67a.637.637 0 00-.83-.22c-.3.16-.42.54-.26.85L6.4 9.48A10.81 10.81 0 001 18h22a10.81 10.81 0 00-5.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" /></svg>
                <svg *ngSwitchCase="'apple'" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                <svg *ngSwitchCase="'linux'" viewBox="0 0 24 24"><path d="M12 3c-2.5 0-4 2.2-4 4.5V11l-1.5 3c-.4 1 .2 2 1.3 2H8v2.5c0 1 .8 1.8 1.8 1.8H14c1 0 1.8-.8 1.8-1.8V16h.2c1.1 0 1.7-1 1.3-2L16 11V7.5C16 5.2 14.5 3 12 3Z"/><circle cx="10" cy="7" r="0.6" /><circle cx="14" cy="7" r="0.6" /></svg>
                <svg *ngSwitchDefault viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="12" rx="2" /></svg>
              </div>
            </div>
          </div>
          <div class="screen-card__responsible">
            <div class="avatar">{{ getInitials(screen.responsible.name) }}</div>
            <div>
              <span class="chip__label">{{ 'configuracion.responsible' | t }}</span>
              <strong>{{ screen.responsible.name }}</strong>
              <div class="links">
                <a [href]="'mailto:' + screen.responsible.email">{{ screen.responsible.email }}</a>
                <a *ngIf="screen.responsible.phone" [href]="'tel:' + screen.responsible.phone">{{ screen.responsible.phone }}</a>
              </div>
            </div>
            <div class="quick-actions">
              <a *ngIf="screen.responsible.phone" [href]="'tel:' + screen.responsible.phone" aria-label="Llamar">
                <svg viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </a>
              <a [href]="'mailto:' + screen.responsible.email" aria-label="Correo">
                <svg viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>
          <div class="screen-card__extras">
            <div>
              <span class="chip__label">{{ 'configuracion.assigned_project' | t }}</span>
              <strong>{{ screen.assignedProject?.name || 'Sin proyecto asignado' }}</strong>
              <small *ngIf="screen.assignedProject">
                {{ 'configuracion.last_sync' | t }} · {{ getTimeAgo(screen.assignedProject.lastSync) | t }}
              </small>
            </div>
            <div class="accessories" *ngIf="screen.accessories.roku || screen.accessories.xiaomiTvBox || screen.accessories.chromecast || screen.accessories.other?.length">
              <span *ngIf="screen.accessories.roku">Roku</span>
              <span *ngIf="screen.accessories.xiaomiTvBox">Xiaomi TV Box</span>
              <span *ngIf="screen.accessories.chromecast">Chromecast</span>
              <span *ngFor="let other of screen.accessories.other">{{ other }}</span>
            </div>
          </div>
          <div class="screen-card__footer">
            <span>{{ 'configuracion.last_seen' | t }} · {{ getTimeAgo(screen.lastSeen) | t }}</span>
            <div class="cta">
              <button type="button" class="btn ghost" (click)="editScreen(screen)">{{ 'configuracion.edit_screen' | t }}</button>
              <button type="button" class="btn solid dark" (click)="assignProject(screen)">
                Gestionar
                <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </article>
      </section>

      <section class="config-premium__pagination">
        <div class="pager">
          <button type="button" disabled>← {{ 'configuracion.prev' | t }}</button>
          <span>{{ 'configuracion.showing' | t }} {{ filteredScreens.length }} {{ 'configuracion.of' | t }} {{ screens.length }}</span>
          <button type="button" disabled>{{ 'configuracion.next' | t }} →</button>
        </div>
      </section>
    </ng-container>
  </div>
</div>

<ng-template #emptyState>
  <section class="empty-state">
    <div>
      <span>📺</span>
      <h3>{{ 'configuracion.no_screens' | t }}</h3>
      <p>{{ 'configuracion.no_screens_description' | t }}</p>
      <button type="button" class="btn solid" (click)="addScreen()">
        {{ 'configuracion.add_first_screen' | t }}
      </button>
    </div>
  </section>
</ng-template>

<!-- Modales -->
<app-modal
  [isOpen]="showAddModal"
  [config]="addModalConfig"
  (confirm)="onAddConfirm($event)"
  (cancel)="onModalCancel()"
  (close)="onModalClose()">
</app-modal>

<app-modal
  [isOpen]="showEditModal"
  [config]="editModalConfig"
  (confirm)="onEditConfirm($event)"
  (cancel)="onModalCancel()"
  (close)="onModalClose()">
</app-modal>

<app-modal
  [isOpen]="showAssignModal"
  [config]="assignModalConfig"
  (confirm)="onAssignConfirm()"
  (cancel)="onModalCancel()"
  (close)="onModalClose()">
</app-modal>
"""

Path("src/app/sections/configuracion/configuracion.component.html").write_text(TEMPLATE, encoding="utf-8")

