import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DetalleActividad } from './detalle-actividad';

describe('DetalleActividad', () => {
  let component: DetalleActividad;
  let fixture: ComponentFixture<DetalleActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleActividad],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleActividad);
    fixture.componentRef.setInput('id', '1');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
