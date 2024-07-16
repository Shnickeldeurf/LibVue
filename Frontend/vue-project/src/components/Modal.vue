<script>

    export default {
        props: {
            id: String,
            required: true
        }
    }
</script>

<template>

    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel"><slot name="title"></slot></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div>
                    <slot name="body"></slot>
                </div>
            </div>
        </div>
    </div>

</template>