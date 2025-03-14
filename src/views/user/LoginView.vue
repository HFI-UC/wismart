<script setup lang="ts">
import Card from "primevue/card";
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { z } from "zod";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import VueTurnstile from "vue-turnstile";
import Message from "primevue/message";
import Button from "primevue/button";
import { postLogin, getVerifyLogin, type LoginData } from "../../api";
import { useRequest } from "vue-request";

const props = defineProps<{
    callback?: string;
}>();

const { data: loginData } = useRequest(getVerifyLogin);

watch(
    () => loginData.value,
    () => {
        if (loginData.value?.data) {
            toast.add({
                severity: "error",
                summary: "错误",
                detail: "已登录！",
                life: 3000,
            });
            setTimeout(
                () =>
                    (window.location.href = decodeURIComponent(
                        props.callback || "/"
                    )),
                3000
            );
        }
    }
);

const initialValues = ref<LoginData>({
    email: "",
    password: "",
    turnstileToken: "",
});

const resolver = ref(
    zodResolver(
        z.object({
            email: z
                .string()
                .min(1, { message: "请填写此栏。" })
                .email({ message: "错误的邮箱格式。" }),
            password: z.string().min(1, { message: "请填写此栏。" }),
        })
    )
);

const toast = useToast();

const submitLoading = ref(false);
const turnstileToken = ref("");
const turnstileRef = ref()
const onSubmitEvent = async (form: FormSubmitEvent) => {
    submitLoading.value = true;
    if (!form.valid) {
        return;
    }
    form.values.turnstileToken = turnstileToken.value;
    const response = await postLogin(form.values as LoginData);
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000,
        });
        setTimeout(() => (submitLoading.value = false), 3000);
        setTimeout(
            () =>
                (window.location.href = decodeURIComponent(
                    props.callback || "/"
                )),
            3000
        );
    } else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000,
        });
        turnstileRef.value.reset()
        submitLoading.value = false;
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center w-full">
        <Card class="w-[23rem] sm:w-[28rem] items-center p-4">
            <template #header>
                <h1 class="text-3xl font-bold my-8">登录</h1>
            </template>
            <template #content>
                <Form
                    v-slot="$form"
                    :resolver
                    :initialValues
                    @submit="onSubmitEvent"
                >
                    <div
                        class="flex flex-col gap-4 items-center justify-center"
                    >
                        <div class="flex flex-col gap-2">
                            <IconField>
                                <InputText
                                    class="w-[17rem] sm:w-[20rem]"
                                    name="email"
                                    autocomplete="username"
                                    type="text"
                                    placeholder="邮箱"
                                >
                                </InputText>
                                <InputIcon
                                    class="icon-mail"
                                ></InputIcon> </IconField
                            ><Message
                                v-if="$form.email?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                                >{{ $form.email.error?.message }}</Message
                            >
                        </div>
                        <div class="flex flex-col gap-2">
                            <IconField>
                                <InputText
                                    class="w-[17rem] sm:w-[20rem]"
                                    name="password"
                                    autocomplete="password"
                                    type="password"
                                    placeholder="密码"
                                >
                                </InputText>
                                <InputIcon
                                    class="icon-key-round"
                                ></InputIcon> </IconField
                            ><Message
                                v-if="$form.password?.invalid"
                                severity="error"
                                size="small"
                                variant="simple"
                                >{{ $form.password.error?.message }}</Message
                            >
                        </div>
                        <div
                            class="flex flex-col w-full gap-4 items-center justify-center"
                        >
                            <p class="text-center text-sm">告诉我们你是人类</p>
                            <VueTurnstile
                                ref="turnstileRef"
                                v-model="turnstileToken"
                                site-key="0x4AAAAAAAiw3hAxhw1fzq4B"
                            ></VueTurnstile>
                        </div>
                        <Button
                            type="submit"
                            icon="icon-log-in"
                            :disabled="turnstileToken == ''"
                            :loading="submitLoading"
                            label="登录"
                        ></Button>
                    </div>
                </Form>
            </template>
        </Card>
    </div>
</template>
