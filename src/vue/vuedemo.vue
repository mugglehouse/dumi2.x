<template>
    <div>   
        <p>title: {{ title }}</p>
        <p>disabled: {{ disabled }}</p>
    </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';

const props = defineProps<{
    /**
     * @description 标题
     * @default 'vuedemo'
     */
    title: string
    /**
     * @description 是否禁用
     * @default false
     */
    disabled: boolean
}>()

const emit = defineEmits<{
    /**
     * @description 更新标题
     */
    (e: 'update:title', value: string): void
    /**
     * @description 更新是否禁用
     */
    (e: 'update:disabled', value: boolean): void
}>()

/**
 * @description 测试方法
 */
function foo() {
    console.log('foo')
}



defineComponent({
    name: 'vuedemo',
})
</script>