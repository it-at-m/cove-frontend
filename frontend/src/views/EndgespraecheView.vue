<template>
    <v-container>

        <calling-popup :type="TYPE_ENDGESPRAECH" @save="savePerson" @saveAndEdit="savePersonAndEdit" ref="popup" v-model="selectedPersonToCall"></calling-popup>

        <v-card flat>
            <div class="headline">Abschlussgespräche der {{personenBezeichnung}}</div>
            <v-card class="mt-4" outlined>
                <v-card flat>
                    <v-row  justify="center" align="center">
                        <v-col cols="8" md="2">
                            <v-text-field
                                    id="endgespraecheview-textfield-quarantaeneEndeAb"
                                    v-model="quarantaeneEndeAb"
                                    label="Quarantäne-Ende ab (Optional)"
                                    filled
                                    outlined
                                    dense
                                    hide-details
                                    type="date"
                            >
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-btn
                                id="endgespraecheview-btn-callnextEndgespraech"
                                @click="callNextEndgespraech"
                                color="primary"
                                raised
                                block
                                :loading="loadingNext"
                            >
                                <v-icon left>mdi-phone</v-icon> Nächstes Abschlussgespräch starten
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row
                        v-if="loadingEndgespraeche"
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
                    <call-personen-table 
                        id="endgespraecheview-callPersonenTable"
                        v-model="nextEndgespraeche"
                        v-if="!loadingEndgespraeche"></call-personen-table>
                </v-card>
            </v-card>
        </v-card>
    </v-container>
    

</template>

<script lang="ts">
    // libs
    import {Component, Vue, Watch } from 'vue-property-decorator';
    // components
    import CallPersonenTable from '@/components/call/CallPersonenTable.vue'
    import CallingPopup from '@/components/call/CallingPopup.vue'
    // types
    import DailyCallReport from '@/types/DailyCallReport';
    import Person, { Quarantäne } from '@/types/Person';
    import PersonService from '../api/PersonService';
    import BerichtService from '../api/BerichtService';
    import {Gespraeche} from "@/types/Gespraeche";
    import Kategorie from '../types/Kategorie';

    // statics
    export const TYPE_ENDGESPRAECH : string = Gespraeche.End.toLowerCase();

    @Component({
        name: "TelefonierView",
        components: {CallingPopup, CallPersonenTable}
    })
    export default class TelefonierView extends Vue {
        // static
        TYPE_ENDGESPRAECH : string = TYPE_ENDGESPRAECH;
        // models
        selectedPersonToCall : Person = {quarantaene: {}} as Person;
        nextEndgespraeche : Person[] = [];
        kategorieToCall : Kategorie = Kategorie.Index;
        quarantaeneEndeAb: Date | null = null;
        //progressindicators
        loadingEndgespraeche : boolean = false;
        loadingNext : boolean = false;

        mounted() {
            this.loadNextCalls();
        }

        @Watch('$route', { immediate: true, deep: true })
        onUrlChange(newVal: any) {
            let newKategorie : Kategorie = Kategorie[newVal.params.type as keyof typeof Kategorie];
            if(newKategorie === undefined) {
                newKategorie = Kategorie.Index;
            }
            this.kategorieToCall = newKategorie;
        }

        @Watch('quarantaeneEndeAb')
        onQuarantaeneEndeAbChange() {
            this.loadNextCalls();
        }

        get personenBezeichnung() {
            if(this.kategorieToCall == Kategorie.Index) {
                return "Indexpersonen";
            } else {
                return "Kontaktpersonen";
            }
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

        callNextEndgespraech() {
            this.loadingNext = true;
            PersonService.getNextEndgespraechCall(this.kategorieToCall, this.quarantaeneEndeAb)
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

        @Watch("kategorieToCall")
        loadNextCalls() {
            this.loadingEndgespraeche = true;
            PersonService.getPersonenFuerEndgespraech(this.kategorieToCall, this.quarantaeneEndeAb)
                .then(resp => {
                    this.nextEndgespraeche = resp;
                })
                .catch(err => this.$store.dispatch('snackbar/showMessage', err))
                .finally(() => {
                    this.loadingEndgespraeche = false;
                })
        }
    }
</script>
