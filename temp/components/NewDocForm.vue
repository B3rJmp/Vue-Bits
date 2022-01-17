<template>
  <div class="form">
    <h3>Add Document</h3>
    <form @submit.prevent="handleSubmit">
        <select v-model="category" name="category" id="category" aria-placeholder="Select Category">
            <option value="-1" hidden selected>Select Category</option>
            <option v-for="dc in allDocCats" :key="dc.id" :value="dc.id">{{ dc.name }}</option>
        </select>
        <!-- <input v-model="version" type="text" name="version" id="version" placeholder="Version Name"> -->
        <input type="submit" value="Add Document">
    </form>
    <ul class="errors" v-if="errors">
        <li v-for="(err, index) in errors" :key="index">{{ err }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    props: {
        currentCase: Number
    },
    data() {
        return {
            category: "-1",
            version: null,
            errors: []
        }
    },
    methods: {
        ...mapActions([
            'fetchDocCats',
            'addDoc'
        ]),
        handleSubmit() {
            this.errors = []
            if(this.category < 0) {
                this.errors.push('No category was selected')
            }
            // if(!this.version) {
            //     this.errors.push('Please provide a version name')
            // }
            if(this.errors.length > 0) {
                console.log(this.errors)
                return
            }
            let data = {
                case: this.currentCase,
                category: this.category,
                // version: this.version
            }
            // return console.log(data)
            this.addDoc(data).then(res => {
                this.$emit('added')
            })
        }
    },
    computed: {
        ...mapGetters([
            'allDocCats',
            // 'currentCase'
        ])
    },
    created() {
        this.fetchDocCats()
    }
}
</script>

<style>
    .errors li {
        color: red;
    }
    button, input[type='submit'], input[type='file'] {
        cursor: pointer !important;
    }
</style>
