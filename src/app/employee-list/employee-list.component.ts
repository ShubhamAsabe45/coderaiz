import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmployeeModel } from './employee.model';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {

  employeeForm!: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  employeeData: any;
  edit: boolean = false;
  id: number = 0;
  errMsg: boolean = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private empService: EmployeeService) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getEmpDetails();
  }

  onClick() {
    this.edit = false;
    this.employeeForm.controls['name'].setValue('');
    this.employeeForm.controls['email'].setValue('');
    this.employeeForm.controls['department'].setValue('');
    this.employeeForm.controls['date'].setValue('');
  }

  postEMpDetails() {
    this.employeeModelObj.name = this.employeeForm.value.name;
    this.employeeModelObj.email = this.employeeForm.value.email;
    this.employeeModelObj.department = this.employeeForm.value.department;
    this.employeeModelObj.date = this.employeeForm.value.date;

    if (this.employeeForm.valid) {
      this.empService.postEmployee(this.employeeModelObj).subscribe((res) => {
        console.log('Data inserted sucessfully');
        alert('Data added sucessfully.');
        this.employeeForm.reset();
        let ref = document.getElementById('cancle');
        ref?.click();
        this.getEmpDetails();
      },
        error => {
          alert('something went wrong.')
        }
      )
    } else {
      // this.errMsg = true;
      this.employeeForm.markAllAsTouched();

    }

  }


  getEmpDetails() {
    this.empService.getEmployee().subscribe(
      res => {
        this.employeeData = res;
      },
      error => {
        console.log('Error reciving data');
      }
    )
  }

  deleteEmp(row: EmployeeModel) {
    this.empService.deleteEmployee(row.id).subscribe(
      res => {
        alert('Employee deleted');
        this.getEmpDetails();
      },
      error => {
        console.log('Error reciving data');
      }
    )
  }
  onEdit(row: any) {
    this.edit = true;
    this.id = row.id;
    this.employeeForm.controls['name'].setValue(row.name);
    this.employeeForm.controls['email'].setValue(row.email);
    this.employeeForm.controls['department'].setValue(row.department);
    this.employeeForm.controls['date'].setValue(row.date);
  }

  updateEmp() {
    this.employeeModelObj.name = this.employeeForm.value.name;
    this.employeeModelObj.email = this.employeeForm.value.email;
    this.employeeModelObj.department = this.employeeForm.value.department;
    this.employeeModelObj.date = this.employeeForm.value.date;
    this.empService.updateEmployee(this.employeeModelObj, this.id).subscribe((res) => {
      console.log('Data updated sucessfully');
      alert('Data updated sucessfully.');
      this.employeeForm.reset();
      let ref = document.getElementById('cancle');
      ref?.click();
      this.getEmpDetails();
    },
      error => {
        console.log(error)
        alert('something went wrong.')
      })
  }

}
