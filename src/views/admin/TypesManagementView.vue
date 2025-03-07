<script setup lang="ts">
import { useRequest } from "vue-request";
import {
    getProductTypes,
    getVerifyAdmin,
    getVerifyLogin,
} from "../../api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";
import { watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
const { data: loginData } = useRequest(getVerifyLogin);
const { data: adminData } = useRequest(getVerifyAdmin);
const { data: typesData, run: fetchProducts } = useRequest(getProductTypes);
const toast = useToast();
const router = useRouter();
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
                        "/product/types"
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
        fetchProducts()
    }
);

</script>

<template>
    <h1 class="text-4xl font-bold my-8">商品类型管理</h1>
    <div
        v-if="adminData?.data && typesData && typesData.success"
        class="flex flex-wrap items-center justify-between w-full gap-y-8"
    >
        <DataTable :value="typesData.data">
            <Column>
                <template #body="slotProps">
                    <p>{{ slotProps.data }}</p>
                </template>
            </Column>
        </DataTable>
    </div>
    <Skeleton v-else class="w-full min-h-[70vh] !rounded-xl"></Skeleton>
</template>
