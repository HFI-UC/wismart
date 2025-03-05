<script setup lang="ts">
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { ref, watch } from "vue";
import Message from "primevue/message";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import VueTurnstile from "vue-turnstile";
import Card from "primevue/card";
import Select from "primevue/select";
import Skeleton from "primevue/skeleton";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import {
    postNewProduct,
    getVerifyLogin,
    type NewProductData,
    uploadCOS,
    getProductTypes,
} from "../api";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { useRequest } from "vue-request";
import type { FileUploadSelectEvent } from "primevue/fileupload";

const { data: loginData } = useRequest(getVerifyLogin);
const { data: typesData } = useRequest(getProductTypes);
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
                    `/user/login?callback=${encodeURIComponent("/product/new")}`
                );
            }, 3000);
        }
    }
);

const initialValues = ref<NewProductData>({
    name: "",
    type: "",
    price: null,
    description: "",
    image: "",
    stock: null,
    turnstileToken: "",
});

const src = ref<null | string>(null);
const file = ref<null | File>(null);

const onFileSelect = (event: FileUploadSelectEvent) => {
    file.value = event.files[0];
    if (!file.value) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
        src.value = e.target?.result as string;
    };
    reader.readAsDataURL(file.value);
};

const resolver = ref(
    zodResolver(
        z.object({
            name: z.string().min(1, { message: "请填写此栏。" }),
            type: z.string().min(1, { message: "请填写此栏。" }),
            price: z.number({ message: "请填写此栏。" }),
            description: z.string().min(1, { message: "请填写此栏。" }),
            stock: z.number({ message: "请填写此栏。" }),
        })
    )
);

const turnstileToken = ref("");
const submitLoading = ref(false);
const toast = useToast();
const router = useRouter();
const onSubmitEvent = async (form: FormSubmitEvent) => {
    submitLoading.value = true;
    if (!form.valid) {
        submitLoading.value = false;
        return;
    }
    form.values.turnstileToken = turnstileToken.value;
    if (!file.value) {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: "请上传商品照片！",
            life: 3000,
        });
        submitLoading.value = false;
        return;
    }
    const uploadResponse = await uploadCOS(file.value);
    if (!uploadResponse.success) {
        submitLoading.value = false;
        return;
    }
    form.values.image = uploadResponse.data;
    const response = await postNewProduct(form.values as NewProductData);
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
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center w-full">
        <div class="w-[23rem] sm:w-[28rem]">
            <Card v-if="loginData" class="items-center p-4">
                <template #header>
                    <h1 class="text-3xl font-bold my-8">新建商品</h1>
                </template>
                <template #content>
                    <Form
                        v-slot="$form"
                        :resolver
                        :initialValues
                        @submit="onSubmitEvent"
                        autocomplete="off"
                    >
                        <div
                            class="flex flex-col gap-4 items-center justify-center"
                        >
                            <div class="flex flex-col gap-2">
                                <IconField>
                                    <InputText
                                        class="w-[17rem] sm:w-[20rem]"
                                        name="name"
                                        type="text"
                                        placeholder="商品名"
                                    >
                                    </InputText>
                                    <InputIcon
                                        class="icon-package"
                                    ></InputIcon> </IconField
                                ><Message
                                    v-if="$form.name?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                    >{{ $form.name.error?.message }}</Message
                                >
                            </div>
                            <div class="flex flex-col gap-2">
                                <Select
                                    class="w-[17rem] sm:w-[20rem]"
                                    dropdownIcon="icon-boxes"
                                    :options="typesData?.data || []"
                                    name="type"
                                    placeholder="商品类型"
                                ></Select>
                                <Message
                                    v-if="$form.type?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                    >{{ $form.type.error?.message }}</Message
                                >
                            </div>
                            <div class="flex flex-col gap-2">
                                <IconField>
                                    <InputText
                                        class="w-[17rem] sm:w-[20rem]"
                                        name="description"
                                        type="text"
                                        placeholder="商品描述"
                                    >
                                    </InputText>
                                    <InputIcon
                                        class="icon-info"
                                    ></InputIcon> </IconField
                                ><Message
                                    v-if="$form.description?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                    >{{
                                        $form.description.error?.message
                                    }}</Message
                                >
                            </div>
                            <div class="flex flex-col gap-2">
                                <IconField>
                                    <InputNumber
                                        class="w-[17rem] sm:w-[20rem]"
                                        name="price"
                                        :min="1"
                                        mode="currency"
                                        currency="CNY"
                                        locale="zh-CN"
                                        placeholder="单价"
                                    >
                                    </InputNumber>
                                    <InputIcon
                                        class="icon-circle-dollar-sign"
                                    ></InputIcon> </IconField
                                ><Message
                                    v-if="$form.price?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                    >{{ $form.price.error?.message }}</Message
                                >
                            </div>
                            <div class="flex flex-col gap-2">
                                <IconField>
                                    <InputNumber
                                        class="w-[17rem] sm:w-[20rem]"
                                        name="stock"
                                        :min="1"
                                        placeholder="库存"
                                    >
                                    </InputNumber>
                                    <InputIcon
                                        class="icon-archive"
                                    ></InputIcon> </IconField
                                ><Message
                                    v-if="$form.stock?.invalid"
                                    severity="error"
                                    size="small"
                                    variant="simple"
                                    >{{ $form.stock.error?.message }}</Message
                                >
                            </div>
                            <div
                                class="flex flex-col items-center align-center"
                            >
                                <div class="flex">
                                    <FileUpload
                                        mode="basic"
                                        @select="onFileSelect"
                                        accept="image/jpg, image/png, image/jpeg, image/gif, image/tmp, image/tiff"
                                        customUpload
                                        uploadIcon="icon-upload"
                                        auto
                                        chooseLabel="
                                            上传照片
                                        "
                                        class="m-3"
                                    ></FileUpload>
                                </div>
                                <img
                                    v-if="src"
                                    :src="src"
                                    class="shadow-md rounded-xl sm:w-64 m-3"
                                    alt="upload-img"
                                />
                                <p v-if="file" id="file" class="m-3">
                                    {{ file.name }}
                                </p>
                            </div>
                            <div
                                class="flex flex-col w-full gap-4 items-center justify-center"
                            >
                                <p class="text-center text-sm">
                                    告诉我们你是人类
                                </p>
                                <VueTurnstile
                                    v-model="turnstileToken"
                                    site-key="0x4AAAAAAAiw3hAxhw1fzq4B"
                                ></VueTurnstile>
                            </div>
                            <Button
                                :loading="submitLoading"
                                type="submit"
                                icon="icon-upload"
                                label="提交"
                            ></Button>
                        </div>
                    </Form>
                </template>
            </Card>
            <Skeleton v-else class="!rounded-xl !h-[33rem]"></Skeleton>
        </div>
    </div>
</template>
