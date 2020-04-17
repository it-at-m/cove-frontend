<template>
    <v-dialog persistent v-model="active" max-width="1400px" min-width="800px">
        <v-card class="pb-8">
            <v-card-title>
                {{cardTitle}}
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-form ref="form">
                        <call-person-fields id="callingpopup-callPersonFields" :value="value"></call-person-fields>
                    </v-form>
                    
                    <v-row>
                        <v-col md="12">
                            <v-btn id="callingpopup-btn-erledigt" dark block color="green" @click="saveErledigt"><v-icon left>mdi-phone-check</v-icon>Erledigt</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-btn id="callingpopup-btn-verpasst" outlined block color="red" @click="saveMissed"><v-icon left>mdi-phone-missed</v-icon>nicht erreicht</v-btn>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-btn id="callingpopup-btn-erledigtUndBearbeiten" outlined block color="green" @click="saveErledigtAndEdit"><v-icon left>mdi-phone-message</v-icon>Erledigt & person bearbeiten</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
// libs
import {Component, Vue, Prop} from 'vue-property-decorator';
// components
import CallPersonFields from "./CallPersonFields.vue";
// types
import Person from '../../types/Person';
import moment from 'moment';
import {Gespraeche} from "@/types/Gespraeche";

// statics
export const TYPE_DAILYGESPRAECH : string = Gespraeche.Index.toLowerCase();
export const TYPE_ENDGESPRAECH : string = Gespraeche.End.toLowerCase();

@Component({
    name: "CallingPopup",
    components: {CallPersonFields}
})
export default class CallingPopup extends Vue {

    
    @Prop({required: true,})
    value!: Person;

    @Prop({type: String})
    type!:string;

    active: boolean = false;

    get cardTitle() {
        if(this.type === TYPE_DAILYGESPRAECH) {
            return "Tägliches Gespräch mit Indexperson";
        } else if(this.type === TYPE_ENDGESPRAECH) {
            return "Quarantäne Abschlussgespräch";
        } else {
            return "Person kontaktieren"
        }
    }

    saveErledigt() {
        this.emitEvent('save', this.getPersonErledigt());
    }

    saveErledigtAndEdit() {
        this.emitEvent('saveAndEdit', this.getPersonErledigt());
    }

    getPersonErledigt() : Person {
        let personToSave : Person = this.value;
        personToSave.aktuellerBearbeiter = null;
        personToSave.letzterKontakt = moment().endOf('day').toDate();
        if(this.type === TYPE_ENDGESPRAECH) {
            personToSave.endTelefonatErfolgtAm = moment().toDate();
        }
        return personToSave;
    }

    saveMissed() {
        let personToSave : Person = this.value;
        personToSave.aktuellerBearbeiter = null;
        personToSave.letzterKontakt = moment().add(1, 'hours').toDate();
        this.emitEvent("save", personToSave);
    }

    emitEvent(event:string, personToSave:Person) {
        this.$emit(event, personToSave);
        this.active = false;
    }

    open() {
        this.active = true;
    }
}
</script>

