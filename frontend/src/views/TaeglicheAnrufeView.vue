<template>
    <v-container>

        <calling-popup :type="TYPE_DAILYGESPRAECH" @save="savePerson" @saveAndEdit="savePersonAndEdit" ref="popup" v-model="selectedPersonToCall"></calling-popup>

        <v-card flat>
            <div class="headline">Tägliche Anrufe der Indexpersonen</div>
            <v-card class="mt-4" outlined>
                <v-card class="pb-4" flat>
                    <v-row justify="center">
                        <v-col class="pt-0" md="12">
                            <v-progress-linear
                                :color="getColor(dailyCallReportPercentage)"
                                :value="dailyCallReportPercentage"
                                :indeterminate="Object.keys(this.dailyCallReport).length === 0"
                                height="25"
                                >
                                <template v-if="Object.keys(this.dailyCallReport).length > 0" v-slot="">
                                    <b id="dailycallview-text-fortschritt" style="color: white; text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;">{{dailyCallReport.dailyCallsTotal - dailyCallReport.dailyCallsTodo}} von {{dailyCallReport.dailyCallsTotal}} aller täglichen Anrufe erledigt</b>
                                </template>
                            </v-progress-linear>
                        </v-col>
                    </v-row>
                    <v-row  justify="center">
                        <v-col cols="12" md="4">
                            <v-btn
                                id="dailycallview-btn-callNextIndex"
                                @click="callNextIndex"
                                color="primary"
                                raised
                                block
                                :loading="loadingNext"
                            >
                                <v-icon left>mdi-phone</v-icon> Nächste freie Index-Person anrufen
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row
                        v-if="loadingNextDailyCalls"
                        class="fill-height"
                        align-content="center"
                        justify="center"
                    >
                        <v-col class="subtitle-1 text-center" cols="12">
                        Lade Daten....
                        </v-col>
                        <v-col cols="6">
                            <v-progress-linear
                                    indeterminate
                                    rounded
                                    height="6"
                            ></v-progress-linear>
                        </v-col>
                    </v-row>
                    <call-personen-table id="dailycallview-callPersonenTable" v-model="nextDailyCalls" v-if="!loadingNextDailyCalls"></call-personen-table>
                </v-card>
            </v-card>
        </v-card>
    </v-container>
    

</template>

<script lang="ts">
    // libs
    import {Component, Vue, Watch} from 'vue-property-decorator';
    // components
    import CallPersonenTable from '@/components/call/CallPersonenTable.vue'
    import CallingPopup from '@/components/call/CallingPopup.vue'
    // types
    import DailyCallReport from '@/types/DailyCallReport';
    import Person, { Quarantäne } from '@/types/Person';
    import PersonService from '../api/PersonService';
    import BerichtService from '../api/BerichtService';
    import {Gespraeche} from "@/types/Gespraeche";

    // statics
    export const TYPE_DAILYGESPRAECH : string = Gespraeche.Index.toLowerCase();

    @Component({
        name: "TelefonierView",
        components: {CallingPopup, CallPersonenTable}
    })
    export default class TelefonierView extends Vue {
        // static
        TYPE_DAILYGESPRAECH : string = TYPE_DAILYGESPRAECH;
        // models
        selectedPersonToCall : Person = {quarantaene: {}} as Person;
        nextDailyCalls : Person[] = [];
        dailyCallReport : DailyCallReport = {} as DailyCallReport;
        //progressindicators
        loadingNextDailyCalls : boolean = false;
        loadingNext : boolean = false;

        get dailyCallReportPercentage() {
            if(Object.keys(this.dailyCallReport).length) {
                const toCall = this.dailyCallReport.dailyCallsTodo;
                const total = this.dailyCallReport.dailyCallsTotal;
                const called = total - toCall;
                return called / (total/100);
            } else {
                return -1
            }
        }


        mounted() {
            this.loadNextCalls();
        }

        savePerson(person : Person) {
            this.loadingNext = true;
            PersonService.updateCalledPerson(person)
              .then((resp) => {
                  this.$store.dispatch('snackbar/showMessage', {message: "Person wurde erfolgreich gespeichert."});
              })
              .catch((error) => this.$store.dispatch('snackbar/showMessage', error))
              .finally(() => {
                  this.loadingNext = false;
                  this.loadNextCalls();
              });
        }

        savePersonAndEdit(person : Person) {
            this.loadingNext = true;
            PersonService.updateCalledPerson(person)
              .then((resp) => {
                  this.$store.dispatch('snackbar/showMessage', {message: "Person wurde erfolgreich gespeichert."});
              })
              .catch((error) => this.$store.dispatch('snackbar/showMessage', error))
              .finally(() => {
                  this.loadingNext = false;
                  this.$router.push(`/edit/${person.id}`);
              });
        }

        callNextIndex() {
            this.loadingNext = true;
            PersonService.getNextDailyCall()
                .then(person => {
                    this.openCall(person);
                })
                .catch((error) => this.$store.dispatch('snackbar/showMessage', error))
                .finally(() => this.loadingNext = false)
        }

        openCall(person:Person) {
            this.selectedPersonToCall = person;
            (this.$refs.popup as any).open();
        }

        getColor(progressIndex:number) : string{
            if(progressIndex < 0) {
                return "primary"
            } else if(progressIndex < 25) {
                return "red";
            } else if(progressIndex < 50) {
                return "orange"
            } else if(progressIndex < 75) {
                return "lime"
            } else if(progressIndex < 100) {
                return "light-green";
            } else if(progressIndex === 100) {
                return "green";
            }
            return "primary";
        }

        loadNextCalls() {
            this.dailyCallReport = {} as DailyCallReport;
            this.loadingNextDailyCalls = true;

            var promises : Promise<any>[] = [];

            promises.push(
                BerichtService.getDailyCallStatistik()
                    .then((dailyCallReport) => this.dailyCallReport = dailyCallReport)
            );

            promises.push(
                PersonService.getIndexPersonenOhneBearbeiterNichtKontaktiert()
                    .then(resp => {
                        this.nextDailyCalls = resp;
                    })
                    .catch(err => this.$store.dispatch('snackbar/showMessage', err))
            );

            Promise.all(promises)
                .finally(() => {
                    this.loadingNextDailyCalls = false;
                });
        }
    }
</script>
