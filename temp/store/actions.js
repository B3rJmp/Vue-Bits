import state from './state'
import axios from 'axios'
axios.defaults.withCredentials = true

export default {
    async fetchEnclosures({ commit }, id) {
        const res = await axios.get('https://www.zaf.local/api/enclosures/case/' + id)
        commit('setEnclosures', res.data)
    },

    async fetchDocs({commit}, id) {
        const res = await axios.get('https://www.zaf.local/api/documents/case/' + id)
        commit('setDocs', res.data)
    },

    async fetchInsurance({commit}) {
        const res = await axios.get('https://www.zaf.local/api/insurance')
        commit('setInsurance', res.data)
    },

    async updatePages({commit}, doc) {
        const res = await axios.put(`https://www.zaf.local/api/document-files/${doc.id}`, doc)
        commit('updatePages', doc)
    },

    async fetchFileTypes({commit}) {
        const res = await axios.get('https://www.zaf.local/api/file-types')
        commit('setFileTypes', res.data)
    },

    async fetchDocCats({commit}) {
        const res = await axios.get('https://www.zaf.local/api/document-categories')
        commit('setDocCats', res.data)
    },

    async addFile({commit}, data) {
        const res =  await axios.post('https://www.zaf.local/api/files', data)
        commit('addFile', res.data)
        if(res.data.document_file) {
            commit('addToDoc', res.data.document_file)
        }
    },

    async addDoc({commit}, data) {
        const res = await axios.post('https://www.zaf.local/api/documents', data)
        commit('newDoc', res.data)
    },

    async fetchCases({commit}) {
        const res = await axios.get('https://www.zaf.local/api/cases')
        commit('setCases', res.data)
    },

    async fetchCase({commit}, id) {
        const res = await axios.get('https://www.zaf.local/api/cases/' + id)
        commit('setCaseInfo', res.data)
    },

    async newVersion({commit}, data) {
        const res = await axios.post('https://www.zaf.local/api/document-versions', data)
        commit('newVersion', res.data)
    },

    async addToDocument({commit}, data) {
        if(data.document && data.file) {
            const res = await axios.post('https://www.zaf.local/api/document-files', data)
            commit('addToDoc', res.data)
        }else{
            console.log('no document selected')
        }
    },

    async removeFromDocument({commit}, data) {
        const res = await axios.delete(`https://www.zaf.local/api/document-files/${data.id}`)
        commit('removeFromDocument', data)
    },

    async deleteVersion({commit}, data) {
        const res = await axios.delete(`https://www.zaf.local/api/document-versions/${data.id}`)
        commit('deleteVersion', data)
    },

    async generateDoc({commit}, data) {
        const res = await axios.post('https://www.zaf.local/api/generate-pdf', data)
        if(state.currentCase.id === data.case_id) {
            commit('addGenerated', res.data)
        }
        return res.data.generated
    },

    async setupNewCase({commit}) {
        const res = await axios.get('https://www.zaf.local/api/new-case-info')
        commit('setNewCaseInfo', res.data)
    },

    async fetchDocInfo({commit}, data) {
        if(!data) {
            return
        }
        const res = await axios.get(`https://www.zaf.local/api/case-info/${data}`)
        commit('setDocInfo', res.data)
    },

    async newCase({commit}, data) {
        const res = await axios.post(`https://www.zaf.local/api/cases`, data)
        commit('addNewCase', res.data)
        return res.data
    },

    async updateCase({commit}, data) {
        const res = await axios.put(`https://www.zaf.local/api/cases/${data.case_id}`, data)
        commit('setCaseInfo', res.data)
        return res.data
    },

    async updateDocInfo({commit}, data) {
        const res = await axios.put(`https://www.zaf.local/api/case-info/${data.case_id}`, data)
        commit('setDocInfo', res.data)
        return true
    },

    async addAttorney({commit}, data) {
        const res = await axios.post(`https://www.zaf.local/api/attorney`, data)
        return res.data
    },

    async addAdjuster({commit}, data) {
        const res = await axios.post(`https://www.zaf.local/api/adjuster`, data)
        console.log(res.data)
    },

    async addInsurance({commit}, data) {
        const res = await axios.post(`https://www.zaf.local/api/insurance`, data)
        console.log(res.data)
    },
}
