<script setup lang="ts">
import { useRequest } from "vue-request";
import { getAllLogs, getVerifyAdmin, getVerifyLogin } from "../../api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";
import Card from "primevue/card";
import { watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
const { data: loginData } = useRequest(getVerifyLogin);
const { data: adminData } = useRequest(getVerifyAdmin);
const { data: usersData } = useRequest(getAllLogs);
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
                    `/user/login?callback=${encodeURIComponent("/admin/logs")}`
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
    <h1 class="text-4xl font-bold my-8">日志</h1>
    <div
        v-if="usersData && usersData.success && loginData?.data"
        class="flex flex-wrap items-center justify-between w-full gap-y-8"
    >
        <Card class="w-full">
            <template #content>
                <DataTable
                    class="w-full"
                    :value="usersData.data"
                    removableSort
                    paginator
                    :rows="30"
                    :rowsPerPageOptions="[30, 50, 100]"
                >
                    <template #empty>
                        <p>无可用数据。</p>
                    </template>
                    <template #header>
                        <h2 class="text-xl font-bold">日志</h2>
                    </template>
                    <Column field="id" header="ID" sortable> </Column>
                    <Column field="time" header="时间" sortable></Column>
                    <Column
                        field="userAgent"
                        header="用户代理"
                        sortable
                    ></Column>
                    <Column field="ip" header="IP" sortable></Column>
                    <Column field="port" header="端口"></Column>
                    <Column field="url" header="URL" sortable></Column>
                    <Column field="method" header="方法" sortable></Column>
                    <Column field="status" header="状态码" sortable></Column>
                    <Column field="response" header="响应" sortable></Column>
                </DataTable>
            </template>
        </Card>
    </div>
    <Skeleton v-else class="w-full min-h-[70vh] !rounded-xl"></Skeleton>
</template>
