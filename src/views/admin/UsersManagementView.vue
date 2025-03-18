<script setup lang="ts">
import { useRequest } from "vue-request";
import { getAllUsers, getVerifyAdmin, getVerifyLogin } from "../../api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";
import Card from "primevue/card";
import { watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
const { data: loginData } = useRequest(getVerifyLogin);
const { data: adminData } = useRequest(getVerifyAdmin);
const { data: typesData } = useRequest(getAllUsers);
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
                    `/user/login?callback=${encodeURIComponent("/admin/users")}`
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
    }
);
</script>

<template>
    <h1 class="text-4xl font-bold my-8">用户管理</h1>
    <div
        v-if="typesData && typesData.success && loginData?.data"
        class="flex flex-wrap items-center justify-between w-full gap-y-8"
    >
        <Card class="w-full">
            <template #content>
                <DataTable
                    class="w-full"
                    :value="typesData.data"
                    paginator
                    :rowsPerPageOptions="[10, 20, 30]"
                >
                    <template #empty>
                        <p>无可用数据。</p>
                    </template>
                    <template #header>
                        <h2 class="text-xl font-bold">用户</h2>
                    </template>
                    <Column field="id" header="ID"></Column>
                    <Column field="username" header="用户名"></Column>
                    <Column field="email" header="邮箱"></Column>
                </DataTable>
            </template>
        </Card>
    </div>
    <Skeleton v-else class="w-full min-h-[70vh] !rounded-xl"></Skeleton>
</template>
