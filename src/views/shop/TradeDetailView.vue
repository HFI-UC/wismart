<script setup lang="ts">
import { useRequest } from "vue-request";
import {
    getProductTypes,
    getVerifyLogin,
    postProductDetail,
    postTradeDetail,
    postUserProfile,
    type ProductData,
    type ProductType,
    type TradeDetailData,
    type UserProfile,
} from "../../api";
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import Image from "primevue/image";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const { data: loginData } = useRequest(getVerifyLogin);
const { data: tradeData } = useRequest<{
    data: TradeDetailData;
    message?: string;
}>(() => postTradeDetail(parseInt(route.params.id as string)));
const { data: productData } = useRequest<{
    data: ProductData;
    message?: string;
}>(() => postProductDetail(tradeData.value?.data.id || -1));
const { data: types } = useRequest<{ data: ProductType[] }>(getProductTypes);
const typesData = computed(() => {
    const data: Record<number, string> = {};
    types.value?.data?.map((item) => (data[item.id] = item.type));
    return data;
});
const { data: sellerData } = useRequest<{ data: UserProfile}>(() => postUserProfile(tradeData.value?.data.sellerId as number))
const { data: buyerData } = useRequest<{ data: UserProfile}>(() => postUserProfile(tradeData.value?.data.buyerId as number))

onMounted(() => {
    if (!route.params.id) {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: "无效的交易。",
            life: 3000,
        });
        router.push("/");
    }
});

watch(
    () => loginData.value,
    () => {
        if (!loginData.value?.data) {
            toast.add({
                severity: "error",
                summary: "错误",
                detail: "请登录！",
                life: 3000,
            });
            setTimeout(() => {
                router.push(
                    `/user/login?callback=${encodeURIComponent(
                        `/user/trade/detail/${route.params.id}`
                    )}`
                );
            }, 3000);
        }
    }
);

watch(
    () => tradeData.value,
    () => {
        if (!tradeData.value?.message) {
            toast.add({
                severity: "error",
                summary: "错误",
                detail: tradeData.value?.message,
                life: 3000,
            });
        }
    }
);
</script>

<template>
    <div class="flex flex-col items-center justify-center w-full">
        <div class="w-[23rem] sm:w-[28rem]">
            <Card v-if="tradeData?.data && productData?.data">
                <template #header>
                    <h1 class="text-center text-3xl font-bold my-8">
                        交易 #{{ tradeData.data.id }}
                    </h1>
                </template>
                <template #content>
                    <div class="mx-3">
                        <div class="w-full flex items-center justify-center">
                            <Image
                                class="w-full h-[20rem] items-center justify-center mt-4 mb-6"
                                v-if="productData.data.image"
                                preview
                            >
                                <template #image>
                                    <img
                                        class="h-full object-contain"
                                        :src="productData.data.image"
                                        alt="image"
                                    />
                                </template>
                                <template #original="slotProps">
                                    <img
                                        :src="productData.data.image"
                                        alt="preview"
                                        :style="slotProps.style"
                                        @click="slotProps.previewCallback()"
                                    />
                                </template>
                            </Image>
                            <div
                                v-else
                                class="flex items-center justify-center h-[20rem] mt-4 mb-6"
                            >
                                <i
                                    class="!text-[8em] text-gray-300 icon-image-off"
                                >
                                </i>
                            </div>
                        </div>
                        <div class="my-4 flex flex-col gap-4">
                            <p class="text-lg">
                                <b class="font-bold">商品名：</b>
                                {{ productData.data.name }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">商品描述：</b
                                >{{ productData.data.description }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">商品价格：</b>¥{{
                                    productData.data.price.toFixed(2)
                                }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">商品类型：</b
                                >{{
                                    typesData[productData.data.type] || "未知"
                                }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">买家：</b
                                >{{
                                    buyerData?.data.username
                                }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">卖家：</b
                                >{{
                                    sellerData?.data.username
                                }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">购买个数：</b
                                >{{ tradeData.data.count }}
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">总价：</b>¥{{
                                    tradeData.data.total.toFixed(2)
                                }}
                            </p>
                        </div>
                    </div>
                </template>
            </Card>
            <Skeleton v-else class="!rounded-xl !h-[33rem]"></Skeleton>
        </div>
    </div>
</template>
