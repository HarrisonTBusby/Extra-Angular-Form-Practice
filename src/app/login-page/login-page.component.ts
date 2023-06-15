import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ModalComponent } from '../modal/modal.component';

interface department {
  value: number;
  viewValue: string;
}

interface district {
  id: number, 
  name:string
}

interface county {
  id: number,
  county_name: string
}

interface cereal {
  id: number;
  name: string;
}

interface school {
  school_id:number,
  school_name: string,
}



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    CommonModule,
    MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule
  ],
})
export class LoginPageComponent {
  userForm!: FormGroup;

  department: department[] = [
    { value: 1, viewValue: 'Police' },
    { value: 2, viewValue: 'Paramedics' },
  ];

  county: county[] = [
    {id: 1, county_name: 'San Joaquin'},
    {id: 2, county_name: 'Shasta'},
    {id: 3, county_name: 'Tehama'},
    {id: 4, county_name: 'Sacramento'},

  ];

  district: district[] = [
    {id: 1, name: 'District 1'},
    {id: 2, name: 'District 2'},
    {id: 3, name: 'District 3'},
    {id: 4, name: 'District 4'}
  ];

  school: school[] = [
    {school_id: 1, school_name: 'San Joaquin School'},
    {school_id: 2, school_name: 'Shasta School'},
    {school_id: 3, school_name: 'Tehama School'},
    {school_id: 4, school_name: 'Sacramento School'},

  ];

  cereal: cereal[] = [
    { id: 1, name: 'Suicide Related Emergency' },
    { id: 2, name: 'Attempted Suicide' },
    { id: 3, name: 'Child with Trauma' },
  ];


  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) {}

 ngOnInit() {
  this.userForm = this.formBuilder.group({
    fName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(12), Validators.minLength(2)]],
    lName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.minLength(2)]],
    badge_id: ['', [Validators.required, Validators.minLength(2)]],
    county: [null, Validators.required],
    department: [null, Validators.required],
    school: [{ value: null, disabled: true }, Validators.required],
    district: [{ value: null, disabled: true }, Validators.required],
    cereal: this.formBuilder.array([]),
  });

  let countyClicked = false;
  let districtValueChanged = false;

  this.userForm.get('county')?.valueChanges.subscribe((selectedCountyId: number) => {
    const districtControl = this.userForm.get('district');
    const schoolControl = this.userForm.get('school');

    if (selectedCountyId === 1) { // San Joaquin County
      districtControl?.enable();
      districtControl?.setValue(null);
      schoolControl?.disable();
      schoolControl?.setValue(null);
      countyClicked = true;
    } else {
      districtControl?.disable();
      districtControl?.setValue(null);
      schoolControl?.disable();
      schoolControl?.setValue(null);
      countyClicked = false;
    }

    if (districtControl?.value && countyClicked && districtValueChanged) {
      schoolControl?.enable();
    } else {
      schoolControl?.disable();
      schoolControl?.setValue(null);
    }
  });

  this.userForm.get('district')?.valueChanges.subscribe((selectedDistrictId: number) => {
    districtValueChanged = true;

    const schoolControl = this.userForm.get('school');

    if (this.userForm.get('county')?.value === 1) { // San Joaquin County
      if (selectedDistrictId === 3 || selectedDistrictId === 4) {
        schoolControl?.disable();
        schoolControl?.setValue(null);
      } else if (selectedDistrictId === 1) { // District 1
        schoolControl?.enable();
        this.school = this.school.filter(s => s.school_id === 1); // Filter only San Joaquin School
      } else if (selectedDistrictId === 2) { // District 2
        schoolControl?.enable();
        this.school = this.school.filter(s => s.school_id === 4); // Filter only Sacramento School
      } else {
        schoolControl?.disable();
        schoolControl?.setValue(null);
      }
    } else {
      if (selectedDistrictId && countyClicked && districtValueChanged) {
        schoolControl?.enable();
      } else {
        schoolControl?.disable();
        schoolControl?.setValue(null);
      }
    }
  });

  this.userForm.get('county')?.valueChanges.subscribe((selectedCountyId: number) => {
    const districtControl = this.userForm.get('district');
    const districtOptions = this.district.filter(d => d.id <= 2); // Filter only District 1 and District 2

    if (selectedCountyId === 1) { // San Joaquin County
      districtControl?.enable();
      districtControl?.setValue(null);
      this.district = districtOptions;
    } else {
      districtControl?.disable();
      districtControl?.setValue(null);
      this.district = this.district; // Reset district options to the original values
    }
  });

  this.userForm.get('district')?.valueChanges.subscribe((selectedDistrictId: number) => {
    const schoolControl = this.userForm.get('school');

    if (selectedDistrictId === 1) { // District 1
      schoolControl?.setValue(1); // Select San Joaquin School
    } else if (selectedDistrictId === 2) { // District 2
      schoolControl?.setValue(4); // Select Sacramento School
    } else {
      schoolControl?.setValue(null);
    }
  });
}

  
  
  
  
  
  
  

  toggleCerealSelection(cerealId: number) {
    const cerealFormArray = this.userForm.get('cereal') as FormArray;
    const index = cerealFormArray.value.indexOf(cerealId);
    if (index !== -1) {
      cerealFormArray.removeAt(index);
    } else {
      const isSelected = this.isCerealSelected(cerealId);
      if (!isSelected) {
        cerealFormArray.push(new FormControl(cerealId));
      }
    }
  }
  
  isCerealSelected(cerealId: number): boolean {
    const cerealFormArray = this.userForm.get('cereal') as FormArray;
    return cerealFormArray.value.includes(cerealId);
  }

  isCerealInvalid(): boolean {
    const cerealFormArray = this.userForm.get('cereal') as FormArray;
    return !this.userForm.valid || cerealFormArray.value === null;
  }

  submitForm() {
    this.userForm.value;
    this.dialog.open(ModalComponent, {
      data:
      {
        badge_id: this.userForm.get('badge_id')?.value,
        fName: this.userForm.get('fName')?.value,
        lName: this.userForm.get('lName')?.value,
        county: this.userForm.get('county')?.value,
        school: this.userForm.get('school')?.value,
        department: this.userForm.get('department')?.value,
        district: this.userForm.get('district')?.value,
        cereal: this.userForm.get('cereal')?.value,
      },
    });
    this.userForm.reset();
  }
}
