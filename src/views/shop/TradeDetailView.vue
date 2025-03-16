<script setup lang="ts">
import { useRequest } from "vue-request";
import {
    getProductTypes,
    getVerifyLogin,
    postChangeTrade,
    postProductDetail,
    postTradeDetail,
    postUserProfile,
    type ProductData,
    type ProductType,
    type TradeDetailData,
    type UserProfile,
} from "../../api";
import { computed, onMounted, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import Image from "primevue/image";
import Button from "primevue/button";
import Tag from "primevue/tag";
import Skeleton from "primevue/skeleton";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const { data: loginData } = useRequest(getVerifyLogin);

const tradeData = ref<{ data: TradeDetailData; message?: string } | null>(null);
const productData = ref<{ data: ProductData; message?: string } | null>(null);
const types = ref<{ data: ProductType[] } | null>(null);
const sellerData = ref<{ data: UserProfile } | null>(null);
const buyerData = ref<{ data: UserProfile } | null>(null);

const fetchTradeDetail = async () => {
    const tradeResponse: { data: TradeDetailData; message?: string } =
        await postTradeDetail(parseInt(route.params.id as string));
    tradeData.value = tradeResponse;

    if (tradeResponse.data) {
        const productResponse = await postProductDetail(
            tradeResponse.data.productId
        );
        productData.value = productResponse;

        const sellerResponse = await postUserProfile(
            tradeResponse.data.sellerId
        );
        sellerData.value = sellerResponse;

        const buyerResponse = await postUserProfile(tradeResponse.data.buyerId);
        buyerData.value = buyerResponse;
    }
};

const fetchProductTypes = async () => {
    const typesResponse = await getProductTypes();
    types.value = typesResponse;
};

onMounted(() => {
    fetchTradeDetail();
    fetchProductTypes();
});

const typesData = computed(() => {
    const data: Record<number, string> = {};
    types.value?.data?.map((item) => (data[item.id] = item.type));
    return data;
});

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

const tagValueMapping: Record<string, string> = {
    pending: "等待中",
    canceled: "已取消",
    completed: "已完成",
};

const tagSeverityMapping: Record<string, string> = {
    pending: "info",
    canceled: "danger",
    completed: "success",
};

const submitLoading = ref(false)

const onChangeEvent = async (data: boolean) => {
    if (!tradeData.value) return;
    submitLoading.value = true
    const status = data ? "completed" : "canceled"
    const response = await postChangeTrade({ id: tradeData.value.data.id, status })
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000,
        });
        submitLoading.value = false;
        fetchTradeDetail();
    } else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000,
        });
        submitLoading.value = false;
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center w-full">
        <div class="w-[23rem] sm:w-[28rem]">
            <Card
                v-if="
                    tradeData?.data &&
                    productData?.data &&
                    buyerData?.data &&
                    sellerData?.data &&
                    types?.data
                "
            >
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
                                >{{ buyerData.data.username }} <<a
                                    class="text-orange-400 hover:text-orange-300 transition-colors duration-300"
                                    :href="`mailto:${buyerData.data.email}`"
                                    >{{ buyerData.data.email }}</a
                                >>
                            </p>
                            <p class="text-lg">
                                <b class="font-bold">卖家：</b
                                >{{ sellerData.data.username }} <<a
                                    class="text-orange-400 hover:text-orange-300 transition-colors duration-300"
                                    :href="`mailto:${sellerData.data.email}`"
                                    >{{ sellerData.data.email }}</a
                                >>
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
                            <p class="text-lg">
                                <b class="font-bold">状态：</b>
                                <Tag
                                    :severity="
                                        tagSeverityMapping[tradeData.data.status]
                                    "
                                    :value="
                                        tagValueMapping[tradeData.data.status]
                                    "
                                ></Tag>
                            </p>
                        </div>
                    </div>
                </template>
                <template #footer>
                    <div v-if="tradeData.data.status == 'pending'" class="flex mx-3 gap-4">
                        <Button
                            class="w-full"
                            icon="icon-check"
                            severity="success"
                            label="完成交易"
                            :loading="submitLoading"
                            @click="onChangeEvent(true)"
                        ></Button>
                        <Button
                            class="w-full"
                            icon="icon-x"
                            severity="danger"
                            label="取消交易"
                            :loading="submitLoading"
                            @click="onChangeEvent(false)"
                        ></Button>
                    </div>
                </template>
            </Card>
            <Skeleton v-else class="!rounded-xl !h-[33rem]"></Skeleton>
        </div>
    </div>
</template>
