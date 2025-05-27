import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMovieComponent } from './admin-movie.component';

describe('AdminMovieComponent', () => {
  let component: AdminMovieComponent;
  let fixture: ComponentFixture<AdminMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
