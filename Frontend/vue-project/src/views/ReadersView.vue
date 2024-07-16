<script>

    import DispReaders from '@/components/DisplayReaders.vue'
    import ReaderForm from '@/components/ReaderForm.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    import _, { map } from 'underscore'


    export default {
        components: {
            DispReaders,
            ReaderForm,
            Modal
        },
        props: {
            searchby: 0,
            order: 'asc',
            search: '',
            go: true
        },
        data() {
            return {
                baseURL: 'http://localhost:3002',
                readers: [],
                filtered: [],
                form: {
                    FName: '',
                    LName: '',
                    address: '',
                    phone: ''
                },
                editModal: null,
                toUpdate: 0,
                toSearch: ['name','address','phone']
            }
        },        
        watch: {
            order(){
                this.changeOrder(this.filtered);
            },
            go(){
                this.searchReaders(this.search);
            }
        },
        methods: {
            changeOrder(array = this.readers){
                if(this.toSearch[this.searchby] === 'name'){
                    if (this.order === 'asc'){
                    this.filtered = _.sortBy(array, 'FName');
                    }
                else {
                        this.filtered = _.sortBy(array, 'FName').reverse();
                    }
                }
                else{
                    if (this.order === 'asc'){
                        this.filtered = _.sortBy(array, this.toSearch[this.searchby]);
                        }
                    else {
                            this.filtered = _.sortBy(array, this.toSearch[this.searchby]).reverse();
                        }
                }
            },
            searchReaders(search){
                var f = [];
                var sb = this.toSearch[this.searchby];
                if (search === ''){
                    this.filtered = this.readers;
                    return;
                }
                f = this.readers.filter(function(reader){
                    var full = reader.FName.toLowerCase() + ' ' + reader.LName.toLowerCase();
                    switch(sb){
                        case 'name':
                            return full.includes(search.toLowerCase())
                        case 'address':
                            return reader.address.toLowerCase().includes(search.toLowerCase());
                        case 'phone':
                            return reader.phone.toLowerCase().includes(search.toLowerCase());
                    }
                });
                this.changeOrder(f);
            },
            getReaders() {
                axios.get(this.baseURL + '/readers/list')
                .then((response) => {
                    this.readers = response.data;
                    this.changeOrder();
                });
            },
            deleteReaderHandler(id, i) {
                if (!confirm('Are you sure you want to delete this reader?')) return;
                this.getReaders();
                axios.delete(this.baseURL + '/readers/' + id);
            },
            editRowHandler(id, i) {
                this.form.FName = this.filtered[i].FName;
                this.form.LName = this.filtered[i].LName;
                this.form.address = this.filtered[i].address;
                this.form.phone = this.filtered[i].phone;
                this.toUpdate = id;
                this.editModal.show();
            },
            updateRow() {
                if (!confirm('Are you sure you want to update this reader?')) return;
                const form = this.$refs.editForm;
                if (!form.checkValidity()) {
                    form.reportValidity();
                    form.classList.add('was-validated');
                    return;
                }
                axios.put(this.baseURL + '/readers/' + this.toUpdate, this.form)
                .then(response =>  this.getReaders())
                    this.editModal.hide();
            },
            saveReaderHandler(reader) {
                if (!confirm('Are you sure you want to add this reader?')) return;
                axios.post(this.baseURL + '/readers', reader)
                    .then((response) => this.getReaders());
            },
        },
        mounted() {
            this.getReaders();
            this.editModal = new bootstrap.Modal(document.getElementById('edit-row'));
        }
    }

</script>

<template>
    <ReaderForm 
        @save-reader="saveReaderHandler">
    </ReaderForm>

    <DispReaders
        :readers="filtered"
        @edit-reader="editRowHandler"
        @delete-reader="deleteReaderHandler">
    </DispReaders>

    <Modal id ="edit-row">
        <template #body>        
            <div class="modal-body">
                <form ref="editForm">
                    <div class="row">
                        <div>
                            <label for="ufname" class="form-label">First Name</label>
                            <input type="text" class="form-control" v-model="form.FName" id="ufname" placeholder="Enter First Name..." required>
                            <label for="ulname" class="form-label">Last Name</label>
                            <input type="text" class="form-control" v-model="form.LName" id="ulname" placeholder="Enter Last Name..." required>
                            <label for="uadd" class="form-label">Address</label>
                            <input type="text" class="form-control" v-model="form.address" id="uadd" placeholder="Enter Address..." required>
                            <label for="uphone" class="form-label">Phone Number</label>
                            <input type="text" class="form-control" v-model="form.phone" id="uphone" placeholder="Enter Phone Number..." pattern="[0-9]{10}" required>
                        </div>
                    </div>
                </form>
             </div>

            <div class="modal-footer">
                <button type="button" @click.prevent="updateRow" class="btn btn-primary">Save Edits</button>
            </div>
        </template>
    </Modal>
</template>