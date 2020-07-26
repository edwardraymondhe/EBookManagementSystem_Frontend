<template>
    <div class="userTable">
        <vxe-toolbar class="userTable_toolBar">
            <template v-slot:buttons>
                <vxe-input class="toolBar_search" v-model="filterName" type="search" placeholder="Hello, Admin."></vxe-input>
            </template>
        </vxe-toolbar>
        <vxe-table
                border
                resizable
                keep-source
                ref="xTable"
                :data="list"
                :edit-config="{trigger: 'click', mode: 'cell', showStatus: true, activeMethod: activeCellMethod, icon: 'fa fa-pencil'}"
                @edit-closed="editClosedEvent"
                @edit-disabled="editDisabledEvent"
                :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
        >
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="userId" title="UserId" :edit-render="{name: 'input'}" sortable></vxe-table-column>
            <vxe-table-column field="name" title="Username" :edit-render="{name: 'input'}" sortable></vxe-table-column>
            <vxe-table-column field="password" title="Password" :edit-render="{name: 'input'}" sortable></vxe-table-column>
            <vxe-table-column field="permission" title="Permission" :edit-render="{name: 'input'}" sortable></vxe-table-column>
            <vxe-table-column field="tel" title="Tel" :edit-render="{name: 'input'}" sortable></vxe-table-column>
            <vxe-table-column field="email" title="Email" :edit-render="{name: 'input'}" sortable></vxe-table-column>
            <vxe-table-column field="address" title="Address" :edit-render="{name: 'input'}" sortable></vxe-table-column>
        </vxe-table>
    </div>
</template>

<script>
    import XEUtils from 'xe-utils'
    import axios from "axios";

    export default {
        name: "AdminUserPanel",
        data() {
            return {
                filterName: '',
                tableData: [],
            }
        },
        computed: {
            list() {
                const filterName = XEUtils.toString(this.filterName).trim().toLowerCase()
                if (filterName) {
                    const searchProps = ['name', 'author', 'language', 'published'];
                    const rest = this.tableData.filter(item => searchProps.some(key => XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1))
                    return rest.map(row => {
                        const item = Object.assign({}, row)
                        return item
                    })
                }
                return this.tableData
            }
        },
        created(){
            axios.get("http://localhost:8080/user/getUsers")
                .then(response => this.tableData = response.data);
        },
        methods: {
            activeCellMethod ({columnIndex }) {
                // Can't update userId
                return columnIndex !== 1;
            },
            editDisabledEvent () {
                this.$XModal.message({ message: 'Edit not allowed.', status: 'error' })
            },
            editClosedEvent({row, column}) {

                // For handling edit-cell-close event, eg. Updating record
                let xTable = this.$refs.xTable;
                let field = column.property;
                if (xTable.isUpdateByRow(row, field)) {
                    let keys = Object.keys(row);
                    let values = Object.values(row);
                    let varField;
                    for (let i = 0; i < keys.length; i++){
                        if(keys[i] === field)
                            varField = values[i];
                    }

                    // Sends specific requests to the backend with calculated fieldName & fieldValue
                    // let changeField = field[0].toUpperCase() + field.substring(1, field.length);
                    let type = 0;
                    switch (field) {
                        case 'permission':
                            type = 1;
                            break;
                        case 'name':
                            type = 2;
                            break;
                        case 'nickName':
                            type = 3;
                            break;
                        case 'tel':
                            type = 4;
                            break;
                        case 'address':
                            type = 5;
                            break;
                        case 'email':
                            type = 6;
                            break;
                        case 'password':
                            type = 7;
                            break;
                        default:
                            break;
                    }
                    axios.post(`http://localhost:8080/user/updateUser?setType=${type}&userId=${row.userId}&value=${varField}`, {
                    }).then(response => {
                        setTimeout(() => {
                            if(response)
                                this.$XModal.message({
                                    message: `Operation succeeded.`,
                                    status: 'Success'
                                });
                            else
                                this.$XModal.message({
                                    message: `Operation failed.`,
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
    @import '../assets/css/adminUserPanel.css';
</style>
