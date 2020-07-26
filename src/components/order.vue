<template>
    <div class="order_wrapper">
        <div class="order_toolBar">

            <input class="toolBar_search" v-model="bookInput" v-on:keyup="showHint" @keyup.enter="fetchBook" type="text"
                   placeholder="What are you looking for?"/>

            <div class="toolBar_date">
                <DatePicker
                        mode='range'
                        v-model='range'
                />
                <button @click="dateRangeWithin">Confirm</button>
            </div>
            <button @click="showBookCnt">Book Ranking</button>
        </div>
        <div class="orderView_wrapper"  v-if="orders.length > 0">
            <div class="orderView" v-bind:key="item.purchaseId" v-for="item in orders">
                <OrderItem @reFetch="reFetch" v-bind:itemInfo="item"/>
            </div>
        </div>
        <div class="orderView_wrapper" v-else>
            <span class="warn">You don't have much history do you...?</span>
        </div>
        <modal name="bookCnt" height="800" width="900">
            <Chart :chartdata="bookCnt" :styles="chartStyles"/>
        </modal>
    </div>

</template>

<script>
    import OrderItem from './orderItem';
    import DatePicker from 'v-calendar/lib/components/date-picker.umd';
    import axios from "axios";
    import Chart from "@/components/chart";

    export default {
        name: "Order",
        props: ["passInput"],
        data() {
            return {
                orders: [],
                orderItems:[],
                orderBooks: new Map(),
                bookInput: '',
                inputSuggestion: '',
                books: [],
                range: {
                    start: new Date(),
                    end: new Date(),
                },
                bookCnt: null,
                showBook: false,
            }
        },
        created() {
            axios.get("http://localhost:8080/purchase/getPurchase", {
                    params:{
                        userId: localStorage.getItem('UserId')
                    }
                }
            )
                .then(response => {
                    let fetchOrder = JSON.stringify(response.data);
                    localStorage.setItem('Order', fetchOrder);
                    this.orders = (JSON.parse(localStorage.getItem('Order')));
                });
        },
        methods:{
            showBookCnt: function(){
                this.$modal.show('bookCnt');
            },
            genBookCnt: function () {
                let booksCount = new Map();
                let priceCount = new Map();
                let orderBooks = this.orderBooks;
                let orderItems = this.orderItems;
                for(let item of orderBooks.entries())
                {
                    for(let bookOrder of item[1])
                    {
                        for(let tmpOrder in orderItems)
                        {
                            if(orderItems[tmpOrder][0].purchaseId === bookOrder)
                            {
                                for(let tmpBook in orderItems[tmpOrder])
                                {
                                    if(orderItems[tmpOrder][tmpBook].bookId === item[0])
                                    {
                                        if(booksCount.has(item[0]))
                                        {
                                            booksCount.set(item[0], booksCount.get(item[0]) + orderItems[tmpOrder][tmpBook].quantity);
                                            priceCount.set(item[0], priceCount.get(item[0]) + orderItems[tmpOrder][tmpBook].quantity * orderItems[tmpOrder][tmpBook].price);
                                        }else{
                                            booksCount.set(item[0], orderItems[tmpOrder][tmpBook].quantity);
                                            priceCount.set(item[0], orderItems[tmpOrder][tmpBook].quantity * orderItems[tmpOrder][tmpBook].price);
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                console.log(priceCount);
                let priceCntArr = Array.from(priceCount);
                priceCntArr.sort(function(a,b){return b[1]-a[1]});
                console.log(priceCntArr);
                let priceRes = new Map(priceCntArr.map(i => [i[0], i[1]]));
                let booksCntArr = new Array();
                let totalPrice = 0;
                let totalAmount = 0;
                for(let priceTmp of priceRes.entries())
                {
                    let tmp = [priceTmp[0], booksCount.get(priceTmp[0])];
                    booksCntArr.push(tmp);
                    totalPrice += priceTmp[1];
                    totalAmount += booksCount.get(priceTmp[0]);
                }
                let priceLabel = 'You\'ve spent $' + (totalPrice).toString() + ' on ' + (totalAmount).toString() + ' books';

                let booksRes = new Map(booksCntArr.map(i => [i[0], i[1]]));
                let labels = Array.from(booksRes.keys());
                // let priceData = Array.from(priceRes.values());
                let booksData = Array.from(booksRes.values());
                this.bookCnt = {
                    labels: labels,
                    datasets:[
                        {
                            label: priceLabel,
                            backgroundColor: '#dcd48f',
                            data: booksData
                        }
                    ]
                }
            },
            async dateRangeWithin(){
                let s= new Date(this.range.start);
                let e = new Date(this.range.end);
                let sf = s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate();
                let ef = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + (e.getDate()+1);
                axios.get("http://localhost:8080/purchase/getPurchaseByUserIdAndByRange", {
                    params:{
                        userId: localStorage.getItem('UserId'),
                        startDate: sf,
                        endDate: ef
                    }
                })
                    .then(response => {
                        console.log(response.data);
                        let fetchOrder = JSON.stringify(response.data);
                        localStorage.setItem('Order', fetchOrder);
                        this.orders = (JSON.parse(localStorage.getItem('Order')));
                    });
            },
            reFetch(){
                this.orders = (JSON.parse(localStorage.getItem('Order')));
            },
            showHint() {
                var xmlhttp;
                var $this = this;
                var str = $this.bookInput;

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
            },
            async fetchBook(){
                let _this = this;
                let orderList = [];
                await _this.dateRangeWithin();

                setTimeout(()=>{
                    axios.get("http://localhost:8080/book/getBookByNames",
                        {
                            params:{
                                books: _this.bookInput
                            }
                        })
                        .then(response => {

                            _this.books = response.data;
                            console.log("response.data");
                            console.log(_this.books);
                            console.log("orderBooks");
                            console.log(_this.orderBooks);
                            for(let i in _this.books)
                            {
                                let tmp = _this.orderBooks.get(_this.books[i]);
                                console.log("tmp");
                                console.log(tmp);
                                for(let j in tmp)
                                {
                                    orderList.push(tmp[j]);
                                }
                            }

                            let orderEntityList = [];
                            console.log("orderList: ");
                            console.log(orderList);
                            for(let i in orderList)
                            {
                                for(let j in _this.orders)
                                {
                                    if(_this.orders[j].purchaseId === orderList[i] && orderEntityList.indexOf(orderList[i]) === -1)
                                    {
                                        console.log(_this.orders[j].purchaseId);
                                        orderEntityList.push(_this.orders[j]);
                                    }
                                }
                            }
                            console.log("OrderEntityList...");
                            console.log(orderEntityList.indexOf(999));
                            _this.orders = orderEntityList;
                        });
                },200);

            }
        },
        computed:{
            chartStyles () {
                return {
                    height: `600px`,
                    width: `750px`,
                    margin: '20px auto auto auto'
                }
            }
        },
        watch: {
            orders(val) {
                let _this = this;

                _this.orderBooks = new Map();

                let fetchOrders = [];
                let i, j;
                for(i in val)
                    fetchOrders.push(val[i].purchaseId);

                let fetchOrdersStr = JSON.stringify(fetchOrders);
                let postData = new FormData();
                postData.append('purchases', fetchOrdersStr);

                axios.post("http://localhost:8080/purchase/getPurchaseItems", postData)
                    .then(response => {
                        _this.orderItems = response.data;
                        console.log(_this.orderItems);
                        for(i in _this.orderItems)
                        {
                            for(j in _this.orderItems[i])
                            {
                                let currBook = _this.orderItems[i][j].bookId;
                                let currItem = _this.orderItems[i][j].purchaseId;
                                if(_this.orderBooks.has(currBook))
                                {
                                    console.log("Exists.");
                                    let tmp = Array.from(_this.orderBooks.get(currBook));
                                    tmp.push(currItem);

                                    _this.orderBooks.set(currBook, tmp);
                                }else{
                                    console.log("Doesn't Exist.");
                                    let tmp = new Array();
                                    tmp.push(_this.orderItems[i][j].purchaseId);
                                    _this.orderBooks.set(currBook, tmp);
                                }
                            }
                        }
                        console.log("orderbooks");
                        console.log(_this.orderBooks);
                        _this.genBookCnt();
                    });


            }
        },
        components: {
            OrderItem,
            DatePicker,
            Chart
        }
    }
</script>

<style scoped>
    @import '../assets/css/order.css';
</style>
