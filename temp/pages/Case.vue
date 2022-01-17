<template>
    <div class="container">
        <div style="margin-top: 20px; width: 100%;">
            <router-link to="/home" style="text-align:left; margin: 0 15%;">&lt; Back</router-link>
        </div>
        <edit-case-form v-if="editCase" @cancel="editCase = false" @saved="saveCase" :edit="true" :currentCase="currentCase" />
        <div v-show="!editCase" class="case-main">
            <div class="case left">
                <h1>{{currentCase.name}}</h1>
                <div class="info">
                    <div class="info-column">
                        <p>Client: {{getClient ? getClient.first_name + " " + getClient.last_name : ""}}</p>
                        <!-- <p>Liable: {{getLiable ? getLiable.first_name + " " + getLiable.last_name : "(no assignment)"}}</p> -->
                        <p>Category: {{ currentCase.category ? currentCase.category.name : '' }}</p>
                        <p>Date of Injury: {{ currentCase.date_of_injury ? formatTime(currentCase.date_of_injury) : '' }}</p>
                    </div>
                    <!-- <div class="info-column">
                        <p style="margin-bottom: 0px;">Client Adjusters:</p>
                        <ul>
                            <li v-for="rep in getClient.assigned_rep" :key="rep.id">{{rep.rep.name}}, {{rep.type.name}}</li>
                        </ul>
                        <p style="margin-bottom: 0px;">Liable Adjusters:</p>
                        <ul>
                            <li v-for="rep in getLiable.assigned_rep" :key="rep.id">{{rep.rep.name}}, {{rep.type.name}}</li>
                        </ul>
                    </div> -->
                </div>
                <div class="doc-buttons">
                    <button @click="editCase = true">Edit Case</button>
                    <!-- <button @click="saveDoc">Save Document</button>
                    <button @click="previewDoc" v-if="allVersions[currentVersion] && allVersions[currentVersion].generated">View Doc</button>
                    <button @click="generatePDF">Generate Doc</button> -->
                </div>
            </div>
            <div class="case right">
                <!-- ======== Move back to left side of page when implementing other docs ======== -->
                <h2>All Files</h2>
                <table v-if="allFiles && allFiles.length > 0">
                    <tr>
                        <th>File</th>
                        <th>Category</th>
                        <th>&nbsp;</th>
                        <th>&nbsp;</th>
                    </tr>
                    <tr v-for="d in allFiles" :key="d.id">
                        <td>{{ d.name }}</td>
                        <td>{{ d.file_type.name }}</td>
                        <td><button @click="open(d, true)">Preview</button></td>
                        <td><button @click="addToDoc(d.id)">Add to Doc</button></td>
                    </tr>
                </table>
                <template v-else>
                    <p>This case has no assigned files</p>
                </template>
                <!-- ======== End Move ======== -->

                <!-- ======== Disable until implementing other Documents ======== -->
                <!-- <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <h2>Documents</h2>
                    <button @click="showNewDocForm = !showNewDocForm">{{showNewDocForm ? 'Cancel' : '+ New Document'}}</button>
                </div>
                <div class="scroll" v-if="allDocs && allDocs.length > 0">
                    <table>
                        <tr style="position: sticky; top: -1px;">
                            <th>Category</th>
                            <th>Last Updated</th>
                            <th>&nbsp;</th>
                        </tr>
                        <tr v-for="d in allDocs" :key="d.id">
                            <td>{{ d.category.name }}</td>
                            <td>{{ formatTime(d.updated_at ? d.updated_at : d.created_at) }}</td>
                            <td><button @click="viewDoc(d)">View Doc</button></td>
                        </tr>
                    </table>
                </div>
                <template v-else>
                    <p>This case has no documents</p>
                </template>
                <NewDocForm :currentCase="currentCase.id" @added="docAdded" v-if="showNewDocForm"/> -->
                <!-- ======== End Disable ======== -->

                <template v-if="showEnc">
                    <div>
                        <div style="display: inline-block; margin-top: 20px;">
                            <template v-if="allVersions.length > 0">
                                <label for="version">Version:</label>
                                <select @change="changeVersion" v-model="currentVersion" name="version" id="version">
                                    <option v-for="(v, index) in allVersions" :key="index" :value="index">{{ v.version }}</option>
                                </select>
                            </template>
                            <template v-else>
                                <p>There are no versions for this document</p>
                            </template>
                            <button @click="addVersion" style="cursor: pointer;">&plus; New Version</button>
                            <button v-if="allVersions.length > 0" @click="removeVersion" style="cursor: pointer;">&minus; Remove Version</button>
                        </div>
                    </div>
                    <template v-if="allVersions.length > 0 && allDocFiles">
                        <h2>Enclosures</h2>
                        <table v-if="allDocFiles.length > 0">
                            <tr>
                                <th>File</th>
                                <th>Move</th>
                                <th>&nbsp;</th>
                                <th>&nbsp;</th>
                            </tr>
                            <tr v-for="(d, index) in allDocFiles" :key="d.id">
                                <td>{{ d.file.name }}</td>
                                <td><button class="move" @click.prevent="moveEnc('up', index)">&uarr;</button><button class="move" @click.prevent="moveEnc('down', index)">&darr;</button></td>
                                <td><button @click="open(d)">Open File</button></td>
                            <td><button @click="remove(d)">Remove</button></td>
                            </tr>
                        </table>
                        <template v-else>
                            <p>This document has no assigned enclosures</p>
                        </template>
                    </template>
                </template>
            </div>
        </div>
        <add-enclosure-form v-if="!editCase" :selected="selected" :currentVersion="currentVersion" />
        <div class="errors" v-if="errors.length > 0">
            <ul>
                <li v-for="(err, index) in errors" :key="index">{{ err }}</li>
            </ul>
        </div>
        <Viewer v-if="showEditor" :file="file" :preview="preview" @close="close()" @save="save()"></Viewer>
        <template v-if="showForm && selected.category">
            <DLForm v-show="!editCase" v-if="selected.category.id === 1 && currentVersion != null && allVersions.length > 0" :currentCase="currentCase" :enclosures="allDocFiles.length > 0 ? allDocFiles : null" :currentVersion="allVersions[this.currentVersion]"></DLForm>
        </template>
    </div>
</template>

<script>
import DLForm from '../components/DemandLetterForm.vue'
import Viewer from '../components/Viewer.vue'
import NewDocForm from '../components/NewDocForm.vue'
import EditCaseForm from '../components/EditCaseForm.vue'
import {mapGetters, mapActions, mapMutations} from 'vuex'
import AddEnclosureForm from '../components/AddEnclosureForm.vue'
import CaseService from '../app/services/CaseService'
export default {
    data() {
        return {
            showForm: true,
            showEditor: false,
            processMsg: {
                processing: false,
                finished: false,
                message: null
            },
            showEnc: false,
            editCase: false,
            showNewDocForm: false,
            documents: [],
            selected: {},
            file: {},
            preview: false,
            errors: [],
            currentVersion: null
        }
    },
    components: {
        DLForm,
        Viewer,
        NewDocForm,
        EditCaseForm,
        AddEnclosureForm
    },
    methods: {
        ...mapActions([
            'addToDocument',
            'removeFromDocument',
            'fetchCase',
            'newVersion',
            'deleteVersion',
            'updateDocInfo',
            'generateDoc'
        ]),
        ...mapMutations([
            'setLoading',
            'setProcessing',
            'setVersions',
            'setDocFiles',
            'setCaseInfo'
        ]),
        moveEnc(d, i) {
            var temp = this.allDocFiles[i]
            if(d === 'up') {
                if ((i - 1) >= 0) {
                    this.allDocFiles.splice(i, 1)
                    this.allDocFiles.splice(i - 1, 0, temp)
                } else {
                    this.allDocFiles.splice(i, 1)
                    this.allDocFiles.push(temp)
                }
            }else if(d === 'down') {
                if ((i + 1) < (this.allDocFiles.length)) {
                    this.allDocFiles.splice(i, 1)
                    this.allDocFiles.splice(i + 1, 0, temp)
                } else {
                    this.allDocFiles.splice(i, 1)
                    this.allDocFiles.unshift(temp)
                }
            }else{
                console.log('no direction defined')
            }
            // console.log(180,d,i)
        },
        saveDoc(){
            var data = {
                ...this.docInfo,
                enclosures: this.allDocFiles ? [...this.allDocFiles] : false
            }
            // return console.log(data)
            data.document_category_id = 1
            data.case_id = this.currentCase.id
            // return console.log(data)
            this.updateDocInfo(data).then(() => {
                this.setProcessing({processing: true, finished: true, message: 'Saved!'})
            }).catch(err => {
                this.setProcessing({processing: true, finished: true, error: err})
            })
        },
        saveCase() {
            this.editCase = false
            this.viewDoc(this.allDocs.find(d => d.doc_category_id === 1))
        },
        generatePDF() {
            if(!this.getDemandLetter) {
                return
            }
            let data = {
                enclosures: this.allDocFiles ? [...this.allDocFiles] : false,
                demandLetter: {...this.getDemandLetter},
                version: this.allVersions[this.currentVersion].version,
                version_id: this.allVersions[this.currentVersion].id,
                case: this.currentCase.name,
                case_id: this.currentCase.id
            }
            this.setProcessing({processing: true, finished: false, message: 'Processing...'})
            this.generateDoc(data).then(res => {
                this.setProcessing({processing: true, finished: true, message: 'Finished!'})
                window.open(`https://www.zaf.local/api/get-generated/${res}`)
            }).catch(err => {
                this.setProcessing({processing: true, finished: true, error: err})
            })
        },
        previewDoc() {
            window.open(`https://www.zaf.local/api/get-generated/${this.allVersions[this.currentVersion].generated}`)
        },
        addVersion() {
            if(this.selected.document_version.length > 0 && this.selected.document_version[this.currentVersion].document_files.length > 0) {
                var w = window.confirm(`Keep information and enclosures from version: ${this.selected.document_version[this.currentVersion].version}?`)
            }else{
                var w = false
            }
            var x = window.prompt('New Version Name:')
            if(x && x != '') {
                if(this.allVersions.find(v => {
                    return v.version === x
                })) {
                    window.alert('This version already exists')
                    return this.addVersion()
                }
                if(w) {
                    let y = window.confirm('Keep Pages?')
                    var data = {
                        version: x,
                        id: this.selected.document_version[this.currentVersion].id,
                        keepPages: y,
                        new: false
                    }
                }else{
                    var data = {
                        document: this.selected.id,
                        version: x,
                        new: true
                    }
                }
                this.newVersion(data)
                    .then(res => {
                        this.currentVersion = this.allVersions.findIndex(v => {
                            return v.version === x
                        })
                        this.changeVersion()
                    })
                    .catch(err => {console.log(err)})
            }else{
                console.log('No name was entered')
            }
        },
        removeVersion() {
            if(this.selected.document_version[this.currentVersion].version == 'Root') {
                return window.alert('Cannot delete Root version')
            }
            var x = window.confirm('Do you want to delete this version?')
            if(x) {
                var data = this.selected.document_version[this.currentVersion]
                this.currentVersion = 0
                this.changeVersion()
                this.deleteVersion(data).then(res => {
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        addDoc() {
            console.log(this.currentCase.id)
        },
        docAdded() {
            showNewDocForm = false
        },
        open(doc, preview = false) {
            this.close().then(() => {
                this.file = {}
                this.file = doc
                this.preview = preview ? true : false
                return this.showEditor = true
            }).catch(err => {
                console.log(err)
            })
        },
        save() {
            console.log('save')
        },
        close() {
            return new Promise((resolve, reject) => {
                console.log('close')
                this.showEditor = false
                resolve()
            })
        },
        addToDoc(id) {
            if(this.selected.document_version[this.currentVersion].document_files.find(f => f.file.id === id)) {
                let x = window.alert('This file is already included in this document.')
                return
            }
            var data = {
                document: this.selected.document_version[this.currentVersion].id,
                file: id,
            }
            this.addToDocument(data);
        },
        remove(doc) {
            let x = window.confirm('Are you sure you want to remove this?')
            if(x) {
                this.removeFromDocument(doc).then(() => {
                    this.close()
                })
            }
        },
        viewDoc(doc) {
            this.showEnc = false
            this.showEditor = false
            this.selected = doc
            this.setVersions(doc.document_version)
            this.currentVersion = 0
            if(this.allVersions.length > 0 && this.allVersions[this.currentVersion].document_files.length > 0)
            this.setDocFiles(this.allVersions[this.currentVersion].document_files)
            this.showEnc = true
        },
        changeVersion() {
            this.setDocFiles(this.selected.document_version[this.currentVersion].document_files)
            this.showEnc = false
            this.showEditor = false
            this.showEnc = true
        },
        formatTime(date) {
            let d = new Date(date);
            let day = Number(new Intl.DateTimeFormat('en', {
                day: 'numeric'
            }).format(d)) + 1;
            let month = new Intl.DateTimeFormat('en', {
                month: 'numeric'
            }).format(d);
            let year = new Intl.DateTimeFormat('en', {
                year: 'numeric'
            }).format(d);
            return `${month}/${day}/${year}`
        }
    },
    computed: {
        ...mapGetters([
            'currentCase',
            'processing',
            'allDocs',
            'allFiles',
            'allVersions',
            'getClient',
            'getLiable',
            'allDocFiles',
            'docInfo',
            'getDemandLetter'
        ]),
    },
    mounted() {
    },
    created() {
        this.setLoading(true)
        // this.fetchCase(this.$route.params.id).then(() => {
        CaseService.fetchCase(this.$route.params.id).then(res => {
        // this.$app.services.cases.fetchCase(this.$route.params.id).then(res => {
            this.setCaseInfo(res)
            this.setLoading(false);
            this.viewDoc(this.allDocs.find(d => d.doc_category_id === 1))
        })
    },
}
</script>

<style scoped lang="scss">
    button, input[type='submit'], input[type='file'] {
        cursor: pointer !important;
    }

    td, option {
        text-transform: capitalize;
    }
    .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    form {
        margin: 25px;
    }

    .errors li {
        color: red;
    }

    .case-main {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        width: auto;
        .case {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: 350px;
            align-items: flex-start;
            &.left {
                margin-right: 50px;
            }
        }
    }

    table {
        border-collapse: collapse;
        td, th {
            padding: 10px;
            // min-width: 100px;
            text-align: left;
            border: 1px solid black;
            max-width: 150px;
        }
        th {
            background: #ccc;
        }
        button {
            color: white;
            text-decoration: none;
            background: #0075ff;
            border-radius: 5px;
            cursor: pointer;
            padding: 5px;
            border: none;
            outline: none;
            &.move {
                padding: 5px 9px;
                background-color: lightgray;
                color: black;
                margin: 0 5px;
            }
        }
    }

    .scroll {
        max-height: 250px;
        overflow: auto;
        table {
            position: relative;
        }
    }

    .info {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .info-column {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            margin-right: 20px;
        }
    }

    .doc-buttons {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        button {
            margin-right: 5px;
        }
    }


</style>
