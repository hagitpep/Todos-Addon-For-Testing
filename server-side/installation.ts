
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { Relation } from '@pepperi-addons/papi-sdk'
import { TodosService } from './todos.service'
import { PapiClient } from '@pepperi-addons/papi-sdk'

export async function install(client: Client, request: Request): Promise<any> {

    const papiClient = new PapiClient({
        baseURL: client.BaseURL,
        token: client.OAuthAccessToken,
        addonUUID: client.AddonUUID,
        addonSecretKey: client.AddonSecretKey,
        actionUUID: client['ActionUUID']
    })

    await papiClient.addons.data.schemes.post({
        Name: 'Todos',
        Type: 'indexed_data',
        Fields: {
            Name: {
                Type: 'String',
                Indexed: true
            },
            Description: {
                Type: 'String',
                Indexed: true
            },
            DueDate: {
                Type: 'DateTime'
            },
            Completed: {
                Type: 'Bool'
            }
        } as any
    })

    return { success: true, resultObject: {} }
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return { success: true, resultObject: {} }
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return { success: true, resultObject: {} }
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return { success: true, resultObject: {} }
}

async function createBlockRelation(client: Client, isPageBlock: boolean): Promise<any> {
    try {
        // TODO: change to block name (this is the unique relation name and the description that will be on the block).
        const blockName = 'BLOCK_NAME_TO_CHANGE';

        const filename = `file_${client.AddonUUID.replace(/-/g, '_').toLowerCase()}`;

        const pageComponentRelation: Relation = {
            RelationName: isPageBlock ? 'PageBlock' : 'AddonBlock',
            Name: blockName,
            Description: `${blockName} block`,
            Type: "NgComponent",
            SubType: "NG11",
            AddonUUID: client.AddonUUID,
            AddonRelativeURL: filename,
            ComponentName: `BlockComponent`, // This is should be the block component name (from the client-side)
            ModuleName: `BlockModule`, // This is should be the block module name (from the client-side)
        };

        // For Page block we need to declare the editor data.
        if (isPageBlock) {
            pageComponentRelation['EditorComponentName'] = `BlockEditorComponent`, // This is should be the block editor component name (from the client-side)
                pageComponentRelation['EditorModuleName'] = `BlockEditorModule` // This is should be the block editor module name (from the client-side)}
        }

        const service = new TodosService(client);
        const result = await service.upsertRelation(pageComponentRelation);
        return { success: true, resultObject: result };
    } catch (err) {
        return { success: false, resultObject: err, errorMessage: `Error in upsert relation. error - ${err}` };
    }
}