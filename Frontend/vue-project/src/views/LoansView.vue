<script>

    import DispLoans from '@/components/DisplayLoans.vue'
    import LoanForm from '@/components/LoanForm.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    import _, { map } from 'underscore'


    export default {
        components: {
            DispLoans,
            LoanForm,
            Modal
        },
        props: {
            searchby: 'title',
            order: 'asc',
            search: '',
            go: true
        },
        data() {
            return {
                baseURL: 'http://localhost:3002',
                readers: [],
                books: [],
                loans: [],
                filtered: [],
                form: {
                    book_id: '',
                    reader_id: '',
                    loanDate: '',
                    returnDate: ''
                },
                editModal: null,
                toUpdate: 0,
                btoUpdate: 0,
                toSearch: ['loanDate','returnDate','title','reader','loanDate','returnDate']
            }
        },        watch: {
            order(){
                this.changeOrder(this.filtered);
            },
            go(){
                this.searchLoans(this.search);
            }
        },
        methods: {
            changeOrder(array = this.loans){
                if(this.toSearch[this.searchby] === 'reader'){
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
            searchLoans(search){
                var f = [];
                var sb = this.toSearch[this.searchby];
                if (search === ''){
                    this.filtered = this.loans;
                    return;
                }
                f = this.loans.filter(function(loan){
                    var full = loan.FName.toLowerCase() + ' ' + loan.LName.toLowerCase();
                    switch(sb){
                        case 'reader':
                            return full.includes(search.toLowerCase())
                        case 'title':
                            return loan.title.toLowerCase().includes(search.toLowerCase());
                        case 'loanDate':
                            return loan.loanDate.includes(search);
                        case 'returnDate':
                            return loan.returnDate.includes(search);
                    }
                });
                this.changeOrder(f);
            },
           getReaders() {
                axios.get(this.baseURL + '/readers/list')
                .then((response) => {
                    this.readers = response.data;
                });
            },
            getBooks() {
                axios.get(this.baseURL + '/loans/getbooks')
                .then((response) => {
                    this.books = response.data;
                });
            },
            getLoans() {
                axios.get(this.baseURL + '/loans/list')
                .then((response) => {
                    this.loans = response.data;
                    this.changeOrder();
                });
            },
            deleteLoanHandler(id, i, bid) {
                if (!confirm('Are you sure you want to delete this loan?')) return;
                this.getBooks();
                this.getLoans();
                axios.delete(this.baseURL + '/loans/' + id + '&' + bid);
            },
            editRowHandler(id, i) {
                this.form.reader_id = this.filtered[i].reader_id;
                this.form.book_id = this.filtered[i].book_id;
                this.form.loanDate = this.filtered[i].loanDate.split('T')[0];
                this.form.returnDate = this.filtered[i].returnDate.split('T')[0];
                this.toUpdate = id;
                this.btoUpdate = this.filtered[i].book_id;
                this.editModal.show();
            },
            updateRow() {
                if (!confirm('Are you sure you want to update this loan?')) return;
                const form = this.$refs.editForm;
                if (!form.checkValidity()) {
                    form.reportValidity();
                    form.classList.add('was-validated');
                    return;
                }
                axios.put(this.baseURL + '/loans/' + this.toUpdate + '&' + this.btoUpdate, this.form)
                .then(response =>  this.getLoans())
                    this.editModal.hide();
                    this.getBooks();
            },
            saveLoanHandler(loan) {
                if (!confirm('Are you sure you want to add this loan?')) return;
                axios.post(this.baseURL + '/loans', loan)
                    .then((response) => this.getLoans());
                    this.getBooks();
            },
        },
        mounted() {
            this.getLoans();
            this.getReaders();
            this.getBooks();
            this.editModal = new bootstrap.Modal(document.getElementById('edit-row'));
        }
    }

</script>

<template>
    <LoanForm 
        :readers="readers"
        :books="books"
        @save-loan="saveLoanHandler">
    </LoanForm>

    <DispLoans
        :loans="filtered"
        @edit-loan="editRowHandler"
        @delete-loan="deleteLoanHandler">
    </DispLoans>

    <Modal id ="edit-row">
        <template #body>        
            <div class="modal-body">
                <form ref="editForm">
                    <div>
                        <label for="ureader">Reader</label>
                        <select class="form-control" id="ureader" v-model="form.reader_id" required>
                            <option v-for="(reader, i) in readers" :key="i" :value="reader.reader_id">
                                {{reader.FName}} {{reader.LName}}
                            </option>
                        </select>
                        <label for="ubook">Book</label>
                        <select class="form-control" id="ubook" v-model="form.book_id" required>
                            <option v-for="(book, i) in books" :key="i" :value="book.book_id" :hidden="book.isBorrowed === 1 && book.book_id != form.book_id">
                                {{book.title}}
                            </option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="uLDate">Loan Date</label>
                            <input :value="form.loanDate" type="date" class="form-control" id="uLdate" disabled>
                        </div>
                        <div class="col-md-6">
                            <label for="uRDate">Return Date</label>
                            <input :value="form.returnDate" type="date" class="form-control" id="Rdate" disabled>
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