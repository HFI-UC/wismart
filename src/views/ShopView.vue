<script setup lang="ts">
import { useRequest } from "vue-request";
import { postProducts } from "../api";
import Card from "primevue/card";
import Button from "primevue/button";
import Image from "primevue/image";
import Skeleton from "primevue/skeleton";
import { ref } from "vue";
const row = ref(10);
const page = ref(0);
const type = ref<string | null>(null);
const keyword = ref<string | null>(null);
const { data: productsData } = useRequest(() =>
    postProducts(row.value, page.value, type.value, keyword.value)
);
</script>

<template>
    <h1 class="text-4xl font-bold my-8">商店</h1>
    <div
        v-if="productsData && productsData.success"
        class="flex flex-wrap items-center justify-between w-full gap-y-8"
    >
        <Card
            class="sm:w-[49%] w-full"
            v-for="product in productsData.data.products"
        >
            <template #header>
                <h2 class="mx-8 text-3xl font-bold my-8">
                    {{ product.name }}
                </h2>
            </template>
            <template #content>
                <div class="mx-3">
                    <div class="w-full flex items-center justify-center">
                        <Image
                            class="w-full h-[20rem] items-center justify-center mt-4 mb-6"
                            preview
                        >
                            <template #image>
                                <img
                                    class="h-full object-contain"
                                    :src="product.image"
                                    alt="image"
                                />
                            </template>
                            <template #original="slotProps">
                                <img
                                    :src="product.image"
                                    alt="preview"
                                    :style="slotProps.style"
                                    @click="slotProps.previewCallback()"
                                />
                            </template>
                        </Image>
                    </div>
                    <div class="my-4 flex flex-col gap-4">
                        <p class="text-lg"><b class="font-bold">商品描述：</b>{{ product.description }}</p>
                        <p class="text-lg"><b class="font-bold">商品价格：</b>¥{{ product.price.toFixed(2) }}</p>
                        <p class="text-lg"><b class="font-bold">商品类型：</b>{{ product.type }}</p>
                        <p class="text-lg"><b class="font-bold">已售：</b>{{ product.sales }}/{{ product.stock }}</p>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex mx-3 gap-4">
                    <Button class="w-full" icon="icon-shopping-cart" label="购买"></Button>
                </div>
            </template>
        </Card>
    </div>
    <Skeleton v-else class="w-full min-h-[70vh] !rounded-xl"></Skeleton>
</template>
