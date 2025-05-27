import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMovieAddComponent } from './admin-movie-add.component';

describe('AdminMovieAddComponent', () => {
  let component: AdminMovieAddComponent;
  let fixture: ComponentFixture<AdminMovieAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMovieAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMovieAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
