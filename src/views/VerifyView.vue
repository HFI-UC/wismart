<script setup lang="ts">
import Card from "primevue/card";
import { onMounted, ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import ProgressSpinner from "primevue/progressspinner";
import { postVerify } from "../api";

const props = defineProps<{
    token: string;
}>();

const toast = useToast();

onMounted(async () => {
    if (!props.token) {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: "无效的 token。",
            life: 3000
        });
        router.push("/")
    }
    const response = await postVerify(props.token)
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000
        });
        loading.value = false
        setTimeout(() => router.push("/user/login"), 3000)
    }
    else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000
        });
        loading.value = false
        setTimeout(() => router.push("/"), 2000)
    }
});

const loading = ref(true);
const router = useRouter();
</script>

<template>
    <div class="flex flex-col items-center justify-center w-full">
        <Card class="w-[23rem] sm:w-[28rem] items-center p-4">
            <template #header>
                <h1 class="text-3xl font-bold my-8">验证邮箱</h1>
            </template>
            <template #content>
                <ProgressSpinner
                    v-if="loading"
                    strokeWidth="4"
                    fill="transparent"
                />
                <i
                    v-else
                    class="w-[50px] h-[50px] text-green-500 icon-check"
                >
                </i>
            </template>
        </Card>
    </div>
</template>
