<template>
    <div class="book_wrapper">
        <img class="cover" v-bind:src="bookInfo.bookColl.bookCover" @click="clickMethod(bookInfo.bookId)"/>
        <div class="info">
            <h3 class="name">{{bookInfo.name}}</h3>
            <span class="author">{{bookInfo.author}}</span><br/>
            <span class="price">$ {{bookInfo.price}}</span>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Book",
        props: ["bookInfo"],
        methods: {
            clickMethod(bookId) {
                this.$router.push({path: `/home/bookDetail/${bookId}`});
            },
        },
    }
</script>

<style scoped>
    @import '../assets/css/book.css';
</style>