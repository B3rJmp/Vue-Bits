export default {
    allEnclosures: state => state.enclosures,
    allDocs: state => state.documents,
    allFiles: state => state.files,
    allDocFiles: state => state.documentFiles,
    allVersions: state => state.documentVersions,
    allFileTypes: state => state.fileTypes,
    allCases: state => state.cases,
    allAttorneys: state => state.attorneys,
    allInsurance: state => state.insurance,
    allReps: state => state.reps,
    allRepTypes: state => state.repTypes,
    allCategories: state => state.categories,
    getClient: state => state.client,
    getLiable: state => state.liable,
    getDemandLetter: state => state.demandLetter,
    currentCase: state => state.currentCase,
    loading: state => state.loading,
    allDocCats: state => state.docCategories,
    processing: state => state.process,
    docInfo: state => state.docInfo
}