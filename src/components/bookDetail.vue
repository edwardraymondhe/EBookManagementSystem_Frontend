<template>
    <div class="bookDetail_wrapper">
        <div class="book">
            <img class="cover" v-bind:src="bookInfo.bookColl.bookCover"/>
            <div class="info">
                <h2 class="name">{{bookInfo.name}}</h2>
                <h4 class="intro">"{{bookInfo.bookColl.bookIntro}}"</h4>
                <p class="author">{{bookInfo.author}}</p><br/>
                <p class="category">{{bookInfo.category}}</p>
                <p class="price">Price:<br/>{{bookInfo.price}}</p>
                <p class="isbn">ISBN:<br/>{{bookInfo.isbn}}</p>
                <p class="stock">Stock:<br/>{{bookInfo.stock}}</p>

            </div>
        </div>
        <div class="option">
            <button class="add" @click="inc" v-if="this.bookInfo.stock > 0">ADD TO CART</button>
            <button class="add" v-else>NOT IN STOCK</button>
            <button class="buy" @click="notDone" >BUY NOW</button>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "bookDetail",
        data() {
            return {
                bookInfo:{}
            }
        },
        methods:{
            inc(){
                let cart = (JSON.parse(localStorage.getItem('Cart')));
                let flag = false;
                for(let i in cart)
                {
                    if(cart[i].bookId === this.bookInfo.bookId) {
                        console.log("cart");
                        console.log(cart[i].quantity);
                        console.log("stock");
                        console.log(this.bookInfo.stock);
                        if (cart[i].quantity === this.bookInfo.stock) {
                            alert("We currently don't have that much in stock.");
                            flag = true;
                        }
                    }
                }
                if(!flag) {
                    axios.get("http://localhost:8080/cart/updateCart", {
                        params: {
                            userId: localStorage.getItem('UserId'),
                            bookId: this.bookInfo.bookId,
                            quantity: -1
                        }
                    }).then(response => {
                        let fetchCart = JSON.stringify(response.data);
                        localStorage.removeItem('Cart');
                        localStorage.setItem('Cart', fetchCart);
                    });
                }
            },
            notDone(){
              alert("Sorry, you can't do that right now.");
            }
        },
        created() {
            axios.get("http://localhost:8080/book/getBook",{
                params:{
                    bookId: this.$route.params.bookId,
                }
            })
            .then(response => this.bookInfo = response.data);
        },
    }
</script>

<style scoped>
    @import '../assets/css/bookDetail.css';
</style>
