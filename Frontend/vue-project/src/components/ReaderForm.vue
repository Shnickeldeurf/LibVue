<script>
export default {
    data(){
        return {
            reader: {
            FName: '',
            LName: '',
            address: '',
            phone: ''
            }
        }
    },
    methods: {
        emitSaveReader: function(reader) {
                const form = document.getElementById('reader-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    form.classList.add('was-validated');
                    return;
                }
                this.$emit('saveReader', reader);
                for(let i in this.reader) {
                    this.reader[i] = '';
                }
                form.classList.remove('was-validated');
        }
    }
}
</script>

<template>
    <form id="reader-form">
        <div class="row p-5">
            <div>
                <label for="fname" class="form-label">First Name</label>
                <input type="text" class="form-control" v-model="reader.FName" id="fname" placeholder="Enter First Name..." required>
                <label for="lname" class="form-label">Last Name</label>
                <input type="text" class="form-control" v-model="reader.LName" id="lname" placeholder="Enter Last Name..." required>
                <label for="add" class="form-label">Address</label>
                <input type="text" class="form-control" v-model="reader.address" id="add" placeholder="Enter Address..." required>
                <label for="phone" class="form-label">Phone Number</label>
                <input type="text" class="form-control" v-model="reader.phone" id="phone" placeholder="Enter Phone Number..." pattern="[0-9]{10}" required>
            </div>
            <button type="submit" @click.prevent="emitSaveReader(reader)" class="btn btn-lg btn-outline-warning mt-3">Add</button>
        </div>
    </form>
</template>