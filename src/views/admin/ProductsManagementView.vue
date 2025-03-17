<script setup lang="ts">
import { useRequest } from "vue-request";
import {
    getAllProducts,
    getProductTypes,
    getVerifyAdmin,
    getVerifyLogin,
    postChangeProduct,
    postRemoveProduct,
    type ChangeProductData,
    type ProductData,
    type ProductType,
} from "../../api";
import Card from "primevue/card";
import Button from "primevue/button";
import Image from "primevue/image";
import Skeleton from "primevue/skeleton";
import Tag from "primevue/tag";
import { computed, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useRouter } from "vue-router";
const { data: loginData } = useRequest(getVerifyLogin);
const { data: adminData } = useRequest(getVerifyAdmin);
const { data: types } = useRequest<{ data?: ProductType[] }>(getProductTypes);
const typesData = computed(() => {
    const data: Record<number, string> = {};
    types.value?.data?.map((item) => {
        data[item.id] = item.type;
    });
    return data;
});
const { data: products, run: fetchProducts } = useRequest(getAllProducts);
const productsData = computed(
    () =>
        products.value?.data.sort(
            (a, b) => Number(a.isVerified) - Number(b.isVerified)
        ) || []
);
const toast = useToast();
const router = useRouter();
const confirm = useConfirm();
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
                        "/admin/verify"
                    )}`
                );
            }, 3000);
        }
    }
);
watch(
    () => adminData.value,
    () => {
        if (!adminData.value?.data && loginData.value?.data) {
            toast.add({
                severity: "error",
                summary: "错误",
                detail: "非管理员！",
                life: 3000,
            });
            setTimeout(() => {
                router.push("/");
            }, 3000);
        }
        fetchProducts();
    }
);

const verifyLoading = ref<boolean[]>([]);
const rejectLoading = ref<boolean[]>([]);
const deleteLoading = ref(false);

const deleteProduct = (product: ProductData) => {
    confirm.require({
        message: "你确定要删除该产品吗？",
        header: "确认",
        icon: "icon-triangle-alert",
        rejectProps: {
            label: "取消",
            severity: "secondary",
            outlined: true,
        },
        acceptProps: {
            label: "确认",
        },
        accept: async () => {
            deleteLoading.value = true;
            const response = await postRemoveProduct(product.id);
            if (response.success) {
                toast.add({
                    severity: "success",
                    summary: "成功",
                    detail: response.message,
                    life: 3000,
                });
                deleteLoading.value = false;
                fetchProducts();
            } else {
                toast.add({
                    severity: "error",
                    summary: "错误",
                    detail: response.message,
                    life: 3000,
                });
                deleteLoading.value = false;
            }
        },
    });
};
const verifyProduct = async (isVerified: boolean, product: ProductData) => {
    if (isVerified) verifyLoading.value[product.id] = true;
    else rejectLoading.value[product.id] = true;
    const newProduct: ChangeProductData = {
        ...product,
        details: isVerified
            ? `你的商品“${product.name}”已上架。`
            : `你的商品“${product.name}”已下架。`,
    };
    newProduct.isVerified = isVerified;
    const response = await postChangeProduct(newProduct);
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000,
        });
        if (isVerified) verifyLoading.value[product.id] = false;
        else rejectLoading.value[product.id] = false;
    } else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000,
        });
        if (isVerified) verifyLoading.value[product.id] = false;
        else rejectLoading.value[product.id] = false;
    }
    if (isVerified) verifyLoading.value[product.id] = false;
    else rejectLoading.value[product.id] = false;
    fetchProducts();
};
</script>

<template>
    <h1 class="text-4xl font-bold my-8">商品管理</h1>
    <div
        v-if="adminData?.data && products && products.success"
        class="flex flex-wrap items-start justify-between w-full gap-y-8"
    >
        <p v-if="!productsData.length">无可用数据。</p>
        <Card class="md:w-[49%] w-full" v-for="product in productsData">
            <template #header>
                <h2 class="mx-8 text-3xl font-bold my-8">
                    {{ product.name }}
                </h2>
            </template>
            <template #content>
                <div class="mx-3">
                    <div class="w-full flex items-center justify-center">
                        <Image
                            class="w-full h-[20rem] items-center justify-center mt-4 mb-6 !rounded-xl"
                            v-if="product.image"
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
                        <div
                            v-else
                            class="flex items-center justify-center h-[20rem] mt-4 mb-6"
                        >
                            <i class="!text-[8em] text-gray-300 icon-image-off">
                            </i>
                        </div>
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
                            >{{ typesData[product.type] || "未知" }}
                        </p>
                        <p class="text-lg">
                            <b class="font-bold">已售：</b
                            >{{ product.sales }}/{{ product.stock || "∞" }}
                        </p>
                        <p class="text-lg">
                            <b class="font-bold">上传者：</b
                            >{{ product.ownerId }}
                        </p>
                        <p class="text-lg">
                            <b class="font-bold">状态：</b>
                            <Tag
                                :severity="
                                    product.isVerified ? 'success' : 'warn'
                                "
                                :value="
                                    product.isVerified ? '已上架' : '未上架'
                                "
                            ></Tag>
                        </p>
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="flex mx-3 gap-4">
                    <Button
                        class="w-full"
                        severity="success"
                        icon="icon-check"
                        label="上架"
                        :loading="verifyLoading[product.id]"
                        @click="verifyProduct(true, product)"
                    ></Button>
                    <Button
                        class="w-full"
                        severity="danger"
                        icon="icon-x"
                        label="下架"
                        :loading="rejectLoading[product.id]"
                        @click="verifyProduct(false, product)"
                    ></Button>
                    <Button
                        class="w-full"
                        severity="danger"
                        icon="icon-x"
                        label="删除"
                        outlined
                        :loading="rejectLoading[product.id]"
                        @click="deleteProduct(product)"
                    ></Button>
                </div>
            </template>
        </Card>
    </div>
    <div v-else class="w-full min-h-[70vh]">
        <div class="flex flex-wrap items-center justify-between w-full gap-y-8">
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
        </div>
    </div>
</template>
