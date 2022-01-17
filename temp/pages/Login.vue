<template>
  <div class="main">
      <p>Login Please</p>
      <input type="email" name="email" id="email" v-model="form.email">
      <input type="password" name="password" id="password" v-model="form.password">
      <button @click.prevent="login">Log In</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            form: {
                email: null,
                password: null
            },
            errors: []
        }
    },
    methods: {
        login() {
            if(this.form.password.length > 0) {
                axios.get('https://www.zaf.local/sanctum/csrf-cookie').then(() => {
                    axios.post('https://www.zaf.local/api/login', this.form)
                        .then(res => {
                            console.log(res.data)
                            if(res.data.success) {
                                // window.Laravel.isLoggedin = true
                                // this.$router.go('/')
                            }else{
                                this.error.push(res.data.message)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            }
        }
    }
}
</script>

<style>

</style>
