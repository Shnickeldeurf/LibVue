<script>
export default {
    props: {
        readers: Array
    }
}
</script>

<template>
    <div>
        <table class="table table-striped text-center">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(reader, i) in readers" :key="i">
                    <td>{{ reader.reader_id }}</td>
                    <td>{{ reader.FName }}</td>
                    <td>{{ reader.LName }}</td>
                    <td>{{ reader.address }}</td>
                    <td>{{ reader.phone }}</td>
                    <td>
                        <button type="button" class="btn btn-outline-warning" @click="$emit('editReader', reader.reader_id, i)"><i class="bi bi-pencil-square"></i></button>
                        <button type="button" class="btn btn-outline-danger" @click="$emit('deleteReader', reader.reader_id, i)"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>