<template>
    <div>
        <div class="overline">{{label}}</div>
        <v-input
                :readonly="readonly"
                :hide-details="hideDetails"
                v-model="value"
                :rules="[...rules,dateFilled]"
                :dense="dense"
                :error.sync="error"
                :error-messages="errorMessages"
                :persistent-hint="persistentHint"
                :hint="hint">
            <v-row>
                <v-col cols="6">
                    <v-text-field
                            required
                            label="Datum"
                            ref="day"
                            :readonly="readonly"
                            v-model="day"
                            :error="error"
                            hide-details
                            :dense="dense"
                            :filled="filled"
                            :outlined="outlined"
                            @focusout="leaveInput"
                            @focus="enterInput"
                            @blur="sendInput"
                            type="date"/>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                            required
                            label="Zeit"
                            ref="time"
                            :readonly="readonly"
                            v-model="time"
                            :error="error"
                            hide-details
                            :dense="dense"
                            :filled="filled"
                            :outlined="outlined"
                            @focusout="leaveInput"
                            @focus="enterInput"
                            @blur="sendInput"
                            type="time">
                        <template v-if="clearable && !readonly" #append-outer>
                            <v-btn
                                    icon
                                    :disabled="!value"
                                    @click="clear"
                            >
                                <v-icon v-if="value">mdi-close</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>
                </v-col>
            </v-row>
        </v-input>
    </div>
</template>

<script>
    export default {
        name: "DatetimeInput",
        props: {
            value: String,
            readonly: Boolean,
            hideDetails: Boolean,
            dense: Boolean,
            filled: Boolean,
            outlined: Boolean,
            clearable: Boolean,
            persistentHint: Boolean,
            hint: String,
            label: String,
            rules: Array,
        },
        data() {
            return {
                day: null,
                time: null,
                error: false,
                errorMessages: "",

                dateFilled: v => this.checkBothFieldsFilled() || 'Datum und Zeit muss ausgefüllt werden'
            }
        },
        mounted() {
            this.parseValue()
        },
        watch: {
            'value': function () {
                this.parseValue();
            }
        },
        methods: {
            clear() {
                this.errorMessages = "";
                this.time = null;
                this.day = null;
                this.$emit('input', this.getDate())
            },
            getDate() {
                if (this.day && this.time) {
                    this.error = false;
                    this.errorMessages = "";
                    return new Date(this.day + 'T' + this.time).toISOString()
                }

                return null;
            },
            parseValue() {
                if (this.value) {
                    let newDate = new Date(this.value);
                    this.day = this.parseDay(newDate);
                    this.time = this.parseTime(newDate);
                } else {
                    this.day = null;
                    this.time = null;
                }
            },
            parseDay(timestamp) {
                return timestamp.toISOString().replace(/T.*/, '');
            },
            parseTime(timestamp) {
                return timestamp.toLocaleTimeString(navigator.language, {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },
            leaveInput() {
                if(! this.checkBothFieldsFilled()) {
                    this.error = true;
                    this.errorMessages = "Datum und Zeit muss ausgefüllt werden"
                }
            },
            enterInput() {
                if(! this.checkBothFieldsFilled()) {
                    this.error = false;
                    this.errorMessages = ""
                }
            },
            sendInput() {
                if(this.checkBothFieldsFilled()) {
                    this.$emit('input', this.getDate())
                }
            },
            checkBothFieldsFilled() {
                return !!(this.time && this.day) || (!this.time && !this.day)
            }
        }
    }
</script>