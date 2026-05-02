import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CepResult } from './cep-result';

describe('CepResult', () => {
  let component: CepResult;
  let fixture: ComponentFixture<CepResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CepResult],
    }).compileComponents();

    fixture = TestBed.createComponent(CepResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
