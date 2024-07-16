<script>
    
export default {
    props: {
        loans: Array
    }
}
</script>

<template>
    <div>
        <table class="table table-striped text-center">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Reader</th>
                    <th scope="col">Book</th>
                    <th scope="col">Loan Date</th>
                    <th scope="col">Return Date</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(loan, i) in loans" :key="i">
                    <td>{{ loan.loan_id }}</td>
                    <td> 
                        {{ loan.FName }} {{ loan.LName }}
                    </td>
                    <td> 
                        {{ loan.title }}
                    </td>
                    <td>{{ loan.loanDate.split('T')[0] }}</td>
                    <td>{{ loan.returnDate.split('T')[0] }}</td>
                    <td>
                        <button type="button" class="btn btn-outline-warning" @click="$emit('editLoan', loan.loan_id, i)"><i class="bi bi-pencil-square"></i></button>
                        <button type="button" class="btn btn-outline-danger" @click="$emit('deleteLoan', loan.loan_id, i, loan.book_id)"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>