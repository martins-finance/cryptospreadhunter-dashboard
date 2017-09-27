import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpreadWatcherComponent } from './spread-watcher.component';

describe('SpreadWatcherComponent', () => {
  let component: SpreadWatcherComponent;
  let fixture: ComponentFixture<SpreadWatcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpreadWatcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpreadWatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
