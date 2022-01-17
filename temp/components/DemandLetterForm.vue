<template>
    <div v-if="render" class="content">
        <div class="saveDoc">
            <div class="saveBtn">
                <button @click="saveDoc">Save Document</button>
                <button v-if="currentVersion.generated" @click="previewDoc()" style="margin-top: 10px;">Preview
                    Document</button>
                <button @click="generatePDF()" style="margin-top: 10px;">Create Document</button>
            </div>
        </div>
        <h1>Demand Letter</h1>
        <form class="docInfo" @submit.prevent="generatePDF" id="info" action="">
            <div class="input-container">
                <div class="input-column">
                    <div class="input-group">
                        <label for="company">Insurance</label>
                        <!-- <input type="text" name="insurance_company" v-model="docInfo.case_data.insurance_name"> -->
                        <select @change="setReps" name="" id="company" v-model="getLiable.insurance_company_id">
                            <option value="0" selected hidden>Select Company</option>
                            <option v-for="i in docInfo.insurance" :key="i.id" :value="i.id">{{i.name}}</option>
                        </select>
                        <p class="error" v-if="errors.companyName">{{ errors.companyName }}</p>
                    </div>
                    <div class="input-group">
                        <label for="company">Recipient</label>
                        <!-- <input type="text" name="insurance_company" v-model="docInfo.case_data.insurance_name"> -->
                        <select v-if="getLiable.insurance_company_id" name="" id="" v-model="docInfo.case_data.recipient_id">
                            <option value="0" selected hidden>Select Recipient</option>
                            <option v-for="r in selectedReps" :key="r.id" :value="r.id">{{r.name}}</option>
                        </select>
                        <p class="error" v-if="errors.companyName">{{ errors.companyName }}</p>
                    </div>
                    <!-- <div class="input-group">
                        <label for="recipient">Recipient</label>
                        <input type="text" name="recipient" v-model="docInfo.case_data.recipient_name">
                        <select name="" id="recipient">
                            <option value="0" selected hidden>Select one</option>
                            <option v-for="" value="1">Andrew</option>
                            <option value="-1">Other</option>
                        </select>
                    </div> -->
                    <!-- <div class="input-group">
                        <label for="recipientEmail">Recipient Email</label>
                        <input type="text" name="recipient_email" v-model="docInfo.case_data.recipient_email">
                    </div> -->
                    <!-- <div class="input-group">
                        <label for="repAddress">Insurance Address</label>
                        <input type="text" name="insurance_address" v-model="docInfo.case_data.insurance_address">
                        <p class="error" v-if="errors.repAddress">{{ errors.repAddress }}</p>
                    </div>
                    <div class="input-group">
                        <label for="repAddress2">City, State, Zip</label>
                        <div class="address2">
                            <input type="text" name="insurance_city" placeholder="City"
                                v-model="docInfo.case_data.insurance_city">
                            <input type="text" name="insurance_state" placeholder="State"
                                v-model="docInfo.case_data.insurance_state">
                            <input type="text" name="insurance_zip" placeholder="Zip"
                                v-model="docInfo.case_data.insurance_zip">
                        </div>
                        <p class="error" v-if="errors.address2">{{ errors.address2 }}</p>
                    </div> -->
                    <div class="input-group">
                        <label for="claimNumber">Claim Number</label>
                        <input type="text" name="claim_number" v-model="docInfo.case_data.claim_number">
                        <p class="error" v-if="errors.claim">{{ errors.claim }}</p>
                    </div>
                    <div class="input-group">
                        <label for="daysUntilDeadline">Days Until Deadline</label>
                        <input type="number" name="days_until_deadline" v-model="docInfo.case_data.days_until_deadline">
                        <p class="error" v-if="errors.daysUntilDeadline">{{ errors.daysUntilDeadline }}</p>
                    </div>
                    <div class="input-group">
                        <div class="radio-group">
                            <input type="checkbox" name="policy_limits_demand" v-model="policyLimitsDemand">
                            <label for="demandAmount">Is this a Policy Limits Demand?</label>
                        </div>
                    </div>
                </div>
                <div class="input-column">
                    <div class="input-group">
                        <label for="perPersonLimits">Per Person Limits</label>
                        <input type="number" step="any" name="per_person_limits"
                            v-model="docInfo.case_data.per_person_limits">
                        <p class="error" v-if="errors.perPersonLimits">{{ errors.perPersonLimits }}</p>
                    </div>
                    <div class="input-group">
                        <label for="perAccidentLimits">Per Accident Limits</label>
                        <input type="number" step="any" name="per_accident_limits"
                            v-model="docInfo.case_data.per_accident_limits">
                        <p class="error" v-if="errors.perAccidentLimits">{{ errors.perAccidentLimits }}</p>
                    </div>
                    <div class="input-group">
                        <label for="pastMedBills">Past Medical Bills</label>
                        <input type="number" step="any" name="past_med_bills"
                            v-model="docInfo.case_data.past_med_bills">
                        <p class="error" v-if="errors.pastBills">{{ errors.pastBills }}</p>
                    </div>
                    <div class="input-group">
                        <label for="futureMedBills">Future Medical Bills</label>
                        <input type="number" step="any" name="future_med_bills"
                            v-model="docInfo.case_data.future_med_bills">
                        <p class="error" v-if="errors.futureBills">{{ errors.futureBills }}</p>
                    </div>
                    <div class="input-group">
                        <label for="demandAmount">Demand Amount</label>
                        <input type="number" step="any" name="demand_amount" v-model="docInfo.case_data.demand_amount">
                        <p class="error" v-if="errors.demand">{{ errors.demand }}</p>
                    </div>
                    <div class="input-group">
                        <label for="lostWages">Estimated Lost Wages</label>
                        <input type="number" step="any" name="lost_wages" v-model="docInfo.case_data.lost_wages">
                    </div>
                </div>
            </div>
            <div action="" class="edit" style="background: #eee;">
                <div class="edit-group">
                    <h3>Background</h3>
                    <table v-if="docInfo.case_info.background && docInfo.case_info.background.length > 0">
                       <template v-for="(data, index) in docInfo.case_info.background" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.background)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.background)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.background)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.background)">&#x21A9;</button></td>
                            </tr>
                       </template>
                    </table>
                    <p v-else>No includes to display</p>
                    <div>
                        <input type="text" name="" v-model="tempBackground"
                            @keypress.prevent.enter="addItem('b', 'background', tempBackground)">
                        <button @click.prevent="addItem('b', 'background', tempBackground)">Add Background</button>
                    </div>
                </div>
                <div class="edit-group">
                    <h3>Liability</h3>
                    <table v-if="docInfo.case_info.liability && docInfo.case_info.liability.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.liability" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.liability)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.liability)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.liability)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.liability)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>No includes to display</p>
                    <div>
                        <input type="text" name="" v-model="tempLiability"
                            @keypress.prevent.enter="addItem('l', 'liability', tempLiability)">
                        <button @click.prevent="addItem('l', 'liability', tempLiability)">Add Liability</button>
                    </div>
                </div>
                <div class="edit-group">
                    <h3>Injury Summary</h3>
                    <!-- <textarea name="intro" cols="100" rows="5" v-model="this.docEdit.careParagraph"></textarea> -->
                    <table v-if="docInfo.case_info.injury_summary && docInfo.case_info.injury_summary.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.injury_summary" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.injury_summary)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.injury_summary)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.injury_summary)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.injury_summary)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>No includes to display</p>
                    <div style="margin-bottom: 20px">
                        <input type="text" name="" v-model="tempCare"
                            @keypress.prevent.enter="addItem('is', 'injury_summary', tempCare)">
                        <button @click.prevent="addItem('is', 'injury_summary', tempCare)">Add Care</button>
                    </div>
                    <!-- <textarea name="intro" cols="100" rows="5" v-model="this.docEdit.injuryParagraph"></textarea> -->
                    <table class="diagnoses" v-if="docInfo.case_diagnoses">
                        <tr>
                            <th>Diagnosis/Injury</th>
                            <th>Provider</th>
                            <th>Date of Service</th>
                            <th>&nbsp;</th>
                            <th>&nbsp;</th>
                        </tr>
                        <template v-for="(d, index) in docInfo.case_diagnoses" :key="index">
                            <tr>
                                <td :class="{deleted: d.delete}">{{ d.diagnosis }} <span v-if="d.delete">(deleted)</span></td>
                                <td :class="{deleted: d.delete}">{{ d.provider.name }}</td>
                                <td :class="{deleted: d.delete}">{{ diagnosisDate(d.date_of_service) }}</td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_diagnoses)">&uarr;</button></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_diagnoses)">&darr;</button>
                                </td>
                                <td v-if="!d.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_diagnoses)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_diagnoses)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>No diagnoses to display</p>
                    <div class="addDiagnosis" style="margin-bottom: 20px">
                        <input type="text" name="" v-model="tempDiagnosis.d" placeholder="Diagnosis/Injury">
                        <!-- <input type="text" name="" v-model="tempDiagnosis.p" placeholder="Provider"> -->
                        <select name="providers" id="providers" v-model="tempDiagnosis.p">
                            <option value="0" selected hidden>Select Provider</option>
                            <option v-for="p in docInfo.providers" :key="p.id" :value="p.id">{{p.name}}</option>
                        </select>
                        <input type="date" name="" v-model="tempDiagnosis.date" placeholder="Date of Service">
                        <button @click.prevent="addDiagnosis(tempDiagnosis)">Add
                            Diagnosis</button>
                    </div>
                    <h4 style="margin-bottom: 0;">Other Notable Medical Findings:</h4>
                    <table
                        v-if="docInfo.case_info.other_medical_findings && docInfo.case_info.other_medical_findings.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.other_medical_findings" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.other_medical_findings)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.other_medical_findings)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.other_medical_findings)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.other_medical_findings)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>No includes to display</p>
                    <div style="margin-bottom: 20px">
                        <input type="text" name="" v-model="tempOtherMeds"
                            @keypress.prevent.enter="addItem('m', 'other_medical_findings', tempOtherMeds)">
                        <button
                            @click.prevent="addItem('m', 'other_medical_findings', tempOtherMeds)">Add
                            Medical
                            Finding</button>
                    </div>
                    <h4 style="margin-bottom: 0;">Future Medical Care:</h4>
                    <table
                        v-if="docInfo.case_info.future_medical_care && docInfo.case_info.future_medical_care.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.future_medical_care" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.future_medical_care)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.future_medical_care)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.future_medical_care)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.future_medical_care)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>No includes to display</p>
                    <div style="margin-bottom: 20px">
                        <input type="text" name="" v-model="tempFutureMeds"
                            @keypress.prevent.enter="addItem('fm', 'future_medical_care', tempFutureMeds)">
                        <button
                            @click.prevent="addItem('fm', 'future_medical_care', tempFutureMeds)">Add
                            Future Medical
                            Care</button>
                    </div>
                </div>
                <div class="edit-group">
                    <h3>Special Damages</h3>
                    <!-- <textarea name="intro" cols="100" rows="5" v-model="this.docEdit.specialDamageParagraph"></textarea> -->
                    <table v-if="docInfo.case_info.special_damages && docInfo.case_info.special_damages.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.special_damages" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.special_damages)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.special_damages)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.special_damages)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.special_damages)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>No reasons for lost wages listed</p>
                    <div>
                        <input type="text" name="" v-model="tempLostWages"
                            @keypress.prevent.enter="addItem('lw', 'special_damages', tempLostWages)">
                        <button @click.prevent="addItem('lw', 'special_damages', tempLostWages)">Add
                            Reason</button>
                    </div>
                </div>
                <div class="edit-group">
                    <h3>General Damages and Settlement Demand</h3>
                    <!-- <textarea name="intro" cols="100" rows="5" v-model="this.docEdit.generalDamageParagraph"></textarea> -->
                    <h4>Pain and Suffering</h4>
                    <table v-if="docInfo.case_info.pain_and_suffering && docInfo.case_info.pain_and_suffering.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.pain_and_suffering" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.pain_and_suffering)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.pain_and_suffering)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.pain_and_suffering)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.pain_and_suffering)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>Nothing Listed</p>
                    <div>
                        <input type="text" name="" v-model="tempPain"
                            @keypress.prevent.enter="addItem('ps', 'pain_and_suffering', tempPain)">
                        <button @click.prevent="addItem('ps', 'pain_and_suffering', tempPain)">Add Pain
                            and
                            Suffering</button>
                    </div>
                    <h4>Disfigurement</h4>
                    <table v-if="docInfo.case_info.disfigurement && docInfo.case_info.disfigurement.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.disfigurement" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.disfigurement)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.disfigurement)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.disfigurement)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.disfigurement)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>Nothing Listed</p>
                    <div>
                        <input type="text" name="" v-model="tempDisfigurement"
                            @keypress.prevent.enter="addItem('dis', 'disfigurement', tempDisfigurement)">
                        <button @click.prevent="addItem('dis', 'disfigurement', tempDisfigurement)">Add
                            Disfigurement</button>
                    </div>
                    <h4>Physical Limitations</h4>
                    <table v-if="docInfo.case_info.physical_limitations && docInfo.case_info.physical_limitations.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.physical_limitations" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.physical_limitations)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.physical_limitations)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.physical_limitations)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.physical_limitations)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>Nothing Listed</p>
                    <div>
                        <input type="text" name="" v-model="tempPhysLimits"
                            @keypress.prevent.enter="addItem('pl', 'physical_limitations', tempPhysLimits)">
                        <button
                            @click.prevent="addItem('pl', 'physical_limitations', tempPhysLimits)">Add
                            Limitation</button>
                    </div>
                    <h4>Consequences</h4>
                    <table v-if="docInfo.case_info.consequences && docInfo.case_info.consequences.length > 0">
                        <template v-for="(data, index) in docInfo.case_info.consequences" :key="index">
                            <tr>
                                <td style="width: 22px; vertical-align: top;">{{ index + 1 }}.</td>
                                <td style="width: auto;" :class="{deleted: data.delete}">{{ data.info }} <span v-if="data.delete">(deleted)</span></td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('up', index, docInfo.case_info.consequences)">&uarr;</button>
                                </td>
                                <td style="width: 22px;"><button class="move"
                                        @click.prevent="moveItem('down', index, docInfo.case_info.consequences)">&darr;</button>
                                </td>
                                <td v-if="!data.delete" style="width: 22px;"><button class="delete"
                                        @click.prevent="deleteItem(index, docInfo.case_info.consequences)">X</button></td>
                                <td v-else style="width: 22px;"><button class=""
                                        @click.prevent="undoDelete(index, docInfo.case_info.consequences)">&#x21A9;</button></td>
                            </tr>
                        </template>
                    </table>
                    <p v-else>Nothing Listed</p>
                    <div>
                        <input type="text" name="" v-model="tempConsequences"
                            @keypress.prevent.enter="addItem('c', 'consequences', tempConsequences)">
                        <button @click.prevent="addItem('c', 'consequences', tempConsequences)">Add
                            Consequence</button>
                    </div>
                </div>
                <!-- <button type="submit">Make PDF</button> -->
            </div>
        </form>
        <!-- <PSPDFKit v-if="showPDF" :documentUrl="blobUrl"></PSPDFKit> -->
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
    mapMutations
} from 'vuex'


export default {
    props: {
        currentCase: Object,
        enclosures: Array,
        currentVersion: Object,
        // lAdjuster: String
    },
    data() {
        return {
            // docInfo: {},
            counter: 0,
            render: false,
            showInput: true,
            showEdit: false,
            showPDF: false,
            tempInclude: '',
            tempBackground: '',
            tempLiability: '',
            tempCare: '',
            tempDiagnosis: {
                d: null,
                p: 0,
                date: null
            },
            tempOtherMeds: '',
            tempFutureMeds: '',
            tempLostWages: '',
            tempPain: '',
            tempDisfigurement: '',
            tempPhysLimits: '',
            tempConsequences: '',
            blobUrl: '',
            errors: {
                repName: null,
                companyName: null,
                repEmail: null,
                repFax: null,
                repAddress: null,
                address2: null,
                liable: null,
                claim: null,
                clientFirst: null,
                clientLast: null,
                dateOfInjury: null,
                daysUntilDeadline: null,
                perPersonLimits: null,
                perAccidentLimits: null,
                pastBills: null,
                futureBills: null,
                daysUntilDeadline: null,
                demand: null
            },
            selectedReps: []
        }
    },
    computed: {
        ...mapGetters([
            'docInfo',
            'getClient',
            'getLiable',
        ]),
        pronouns() {
            let pronoun = {}
            if (this.getClient.gender === 'M') {
                pronoun = {
                    denote: 'him',
                    denote2: 'he',
                    possess: 'his'
                }
            } else {
                pronoun = {
                    denote: 'her',
                    denote2: 'she',
                    possess: 'her'
                }
            }
            return pronoun
        },
        // getClient() {
        //     var client = this.currentCase.party.find(p => {
        //         return p.party_type.id === 1
        //     })
        //     return client ? client : {}
        // },
        // getLiable() {
        //     var liable = this.currentCase.party.find(p => {
        //         return p.party_type.id === 2
        //     })
        //     return liable ? liable : {}
        // },
        clientFullName() {
            return `${this.getClient.first_name} ${this.getClient.last_name}`
        },
        policyLimitsDemand: {
            get() {
                return this.docInfo.case_data.policy_limits_demand === 'true' ? true : false
            },
            set(val) {
                this.docInfo.case_data.policy_limits_demand = val ? 'true' : 'false'
            }
        }
        // docInfo() {
        //     return this.currentCase.data
        // }
    },
    methods: {
        ...mapActions([
            'generateDoc',
            'fetchDocInfo',
            'updateDocInfo',
        ]),
        ...mapMutations([
            'setProcessing'
        ]),
        echo(data) {
            console.log(data)
        },
        setReps() {
            this.selectedReps = this.docInfo.insurance.find(i => i.id == this.getLiable.insurance_company_id).reps
            // this.docInfo.case_data.recipient_id = 0

        },
        moneyFormat(n) {
          var number = Number(n)
          var formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
          });
          return formatter.format(number)
        },
        dateFormat(dt) {
            let d = new Date(dt);
            let day = Number(new Intl.DateTimeFormat('en', {
                day: '2-digit'
            }).format(d)) + 1;
            let month = new Intl.DateTimeFormat('en', {
                month: 'long'
            }).format(d);
            let year = new Intl.DateTimeFormat('en', {
                year: 'numeric'
            }).format(d);
            return `${month} ${day}, ${year}`
        },
        sqlDate(d) {
            var date;
            date = new Date(d);
            date = date.getUTCFullYear()         + '-' +
                pad(date.getUTCMonth() + 1)  + '-' +
                pad(date.getUTCDate())
        },
        saveDoc(){
            var data = {
                ...this.docInfo,
                enclosures: this.enclosures ? [...this.enclosures] : false
            }
            // return console.log(data)
            data.document_category_id = 1
            data.case_id = this.currentCase.id
            this.updateDocInfo(data).then(() => {
                this.setProcessing({processing: true, finished: true, message: 'Saved!'})
            }).catch(err => {
                this.setProcessing({processing: true, finished: true, error: err})
            })
        },
        previewDoc() {
            window.open(`https://www.zaf.local/api/get-generated/${this.currentVersion.generated}`)
        },
        diagnosisDate(dt) {
            let d = new Date(dt);
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
        },
        addItem(type, specificArray, tempItem) {
            // return console.log(559,this.docInfo.case_info[specificArray])
            if(!this.docInfo.case_info[specificArray]) {
                this.docInfo.case_info[specificArray] = []
            }
            if (tempItem) {
                if (!this.docInfo.case_info[specificArray].find($i => {
                    return $i.info === tempItem
                })) {
                    this.docInfo.case_info[specificArray].push({info: tempItem})
                }
                switch (type) {
                    case 'i':
                        this.tempInclude = ''
                        break;
                    case 'b':
                        this.tempBackground = ''
                        break;
                    case 'l':
                        this.tempLiability = ''
                        break;
                    case 'is':
                        this.tempCare = ''
                        break;
                    case 'm':
                        this.tempOtherMeds = ''
                        break;
                    case 'fm':
                        this.tempFutureMeds = ''
                        break;
                    case 'lw':
                        this.tempLostWages = ''
                        break;
                    case 'ps':
                        this.tempPain = ''
                        break;
                    case 'dis':
                        this.tempDisfigurement = ''
                        break;
                    case 'pl':
                        this.tempPhysLimits = ''
                        break;
                    case 'c':
                        this.tempConsequences = ''
                        break;
                }
            }
        },
        addDiagnosis(d) {
            let newProvider = this.docInfo.providers.find(p => {
                return p.id === d.p
            }).name
            let data = {
                date_of_service: d.date,
                diagnosis: d.d,
                provider: newProvider,
                provider_id: d.p
            }
            this.docInfo.case_diagnoses.push(data)
            this.tempDiagnosis = {
                d: null,
                p: 0,
                date: null
            }
        },
        deleteItem(index, specificArray) {
            // return console.log(e)
            specificArray[index].delete = true
            var temp = specificArray[index]
            specificArray.splice(index, 1, temp)
        },
        undoDelete(index, specificArray) {
            // return console.log(e)
            specificArray[index].delete = false
            var temp = specificArray[index]
            specificArray.splice(index, 1)
            specificArray.splice(index, 0, temp)
        },
        moveItem(direction, index, specificArray) {
            // console.log(direction, index, specificArray[index])
            // return
            var tempItem = specificArray[index]
            if (direction == 'up') {
                if ((index - 1) >= 0) {
                    specificArray.splice(index, 1)
                    specificArray.splice(index - 1, 0, tempItem)
                } else {
                    specificArray.splice(index, 1)
                    specificArray.push(tempItem)
                }
            } else if (direction == 'down') {
                if ((index + 1) < (specificArray.length)) {
                    specificArray.splice(index, 1)
                    specificArray.splice(index + 1, 0, tempItem)
                } else {
                    specificArray.splice(index, 1)
                    specificArray.unshift(tempItem)
                }
            } else {
                console.log('no direction defined')
            }
            return specificArray
        },
        generatePDF() {
            let errors = false
            this.showEdit = false

            // if (!this.getLiable.insurance_company.name || this.getLiable.insurance_company.name == '') {
            //     this.errors.companyName = 'Please include a company name'
            //     errors = true
            // } else {
            //     this.errors.companyName = null
            // }

            // if (!this.getLiable.insurance_company.address || this.getLiable.insurance_company.address == '') {
            //     this.errors.repAddress = 'Please include an address'
            //     errors = true
            // } else {
            //     this.errors.repAddress = null
            // }

            // if (!this.getLiable.insurance_company.city || this.getLiable.insurance_company.city == '' || !this.getLiable.insurance_company.state || this.getLiable.insurance_company.state == '' || !this.getLiable.insurance_company.zip || this.getLiable.insurance_company.zip == '') {
            //     this.errors.address2 = 'Please include a city, state, and zip code'
            //     errors = true
            // } else {
            //     this.errors.address2 = null
            // }

            // if (!this.getLiable.first_name || this.getLiable.first_name == '') {
            //     this.errors.liable = 'Please include a Liable party'
            //     errors = true
            // } else {
            //     this.errors.liable = null
            // }

            if (!this.docInfo.case_data.claim_number || this.docInfo.case_data.claim_number == '') {
                this.errors.claim = 'Please include a claim number'
                errors = true
            } else {
                this.errors.claim = null
            }

            // if (!this.getClient.first_name || this.getClient.first_name == '') {
            //     this.errors.clientFirst = 'Please include your client\'s first name'
            //     errors = true
            // } else {
            //     this.errors.clientFirst = null
            // }

            // if (!this.getClient.last_name || this.getClient.last_name == '') {
            //     this.errors.clientLast = 'Please include your client\'s last name'
            //     errors = true
            // } else {
            //     this.errors.clientLast = null
            // }

            // if (!this.currentCase.date_of_injury || this.currentCase.date_of_injury == '') {
            //     this.errors.dateOfInjury = 'Please include the date of injury'
            //     errors = true
            // } else {
            //     this.errors.dateOfInjury = null
            // }

            if (!this.docInfo.case_data.days_until_deadline || this.docInfo.case_data.days_until_deadline == '') {
                this.errors.daysUntilDeadline = 'Please include a deadline'
                errors = true
            } else {
                this.errors.daysUntilDeadline = null
            }

            if (!this.docInfo.case_data.per_person_limits || this.docInfo.case_data.per_person_limits == '') {
                this.errors.perPersonLimits = 'Please include limits per person'
                errors = true
            } else {
                this.errors.perPersonLimits = null
            }

            if (!this.docInfo.case_data.per_accident_limits || this.docInfo.case_data.per_accident_limits == '') {
                this.errors.perAccidentLimits = 'Please include limits per accident'
                errors = true
            } else {
                this.errors.perAccidentLimits = null
            }

            if (!this.docInfo.case_data.past_med_bills || this.docInfo.case_data.past_med_bills == '') {
                this.errors.pastBills = 'Please include past medical bills'
                errors = true
            } else {
                this.errors.pastBills = null
            }

            if (!this.docInfo.case_data.future_med_bills|| this.docInfo.case_data.future_med_bills== '') {
                this.errors.futureBills = 'Please include estimated future medical bills'
                errors = true
            } else {
                this.errors.futureBills = null
            }

            if (!this.docInfo.case_data.demand_amount || this.docInfo.case_data.demand_amount == '' || this.docInfo.case_data.demand_amount <= 0) {
                this.errors.demand = 'Please include a valid demand amount'
                errors = true
            } else {
                this.errors.demand = null
            }

            if (!errors) {

                var data = {
                    ...this.docInfo.case_data,
                    ...this.docInfo.case_info,
                    diagnoses: [...this.docInfo.case_diagnoses],
                    client: {...this.getClient},
                    liable: {...this.getLiable},
                    pronouns: {...this.pronouns},
                    liability_adjuster: this.getLiable.assigned_rep[0].rep,
                    date_of_injury: this.currentCase.date_of_injury,
                    enclosures: this.enclosures ? [...this.enclosures] : false,
                    version: this.currentVersion.version,
                    version_id: this.currentVersion.id,
                    case: this.currentCase.name,
                    case_id: this.currentCase.id
                }
                data.policy_limits_demand = this.docInfo.policy_limits_demand ? 'true' : 'false'
                data.per_person_limits = this.moneyFormat(data.per_person_limits)
                data.per_accident_limits = this.moneyFormat(data.per_accident_limits)
                data.demand_amount = this.moneyFormat(data.demand_amount)
                data.past_med_bills = this.moneyFormat(data.past_med_bills)
                data.future_med_bills = this.moneyFormat(data.future_med_bills)
                data.lost_wages = this.moneyFormat(data.lost_wages)
                // return console.log(data)
                this.setProcessing({processing: true, finished: false, message: 'Processing...'})
                this.generateDoc(data).then(res => {
                    this.setProcessing({processing: true, finished: true, message: 'Finished!'})
                    window.open(`https://www.zaf.local/api/get-generated/${res}`)
                }).catch(err => {
                    this.setProcessing({processing: true, finished: true, error: err})
                })
            }
        },
    },
    created() {
        this.fetchDocInfo(this.currentCase.id).then(() => {
            if(this.getLiable.insurance_company_id) {
                this.setReps()
            }
            this.render = true
        })
    }
}
</script>

<style lang="scss" scoped>
.content {
    text-align: center;
    width: 100%;
}

h4 {
    margin: 0;
    margin-top: 70px;
}

li {
    text-align: left;
}

p.error {
    color: #dc3545;
    margin: 5px 0 0 0;
}

.input-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.input-column {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    margin: 0 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    margin-bottom: 25px;
    width: 250px;
    min-height: 50px;
}

.input-group label {
    margin-bottom: 3px;
    text-align: left;
    width: 100%;
}

.input-group input {
    width: 100%;
}

.radio-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    justify-self: center;
}

.address2 {
    display: flex;
    justify-content: space-between;
    align-content: flex-end;
}

.address2 input {
    /* width: 100%; */
    width: calc((100%/3) - 10px);
}

.split {
    display: flex;
    justify-content: space-between;
    align-content: flex-end;
    input {
        width: calc((100%/2) - 10px);
    }
}

.radio-group {
    /* width: 100px; */
    display: flex;
}

.radio-group input {
    width: auto;
    margin-right: 10px;
}

form {
    padding: 50px;
}

.edit-group {
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.edit-group input {
    width: 300px;
}

.edit-group p {
    margin: 5px;
}

table {
    width: 720px;
    margin: 30px 0;
}

table td {
    text-align: left;
    padding: 5px;
    &.deleted {
        opacity: 0.5;
        span {
            opacity: 1;
        }
    }
}

button,
input[type='submit'] {
    cursor: pointer;
}

td button.delete {
    color: white;
    background-color: #f30;
}

td button.delete:hover {
    background-color: #c00;
}

table.diagnoses {
    border-collapse: collapse;
    width: 800px;
}

table.diagnoses td {
    border: 2px solid black;
}

.addDiagnosis input {
    width: 200px;
    margin: 0 5px;
}

.saveDoc {
    position: sticky;
    top: 200px;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    //   z-index: -1;
    z-index: 999;
    pointer-events: none;

    .saveBtn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background-color: gray;
        border-radius: 5px 0 0 5px;
        width: 150px;
        button {
            cursor: pointer;
            pointer-events: all;
        }
    }

    .processing {
        background-color: gray;
        color: white;
        padding: 0 10px;
        border-radius: 0 5px 5px 0;
        max-width: 150px;
    }
}
</style>
