<template>
    <div class="cartItem_wrapper">
<!--        <Checkbox value="this.checkedValue" v-model>-->
            <div class="cover_wrapper">
                <img class="cover" v-bind:src="this.cover">
            </div>
            <!--        v-bind:src="this.cover"-->
            <div class="info">
                <h2 class="name">{{this.name}}</h2>
                <p class="restInfo">{{this.language}}/{{this.author}}</p>

            </div>

            <div class="control">
                <button class="inc" @click="inc">+</button>
                <span class="quantity">{{this.quantity}}</span>
                <button class="dec" @click="dec">-</button>

            </div>
            <span class="price">$ {{this.quantity * this.price}}</span>
            <button class="del" @click="del">x</button>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'CartItem',
        props: ["itemInfo"],
        data(){
            return{
                bookId: this.itemInfo.bookId,
                quantity: this.itemInfo.quantity,
                name: null,
                price: null,
                cover: null,
                author: null,
                language: null,
                stock: null,
                userId: localStorage.getItem('UserId'),
            }
        },
        created() {
            let _this = this;
            axios.get("http://localhost:8080/book/getBook", {
                params: {
                    bookId: this.bookId
                }
            })
                .then(response => {
                    _this.name = response.data.name;
                    _this.price = response.data.price;
                    _this.cover = response.data.bookColl.bookCover;
                    _this.author = response.data.author;
                    _this.language = response.data.language;
                    _this.stock = response.data.stock;
                });
        },
        methods: {
            inc() {
                if(this.quantity < this.stock)
                    this.quantity += 1;
                else
                    alert("We currently don't have that much in stock.");
            },
            dec() {
                this.quantity -= 1;
            },
            del() {
                this.quantity = 0;
            }
        },
        watch:{
            quantity(newVal){
                this.quantity = newVal;

                axios.get("http://localhost:8080/cart/updateCart", {
                    params: {
                        userId: this.userId,
                        bookId: this.bookId,
                        quantity: newVal
                    }
                })
                .then(response => {
                    let fetchCart = JSON.stringify(response.data);
                    localStorage.removeItem('Cart');
                    localStorage.setItem('Cart', fetchCart);

                    if(newVal !== 0)
                        this.$emit('reCalc', 0);
                    else
                        this.$emit('reCalc', 1);

                });
            }
        },
        component:{
        }
    }
</script>

<style>
    @import '../assets/css/cartItem.css';
</style>
