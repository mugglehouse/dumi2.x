<template>
  <div>
      <h1>hello vue!</h1>
      <p>name: {{ name }}</p>
      <p>age: {{ age }}</p>
      <p>disabled: {{ disabled }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'vuetest',
  props: {
    /**
     * @description 名称
     * @default 'vue'
     */
    name: {
      type: String,
      default: 'vue',
    },
    /**
     * @description 年龄
     * @default 18
     */
    age: {
      type: Number,
      default: 18,
    },
    /**
     * @description 是否禁用
     * @default false
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 标题
     * @default ''
     */
    title: {
      type: String,
      default: '',
    },
  },
  emits: {
    /**
     * @description 点击事件
     */
    click: (value: string) => true,
    /**
     * @description 变更事件
     */
    change: (value: any) => true,
  },
  methods: {
    /**
     * @description 聚焦方法
     * @public
     */
    focus() {
    },
    /**
     * @description 失焦方法
     * @public
     */
    blur() {
    }
  },
});
</script>

<style scoped lang="scss"></style>