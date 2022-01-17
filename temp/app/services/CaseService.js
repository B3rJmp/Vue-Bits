import axios from 'axios'
import APIService from './APIService'

// class CaseService extends APIService {
class CaseService {
    static onSuccess(res) {
        return res.data
    }
    
    static onError(error='Unknown') {
        if(error && error.response.data && error.response.data.errors) {
        throw error.response.data.errors.general
        }else{
        throw error
        }
    }
    
    static fetchCases() {
        return axios.get(`https://www.zaf.local/api/cases`)
            .then(this.onSuccess)
            .catch(this.onError)
    }

    static fetchCase(id) {
        return axios.get(`https://www.zaf.local/api/cases/${id}`)
            .then(this.onSuccess)
            .catch(this.onError)
    }
}

export default CaseService