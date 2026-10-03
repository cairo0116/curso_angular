import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ActividadesApi } from '../actividades/api/actividades-api';
import { PaginaActividades } from './pagina-actividades';

describe('PaginaActividades', () => {
  let component: PaginaActividades;
  let fixture: ComponentFixture<PaginaActividades>;
  let api: { listar: ReturnType<typeof vi.fn>; buscar: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    api = {
      listar: vi.fn(() => of([])),
      buscar: vi.fn(() =>
        of([
          {
            id: 1,
            titulo: 'Resultado remoto',
            descripcion: '',
            estado: 'pendiente' as const,
            prioridad: 'media' as const,
            creadaEn: '2026-10-01',
            destacada: false,
          },
        ]),
      ),
    };
    await TestBed.configureTestingModule({
      imports: [PaginaActividades],
      providers: [
        provideRouter([]),
        { provide: ActividadesApi, useValue: api },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaActividades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders activities returned by the remote search', async () => {
    fixture.componentRef.setInput('buscar', 'remoto');
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 350));
    fixture.detectChanges();

    expect(api.buscar).toHaveBeenCalledWith('remoto');
    expect(fixture.nativeElement.textContent).toContain('Resultado remoto');
  });
});
