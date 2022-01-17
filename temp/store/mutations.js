export default {
    setProcessing: (state, data) => {
        /**
         *  import via mapMutations
         *
         *  parameters are:
         *      processing: will show message box if true
         *      finished: will appear light blue if false, green if true
         *      message: message you want to appear in box. Leave blank if error
         *      error: if something goes wrong, set this to the catch error, the box will appear red, the message will be set to 'Error', and the error will be logged to the console
         *
         *  if processing, data = {processing: true, finished: false, message: '[insert message here]'}
         *  if finished, data = {processing: true, finished: true, message: '[insert finished message here]'}
         *  if error, data = {processing: true, finished: true, error: err}
         */
        var timeout
        state.process.processing = data.processing
        state.process.finished = data.finished
        state.process.message = data.error ? 'Error' : data.message
        state.process.error = data.error ? true : false

        if(data.finished) {
            timeout = setTimeout(() => {
                state.process.processing = false
                state.process.finished = false
                state.process.message = null
                state.process.error = false
            }, 3000)
        }else{
            clearTimeout(timeout)
        }

        if(data.error) {
            console.log(data.error)
        }
    },

    setFiles: (state, files) => (state.files = files),

    setVersions: (state, versions) => (state.documentVersions = versions),

    setDocFiles: (state, docFiles) => (state.documentFiles = docFiles),

    setClient: (state, client) => (state.client = client),

    setLiable: (state, liable) => (state.liable = liable),

    setFileTypes: (state, cats) => (state.fileTypes = cats),

    setDocCats: (state, data) => (state.docCategories = data),

    setDocs: (state, docs) => (state.documents = docs),

    setCases: (state, cases) => (state.cases = cases),

    setCurrentCase: (state, currentCase) => (state.currentCase = currentCase),

    setCaseInfo: (state, data) => {
        state.documentFiles = [] // so as to not carry over incorrect documents to other cases
        state.currentCase = data ?? {}
        state.documents = data.documents ?? []
        state.files = data.files ?? [] // all files except the demand letter
        state.client = data.party.find(p => {return p.party_type.id === 1}) ?? {} // client party type id is 1
        state.liable = data.party.find(p => {return p.party_type.id === 2}) ?? {} // liable party type id is 2
    },

    setDocuments: (state, documents) => (state.documents = documents),

    updatePages: (state, data) => {
        if(data.document_version) {
            var file = state.documentFiles.find(df => {
                return df.id === data.id
            })
            return file.pages = data.pages
        }
    },

    setLoading: (state, load) => (state.loading = load),

    addFile: (state, data) => {
        if(data.file.file_type_id != 2) {
            state.files.push(data.file)
        }else{
            state.demandLetter = data.file
        }
    },

    addToDoc: (state, data) => (state.documentFiles.push(data)),

    removeFromDocument: (state, data) => {
        state.documentFiles.splice(state.documentFiles.findIndex(file => {
            return file.id == data.id
        }), 1)
    },

    newVersion: (state, data) => (state.documentVersions.push(data)),

    newDoc: (state, data) => (state.documents.push(data)),

    deleteVersion: (state, data) => {
        state.documentVersions.splice(state.documentVersions.findIndex(version => {
            return version.id === data.id
        }),1)
    },

    addGenerated: (state, data) => {
        return state.documentVersions.find(v => {
            return v.id === data.id
        }).generated = data.generated
    },

    setInsurance: (state, data) => (state.insurance = data),

    setReps: (state, data) => {
        if(!data.party || !data.reps) {
            return
        }
        if(data.party === 'client') {
            state.reps.client = data.reps
        }else if(data.party === 'liable') {
            state.reps.liable = data.reps
        }
    },

    setNewCaseInfo: (state, data) => {
        state.insurance = data.insurance
        state.attorneys = data.attorneys
        state.categories = data.categories
        state.repTypes = data.rep_types
    },

    setDocInfo: (state, data) => (state.docInfo = data),

    updateDocInfo: (state, data) => {
        // var res = {}
        for(let d in data.case_info) {
            for(let [i, ci] in d) {
                if(ci.delete && ci.delete == true) {
                    a.splice(i, 1)
                }
            }
        }
        return state.docInfo = data
    },

    addNewCase: (state, data) => (state.cases.push(data))
}
