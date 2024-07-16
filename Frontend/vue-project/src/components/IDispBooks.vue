<script>

//:style="{ 'background-image': 'url(' + book.cover + ')' }"

export default {
    props: {
        books: Array
    }
}

</script>

<template>

    <div v-for="(book, i) in books" :key="i">
        <div :style="{ 'background-image': 'url(data:image/png;base64,' + book.image + ')' }" class="col-md-3 text-center">   
            <h2>{{ book.title }}</h2>
            <p>Author: {{ book.author }}</p>
            <p>Genre: {{ book.genre }}</p>
            <button @click="$emit('loan-book', book)" class="btn" type="button" :disabled="book.isBorrowed == 1">Loan</button>
        </div>
    </div>
</template>