import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ActividadesApi } from '../api/actividades-api';
import { FormularioActividad } from './formulario-actividad';

describe('FormularioActividad', () => {
  let component: FormularioActividad;
  let fixture: ComponentFixture<FormularioActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioActividad],
      providers: [
        provideRouter([]),
        { provide: ActividadesApi, useValue: { listar: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioActividad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
