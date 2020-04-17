<template>
    <v-dialog
            :value="value"
            persistent
            width="800"
            :key="value"
            @input="changed"
    >
        <template #activator="{on}">
            <template v-if="buttontext !== undefined">
                <v-btn
                        color="primary"
                        v-on="on"
                >
                    {{buttontext}}
                </v-btn>
            </template>
            <template v-else-if="icontext !== undefined">
                <v-btn
                        text
                        color="primary"
                        v-on="on"
                >
                    <v-icon large>{{icontext}}</v-icon>
                </v-btn>
            </template>
        </template>
        <v-card>
            <v-card-title>
                {{dialogtitle}}
            </v-card-title>
            <v-card-text>
                {{dialogtext}}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        id="yesnodialog-btn-no"
                        text
                        @click="no"
                >
                    Nein
                </v-btn>
                <v-btn
                        id="yesnodialog-btn-yes"
                        color="primary"
                        @click="yes"
                >
                    Ja
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

    export default {
        name: 'YesNoDialog',
        components: {},
        props: {
            buttontext: {
                type: String
            },
            icontext: {
                type: String
            },
            dialogtitle: {
                type: String
            },
            value: {
                type: Boolean
            },
            dialogtext: {
                type: String
            }
        },
        methods: {
            no() {
                this.$emit('no')
            },
            yes() {
                this.$emit('yes')
            },
            changed(val) {
                this.$emit("input", val)
            }
        }
    }
</script>