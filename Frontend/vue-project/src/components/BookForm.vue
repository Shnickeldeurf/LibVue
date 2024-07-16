<script>
export default {
    data(){
        return {
            book: {
                title: '',
                author: '',
                genre: '',
                isBorrowed: 0
            }
        }
    },
    methods: {
        CoverPreview(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById("coverPreview").style.backgroundImage = "url(" + e.target.result + ")";
            }
            reader.readAsDataURL(input.files[0]);
        }
},
        emitSaveBook: function(book) {
                const form = document.getElementById('book-form');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    form.classList.add('was-validated');
                    return;
                }
                const cover = document.getElementById("cover");
                const formData = new FormData(form);

                formData.append("title", this.book.title);
                formData.append("author", this.book.author);
                formData.append("genre", this.book.genre);
                formData.append("isBorrowed", this.book.isBorrowed);
                formData.append("cover", cover.files[0]);
                this.$emit('saveBook', formData);
                for(let i in this.book) {
                    this.book[i] = '';
                }
                this.book.isBorrowed = 0;
                form.classList.remove('was-validated');
            }
    }
}
</script>

<template>
    <form id="book-form">
        <div class="row p-5">
            <div class="col-6">
                <label for="title" class="form-label">Title</label>
                <input type="text" class="form-control" v-model="book.title" id="title" placeholder="Enter Title..." required>
                <label for="author" class="form-label">Author</label>
                <input type="text" class="form-control" v-model="book.author" id="author" placeholder="Enter Author..." required>
                <label for="genre" class="form-label">Genre</label>
                <input type="text" class="form-control" v-model="book.genre" id="genre" placeholder="Enter Genre..." required>
            </div>

            <div class="col-6">
                <label for="cover" class="form-label">Cover</label>
                <input type="file" class="form-control" id="cover" @change="CoverPreview($event.target)" placeholder="Enter Cover..." required>
                <div id="coverPreview"></div>
            </div>
            <button type="submit" @click.prevent="emitSaveBook(book)" class="btn btn-lg btn-outline-warning mt-3">Add</button>
        </div>
    </form>
</template>