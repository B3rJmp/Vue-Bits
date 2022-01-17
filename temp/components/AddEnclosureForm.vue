<template>
  <div class="container">
      <form @submit.prevent="addEnc">
            <input type="text" v-model="form.name" name="name" placeholder="Document Name">
            <input type="text" v-model="form.description" name="description" placeholder="Description">
            <input type="file" name="file" id="file">
            <!-- <select v-model="form.category" name="category" id="docCategory">
                <option value="0" selected>Select Category</option>
                <option v-for="type in allFileTypes" :key="type.id" :value="type.id">{{type.name}}</option>
            </select> -->
            <input type="submit" value="Add File">
        </form>
        <ul class="error" v-if="errors.length > 0">
            <li v-for="(err, index) in errors" :key="index">{{err}}</li>
        </ul>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
export default {
    props: {
        selected: Object,
        currentVersion: Number
    },
    data() {
        return {
            form: {
                name: null,
                description: null,
                category: 0,
            },
            errors: []
        }
    },
    computed: {
        ...mapGetters([
            'allFileTypes'
        ])
    },
    methods: {
        ...mapActions([
            'addFile',
            'fetchFileTypes'
        ]),
        ...mapMutations([
            'setProcessing'
        ]),
        addEnc() {
            this.errors = []
            var file = document.getElementById('file').files[0]
            if(!this.form.name || this.form.name == '') {
                this.errors.push('Document must have a name')
            }
            if(!this.form.description || this.form.description == '') {
                this.errors.push('Document must have a description')
            }
            // if(!this.form.category || this.form.category == '' || this.form.category <= 0) {
            //     this.errors.push('Please define a category for this document')
            // }
            if(!file) {
                this.errors.push('Please include a pdf file')
            }else if(file.type != 'application/pdf') {
                this.errors.push('File must be a pdf')
            }else if(file.size > 600000000) {
                this.errors.push('This file is too large')
            }
            if(this.errors.length > 0) {
                return console.log(this.errors)
            }else{
                var data = new FormData()
                data.append('name', this.form.name)
                data.append('description', this.form.description)
                // data.append('file_type', this.form.category)
                data.append('file', file)
                data.append('case', this.$route.params.id)
                if(this.currentVersion != null) {
                    data.append('document', this.selected.document_version[this.currentVersion].id)
                }
                this.setProcessing({processing: true, finished: false, message: 'Uploading...'})
                this.addFile(data).then(res => {
                    this.form.name = null
                    this.form.description = null
                    this.form.category = 0
                    document.getElementById('file').value = null
                    this.setProcessing({processing: true, finished: true, message: 'Uploaded!'})
                }).catch(err => {
                    this.setProcessing({processing: true, finished: true, error: err})
                })
            }
        },
    },
    mounted() {
        this.fetchFileTypes()
    }

}
</script>

<style>
    .container {
        margin: 20px 0;
    }

    .error li {
        color: red;
    }
</style>
