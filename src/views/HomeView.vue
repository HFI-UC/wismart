<script setup lang="ts">
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter()
</script>

<template>
    <div class="flex flex-col items-center justify-center h-[80vh]">
        <h1
            class="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent text-center"
        >
            WisMart
        </h1>
        <div class="mt-16 flex flex-wrap gap-4 items-center justify-center">
            <Button @click="router.push('/shop')" icon="icon-shopping-cart" label="开始购物"></Button>
            <Button
                @click="router.push('/product/new')"
                severity="secondary"
                icon="icon-upload"
                label="新建商品"
            ></Button>
        </div>
    </div>
</template>
