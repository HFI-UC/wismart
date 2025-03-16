<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
    getProductTypes,
    getVerifyLogin,
    postBuyProduct,
    postProductDetail,
    type BuyProductData,
    type ProductData,
    type ProductType,
} from "../../api";
import { useRequest } from "vue-request";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import Card from "primevue/card";
import Image from "primevue/image";
import Skeleton from "primevue/skeleton";
import Message from "primevue/message";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import VueTurnstile from "vue-turnstile";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";

const route = useRoute();
const { data: loginData } = useRequest(getVerifyLogin);
const { data: productData } = useRequest<{ data: ProductData, message?: string }>(() =>
    postProductDetail(parseInt(route.params.id as string))
);
const { data: types } = useRequest<{ data: ProductType[] }>(getProductTypes);
const typesData = computed(() => {
    const data: Record<number, string> = {};
    types.value?.data?.map((item) => (data[item.id] = item.type));
    return data;
});
const toast = useToast();
const submitLoading = ref(false);
const initialValues = ref<BuyProductData>({
    turnstileToken: "",
    count: null,
    id: null,
});
const resolver = ref(
    zodResolver(
        z.object({
            count: z.number({ message: "请填写此栏。" }),
        })
    )
);
const turnstileRef = ref();
const turnstileToken = ref("");
const router = useRouter();
onMounted(() => {
    if (!route.params.id) {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: "无效的商品。",
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
                        `/shop/checkout/${route.params.id}`
                    )}`
                );
            }, 3000);
        }
    }
);
const onSubmitEvent = async (form: FormSubmitEvent) => {
    submitLoading.value = true;
    if (!form.valid) {
        submitLoading.value = false;
        return;
    }
    form.values.id = productData.value?.data.id;
    form.values.turnstileToken = turnstileToken.value;
    const response = await postBuyProduct(form.values as BuyProductData);
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000,
        });
        submitLoading.value = false;
        setTimeout(() => {
            router.push("/");
        }, 3000);
    } else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000,
        });
        submitLoading.value = false;
        turnstileRef.value.reset();
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center w-full">
        <div class="w-[23rem] sm:w-[28rem]">
            <Card v-if="productData?.data">
                <template #header>
                    <h1 class="text-center text-3xl font-bold my-8">购买</h1>
                </template>
                <template #content>
                    <Form
                        :initialValues
                        :resolver
                        v-slot="$form"
                        @submit="onSubmitEvent"
                        ><div class="mx-3">
                            <div
                                class="w-full flex items-center justify-center"
                            >
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
                                        typesData[productData.data.type] ||
                                        "未知"
                                    }}
                                </p>
                                <p class="text-lg">
                                    <b class="font-bold">已售：</b
                                    >{{ productData.data.sales }}/{{
                                        productData.data.stock || "∞"
                                    }}
                                </p>
                            </div>
                        </div>
                        <div
                            class="flex flex-col items-center justify-center gap-2 my-4"
                        >
                            <InputNumber
                                class="w-[17rem] sm:w-[20rem]"
                                placeholder="数量"
                                name="count"
                                :min="1"
                                :max="productData.data.stock || undefined"
                                showButtons
                                buttonLayout="horizontal"
                            >
                                <template #incrementicon>
                                    <span class="icon-plus" />
                                </template>
                                <template #decrementicon>
                                    <span class="icon-minus" />
                                </template>
                            </InputNumber>
                            <Message
                                v-if="$form.count?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                                >{{ $form.count.error?.message }}</Message
                            >
                        </div>
                        <div class="mx-3 my-4">
                            <p class="text-lg">
                                <b class="font-bold">总价：</b>¥{{
                                    (
                                        productData.data.price *
                                        ($form.count?.value || 1)
                                    ).toFixed(2)
                                }}
                            </p>
                        </div>
                        <div
                            class="flex flex-col my-4 w-full gap-4 items-center justify-center"
                        >
                            <p class="text-center text-sm">告诉我们你是人类</p>
                            <VueTurnstile
                                ref="turnstileRef"
                                v-model="turnstileToken"
                                site-key="0x4AAAAAAAiw3hAxhw1fzq4B"
                            ></VueTurnstile>
                        </div>
                        <div class="flex mx-3 gap-4">
                            <Button
                                :disabled="turnstileToken == ''"
                                class="w-full"
                                type="submit"
                                icon="icon-shopping-cart"
                                label="购买"
                                :loading="submitLoading"
                            ></Button>
                        </div>
                    </Form>
                </template>
            </Card>
            <Skeleton v-else class="!rounded-xl !h-[33rem]"></Skeleton>
        </div>
    </div>
</template>
