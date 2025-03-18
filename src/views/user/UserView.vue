<script setup lang="ts">
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
    <h1 class="text-4xl font-bold my-8">个人中心</h1>
    <h2 class="text-xl font-bold my-8">功能选择</h2>
    <div class="flex flex-wrap gap-2">
        <Button
            label="我的产品"
            @click="router.push('/admin/products')"
            icon="icon-boxes"
        ></Button>
        <Button
            label="我的个人信息"
            @click="router.push('/admin/types')"
            icon="icon-user-round-pen"
        ></Button>
        <Button
            label="我的交易"
            @click="router.push('/admin/users')"
            icon="icon-users-round"
        ></Button>
    </div>
</template>
