<script>

export default {
    data(){
        return {
            loan: {
            book_id: '',
            reader_id: '',
            loanDate: '',
            returnDate: ''
            },
            Rvalue: '',
            Bvalue: ''
        }
    },
    props: {
        readers: Array,
        books: Array
    },
    methods: {
        onChange(event) {
            if(event.target.id = 'reader'){
                this.loan.reader_id = this.Rvalue;
            } 
            if(event.target.id = 'book'){
                this.loan.book_id = this.Bvalue;
            }
        },
        emitSaveLoan(loan) {
            const form = document.getElementById('loan-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                form.classList.add('was-validated');
                return;
            }
            this.$emit('saveLoan', loan);
            for(let i in this.loan) {
                this.loan[i] = '';
                this.Rvalue = '';
                this.Bvalue = '';
            }
            this.setDates();
            form.classList.remove('was-validated');
        },
        setDates(){
            var date = new Date();
            var rdate = new Date(date.setMonth(date.getMonth()+1));
            var ld = date.getFullYear().toString() + '-' + (date.getMonth()).toString().padStart(2, 0) +
            '-' + date.getDate().toString().padStart(2, 0);
            var rd = rdate.getFullYear().toString() + '-' + (rdate.getMonth() + 1).toString().padStart(2, 0) +
            '-' + rdate.getDate().toString().padStart(2, 0);
            this.loan.loanDate = ld;
            this.loan.returnDate = rd;
        }
    },
    mounted() {
        this.setDates();
    }
}
</script>

<template>
    <form id="loan-form" class="row p-5">
        <div>
            <label for="reader">Reader</label>
            <select @change="onChange($event)" class="form-control" id="reader" v-model="Rvalue" required>
                <option selected disabled hidden value="">Choose Reader</option>
                <option v-for="(reader, i) in readers" :key="i" :value="reader.reader_id">
                    {{reader.FName}} {{reader.LName}}
                </option>
            </select>
            <label for="book">Book</label>
            <select @change="onChange($event)" class="form-control" id="book" v-model="Bvalue" required>
                <option selected disabled hidden value="">Choose Book</option>
                <option v-for="(book, i) in books" :key="i" :value="book.book_id" :hidden="book.isBorrowed == 1">
                    {{book.title}}
                </option>
            </select>
        </div>
        <div class="row">
            <div class="col-md-6">
                <label for="LDate">Loan Date</label>
                <input type="date" :value="loan.loanDate" class="form-control" id="Ldate" disabled>
            </div>
            <div class="col-md-6">
                <label for="RDate">Return Date</label>
                <input type="date" :value="loan.returnDate" class="form-control" id="Rdate" disabled>
            </div>
        </div>
        <button type="submit" @click.prevent="emitSaveLoan(loan)" class="btn btn-lg btn-outline-warning mt-3">Add</button>
    </form>
</template>