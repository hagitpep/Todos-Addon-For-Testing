import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server'
import { v4 as uuid } from 'uuid'

const TABLE_NAME = 'Todos'

export class TodosService {

    papiClient: PapiClient
    addonUUID: string

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client['ActionUUID']
        })
        this.addonUUID = client.AddonUUID
    }

    getTodos(options) {
        return this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME).find(options)
    }

    createTodo(body) {
        // validate that all requeired fields exist

        body.Key = uuid()

        return this.papiClient.addons.data.uuid(this.addonUUID).table(TABLE_NAME).upsert(body)
    }
    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

}

// export default TodosService;