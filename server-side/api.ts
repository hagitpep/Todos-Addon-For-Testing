import { TodosService } from './todos.service'
import { Client, Request } from '@pepperi-addons/debug-server'

export async function todos(client: Client, request: Request) {
    const service = new TodosService(client)

    if (request.method === 'POST') {
        if (!request.body.Key) {
            return service.createTodo(request.body)
        }
    } 
    else if (request.method === 'GET') {
        return service.getTodos(request.query)
    } 
    else {
        throw new Error(`Method ${request.method} not supported`)
    }
}