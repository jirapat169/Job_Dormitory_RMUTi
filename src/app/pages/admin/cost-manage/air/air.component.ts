import { AppService } from './../../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-air',
  templateUrl: './air.component.html',
  styleUrls: ['./air.component.scss'],
})
export class AirComponent implements OnInit {
  public formCostTerm1: FormGroup;
  public formCostTerm2: FormGroup;

  constructor(private formBuilder: FormBuilder, public service: AppService) {}

  ngOnInit(): void {
    this.formCostTerm1 = this.formBuilder.group({
      dormitory: ['', Validators.required],
      electric_first: ['', Validators.required],
      electric_unit: ['', Validators.required],
      id: ['', Validators.required],
      insurance: ['', Validators.required],
      room_type: ['', Validators.required],
      term: ['', Validators.required],
      water_first: ['', Validators.required],
    });

    this.formCostTerm2 = this.formBuilder.group({
      dormitory: ['', Validators.required],
      electric_first: ['', Validators.required],
      electric_unit: ['', Validators.required],
      id: ['', Validators.required],
      insurance: ['', Validators.required],
      room_type: ['', Validators.required],
      term: ['', Validators.required],
      water_first: ['', Validators.required],
    });
  }

  public onSubmitTerm1 = () => {
    console.log(this.formCostTerm1.value);
  };

  public onSubmitTerm2 = () => {
    console.log(this.formCostTerm2.value);
  };
}
