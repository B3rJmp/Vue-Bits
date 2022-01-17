<template>
    <div class="container">
        <div class="page-item">
            <h1>Cases</h1>
        </div>
        <div class="page-item">
            <div class="new-dropdown">
                <button @click="newItem">New <span :class="['fas', forms.showDropdown ? 'fa-arrow-right' : 'fa-arrow-down']"></span></button>
                <div v-if="forms.showDropdown" class="new-dropdown-content">
                    <ul>
                        <li @click="openForm('showNewCase')">Case</li>
                        <!-- <li @click="echo('provider')">Provider</li> -->
                        <li @click="openForm('showNewAttorney')">Attorney</li>
                        <li @click="openForm('showNewAdjuster')">Adjuster</li>
                        <li @click="openForm('showNewInsurance')">Insurance</li>
                    </ul>
                </div>
            </div>
            <table>
                <tr>
                    <th>Case</th>
                    <th>Client</th>
                    <th>Last Modified</th>
                    <th>&nbsp;</th>
                </tr>
                <tr v-for="c in allCases" :key="c.id">
                    <td>{{c.name}}</td>
                    <td>{{ c.party.length > 0 ? caseClient(c) : '' }}</td>
                    <td>{{formatTime(c.updated_at)}}</td>
                    <td>
                        <router-link :to="'/case/' + c.id">View Case</router-link>
                    </td>
                </tr>
            </table>
        </div>
        <new-case-form v-if="forms.showNewCase" @saved="forms.showNewCase = false" style="width: 100%;"/>
        <new-attorney-form v-if="forms.showNewAttorney" @saved="forms.showNewAttorney = false"/>
        <new-adjuster-form v-if="forms.showNewAdjuster" @saved="forms.showNewAdjuster = false"/>
        <new-insurance-form v-if="forms.showNewInsurance" @saved="forms.showNewInsurance = false"/>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
import NewCaseForm from '../components/NewCaseForm.vue'
import NewAttorneyForm from '../components/NewAttorneyForm.vue'
import NewAdjusterForm from '../components/NewAdjusterForm.vue'
import NewInsuranceForm from '../components/NewInsuranceForm.vue'
import CaseService from '../app/services/CaseService'
export default {
    components: {
        NewCaseForm,
        NewAttorneyForm,
        NewAdjusterForm,
        NewInsuranceForm
    },
    data() {
        return {
            forms: {
                showDropdown: false,
                showNewCase: false,
                showNewAttorney: false,
                showNewAdjuster: false,
                showNewInsurance: false
            }
        }
    },
    computed: {
        ...mapGetters(['allCases']),
    },
    methods: {
        ...mapActions(['fetchCases']),
        ...mapMutations(['setLoading', 'setCases']),
        echo(m) {
            console.log(m)
        },
        formatTime(time) {
            let d = new Date(time)
            return d.toLocaleDateString('en-US');
        },
        newItem() {
            this.forms.showDropdown = !this.forms.showDropdown
        },
        openForm(v) {
            for(let f in this.forms) {
                this.forms[f] = false
            }
            return this.forms[v] = true
        },
        caseClient(c) {
            var client = c.party.find(p => {
                return p.party_type.id === 1
            })
            return client.first_name + ' ' + client.last_name
        }
    },
    created() {
        this.setLoading(true)
        // this.fetchCases().then(() => {
        CaseService.fetchCases().then(res => {
        // this.$app.services.cases.fetchCases().then(res => {
            this.setCases(res)
            this.setLoading(false)
        })
    },
    mounted() {
        // console.log('hello')
    }

}
</script>

<style scoped lang="scss">
    h1 {
        margin-bottom: 0;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    table {
        border-collapse: collapse;
        td, th {
            padding: 10px 5px;
            min-width: 100px;
            text-align: left;
            border: 1px solid black;
        }
        th {
            background: #ccc;
        }
        a {
            color: white;
            text-decoration: none;
            background: #0075ff;
            border-radius: 5px;
            cursor: pointer;
            padding: 5px;
        }
    }

    .new-dropdown {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
        position: relative;
        button {
            cursor: pointer;
        }
        .new-dropdown-content {
            position: absolute;
            background-color: white;
            box-shadow: 1px 1px 2px 2px rgba(0,0,0, .2);
            top: 25px;
            // padding: 10px 15px;
            ul {
                list-style: none;
                margin: 0;
                padding: 0;
                li {
                    cursor: pointer;
                    padding: 10px 15px;
                    border-bottom: 1px solid #ccc;
                }
            }
        }
    }
</style>
