<script>

    import DispBooks from '@/components/DisplayBooks.vue'
    import BookForm from '@/components/BookForm.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    import _, { map } from 'underscore'


    export default {
        components: {
            DispBooks,
            BookForm,
            Modal
        },
        data() {
            return {
                baseURL: 'http://localhost:3002',
                books: [],
                filtered: [],
                readers: [],
                form: {
                    title: '',
                    author: '',
                    genre: '',
                    image: '',
                    isBorrowed: 0
                },
                editModal: null,
                loanModal: null,
                toUpdate: 0,
                toSearch: ['title','author','genre']
            }
        },
        props: {
            searchby: 0,
            order: 'asc',
            search: '',
            go: true
        },
        watch: {
            order(){
                this.changeOrder(this.filtered);
            },
            go(){
                this.searchBooks(this.search);
            }
        },
        methods: {
            changeOrder(array = this.books){
                if (this.order === 'asc'){
                        this.filtered = _.sortBy(array, this.toSearch[this.searchby]);
                    }
                else {
                        this.filtered = _.sortBy(array, this.toSearch[this.searchby]).reverse();
                    }
            },
            searchBooks(search){
                var f = [];
                var sb = this.toSearch[this.searchby]
                if (search === ''){
                    this.filtered = this.books;
                    return;
                }
                f = this.books.filter(function(book){
                    switch(sb){
                        case 'title':
                            return book.title.toLowerCase().includes(search.toLowerCase());
                        case 'author':
                            return book.author.toLowerCase().includes(search.toLowerCase());
                        case 'genre':
                            return book.genre.toLowerCase().includes(search.toLowerCase());
                    }
                });
                this.changeOrder(f);
            },
            getBooks() {
                axios.get(this.baseURL + '/books/list')
                .then((response) => {
                    this.books = response.data;
                    this.changeOrder();
                });
            },
            getReaders() {
                axios.get(this.baseURL + '/readers/list')
                .then((response) => {
                    this.readers = response.data;
                });
            },
            deleteBookHandler(id, i) {
                if (!confirm('Are you sure you want to delete this book?')) return;
                this.getBooks();
                axios.delete(this.baseURL + '/books/' + id);
            },
            editRowHandler(id, i) {
                this.form.title = this.filtered[i].title;
                this.form.author = this.filtered[i].author;
                this.form.genre = this.filtered[i].genre;
                this.form.isBorrowed = this.filtered[i].isBorrowed;
                this.toUpdate = id;
                this.editModal.show();
            },
            updateRow() {
                if (!confirm('Are you sure you want to update this book?')) return;
                const form = this.$refs.editForm;
                if (!form.checkValidity()) {
                    form.reportValidity();
                    form.classList.add('was-validated');
                    return;
                }
                const cover = document.getElementById("ucover");
                const formData = new FormData(form);

                formData.append("title", this.form.title);
                formData.append("author", this.form.author);
                formData.append("genre", this.form.genre);
                formData.append("isBorrowed", this.form.isBorrowed);
                formData.append("cover", cover.files[0]);

                axios.put(this.baseURL + '/books/' + this.toUpdate, formData)
                .then(response =>  this.getBooks())
                    this.editModal.hide();
            },
            saveBookHandler(book) {
                if (!confirm('Are you sure you want to add this book?')) return;
                axios.post(this.baseURL + '/books', book)
                    .then((response) => this.getBooks());
            },
            CoverPreview(input) {
                if (input.files && input.files[0]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        document.getElementById("ucoverPreview").style.backgroundImage = "url(" + e.target.result + ")";
                    }
                    reader.readAsDataURL(input.files[0]);
                }
            },
            loanBookHandler(book){
                this.form.title = book.title;
                this.form.author = book.author;
                this.form.genre = book.genre;
                this.form.image = book.image;
                this.toUpdate = book.book_id;
                this.loanModal.show();
            },
            saveLoan(){
                const form = document.getElementById('loan-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    form.classList.add('was-validated');
                    return;
                }

                var loan = {
                    book_id: this.toUpdate,
                    reader_id: document.getElementById('reader').value,
                    loanDate: document.getElementById('Ldate').value,
                    returnDate: document.getElementById('Rdate').value
                };

                if (!confirm('Are you sure you want to add this loan?')) return;
                axios.post(this.baseURL + '/loans', loan)
                    .then((response) => this.getBooks())
                    this.loanModal.hide();
            },
            returnBookHandler(id){
                if (!confirm("Are you sure you want to return this book?")) {
                    return;
                }
                axios.put(this.baseURL + '/books/return/' + id)
                .then(response =>  this.getBooks())
            },
            setDates(){
                var date = new Date();
                var rdate = new Date(date.setMonth(date.getMonth()+1));
                var ld = date.getFullYear().toString() + '-' + (date.getMonth()).toString().padStart(2, 0) +
                '-' + date.getDate().toString().padStart(2, 0);
                var rd = rdate.getFullYear().toString() + '-' + (rdate.getMonth() + 1).toString().padStart(2, 0) +
                '-' + rdate.getDate().toString().padStart(2, 0);
                document.getElementById('Ldate').value = ld;
                document.getElementById('Rdate').value = rd;
            }
        },
        mounted() {
            this.getBooks();
            this.getReaders();
            this.setDates();
            this.editModal = new bootstrap.Modal(document.getElementById('edit-row'));
            this.loanModal = new bootstrap.Modal(document.getElementById('loan-book'));
        }
    }

</script>

<template>
    <BookForm 
        @save-book="saveBookHandler">
    </BookForm>

    <DispBooks
        :books="filtered"
        @edit-book="editRowHandler"
        @delete-book="deleteBookHandler"
        @loan-book="loanBookHandler"
        @return-book="returnBookHandler">
    </DispBooks>

    <Modal id ="edit-row">
        <template #body>        
            <div class="modal-body">
                <form ref="editForm">
                    <div class="row">
                        <div class="col-6">
                            <label for="utitle" class="form-label">Title</label>
                            <input type="text" class="form-control" v-model="form.title" id="utitle" placeholder="Enter Title..." required>
                            <label for="uauthor" class="form-label">Author</label>
                            <input type="text" class="form-control" v-model="form.author" id="uauthor" placeholder="Enter Author..." required>
                            <label for="ugenre" class="form-label">Genre</label>
                            <input type="text" class="form-control" v-model="form.genre" id="ugenre" placeholder="Enter Genre..." required>
                        </div>
                        <div class="col-6">
                            <label for="ucover" class="form-label">Cover</label>
                            <input type="file" class="form-control" id="ucover" @change="CoverPreview($event.target)" placeholder="Enter Cover..." required>
                            <div id="ucoverPreview"></div> 
                        </div>
                    </div>
                </form>
             </div>

            <div class="modal-footer">
                <button type="button" @click.prevent="updateRow" class="btn btn-primary">Save Edits</button>
            </div>
        </template>
    </Modal>

    <Modal id="loan-book">
        <template #body>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-8">
                        <div class="card" style="width: 18rem;">
                            <img id="Pcover" :src="'data:image/png;base64,' + this.form.image" class="card-img-top" alt="Book Cover">
                            <div class="card-body">
                                <h5 id="Ptitle" class="card-title">{{ this.form.title }}</h5>
                                <p id="Pauthor" class="card-text">{{ this.form.author }}</p>
                                <p id="Pgenre" class="card-text">{{ this.form.genre }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <form id="loan-form">
                            <label for="reader" class="form-label">Reader Loaning</label>
                            <select id="reader" class="form-select" aria-label="Reader select">
                                <option selected disabled hidden value="">Reader...</option>
                                <option v-for="(reader, i) in readers" :key="i" :value="reader.reader_id">
                                    {{reader.FName}} {{reader.LName}}
                                </option>
                            </select>
                            <label for="Ldate" class="form-label">Loan Date</label>
                            <input type="date" class="form-control" id="Ldate" disabled>
                            <label for="Rdate" class="form-label">Return Date</label>
                            <input type="date" class="form-control" id="Rdate" disabled>
                            <input type="hidden" class="form-control" id="Pbid">
                        </form>
                    </div>
                </div>
            </div>
        
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" @click="saveLoan" class="btn btn-primary">Loan Book</button>
            </div>
        </template>
    </Modal>
</template>