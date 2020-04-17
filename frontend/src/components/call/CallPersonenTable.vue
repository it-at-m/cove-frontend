<template>
    <v-data-table id="callpersontable-table" :headers="tableHeaders" :items="value" hide-default-footer="">
        <template #item.erstKontaktErfolgtAm="{item}">{{formatDate(item.erstKontaktErfolgtAm)}}</template>
        <template #item.letzterKontakt="{item}">{{formatDateTime(item.letzterKontakt)}}</template>
        <template #item.quarantaene.start="{item}">{{formatDate(item.quarantaene.start)}}</template>
        <template #item.quarantaene.ende="{item}">{{formatDate(item.quarantaene.ende)}}</template>
        <template v-slot:no-data>Keine Daten vorhanden</template>
    </v-data-table>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Person from '../../types/Person';
import Formatter from "@/mixins/formatter";

@Component({
    mixins: [Formatter]
})
export default class CallPersonenTable extends Vue{
    @Prop()
    value!: Person[];

    tableHeaders = [
      { text: "Name", value: "vornameNachname", sortable: false },
      { text: "Erstkontakt am", value: "erstKontaktErfolgtAm", sortable: false },
      { text: "Zuletzt kontaktiert am", value: "letzterKontakt", sortable: false },
      { text: "In Quarantäne seit", value: "quarantaene.start", sortable: false },
      { text: "In Quarantäne bis", value: "quarantaene.ende", sortable: false },
    ];
}
</script>

