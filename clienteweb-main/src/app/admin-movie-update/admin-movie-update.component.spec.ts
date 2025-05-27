import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMovieUpdateComponent } from './admin-movie-update.component';

describe('AdminMovieUpdateComponent', () => {
  let component: AdminMovieUpdateComponent;
  let fixture: ComponentFixture<AdminMovieUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMovieUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMovieUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
