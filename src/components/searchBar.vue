<template>
    <div class="search">
        <vue-simple-suggest
        :list = "inputSuggestion"
        >
            <input v-model="filterInput" v-on:keyup="showHint" @keyup.enter="passInput" class="input" type="text"
                   placeholder="What are you looking for?"/>
            <!-- Filter by input text to only show the matching results -->
        </vue-simple-suggest>
    </div>
</template>


<script type="text/javascript">
    import VueSimpleSuggest from 'vue-simple-suggest'
    import 'vue-simple-suggest/dist/styles.css'
    export default {
        name: "SearchBar",
        xmlHttpRequest: null,
        data() {
            return {
                filterInput: '',
                inputSuggestion:[],
            }
        },
        components:{
            VueSimpleSuggest
        },
        methods: {
            passInput(event) {
                event.preventDefault();
                const filterData = {
                    filterInput: this.filterInput
                };
                this.$router.push({path: `/home`});
                this.filterInput = '';
                this.inputSuggestion = [];
                this.$emit('pass-input', filterData);
            },

            showHint() {

                var xmlhttp;
                var $this = this;
                var str = $this.filterInput;

                if (str.length == 0) {
                    document.getElementById("txtHint").innerHTML = "";
                    return;
                }

                if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                } else {// code for IE6, IE5
                    xmlhttp = new window.ActiveXObject("Microsoft.XMLHTTP");
                }

                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        let suggestionTmp1 = (xmlhttp.responseText.split('['))[1];
                        let suggestionTmp2 = (suggestionTmp1.split(']'))[0];
                        let suggestionTmp3 = suggestionTmp2.split(',');
                        let finalSuggestion = [];
                        var i;
                        for (i = 0; i < suggestionTmp3.length; i++)
                        {
                            var first = suggestionTmp3[i].split('"')[1];
                            finalSuggestion.push(first);
                        }
                        $this.inputSuggestion = finalSuggestion;

                        console.log($this.inputSuggestion);
                    }
                };
                xmlhttp.open("GET", "http://localhost:8080/book/hint?q=" + str, true);
                xmlhttp.send();
            }
        }

    }

</script>

<style scoped>
    @import '../assets/css/searchBar.css';
    @import '~vue-simple-suggest/dist/styles.css';
</style>
