<template>
    <div class="stockTable">
        <vxe-toolbar>
            <template v-slot:buttons>
                <div class="stockTable_toolBar">
                    <vxe-input class="input" v-model="filterName" type="search" placeholder="Hello, Admin."></vxe-input>
                    <vxe-button icon="fa fa-plus" @click="insertEvent()">Insert-Book</vxe-button>
                    <vxe-button @click="showCover">Preview Cover</vxe-button>
                    <vxe-button icon="fa fa-plus" @click="deleteEvent()">Delete-Book</vxe-button>
                    <vxe-button icon="fa fa-plus" @click="superUser()">Full-Control</vxe-button>
                </div>
            </template>
        </vxe-toolbar>
        <vxe-table class="stockTable_table"
                border
                resizable
                keep-source
                ref="xTable"
                :data="list"
                :edit-config="{trigger: 'click', mode: 'cell', showStatus: true, activeMethod: activeCellMethod, icon: 'fa fa-pencil'}"
                :radio-config="{highlight: true}"
                highlight-hover-row
                @edit-closed="editClosedEvent"
                @edit-disabled="editDisabledEvent"
                :sort-config="{triggr: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
        >
            <vxe-table-column type="radio" width="35"></vxe-table-column>
<!--            <vxe-table-column type="seq" width="35" show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>-->
            <vxe-table-column field="bookId" title="Id" width="35" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="name" title="Book" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="author" title="Author" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="isbn" title="ISBN" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="language" title="Language" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="date" title="Published" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="price" title="Price" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="stock" title="Stock" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="status" title="Status" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>
            <vxe-table-column field="sales" title="Sales" :edit-render="{name: 'input'}" sortable show-header-overflow show-overflow="title" show-footer-overflow></vxe-table-column>

        </vxe-table>

        <vxe-modal v-model="show" width="1000" height="800">
            <div class="modalWrapper">
                <img class="cover" v-bind:src="this.prevCover"/>
                <div class="coverControl">
                    <vxe-button icon="fa fa-plus" @click="sendCover()">Send-Cover</vxe-button>
                    <input type="file" @change="uploadCover" ref="img" />
                </div>
            </div>
        </vxe-modal>

    </div>
</template>

<script>
    import XEUtils from 'xe-utils'
    import axios from "axios";

    export default {
        name: "AdminStockPanel",
        data() {
            return {
                filterName: '',
                tableData: [],
                insert: 0,
                admin: false,
                cover: '',
                prevCover: '',
                show:false
            }
        },
        computed: {
            list() {
                const filterName = XEUtils.toString(this.filterName).trim().toLowerCase();
                if (filterName) {
                    const searchProps = ['name', 'author', 'language', 'published'];
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
            axios.get("http://localhost:8080/book/getBooks")
                .then(response => {this.tableData = response.data;});
        },
        methods: {
            showCover(){
                this.prevCover = this.$refs.xTable.getRadioRecord().bookColl.bookCover;
                this.show = !this.show;
            },
            uploadCover(){
                let _this = this;
                //根据ref得到图片文件
                var file = this.$refs.img;
                //使用h5的读取文件api
                var reader = new FileReader();
                reader.readAsDataURL(file.files[0]);
                //读取完成后触发
                reader.onload = function () {
                    //改变img的路径
                    _this.cover = this.result;
                    _this.prevCover = this.result;
                };
            },
            sendCover(){
                // Updates the cover of the current selected book
                let bookId = this.$refs.xTable.getRadioRecord().bookId;
                let postData = new FormData();
                postData.append('setType', JSON.stringify(10));
                postData.append('bookId', bookId);
                postData.append('value', this.cover);
                this.$XModal.confirm('No heading back, do you confirm this operation?').then(type => {
                    if (type === 'confirm') {
                        axios.post(`http://localhost:8080/book/updateBook`, postData).then(response => {
                            if(response.data)
                                this.$XModal.message({
                                    message: `Operation succeeded, cover is uploaded.`,
                                    status: 'Success'
                                });
                            else
                                this.$XModal.message({
                                    message: `Operation failed, cover isn't uploaded.`,
                                    status: 'Failed'
                                });
                            axios.get("http://localhost:8080/book/getBooks")
                                .then(response => this.tableData = response.data);
                        })
                    }
                });
            },
            async insertEvent (row) {
                // Inserts a book, allow bookName inputs
                this.admin = true;
                this.insert = 1;
                let record = {};
                let { row: newRow } = await this.$refs.xTable.insertAt(record, row);
                await this.$refs.xTable.setActiveCell(newRow, 'name');
                this.admin = false;
            },
            deleteEvent(){
                // Deletion requires selecting a book
                let selectRecords = this.$refs.xTable.getRadioRecord();
                if(selectRecords == null)
                    this.$XModal.message({ message: 'You must select a book.', status: 'error' });
                else {
                    this.$XModal.confirm('No heading back, do you confirm this operation?').then(type => {
                        if (type === 'confirm') {
                            axios.post(`http://localhost:8080/book/deleteBook?bookId=${selectRecords.bookId}`, {
                            }).then(response => {
                                setTimeout(() => {
                                    if(response) {
                                        this.$refs.xTable.remove(selectRecords);
                                        this.$XModal.message({
                                            message: `Operation succeeded, book is deleted.`,
                                            status: 'Success'
                                        });
                                    }
                                    else {
                                        this.$XModal.message({
                                            message: `Operation failed, book isn't deleted.`,
                                            status: 'Failed'
                                        });
                                    }
                                }, 200)
                            });
                        }
                    });
                }
            },
            superUser(){
                // Changes the mode to superUser, prevent from error inputting, eg. Accidentally updates a name
                if(this.admin)
                    this.admin = false;
                else {
                    this.admin = true;
                }
            },
            activeCellMethod ({columnIndex }) {
                // Disable editing for specific columns
                if(this.admin === false)
                    return columnIndex !== 2;
                else
                    return columnIndex;
            },
            editDisabledEvent () {
                this.$XModal.message({ message: 'Edit not allowed.', status: 'error' })
            },
            editClosedEvent({row, column}) {
                let xTable = this.$refs.xTable;
                let field = column.property;
                let keys = Object.keys(row);
                let values = Object.values(row);
                let fieldVal;

                // Newly added book, name is empty
                if(this.insert)
                {
                    if(values[1] === null)
                    {
                        this.$XModal.message({ message: "Book name is empty.", status: 'error' });
                        xTable.remove(row);
                        this.insert = 0;
                        return;
                    }
                }

                // Newly added book, name not empty
                if(field === "name" && this.insert)
                {
                    axios.post(`http://localhost:8080/book/addBookByName?name=${row.name}`, {
                    }).then(response => {
                        setTimeout(() => {
                            if(response.data !== "") {
                                this.$XModal.message({
                                    message: `Operation succeeded, book is stored.`,
                                    status: 'Success'
                                });
                                axios.get("http://localhost:8080/book/getBooks")
                                    .then(response => this.tableData = response.data);
                            }
                            else {
                                this.$XModal.message({
                                    message: `Operation failed, book exists.`,
                                    status: 'Failed'
                                });
                                xTable.remove(row);
                            }
                            this.insert = 0;
                        }, 200)
                    });
                    return;
                }

                if (xTable.isUpdateByRow(row, field)) {
                    // Gets the new value for the updated field
                    for (let i = 0; i < keys.length; i++){
                        if(keys[i] === field)
                            fieldVal = values[i];
                    }
                    // Sends specific requests to the backend with calculated fieldName & fieldValue
                    // let changeField = field[0].toUpperCase() + field.substring(1, field.length);
                    let type = 0;
                    switch (field) {
                        case 'isbn':
                            type = 1;
                            break;
                        case 'name':
                            type = 2;
                            break;
                        case 'category':
                            type = 3;
                            break;
                        case 'author':
                            type = 4;
                            break;
                        case 'price':
                            type = 5;
                            break;
                        case 'language':
                            type = 6;
                            break;
                        case 'date':
                            type = 7;
                            break;
                        case 'sales':
                            type = 8;
                            break;
                        case 'stock':
                            type = 9;
                            break;
                    }
                    axios.post(`http://localhost:8080/book/updateBook?setType=${type}&bookId=${row.bookId}&value=${fieldVal}`, {
                    }).then(response => {
                        setTimeout(() => {
                            if(response)
                                this.$XModal.message({
                                    message: `Operation succeeded, bookId-${row.bookId}-${field} = ${fieldVal}.`,
                                    status: 'Success'
                                });
                            else
                                this.$XModal.message({
                                    message: `Operation failed, bookId-${row.bookId}-${field} remains the same.`,
                                    status: 'Failed'
                                });
                            this.$refs.xTable.reloadRow(row, null, field);
                        }, 200)
                    });
                }
            },
        }
    }

</script>
<style>
    @import '~bootstrap-vue/dist/bootstrap-vue.css';
    @import '../assets/css/adminStockPanel.css';
</style>
