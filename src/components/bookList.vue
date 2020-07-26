<template>
    <div class="bookList_wrapper">
        <div v-bind:key="bookInfo.id" v-for="bookInfo in filteredBooks">
            <Book v-bind:bookInfo="bookInfo"/>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Book from './book.vue';

    export default {
        name: "BookList",
        props: ["passInput"],
        components: {
            Book
        },
        computed: {
            filteredBooks: function () {
                return this.bookInfos.filter((bookInfo) => {
                    return bookInfo.name.toLowerCase().match(this.passInput.filterInput);
                });
            }
        },
        data() {
            return {
                bookInfos: []
            }
        },
        created(){
            axios.get("http://localhost:8080/book/getBooks")
            .then(response => {
                this.bookInfos = response.data;
            });
        },
    }
</script>

<style scoped>
    @import '../assets/css/bookList.css';
</style>
