<template>
    <div class="container">
        <form action="">
            <div class="section">
                <h2>General</h2>
                <div class="input-block">
                    <div class="input-group">
                        <label for="attorney">Attorney</label>
                        <select name="" id="attorney" v-model="selected.attorney">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(a, index) in allAttorneys" :key="index" :value="a.id">
                                {{`${a.first_name} ${a.last_name}`}}</option>
                            <option value="-1">Other</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="caseType">Case Type</label>
                        <select name="" id="caseType" v-model="selected.type">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(c, index) in allCategories" :key="index" :value="c.id">{{c.name}}</option>
                            <option value="-1">Other</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="dateOfInjury">Date of Injury</label>
                        <input type="date" name="" id="dateOfInjury" v-model="selected.dateOfInjury">
                    </div>
                    <!-- <div class="input-group">
                        <label for="caseName">Case Name</label>
                        <input type="text" name="" id="caseName" v-model="selected.caseName">
                    </div>
                    <div class="input-group">
                        <label for="clientFirst">First Name</label>
                        <input type="text" name="" id="clientFirst" v-model="selected.client.firstName">
                    </div>
                    <div class="input-group">
                        <label for="clientLast">Last Name</label>
                        <input type="text" name="" id="clientLast" v-model="selected.client.lastName">
                    </div>
                    <div class="input-group">
                        <label for="clientGender">Gender</label>
                        <div class="radio-container">
                            <div class="radio-group">
                                <input type="radio" name="client_gender" id="clientMale" value="M"
                                    v-model="selected.client.gender">
                                <label for="clientMale">Male</label>
                            </div>
                            <div class="radio-group">
                                <input type="radio" name="client_gender" id="clientFemale" value="F"
                                    v-model="selected.client.gender">
                                <label for="clientFemale">Female</label>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="section">
                <h2>Client Information</h2>
                <div class="input-block">
                    <div class="input-group">
                        <label for="clientFirst">First Name</label>
                        <input type="text" name="" id="clientFirst" v-model="selected.client.firstName">
                    </div>
                    <div class="input-group">
                        <label for="clientLast">Last Name</label>
                        <input type="text" name="" id="clientLast" v-model="selected.client.lastName">
                    </div>
                    <div class="input-group">
                      <label for="clientGender">Gender</label>
                      <div class="radio-container">
                          <div class="radio-group">
                              <input type="radio" name="client_gender" id="clientMale" value="M" v-model="selected.client.gender">
                              <label for="clientMale">Male</label>
                          </div>
                          <div class="radio-group">
                              <input type="radio" name="client_gender" id="clientFemale" value="F" v-model="selected.client.gender">
                              <label for="clientFemale">Female</label>
                          </div>
                      </div>
                  </div>
                </div>
                <!-- <div class="input-block">
                    <div class="input-group">
                        <label for="clientAddress">Address</label>
                        <input type="text" name="" id="clientAddress" v-model="selected.client.address">
                    </div>
                    <div class="input-group">
                        <label for="clientCity">City</label>
                        <input type="text" name="" id="clientCity" v-model="selected.client.city">
                    </div>
                    <div class="input-group">
                        <label for="clientState">State</label>
                        <input type="text" name="" id="clientState" v-model="selected.client.state">
                    </div>
                    <div class="input-group">
                        <label for="clientZip">Zip</label>
                        <input type="text" name="" id="clientZip" v-model="selected.client.zip">
                    </div>
                </div>
                <div class="input-block">
                    <div class="input-group">
                        <label for="clientInsurance">Insurance</label>
                        <select name="" id="clientInsurance" v-model="selected.client.insurance.id" @change="changeInsurance('client')">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(i, index) in allInsurance" :key="index" :value="i.id">{{i.name}}</option>
                            <option value="-1">Other</option>
                        </select>
                    </div>
                    <div :class="{'input-group': true, disabled: allReps.client.length <= 0 || selected.client.insurance.id <= 0}">
                        <label for="clientRep">Adjuster</label>
                        <select name="" id="clientRep" v-model="selected.client.tempRep.id">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(r, index) in allReps.client" :key="index" :value="r.id">{{r.name}}</option>
                            <option value="-1">Other</option>
                        </select>
                    </div>
                    <div v-if="selected.client.tempRep.id != -1" :class="{'input-group': true, disabled: allReps.client.length <= 0 || selected.client.insurance.id <= 0}">
                        <label for="clientRepType">Adjuster Type</label>
                        <select name="" id="clientRepType" v-model="selected.client.tempRep.type">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(r, index) in allRepTypes" :key="index" :value="r.id">{{r.name}}</option>
                        </select>
                    </div>
                    <div style="justify-content: flex-end;" v-if="selected.client.tempRep.id != -1" :class="{'input-group': true, disabled: selected.client.tempRep.id === 0}">
                        <button @click.prevent="addRep('client')">Add Adjuster</button>
                    </div>
                </div>
                <div class="adjusters">
                    <h4>Adjusters:</h4>
                    <ul v-if="selected.client.reps.length > 0">
                        <li v-for="(a, index) in selected.client.reps" :key="index">{{a.name}}, {{a.typeName}} <button @click.prevent="deleteAdjuster(index, 'client')">X</button></li>
                    </ul>
                    <p v-else>(No adjusters included)</p>
                </div>
                <div v-if="selected.client.insurance.id == -1 || selected.client.tempRep.id == -1" class="newInsurance">
                    <template v-if="selected.client.insurance.id == -1">
                        <h3>Company</h3>
                        <input type="text" placeholder="Company Name" v-model="selected.client.insurance.name">
                        <input type="text" placeholder="Company Address" v-model="selected.client.insurance.address">
                        <input type="text" placeholder="Company City" v-model="selected.client.insurance.city">
                        <input type="text" placeholder="Company State" v-model="selected.client.insurance.state">
                        <input type="text" placeholder="Company Zip" v-model="selected.client.insurance.zip">
                    </template>
                    <template v-if="selected.client.tempRep.id == -1">
                        <h3>Adjuster</h3>
                        <input type="text" placeholder="Rep Name" v-model="selected.client.tempRep.name">
                        <input type="email" placeholder="Rep Email" v-model="selected.client.tempRep.email">
                        <input type="text" placeholder="Rep Fax" v-model="selected.client.tempRep.fax">
                        <select name="" id="liableRepType" v-model="selected.client.tempRep.type">
                            <option value="0" hidden selected>Select Type</option>
                            <option v-for="(r, index) in allRepTypes" :key="index" :value="r.id">{{r.name}}</option>
                        </select>
                        <button @click.prevent="addRep('client')">Add Adjuster</button>
                    </template>
                </div> -->
            </div>
            <div class="section">
                <h2>Liable Party Information</h2>
                <div class="input-block">
                    <div class="input-group">
                        <label for="liableFirst">First Name</label>
                        <input type="text" name="" id="liableFirst" v-model="selected.liable.firstName">
                    </div>
                    <div class="input-group">
                        <label for="liableLast">Last Name</label>
                        <input type="text" name="" id="liableLast" v-model="selected.liable.lastName">
                    </div>
                    <div class="input-group">
                      <label for="liableGender">Gender</label>
                      <div class="radio-container">
                          <div class="radio-group">
                              <input type="radio" name="liable_gender" id="liableMale" value="M" v-model="selected.liable.gender">
                              <label for="liableMale">Male</label>
                          </div>
                          <div class="radio-group">
                              <input type="radio" name="liable_gender" id="liableFemale" value="F" v-model="selected.liable.gender">
                              <label for="liableFemale">Female</label>
                          </div>
                      </div>
                  </div>
                </div>
                <!-- <div class="input-block">
                    <div class="input-group">
                        <label for="clientAddress">Address</label>
                        <input type="text" name="" id="clientAddress" v-model="selected.liable.address">
                    </div>
                    <div class="input-group">
                        <label for="clientCity">City</label>
                        <input type="text" name="" id="clientCity" v-model="selected.liable.city">
                    </div>
                    <div class="input-group">
                        <label for="clientState">State</label>
                        <input type="text" name="" id="clientState" v-model="selected.liable.state">
                    </div>
                    <div class="input-group">
                        <label for="clientZip">Zip</label>
                        <input type="text" name="" id="clientZip" v-model="selected.liable.zip">
                    </div>
                </div>
                <div class="input-block">
                    <div class="input-group">
                        <label for="liableInsurance">Insurance</label>
                        <select name="" id="liableInsurance" v-model="selected.liable.insurance.id" @change="changeInsurance('liable')">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(i, index) in allInsurance" :key="index" :value="i.id">{{i.name}}</option>
                            <option value="-1">Other</option>
                        </select>
                    </div>
                    <div :class="{'input-group': true, disabled: allReps.liable.length <= 0 || selected.liable.insurance.id <= 0}">
                        <label for="liableRep">Adjuster</label>
                        <select name="" id="liableRep" v-model="selected.liable.tempRep.id">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(r, index) in allReps.liable" :key="index" :value="r.id">{{r.name}}</option>
                            <option value="-1">Other</option>
                        </select>
                    </div>
                    <div v-if="selected.liable.tempRep.id != -1" :class="{'input-group': true, disabled: allReps.liable.length <= 0 || selected.liable.insurance.id <= 0}">
                        <label for="liableRepType">Adjuster Type</label>
                        <select name="" id="liableRepType" v-model="selected.liable.tempRep.type">
                            <option value="0" hidden selected>Select One</option>
                            <option v-for="(r, index) in allRepTypes" :key="index" :value="r.id">{{r.name}}</option>
                        </select>
                    </div>
                    <div style="justify-content: flex-end;" v-if="selected.liable.tempRep.id != -1" :class="{'input-group': true, disabled: !selected.liable.tempRep.type}">
                        <button @click.prevent="addRep('liable')">Add Adjuster</button>
                    </div>
                </div>
                <div class="adjusters">
                    <h4>Adjusters:</h4>
                    <ul v-if="selected.liable.reps.length > 0">
                        <li v-for="(a, index) in selected.liable.reps" :key="index">{{a.name}}, {{a.typeName}}  <button @click.prevent="deleteAdjuster(index, 'client')">X</button></li>
                    </ul>
                    <p v-else>(No adjusters included)</p>
                </div>
                <div v-if="selected.liable.insurance.id == -1 || selected.liable.tempRep.id == -1" class="newInsurance">
                    <template v-if="selected.liable.insurance.id == -1">
                        <h3>Company</h3>
                        <input type="text" placeholder="Company Name" v-model="selected.liable.insurance.name">
                        <input type="text" placeholder="Company Address" v-model="selected.liable.insurance.address">
                        <input type="text" placeholder="Company City" v-model="selected.liable.insurance.city">
                        <input type="text" placeholder="Company State" v-model="selected.liable.insurance.state">
                        <input type="text" placeholder="Company Zip" v-model="selected.liable.insurance.zip">
                    </template>
                    <template v-if="selected.liable.tempRep.id == -1">
                        <h3>Adjuster</h3>
                        <input type="text" placeholder="Rep Name" v-model="selected.liable.tempRep.name">
                        <input type="email" placeholder="Rep Email" v-model="selected.liable.tempRep.email">
                        <input type="text" placeholder="Rep Fax" v-model="selected.liable.tempRep.fax">
                        <select name="" id="liableRepType" v-model="selected.liable.tempRep.type">
                            <option value="0" hidden selected>Select Type</option>
                            <option v-for="(r, index) in allRepTypes" :key="index" :value="r.id">{{r.name}}</option>
                        </select>
                        <button @click.prevent="addRep('liable')">Add Adjuster</button>
                    </template>
                </div> -->
            </div>
            <div class="errors" v-if="errors.length > 0">
                <ul>
                    <li v-for="(err, index) in errors" :key="index">{{err}}</li>
                </ul>
            </div>
            <button @click.prevent="handleSubmit">Save Case</button>
        </form>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
    data() {
        return {
            selected: {
                attorney: 0,
                type: 0,
                dateOfInjury: null,
                caseName: null,
                client: {
                    firstName: null,
                    lastName: null,
                    gender: null,
                    // address: null,
                    // city: null,
                    // state: null,
                    // zip: null,
                    // insurance: {
                    //     id: 0,
                    //     name: null,
                    //     address: null,
                    //     city: null,
                    //     state: null,
                    //     zip: null
                    // },
                    // reps: [],
                    // tempRep: {
                    //     id: 0,
                    //     name: null,
                    //     email: null,
                    //     fax: null,
                    //     type: 0,
                    //     typeName: null,
                    // },
                    party: 1
                },
                liable: {
                    firstName: null,
                    lastName: null,
                    gender: null,
                    // address: null,
                    // city: null,
                    // state: null,
                    // zip: null,
                    // insurance: {
                    //     id: 0,
                    //     name: null,
                    //     address: null,
                    //     city: null,
                    //     state: null,
                    //     zip: null
                    // },
                    // reps: [],
                    // tempRep: {
                    //     id: 0,
                    //     name: null,
                    //     email: null,
                    //     fax: null,
                    //     type: 0,
                    //     typeName: null,
                    // },
                    party: 2
                },
            },
            errors: []

        }
    },
    computed: {
        ...mapGetters([
            'allAttorneys',
            'allInsurance',
            'allReps',
            'allRepTypes',
            'allCategories'
        ]),
    },
    methods: {
        ...mapActions([
            'setupNewCase',
            'newCase'
        ]),
        ...mapMutations([
            'setReps',
            'setProcessing'
        ]),
        deleteAdjuster(i,p) {
            this.selected[p].reps.splice(i, 1)
        },
        changeInsurance(party) {
            // return console.log(this.selected[party].insurance)
            if(this.selected[party].insurance.id != -1) {
                var reps = this.allInsurance.find(i => {
                    return i.id === this.selected[party].insurance.id
                }).reps
                this.setReps({reps: reps, party: party})
                // console.log('!-1')
            }else{
                this.selected[party].tempRep.id = "-1"
                this.setReps({reps: [], party: party})
                // console.log('-1')
            }
        },
        addRep(party) {
            // return console.log(this.selected[party].tempRep.id)
            var p = this.selected[party]
            if(p.tempRep.id !== 0) {
                if(p.tempRep.id != -1) {
                    if(p.reps.find(r => r.id === p.tempRep.id)) {
                        p.tempRep.id = 0
                        return console.log('rep is already included')
                    }
                    p.tempRep.name = this.allReps[party].find(r => r.id === p.tempRep.id).name
                }
                p.tempRep.typeName = this.allRepTypes.find(rt => rt.id === p.tempRep.type).name
                p.reps.push(p.tempRep)
                p.tempRep = {
                    id: p.insurance.id == -1 ? '-1' : 0,
                    name: null,
                    email: null,
                    fax: null,
                    type: 0,
                    typeName: null
                }
            }else{
                console.log('no rep selected')
            }
        },
        handleSubmit() {
            this.errors = []

            if(!this.selected.attorney) {
                this.errors.push('This case must have an assigned attorney')
            }
            if(!this.selected.type) {
                this.errors.push('This case must have an assigned type')
            }
            if(!this.selected.dateOfInjury) {
                this.errors.push('Please provide a date of injury')
            }

            if(!this.selected.caseName) {
                this.errors.push('Please provide a case name')
            }

            if(!this.selected.client.firstName || !this.selected.client.lastName || !this.selected.client.gender) {
                this.errors.push('Make sure all client information is filled out')
            }


            // if(this.selected.client.reps.length <= 0 || this.selected.liable.reps.length <= 0) {
            //     this.errors.push('Each party must have at least one assigned adjuster')
            // }

            // if(!this.selected.liable.reps.find(r => r.type === 1)) {
            //     this.errors.push('Please assign a liability adjuster')
            // }

            // for(let c in this.selected.client) {
            //     if(!this.selected.client[c] || this.selected.client[c] === '') {
            //         console.log(`${c}: ${this.selected.client[c]}`)
            //         this.errors.push('Make sure all client information is filled out')
            //         break;
            //     }
            // }

            // if(this.selected.client.insurance.id == -1) {
            //     for(let i in this.selected.client.insurance) {
            //         if(!this.selected.client.insurance[i] || this.selected.client.insurance[i] == '') {
            //             this.errors.push('Please fill out client insurance information')
            //             break;
            //         }
            //     }
            // }

            // for(let l in this.selected.liable) {
            //     if(!this.selected.liable[l] || this.selected.liable[l] === '') {
            //         console.log(`${l}: ${this.selected.liable[l]}`)
            //         this.errors.push('Make sure all liable party information is filled out')
            //         break;
            //     }
            // }

            // if(this.selected.liable.insurance.id == -1) {
            //     for(let i in this.selected.liable.insurance) {
            //         if(!this.selected.liable.insurance[i] || this.selected.liable.insurance[i] == '') {
            //             this.errors.push('Please fill out liable insurance information')
            //             break;
            //         }
            //     }
            // }

            if(this.errors.length > 0) {
                console.log(this.errors)
                console.log(data)
                return
            }

            var data = {
                attorney: this.selected.attorney,
                type: this.selected.type,
                caseName: this.selected.caseName,
                dateOfInjury: this.selected.dateOfInjury,
                parties: [
                    {
                        ...this.selected.client,
                    },
                    // {
                    //     ...this.selected.liable,
                    // }
                ]
            }

            this.newCase(data).then(res => {
                this.setProcessing({processing: true, finished: true, message: 'Case Added!'})
                this.$emit('saved');
            }).catch(err => {
                this.setProcessing({processing: true, finished: true, error: err})
            })
        }
    },
    mounted() {
        this.setupNewCase()
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

    .adjusters {
        margin: 20px 0;
        h4 {
            margin: 5px 0;
        }
        ul, p {
            font-size: 15px;
            margin: 5px 0;
        }
    }

</style>
