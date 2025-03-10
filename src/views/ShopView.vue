<script setup lang="ts">
import { useRequest } from "vue-request";
import { getProductTypes, postProducts } from "../api";
import Card from "primevue/card";
import Button from "primevue/button";
import Image from "primevue/image";
import Skeleton from "primevue/skeleton";
import Paginator from "primevue/paginator";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Select from "primevue/select";
import { ref, watch } from "vue";

const row = ref(10);
const page = ref(0);
const type = ref<number | null>(null);
const keyword = ref<string | null>(null);
const { data: typesData } = useRequest(getProductTypes);
const { data: productsData, run: fetchProducts } = useRequest(
    () => postProducts(row.value, page.value, type.value, keyword.value),
    { debounceInterval: 300 }
);

watch([row, page, type, keyword], () => {
    productsData.value = undefined;
    fetchProducts();
});
</script>

<template>
    <h1 class="text-4xl font-bold my-8">商店</h1>
    <div class="flex sm:gap-2 my-4 gap-[2%]">
        <IconField class="sm:w-[17rem] w-[49%]">
            <InputText class="sm:w-[17rem] w-full" v-model="keyword" placeholder="搜索"></InputText>
            <InputIcon class="icon-search"></InputIcon>
        </IconField>
        <Select
            class="sm:w-[17rem] w-[49%]"
            v-model="type"
            :options="typesData?.data"
            optionLabel="type"
            optionValue="id"
            placeholder="类型"
            dropdownIcon="icon-boxes"
            showClear
        ></Select>
    </div>
    <div v-if="productsData && productsData.success" class="w-full">
        <div class="flex flex-wrap items-center justify-between w-full gap-y-8">
            <p v-if="!productsData.data.products.length">无可用数据。</p>
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
                            <p class="text-lg">
                                <b class="font-bold">商品描述：</b
                                >{{ product.description }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">商品价格：</b>¥{{
                                    product.price.toFixed(2)
                                }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">商品类型：</b
                                >{{ product.type }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">已售：</b
                                >{{ product.sales }}/{{ product.stock || "∞" }}
                            </p>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex mx-3 gap-4">
                        <Button
                            class="w-full"
                            icon="icon-shopping-cart"
                            label="购买"
                        ></Button>
                    </div>
                </template>
            </Card>
        </div>
        <Paginator
            class="my-4"
            v-model:first="page"
            v-model:rows="row"
            :rowsPerPageOptions="[10, 20, 30]"
            :totalRecords="productsData.data.maxPage + 1"
        ></Paginator>
    </div>
    <div v-else class="w-full min-h-[70vh]">
        <div class="flex flex-wrap items-center justify-between w-full">
            <Card class="sm:w-[49%] w-full">
                <template #header>
                    <div class="flex flex-col gap-2 mx-8 my-8">
                        <Skeleton class="!w-auto !h-[2rem]"></Skeleton>
                        <Skeleton class="!w-[80%] !h-[2rem]"></Skeleton>
                    </div>
                </template>
                <template #content>
                    <div class="mx-3">
                        <Skeleton
                            class="!w-auto !h-[20rem] mt-4 mb-6"
                        ></Skeleton>
                        <div class="my-4 flex flex-col gap-4">
                            <Skeleton class="!w-[90%] !h-[1.75rem]"></Skeleton>
                            <Skeleton class="!w-[85%] !h-[1.75rem]"></Skeleton>
                            <Skeleton class="!w-[90%] !h-[1.75rem]"></Skeleton>
                            <Skeleton class="!w-[75%] !h-[1.75rem]"></Skeleton>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex mx-3 my-2 gap-4">
                        <Skeleton class="w-full !h-[42px]"></Skeleton>
                    </div>
                </template>
            </Card>
            <Card class="sm:w-[49%] w-full">
                <template #header>
                    <div class="flex flex-col gap-2 mx-8 my-8">
                        <Skeleton class="!w-auto !h-[2rem]"></Skeleton>
                        <Skeleton class="!w-[80%] !h-[2rem]"></Skeleton>
                    </div>
                </template>
                <template #content>
                    <div class="mx-3">
                        <Skeleton
                            class="!w-auto !h-[20rem] mt-4 mb-6"
                        ></Skeleton>
                        <div class="my-4 flex flex-col gap-4">
                            <Skeleton class="!w-[90%] !h-[1.75rem]"></Skeleton>
                            <Skeleton class="!w-[85%] !h-[1.75rem]"></Skeleton>
                            <Skeleton class="!w-[83%] !h-[1.75rem]"></Skeleton>
                            <Skeleton class="!w-[85%] !h-[1.75rem]"></Skeleton>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div class="flex mx-3 my-2 gap-4">
                        <Skeleton class="w-full !h-[42px]"></Skeleton>
                    </div>
                </template>
            </Card>
            <Skeleton class="my-4 w-full !h-[58px]"></Skeleton>
        </div>
    </div>
</template>
