<template>
    <div class="container">
        <form>
            <div class="section">
                <h2>New Insurance</h2>
                <div class="input-block">
                    <div class="input-group">
                        <label for="companyName">Company Name</label>
                        <input type="text" id="companyName" v-model="form.insurance.name">
                    </div>
                    <div class="input-group">
                        <label for="address">Address</label>
                        <input type="text" id="address" v-model="form.insurance.address">
                    </div>
                    <div class="input-group">
                        <label for="city">City</label>
                        <input type="text" id="city" v-model="form.insurance.city">
                    </div>
                    <div class="input-group">
                        <label for="state">State</label>
                        <input type="text" id="state" v-model="form.insurance.state">
                    </div>
                    <div class="input-group">
                        <label for="zip">Zip</label>
                        <input type="text" id="zip" v-model="form.insurance.zip">
                    </div>
                </div>
            </div>
            <div class="section">
                <h2>New Adjuster</h2>
                <div class="input-block">
                    <div class="input-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" v-model="form.adjuster.name">
                    </div>
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="text" id="email" v-model="form.adjuster.email">
                    </div>
                    <div class="input-group">
                        <label for="fax">Fax</label>
                        <input type="text" id="fax" v-model="form.adjuster.fax">
                    </div>
                    <!-- <div class="input-group">
                        <label for="company">Company</label>
                        <select name="company" id="company" v-model="form.adjuster.insurance_company_id">
                            <option value="0" selected hidden>Select One</option>
                            <option v-for="i in allInsurance" :key="i.id" :value="i.id">{{i.name}}</option>
                        </select>
                    </div> -->
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
import {mapActions, mapMutations} from 'vuex'
export default {
    data() {
        return {
            form: {
                insurance: {
                    name: null,
                    address: null,
                    city: null,
                    state: null,
                    zip: null
                },
                adjuster: {
                    name: null,
                    email: null,
                    fax: null,
                    // insurance_company_id: 0
                }
            },
            errors: []
        }
    },
    methods: {
        ...mapActions([
            'addInsurance'
        ]),
        ...mapMutations([
            'setProcessing'
        ]),
        handleSubmit() {
            this.errors = []

            if(!this.form.insurance.name || this.form.insurance.name == '') {
                this.errors.push('Please include a company name')
            }
            if(!this.form.insurance.address || this.form.insurance.address == '') {
                this.errors.push('Please include an address')
            }
            if(!this.form.insurance.city || this.form.insurance.city == '') {
                this.errors.push('Please include a city')
            }
            if(!this.form.insurance.state || this.form.insurance.state == '') {
                this.errors.push('Please include a state')
            }
            if(!this.form.insurance.zip || this.form.insurance.zip == '') {
                this.errors.push('Please include a zip code')
            }
            if(!this.form.adjuster.name || this.form.adjuster.name == '') {
                this.errors.push('Please include a company name')
            }
            if(!this.form.adjuster.email || this.form.adjuster.email == '') {
                this.errors.push('Please include an email')
            }
            if(!this.form.adjuster.fax || this.form.adjuster.fax == '') {
                this.errors.push('Please include a fax')
            }

            if(this.errors.length > 0) {
                console.log(this.errors)
                return
            }

            this.addInsurance(this.form).then(() => {
                this.$emit('saved')
                this.setProcessing({processing: true, finished: true, message: 'Saved!'})
            }).catch(err => {
                this.setProcessing({processing: true, finished: true, error: err})
            })
        }
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
