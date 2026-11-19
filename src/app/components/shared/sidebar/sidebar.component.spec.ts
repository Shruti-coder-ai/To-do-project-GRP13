import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { TaskService } from '../../../services/task.service';

@Component({ standalone: true, template: '' })
class DummyDashboardComponent {}

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'user/dashboard', component: DummyDashboardComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create the sidebar component', () => {
    expect(component).toBeTruthy();
  });

  it('should update active task filter and emit close on filter selection', () => {
    let closed = false;
    component.closeSidebar.subscribe(() => (closed = true));

    component.setFilter('Completed');
    expect(taskService.activeFilter()).toBe('Completed');
    expect(closed).toBe(true);
  });
});
