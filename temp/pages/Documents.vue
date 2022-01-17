<template>
  <div class="container">
      <button @click="open(doc)" v-for="(doc, index) in allEnclosures" :key="index">{{doc.name}}</button>
      <DLForm v-if="showForm"></DLForm>
      <form @submit.prevent="addEnclosure">
          <input type="text" v-model="form.name" name="name" placeholder="Document Name">
          <input type="file" name="file" id="file">
          <select v-model="form.category" name="category" id="docCategory">
              <option value="" selected>Select Category</option>
              <option v-for="cat in allDocCats" :key="cat.id" :value="cat.id">{{cat.name}}</option>
          </select>
          <input type="submit" value="Add Document">
      </form>
      <Viewer v-if="showEditor" :file="file" @close="close()" @save="save()"></Viewer>
  </div>
</template>

<script>
import axios from 'axios'
import DLForm from '../components/DemandLetterForm.vue'
import Viewer from '../components/Viewer.vue'
import {mapGetters, mapActions} from 'vuex'
export default {
    data() {
        return {
            showForm: false,
            showEditor: false,
            documents: [],
            file: {},
            form: {
                name: null,
                category: null,
            }
        }
    },
    components: {
        DLForm,
        Viewer
    },
    methods: {
        ...mapActions([
            'fetchEnclosures',
            'fetchDocCats',
            'addEnclosure'
        ]),
        open(doc) {
            this.close().then(() => {
                this.file = {}
                this.file = doc
                // console.log(this.file)
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
        addEnclosure() {
            var errors = []
            var file = document.getElementById('file').files[0]
            // return console.log(file)
            if(!this.form.name || this.form.name == '') {
                errors.push('Document must have a name')
            }
            if(!this.form.category || this.form.category == '' || this.form.category <= 0) {
                errors.push('Please define a category for this document')
            }
            if(!file) {
                errors.push('Please include a pdf file')
            }else if(file.type != 'application/pdf') {
                errors.push('File must be a pdf')
            }else if(file.size > 600000000) {
                errors.push('This file is too large')
            }
            if(errors.length > 0) {
                console.log(errors)
            }else{
                var data = new FormData()
                data.append('name', this.form.name)
                data.append('category', this.form.category)
                data.append('file', file)
                this.addEnclosure(data).then(() => {
                    this.fetchEnclosures()
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    },
    computed: mapGetters([
        'allEnclosures',
        'allDocCats'
    ]),
    mounted() {
        // console.log(this.allDocCats)
        // axios.get('https://www.zaf.local/api/document-categories').then(res => {
        //     console.log('hello', res.data)
        // })
    },
    created() {
        console.log('zaf.vue')
        this.fetchEnclosures()
        this.fetchDocCats()
    }
}
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
