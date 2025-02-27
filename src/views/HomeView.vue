<script setup lang="ts">
import Button from "primevue/button";
</script>

<template>
    <div class="flex flex-col items-center justify-center h-[80vh]">
        <h1
            class="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent text-center"
        >
            WisMart
        </h1>
        <div class="mt-16 flex flex-wrap gap-4 items-center justify-center">
            <Button icon="icon-shopping-cart" label="开始购物"></Button>
            <Button
                severity="secondary"
                icon="icon-upload"
                label="提交物品"
            ></Button>
        </div>
    </div>
</template>
