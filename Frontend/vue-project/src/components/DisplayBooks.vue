<script>
export default {
    props: {
        books: Array
    }
}
</script>

<template>
    <div>
        <table class="table table-striped text-center">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Genre</th>
                    <th scope="col">Availablity</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, i) in books" :key="book.book_id">
                    <td>{{ book.book_id }}</td>
                    <td>{{ book.title }}</td>
                    <td><img :src="'data:image/png;base64,' + book.image" alt="cover" width="50px"></td>
                    <td>{{ book.author }}</td>
                    <td>{{ book.genre }}</td>
                    <td v-if="book.isBorrowed == 0">
                        <button class="btn btn-lg btn-outline-success" @click="$emit('loan-book', book)">Loan</button>
                    </td>
                    <td v-else>
                        <button class="btn btn-lg btn-outline-primary" @click="$emit('return-book', book.book_id)">Return</button>
                    </td>
                    <td>
                        <button type="button" class="btn btn-outline-warning" @click="$emit('editBook', book.book_id, i)"><i class="bi bi-pencil-square"></i></button>
                        <button type="button" class="btn btn-outline-danger" @click="$emit('deleteBook', book.book_id, i)"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>