<template>
    <div class="container">
        <form>
            <div class="section">
                <h2>New Attorney</h2>
                <div class="input-block">
                    <div class="input-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" v-model="form.first_name">
                    </div>
                    <div class="input-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" v-model="form.last_name">
                    </div>
                    <div class="input-group">
                        <label for="title">Title (optional)</label>
                        <input type="text" id="title" v-model="form.title">
                    </div>
                    <div class="input-group">
                        <label for="email">Email</label>
                        <input type="text" id="email" v-model="form.email">
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
import {mapActions, mapMutations} from 'vuex'
export default {
    data() {
        return {
            form: {
                first_name: null,
                last_name: null,
                email: null,
                title: null
            },
            errors: []
        }
    },
    methods: {
        ...mapActions([
            'addAttorney'
        ]),
        ...mapMutations([
            'setProcessing'
        ]),
        handleSubmit() {
            this.errors = []

            if(!this.form.first_name || this.form.first_name == '') {
                this.errors.push('Please include a first name')
            }
            if(!this.form.last_name || this.form.last_name == '') {
                this.errors.push('Please include a last name')
            }
            if(!this.form.email || this.form.email == '') {
                this.errors.push('Please include an email')
            }

            if(this.errors.length > 0) {
                console.log(this.errors)
                return
            }

            this.addAttorney(this.form).then(() => {
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
