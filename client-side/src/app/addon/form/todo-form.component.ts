import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { AddonService } from '../../services/addon.service';
import { PepDialogData, PepDialogService } from '@pepperi-addons/ngx-lib/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TodosService } from 'src/app/services/todos.service';

@Component({
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
  providers: [TranslatePipe]
})
export class TodoForm implements OnInit {

    screenSize: PepScreenSizeType;

    constructor(
        public addonService: AddonService,
        public layoutService: PepLayoutService,
        public translate: TranslateService,
        public dialogService: PepDialogService,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        private todosService: TodosService
    ) {

        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });

        this.key = this.activatedRoute.snapshot.params["todo_uuid"];
        this.loading = true;

        this.todosService.getTodo(this.key).then(obj => {
            this.obj = obj[0];
            this.loading = false;
        });
    }

    mode: 'Edit' | 'Add'
    title: string = "Hello"
    loading: boolean = true
    key: string;

    obj = {
        Name: '',
        Description: '',
        DueDate: ''
    }

    ngOnInit() {
    }

    goBack() {
        this.router.navigate(['..'], {
            relativeTo: this.activatedRoute,
            queryParamsHandling: 'preserve'
        })
    }

    backClicked() {
        this.goBack();
    }

    saveClicked() {
        this.dialogService.openDefaultDialog(new PepDialogData({
            title: 'Saved'
        }))
    }

    cancelClicked() {
        this.dialogService.openDefaultDialog(new PepDialogData({
            title: 'Are you sure?',
            actionButtons: [
                {
                    title: this.translate.instant('No'),
                    className: 'regular',
                    callback: () => {
                        this.goBack()
                    }
                },
                {
                    title: this.translate.instant('Yes'),
                    className: 'strong',
                    callback: () => {
                        this.goBack()
                    }
                }
            ]
        }))
    }
}
