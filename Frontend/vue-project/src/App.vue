<script lang="ts">

    import Navigation from './components/header.vue';
    import Footer from './components/footer.vue';

    export default {
        components: {
            Navigation,
            Footer
        },
        data(){
            return {
                searchby: 0,
                order: 'asc',
                search: '',
                go: true
            }
        },
        methods: {
            changeSearchby(sb: any) {
                this.searchby = sb;
            },
            changeOrder(){
                if(this.order === 'asc'){
                    this.order = 'desc';
                    document.getElementById('order')!.innerHTML = '<i class="bi-caret-up"></i>';
                }
                else {
                    this.order = 'asc'
                    document.getElementById('order')!.innerHTML = '<i class="bi-caret-down"></i>';
                }
            },
            searchAll(search: any){
                this.search = search;
                this.go ? this.go = false : this.go = true;
            }

        }
    }

</script>

<template>

    <header>
        <Navigation @changeOrder="changeOrder" @searchAll="searchAll">
            <template v-if="$route.name === 'loans'" #search>
                <li><a @click="changeSearchby('0')" class="dropdown-item" href="#">Loan Date</a></li>
                <li><a @click="changeSearchby('1')" class="dropdown-item" href="#">Return Date</a></li>
                <li><a @click="changeSearchby('2')" class="dropdown-item" href="#">Book</a></li>
                <li><a @click="changeSearchby('3')" class="dropdown-item" href="#">Reader</a></li>
            </template>
            <template v-else-if="$route.name === 'readers'" #search>
                <li><a @click="changeSearchby('0')" class="dropdown-item" href="#">Name</a></li>
                <li><a @click="changeSearchby('1')" class="dropdown-item" href="#">Address</a></li>
                <li><a @click="changeSearchby('2')" class="dropdown-item" href="#">Phone Number</a></li>
            </template>
            <template v-else #search>
                <li><a @click="changeSearchby('0')" class="dropdown-item" href="#">Title</a></li>
                <li><a @click="changeSearchby('1')" class="dropdown-item" href="#">Author</a></li>
                <li><a @click="changeSearchby('2')" class="dropdown-item" href="#">Genre</a></li>
            </template>
        </Navigation>
    </header>
    <main>
        <router-view
            :searchby="searchby"
            :order="order"
            :search="search"
            :go="go"
        ></router-view>
    </main>
    <footer>
        <Footer></Footer>
    </footer>

</template>

<style scoped>

</style>
