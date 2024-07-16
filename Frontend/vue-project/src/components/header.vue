<script>
    export default {
        data(){
            return {
                search: ''
            }
        }
    }
</script>
<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">Library Manager</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      Books
                    </a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="/">View Books</a></li>
                      <li><a class="dropdown-item" href="/books">Add/Edit Books</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/readers">Readers</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/loans">Loans</a>
                </li>
            </ul>
        </div>
        <form class="d-flex" role="search">
            <div class="input-group">
                <button class="btn btn-outline-warning dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Search By</button>
                <ul class="dropdown-menu">
                    <slot name="search"></slot>
                </ul>
                <input  id="search" class="form-control" v-model="search" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-warning" type="button" @click="$emit('searchAll', search)"><i class="bi bi-search"></i></button>
                <button class="btn btn-outline-warning" id="order" type="button" @click="$emit('changeOrder')"><i class="bi-caret-down"></i></button>
            </div>
        </form>
    </div>
</nav>
</template>