<template>
    <div class="orderTable">
        <vxe-toolbar>
            <template class="toolBar_template" v-slot:buttons>
                <div class="orderTable_toolBar">
                    <input class="toolBar_search" v-model="bookInput" @keyup.enter="fetchBook" type="text"
                           placeholder="What are you looking for?"/>
                    <div class="toolBar_date">
                        <DatePicker mode='range' v-model='range'/>
                        <button @click="dateRangeWithin">Confirm</button>
                    </div>
                    <div class="toolBar_chart">
                        <button class="book" @click="showBookCnt">Book Ranking</button>
                        <button class="user" @click="showUserTot">User Ranking</button>
                    </div>
                </div>
            </template>
        </vxe-toolbar>

        <vxe-table class="orderTable_table"
                border
                resizable
                keep-source
                highlight-current-row
                ref="xTable"
                :data="list"
                :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
        >
            <vxe-table-column type="seq" width="45" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column type="expand" width="80">
                <template v-slot:content="{ row }">
                    <ul style="margin-left: 80px">
                        <li v-for="(item, index) in getOrderItem(row)" :key="index">
                            <span>BookId: {{ item.bookId }}</span>
                            <span style="margin-left: 100px"> Price: {{ item.price }}</span>
                            <span style="margin-left: 100px"> Quantity: {{ item.quantity }}</span>
                        </li>
                    </ul>
                </template>
            </vxe-table-column>
            <vxe-table-column field="purchaseId" title="OrderNo" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="userId" title="UserId" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="totalPrice" title="TotalPrice" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="createTime" title="CreateTime" sortable show-header-overflow show-overflow="title" show-footer-overflow :formatter="formatTime"></vxe-table-column>
        </vxe-table>

        <modal name="bookCnt" height="800" width="900">
            <Chart :chartdata="bookCnt" :styles="chartStyles"/>
        </modal>
        <modal name="userTot" height="800" width="900">
            <Chart :chartdata="userTot" :styles="chartStyles"/>
        </modal>

    </div>

</template>

<script>
    import XEUtils from 'xe-utils'
    import axios from "axios";
    import DatePicker from 'v-calendar/lib/components/date-picker.umd';
    import Chart from "@/components/chart";

    export default {
        name: "AdminOrderPanel",
        data() {
            return {
                // Basic data
                filterName: '',
                tableData: [],
                orderItems:[],
                // Filtering data
                orderBooks: new Map(),
                bookInput: '',
                books: [],
                range: {
                    start: new Date(),
                    end: new Date(),
                },
                showBook: false,
                showTot: false,
                userTot: new Map(),
                bookCnt: null,
            }
        },

        computed: {
            chartStyles () {
                return {
                    height: `600px`,
                    width: `750px`,
                    margin: '20px auto auto auto'
                }
            },
            list() {
                const filterName = XEUtils.toString(this.filterName).trim().toLowerCase();
                if (filterName) {
                    const searchProps = ['purchaseId', 'userId', 'totalPrice', 'createTime'];
                    const rest = this.tableData.filter(item => searchProps.some(key => XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1));
                    return rest.map(row => {
                        const item = Object.assign({}, row);
                        return item;
                    })
                }
                return this.tableData;
            }
        },
        created(){
            axios.get("http://localhost:8080/purchase/getAllPurchases")
                .then(response => this.tableData = response.data);
        },
        watch:{
            tableData(val) {
                let _this = this;

                _this.tableData = val;
                _this.orderBooks = new Map();
                let fetchOrders = [];
                let i, j;
                for(i in this.tableData)
                    fetchOrders.push(this.tableData[i].purchaseId);

                let fetchOrdersStr = JSON.stringify(fetchOrders);
                let postData = new FormData();
                postData.append('purchases', fetchOrdersStr);

                axios.post("http://localhost:8080/purchase/getPurchaseItems", postData)
                    .then(response => {
                        _this.orderItems = response.data;
                        console.log("Getting orderItems");
                        console.log(response.data);
                        for(i in _this.orderItems)
                        {
                            for(j in _this.orderItems[i])
                            {
                                let currBook = _this.orderItems[i][j].bookId;
                                let currItem = _this.orderItems[i][j].purchaseId;
                                if(_this.orderBooks.has(currBook))
                                {
                                    let tmp = Array.from(_this.orderBooks.get(currBook));
                                    tmp.push(currItem);

                                    _this.orderBooks.set(currBook, tmp);
                                }else{
                                    // console.log("Doesn't Exist.");
                                    let tmp = new Array();
                                    tmp.push(_this.orderItems[i][j].purchaseId);
                                    _this.orderBooks.set(currBook, tmp);
                                }
                            }
                            _this.orderItems[i].key = _this.orderItems[i][0].purchaseId;
                        }
                        _this.genBookCnt();
                        _this.genUserTot();
                    });
            }
        },
        methods: {
            showBookCnt: function(){
                this.$modal.show('bookCnt');
            },
            showUserTot: function(){
                this.$modal.show('userTot');
            },
            genBookCnt: function () {
                let booksCount = new Map();
                let orderBooks = this.orderBooks;
                let orderItems = this.orderItems;
                for(let item of orderBooks.entries())
                {
                    for(let bookOrder of item[1])
                    {
                        for(let tmpOrder in orderItems)
                        {
                            if(orderItems[tmpOrder].key === bookOrder)
                            {
                                for(let tmpBook in orderItems[tmpOrder])
                                {
                                    if(orderItems[tmpOrder][tmpBook].bookId === item[0])
                                    {
                                        if(booksCount.has(item[0]))
                                        {
                                            booksCount.set(item[0], booksCount.get(item[0]) + orderItems[tmpOrder][tmpBook].quantity);
                                        }else{
                                            booksCount.set(item[0], orderItems[tmpOrder][tmpBook].quantity);
                                        }
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                let arrayObj = Array.from(booksCount);
                arrayObj.sort(function(a,b){return b[1]-a[1]});
                let result = new Map(arrayObj.map(i => [i[0], i[1]]));
                let labels = Array.from(result.keys());
                labels.push('...');
                let data = Array.from(result.values());
                data.push(0);
                this.bookCnt = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Amount of Books',
                            backgroundColor: '#71a9dc',
                            data: data
                        }
                    ]
                };
            },
            genUserTot: function(){
                let tableData = this.tableData;
                let totCount = new Map();
                for(let i in tableData)
                {
                    if(totCount.has(tableData[i].userId))
                    {
                        totCount.set(tableData[i].userId, totCount.get(tableData[i].userId) + tableData[i].totalPrice);
                    }else{
                        totCount.set(tableData[i].userId, tableData[i].totalPrice);
                    }
                }
                let arrayObj = Array.from(totCount);
                arrayObj.sort(function(a,b){return b[1]-a[1]});
                let result = new Map(arrayObj.map(i => [i[0], i[1]]));
                let labels = Array.from(result.keys());
                labels.push('...');
                let data = Array.from(result.values());
                data.push(0);
                this.userTot = {
                    labels: labels,
                    datasets: [
                        {
                            label: 'User Ranking',
                            backgroundColor: '#dcd48f',
                            data: data
                        }
                    ]
                };
            },
            formatDate: function (value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
            },
            async dateRangeWithin(){
                let s= new Date(this.range.start);
                let e = new Date(this.range.end);
                let sf = s.getFullYear() + '-' + (s.getMonth() + 1) + '-' + s.getDate();
                let ef = e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + (e.getDate()+1);
                axios.get("http://localhost:8080/purchase/getPurchaseByRange", {
                    params:{
                        startDate: sf,
                        endDate: ef
                    }
                })
                    .then(response => {
                        let fetchOrder = JSON.stringify(response.data);
                        localStorage.setItem('Order', fetchOrder);
                        this.tableData = (JSON.parse(localStorage.getItem('Order')));
                        // console.log("Finished dateRangeWithin");
                    });
            },
            formatTime ({ cellValue }) {
                return this.formatDate(cellValue);
            },
            // Lists out the orderItems
            getOrderItem(row){
                // console.log(row);
                for(let i in this.orderItems)
                {
                    if(this.orderItems[i][0].purchaseId === row.purchaseId)
                        return this.orderItems[i];
                }
            },
            async fetchBook(){
                // console.log("Started fetchBook");
                let _this = this;
                let orderList = [];

                // Re-fetches the books
                await _this.dateRangeWithin();

                // Gets the bookIds for matched name
                setTimeout(()=>{
                    axios.get("http://localhost:8080/book/getBookByNames",
                        {
                            params:{
                                books: _this.bookInput
                            }
                        })
                        .then(response => {
                            _this.books = response.data;

                            // Iterates through the bookIds to get
                            // (key-value) pair --> (bookId-orders) pair
                            for(let i in _this.books)
                            {
                                let tmp = _this.orderBooks.get(_this.books[i]);

                                for(let j in tmp)
                                    orderList.push(tmp[j]);
                            }

                            let orderEntityList = [];

                            // Gets the matched distinct orders from the orderBooks map()
                            for(let i in orderList)
                                for(let j in _this.tableData)
                                    if(_this.tableData[j].purchaseId === orderList[i] && orderEntityList.indexOf(orderList[i]) === -1)
                                        orderEntityList.push(_this.tableData[j]);

                            // Assigns the matched orders to the current tableData
                            _this.tableData = orderEntityList;

                            // console.log("Finished fetchBook");
                        });

                },200);

            }
        },
        components: {
            Chart,
            DatePicker,
        }
    }

</script>
<style>
    @import '~bootstrap-vue/dist/bootstrap-vue.css';
    @import '../assets/css/adminOrderPanel.css';
</style>
