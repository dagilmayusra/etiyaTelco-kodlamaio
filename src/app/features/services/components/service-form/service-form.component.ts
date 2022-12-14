import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Service } from '../../models/service';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'etiya-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.css']
})
export class ServiceFormComponent implements OnInit {

  serviceForm! : FormGroup;
  service!:Service;   
  
  constructor(private formBuilder:FormBuilder,private activatedRoute:ActivatedRoute,
    private servicesService:ServicesService,private router:Router,private messageService:MessageService) { }

  ngOnInit(): void {
    this.getServiceIdFromRoute();
  }

  createServiceForm(): void{
    this.serviceForm = this.formBuilder.group({
      name: [this.service?.name  || '',Validators.required]
    })   
  }
  
  getServiceIdFromRoute(){
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) this.getServiceById(params['id']);
      else{
        this.createServiceForm();
      };
    });
  }


  getServiceById(id:number) {
    this.servicesService.getById(id).subscribe((data) => {
      this.service = data;
      this.createServiceForm();
    });
  }

  
  save(){
    if(this.service) this.update();
    else{
      this.add();
    }
  }

  update() {
    if (this.serviceForm.invalid) {
      this.messageService.add({severity:'warn', summary:'Güncelleme', detail:'Lütfen gerekli alanları doldurunuz!'});
      return;
    }
    const service:Service = Object.assign({id:this.service.id}, this.serviceForm.value); 
      this.servicesService.update(service).subscribe(() => {
        setTimeout(() => {
          this.router.navigateByUrl("/services");
      this.messageService.add({severity:'success', summary:'Güncelleme', detail:'Müşteri başarıyla güncellendi!'});
        }, 1000);
      });
  }

  add(){
    if (this.serviceForm.invalid) {
      this.messageService.add({severity:'warn', summary:'Ekleme', detail:'Lütfen gerekli alanları doldurunuz!'});
      return;
    }

    const service:Service = {
      ...this.serviceForm.value,
    }

    this.servicesService.add(service).subscribe(() =>{
      setTimeout(() => {
      this.messageService.add({severity:'success', summary:'Ekleme', detail:'Müşteri başarıyla eklendi!'});
        this.router.navigateByUrl("/services");
      }, 1000);
    })
  }

}
