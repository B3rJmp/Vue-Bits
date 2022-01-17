import CaseService from './services/CaseService'

export default class App {
    constructor(router, store, axios) {
        this.router = router,
        this.store = store,
        this.axios = axios,
        this.services = {
            cases: new CaseService
        }
    }
}