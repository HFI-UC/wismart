<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import Button from "primevue/button";
import { onMounted, ref } from "vue";
import Toast from "primevue/toast";

const router = useRouter()
const iconClass = ref("icon-sun");
const toggleColorScheme = () => {
    let color = sessionStorage.getItem("color") == "white" ? "dark" : "white";
    sessionStorage.setItem("color", color);
    const root = document.getElementsByTagName("html")[0];
    root.classList.toggle("p-dark");
    iconClass.value = color == "white" ? "icon-sun" : "icon-moon";
};

onMounted(() => {
    const color =
        sessionStorage.getItem("color") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light");
    if (color == "dark") {
        sessionStorage.setItem("color", color);
        const root = document.getElementsByTagName("html")[0];
        root.classList.toggle("p-dark");
        iconClass.value = "icon-moon";
    }
});
</script>

<template>
    <Toast></Toast>
    <div class="sm:mx-[3rem] sm:my-[2rem] mx-[2rem] my-[1.2rem]">
        <div class="flex w-full justify-between">
            <div>
                <Button
                    icon="icon-house"
                    @click="router.push('/')"
                    severity="secondary"
                    rounded
                ></Button>
            </div>
            <div class="flex gap-2">
                <Button
                    :icon="iconClass"
                    @click="toggleColorScheme()"
                    rounded
                ></Button>
                <Button
                    icon="icon-log-in"
                    severity="success"
                    label="登录"
                    @click="router.push('/user/login')"
                    rounded
                ></Button>
                <Button
                    icon="icon-user-round-plus"
                    @click="router.push('/user/register')"
                    severity="secondary"
                    label="注册"
                    rounded
                ></Button>
            </div>
        </div>
        <RouterView class="my-8"></RouterView>
    </div>
</template>
