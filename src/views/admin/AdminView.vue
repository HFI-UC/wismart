<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';

const router = useRouter()
</script>

<template>
    <h1 class="text-4xl font-bold my-8">管理员面板</h1>
    <h2 class="text-xl font-bold my-8">功能选择</h2>
    <Button label="商品审核" @click="router.push('/product/verify')" icon="icon-shield-check"></Button>
</template>