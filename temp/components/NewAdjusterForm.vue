<template>
    <div v-if="render" class="container">
        <form>
            <div class="section">
                <h2>New Adjuster</h2>
                <div class="input-block">
                    <div class="input-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" v-model="form.name">
                    </div>
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="text" id="email" v-model="form.email">
                    </div>
                    <div class="input-group">
                        <label for="fax">Fax</label>
                        <input type="text" id="fax" v-model="form.fax">
                    </div>
                    <div class="input-group">
                        <label for="company">Company</label>
                        <select name="company" id="company" v-model="form.insurance_company_id">
                            <option value="0" selected hidden>Select One</option>
                            <option v-for="i in allInsurance" :key="i.id" :value="i.id">{{i.name}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <ul v-if="errors.length > 0" class="errors">
                <li v-for="(err, index) in errors" :key="index">{{err}}</li>
            </ul>
            <button @click.prevent="handleSubmit">Save</button>
        </form>
    </div>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from 'vuex'
export default {
    data() {
        return {
            form: {
                name: null,
                email: null,
                fax: null,
                insurance_company_id: 0
            },
            render: false,
            errors: []
        }
    },
    computed: {
        ...mapGetters([
            'allInsurance'
        ])
    },
    methods: {
        ...mapActions([
            'fetchInsurance',
            'addAdjuster'
        ]),
        ...mapMutations([
            'setProcessing'
        ]),
        handleSubmit() {
            this.errors = []

            if(!this.form.name || this.form.name == '') {
                this.errors.push('Adjuster must have a name')
            }
            if(!this.form.email || this.form.email == '') {
                this.errors.push('Adjuster must have an email')
            }
            if(!this.form.fax || this.form.fax == '') {
                this.errors.push('Adjuster must have a fax')
            }
            if(!this.form.insurance_company_id || this.form.insurance_company_id == '') {
                this.errors.push('Adjuster must have a company')
            }

            if(this.errors.length > 0) {
                console.log(this.errors)
                return
            }

            this.setProcessing({processing: true, finished: false, message: 'Saving...'})

            this.addAdjuster(this.form).then(() => {
                this.setProcessing({processing: true, finished: true, message: 'Saved!'})
                this.$emit('saved')
            }).catch(err => {
                this.setProcessing({processing: true, finished: true, error: err})
            })
        }
    },
    mounted() {
        this.fetchInsurance().then(() => {
            this.render = true
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>

<style lang="scss">
    .container {
        margin-bottom: 30px;
    }
    .section {
        margin: 15px 0;
        background-color: #ccc;
        border-radius: 10px;
        padding: 20px;
        .input-block {
            display: flex;
            justify-content: flex-start;
            align-content: flex-start;
            margin: 10px 0;
            .input-group {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                margin: 0 5px;
                &.disabled {
                    opacity: .5;
                    pointer-events: none;
                }
                .radio-container {
                    display: flex;
                }
            }
        }
    }

    form {
        min-width: 600px;
    }

    .errors li {
        color: red;
    }
</style>
