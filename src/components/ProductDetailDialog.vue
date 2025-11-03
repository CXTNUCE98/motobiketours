<script setup lang="ts">
const emit = defineEmits(['close'])

const { visible, info } = definePropsRefs<{
    visible: boolean
    info: any
}>()

</script>

<template>
    <el-dialog v-model="visible" :title="info?.name" width="500" align-center class="[&_.el-dialog\_\_title]:font-bold">
        <span>Open the dialog from the center from the screen</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="emit('close')">Cancel</el-button>
                <el-button type="primary" @click="emit('close')">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>



<style scoped></style>