import { Component, OnInit } from '@angular/core';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee?: Employee;
  public deleteEmployee?: Employee;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response: Employee[]) => {
        this.employees = response;
        console.log(this.employees);
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onAddEmployee(addForm: NgForm): void {
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    });
  }

  public onUpdateEmployee(employee: Employee): void {
    this.employeeService.updateEmployee(employee).subscribe({
      next: (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.getEmployees();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public searchEmployees(key: string): void {
    const results: Employee[] = [];
    for (const employee of this.employees) {
      if (
        employee.name.toLowerCase().includes(key.toLowerCase()) ||
        employee.email.toLowerCase().includes(key.toLowerCase()) ||
        employee.phone.toLowerCase().includes(key.toLowerCase()) ||
        employee.jobTitle.toLowerCase().includes(key.toLowerCase())
      ) {
        results.push(employee);
      }
    }
    this.employees = results;
    if (!key) {
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void {
    const modalId =
      mode === 'add' ? 'addEmployeeModal' :
      mode === 'edit' ? 'updateEmployeeModal' :
      'deleteEmployeeModal';

    if (mode === 'edit') this.editEmployee = employee || undefined;
    if (mode === 'delete') this.deleteEmployee = employee || undefined;

    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
}
