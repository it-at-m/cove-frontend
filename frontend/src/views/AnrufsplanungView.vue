<template>
    <v-container>
        <v-card flat>
            <div class="headline">Anrufsplanung</div>
            <v-form ref="form" class="py-4">
                <v-row>
                    <v-col cols="12" md="5">
                        <v-text-field
                                id="anrufsplanungview-textfield-anzahl"
                                filled
                                dense
                                outlined
                                v-model="anzahl"
                                label="Anzahl"
                                :rules="[rules.required, rules.anzahl]"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="5">
                        <v-text-field
                                id="anrufsplanungview-textfield-sicherheitscode"
                                filled
                                dense
                                outlined
                                v-model="secCode"
                                label="Sicherheitscode"
                                :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" md="2">
                        <v-btn
                                id="anrufsplanungview-btn-generieren"
                                :disabled="!maxAnzahl"
                                @click="blockPersons"
                                :loading="loading"
                                color="primary">
                            <v-icon left dark>mdi-download-multiple</v-icon>Anrufliste generieren</v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-subheader class="subtitle-1" v-if="maxAnzahl > 0">Die maximale Anzahl für den nächsten Tag ist: {{maxAnzahl}}</v-subheader>
            <v-subheader class="subtitle-1" v-else-if="maxAnzahl === 0 && planungsdate">Für das ausgewählte Datum {{formatDate(this.planungsdate)}} stehen keine Personen auf der Telefonliste.</v-subheader>

            <call-disposition-personen-table v-model="personsToCall"></call-disposition-personen-table>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        id="anrufsplanungview-btn-export"
                        :disabled="!personsToCall || personsToCall.length === 0"
                        @click="csvExport"
                        color="primary">
                    <v-icon left dark>mdi-file-download</v-icon>Exportieren</v-btn>
            </v-card-actions>
        </v-card>
        <yes-no-dialog
                id="anrufsplanungview-yesnodialog"
                ref="saveLeaveDialog"
                dialogtitle="Ungespeicherter Export"
                dialogtext="Die Daten wurden nicht exportiert. Sind sie sich sicher, dass sie die Seite verlassen wollen?"
                v-model="saveLeaveDialog"
                @yes="leave"
                @no="cancel"
        >
        </yes-no-dialog>
    </v-container>

</template>

<script lang="ts">
    // libs
    import {Component, Watch} from 'vue-property-decorator';
    // components
    import CallDispositionPersonenTable from '@/components/call/CallDispositionPersonenTable.vue'
    // types
    import Person from '@/types/Person';
    import PersonService from '../api/PersonService';
    import moment from "moment";
    import Formatter from "@/mixins/formatter";
    import YesNoDialog from "@/components/Common/YesNoDialog.vue";
    import {Levels} from '@/api/error';

    export const SECURITY_CODE:string = "683745";

    @Component({
        name: "AnrufsplanungView",
        components: {CallDispositionPersonenTable,YesNoDialog},
        mixins: [Formatter]
    })
    export default class AnrufsplanungView extends Formatter {

        planungsdate: Date = moment().add(1, "days").toDate();
        personsToCall:Person[] = [];
        anzahl: Number | null = null;
        secCode: string = "";
        maxAnzahl: number = -1;
        loading: boolean = false;
        exported: boolean | undefined;
        saveLeaveDialog:boolean = false;
        next:any = null;
        rules:any = {
            required: (v:string) => !!v || 'Eingabe ist erforderlich',
            anzahl: (v:number) => !v || (v > 0 && v < 1000) || "Anzahl muss zwischen 0 und 1000 liegen",
            inFuture: (v:string) => !v || moment(v).isAfter(moment.now()) || "Datum muss in der Zukunft liegen"
        };

        mounted() {
            this.planungsdateChanged();
        }

        beforeRouteLeave (to:any, from:any, next:any) {
            if(this.exported === false) {
                this.saveLeaveDialog = true;
                this.next = next;
            } else {
                next()
            }
        }

        leave() {
            this.next();
        }

        cancel() {
            //erzwingt das Neuladen des Dialogs. Somit werden nicht gespeicherte Eingaben wieder zurückgesetzt.
            this.saveLeaveDialog = false;
            this.next(false);
        }

        @Watch("planungsdate", {deep:true})
        planungsdateChanged() {
            if(this.planungsdate){
                this.loading = true;
                PersonService.countEndgespraecheFuerDatum(this.planungsdate)
                    .then(count => {
                        this.maxAnzahl = count;
                    })
                    .catch(error => {
                        this.maxAnzahl = 0;
                        this.$store.dispatch('snackbar/showMessage', error)
                    })
                    .finally(() => this.loading=false);
            }
        }

        blockPersons() {
            let form = this.$refs.form as any;
            if(form.validate()) {
                if(this.secCode !== SECURITY_CODE) {
                    this.$store.dispatch('snackbar/showMessage', {level: Levels.WARNING, message: "Fehlerhafter Sicherheitscode." })
                    return;
                }
                this.loading = true;
                this.exported = false;
                PersonService.generateEndgespraechAnruferListeFuerDatum(this.planungsdate, this.anzahl)
                    .then(persons => {
                        this.personsToCall = persons;
                    })
                    .catch(error => {
                        this.personsToCall = [];
                        this.$store.dispatch('snackbar/showMessage', error)
                    })
                    .finally(() => this.loading=false);
            }
        }

        csvExport() {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += [
                ["Name", "Vorname", "Geburtsdatum", "Kategorie", "Telefon", "Mobil", "Letzter Kontakt",
                    "Strasse", "PLZ", "Ort", "Quarantaene seit", "Quarantaene bis", "Telefonnotizen", "Doku"
                ].join(";"),
                ...this.personsToCall.map(item => [
                    item.name, item.vorname, this.formatDate(item.geburtsdatum), item.kategorie, item.telefon, item.mobile, this.formatDateTime(item.letzterKontakt),
                    item.strasse, item.plz, item.ort, this.formatDate(item.quarantaene.start), this.formatDate(item.quarantaene.ende),
                    this.stringEscape(item.telefonnotizen),
                    this.stringEscape(item.doku)
                ].join(";"))
            ]
                .join("\n")
                .replace(/(^\[)|(\]$)/gm, "");

            const data = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", data);
            link.setAttribute("download", "export.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            this.exported = true;
        }

        stringEscape(s:string | undefined) : string | undefined {
            return s ? '"' + s + '"' : "";
        }

    }
</script>
