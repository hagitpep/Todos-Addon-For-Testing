import { Injectable } from '@angular/core';
import { AddonService } from './addon.service'

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(
    private addonService: AddonService
  ) { }

  get(options) {
    return this.addonService.papiClient.addons.api.uuid(this.addonService.addonUUID).file('api').func('todos').get(options)
  }
  
  getTodos() {
    return this.get({})
  }

  async getTodo(key: string) {
    return await this.get({
      where: `Key='${key}'`
    })
  }
}
