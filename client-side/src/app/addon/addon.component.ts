import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { TranslateService } from '@ngx-translate/core';

import { AddonService } from "../services/addon.service";
import { IPepGenericListDataSource, IPepGenericListActions } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';
import { ActivatedRoute, Router } from "@angular/router";
import { TodosService } from "../services/todos.service";

@Component({
    selector: 'addon-block',
    templateUrl: './addon.component.html',
    styleUrls: ['./addon.component.scss']
})
export class BlockComponent implements OnInit {
    @Input() hostObject: any;

    @Output() hostEvents: EventEmitter<any> = new EventEmitter<any>();

    screenSize: PepScreenSizeType;

    constructor(
        public addonService: AddonService,
        public router: Router,
        public route: ActivatedRoute,
        public layoutService: PepLayoutService,
        public translate: TranslateService,
        public todosService: TodosService
    ) {
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });
    }

    ngOnInit() {
    }

    openDialog() {

    }

    listDataSource: IPepGenericListDataSource = {
        init: async (state) => {
            const contentItems: any = await this.todosService.getTodos()
            console.log(JSON.stringify(contentItems));
            return {
                dataView: {
                    Context: {
                        Name: '',
                        Profile: { InternalID: 0 },
                        ScreenSize: 'Landscape'
                    },
                    Type: 'Grid',
                    Title: 'Todos',
                    Fields: [
                        {
                            FieldID: 'Name',
                            Type: 'TextBox',
                            Title: this.translate.instant('Name'),
                            Mandatory: false,
                            ReadOnly: true
                        },
                        {
                            FieldID: 'Description',
                            Type: 'TextBox',
                            Title: this.translate.instant('Description'),
                            Mandatory: false,
                            ReadOnly: true
                        },
                        {
                            FieldID: 'DueDate',
                            Type: 'DateAndTime',
                            Title: this.translate.instant('DueDate'),
                            Mandatory: false,
                            ReadOnly: true
                        },
                        {
                            FieldID: 'Completed',
                            Type: 'Boolean',
                            Title: this.translate.instant('Completed'),
                            Mandatory: false,
                            ReadOnly: true
                        }
                    ],
                    Columns: [
                        {
                            Width: 25
                        },
                        {
                            Width: 25
                        },
                        {
                            Width: 25
                        },
                        {
                            Width: 25
                        }
                    ],
                    FrozenColumnsCount: 0,
                    MinimumColumnWidth: 0
                },
                items: contentItems,
                totalCount: contentItems.length

            }
        }

    }

    actions: IPepGenericListActions = {
        get: async (data: PepSelectionData) => {
            const res = []
            if (data.rows.length === 1) {
                res.push({
                    title: this.translate.instant("Edit"),
                    handler: async (objs: any) => {
                        debugger
                        this.router.navigate([objs.rows[0]], {
                            relativeTo: this.route,
                            queryParamsHandling: 'merge'
                        });
                    }
                })
            }
            if (data.rows.length) {
                res.push(
                    {
                        title: this.translate.instant("Delete"),
                        handler: async (objs) => {

                        }
                    },
                    {
                        title: this.translate.instant("Mark As Done"),
                        handler: async (objs) => {

                        }
                    }
                )
            }
            return res
        }
    }
}
