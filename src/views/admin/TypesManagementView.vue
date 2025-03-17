<script setup lang="ts">
import { useRequest } from "vue-request";
import {
    getProductTypes,
    getVerifyAdmin,
    getVerifyLogin,
    postChangeProductType,
    postCreateProductType,
    postRemoveProductType,
} from "../../api";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Skeleton from "primevue/skeleton";
import Card from "primevue/card";
import Button from "primevue/button";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { ref, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import Message from "primevue/message";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
const { data: loginData } = useRequest(getVerifyLogin);
const { data: adminData } = useRequest(getVerifyAdmin);
const { data: typesData, run: fetchTypes } = useRequest(getProductTypes);
const toast = useToast();
const initialValues = ref({
    type: "",
});
const resolver = ref(
    zodResolver(
        z.object({
            type: z.string().min(1, { message: "请填写此栏。" }),
        })
    )
);
const visible = ref(false);
const changeVisible = ref(false);
const changeId = ref<number | null>(null);
const changeLoading = ref(false);
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
        fetchTypes();
    }
);

const createLoading = ref(false);
const onCreateEvent = async (form: FormSubmitEvent) => {
    createLoading.value = true;
    if (!form.valid) {
        createLoading.value = false;
        return;
    }
    const response = await postCreateProductType(form.values.type);
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000,
        });
        createLoading.value = false;
        form.reset();
        fetchTypes();
        visible.value = false;
    } else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000,
        });
        createLoading.value = false;
    }
};

const onDeleteEvent = async (type: number) => {
    const response = await postRemoveProductType(type);
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000,
        });
        fetchTypes();
        visible.value = false;
    } else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000,
        });
    }
};

const onChangeEvent = async (form: FormSubmitEvent) => {
    changeLoading.value = true;
    if (!form.valid || !changeId.value) {
        changeLoading.value = false;
        return;
    }
    const response = await postChangeProductType({ id: changeId.value, type: form.values.type});
    if (response.success) {
        toast.add({
            severity: "success",
            summary: "成功",
            detail: response.message,
            life: 3000,
        });
        changeLoading.value = false;
        form.reset();
        fetchTypes();
        changeVisible.value = false;
        changeId.value = null
    } else {
        toast.add({
            severity: "error",
            summary: "错误",
            detail: response.message,
            life: 3000,
        });
        changeLoading.value = false;
    }
}
</script>

<template>
    <h1 class="text-4xl font-bold my-8">商品类型管理</h1>
    <Dialog v-model:visible="visible" header="新建类型">
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onCreateEvent"
            autocomplete="off"
        >
            <div class="flex flex-col gap-4 items-center justify-center">
                <div class="flex flex-col gap-2">
                    <InputText
                        class="w-[17rem] sm:w-[20rem]"
                        name="type"
                        type="text"
                        placeholder="类型"
                    ></InputText>
                    <Message
                        v-if="$form.type?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.type.error?.message }}</Message
                    >
                </div>
                <Button
                    type="submit"
                    label="新建"
                    icon="icon-plus"
                    :loading="createLoading"
                ></Button>
            </div>
        </Form>
    </Dialog>
    <Dialog v-model:visible="changeVisible" header="修改类型">
        <Form
            v-slot="$form"
            :initialValues
            :resolver
            @submit="onChangeEvent"
            autocomplete="off"
        >
            <div class="flex flex-col gap-4 items-center justify-center">
                <div class="flex flex-col gap-2">
                    <InputText
                        class="w-[17rem] sm:w-[20rem]"
                        name="type"
                        type="text"
                        placeholder="新类型"
                    ></InputText>
                    <Message
                        v-if="$form.type?.invalid"
                        severity="error"
                        size="small"
                        variant="simple"
                        >{{ $form.type.error?.message }}</Message
                    >
                </div>
                <Button
                    type="submit"
                    label="更改"
                    icon="icon-pen"
                    :loading="changeLoading"
                ></Button>
            </div>
        </Form>
    </Dialog>
    <div
        v-if="typesData && typesData.success && loginData?.data"
        class="flex flex-wrap items-center justify-between w-full gap-y-8"
    >
        <Card class="w-full">
            <template #content>
                <DataTable class="w-full" :value="typesData.data">
                    <template #header>
                        <div class="flex justify-between items-center w-full">
                            <h2 class="text-xl font-bold">商品类型</h2>
                            <Button
                                icon="icon-plus"
                                @click="visible = true"
                            ></Button>
                        </div>
                    </template>
                    <Column field="id" header="ID"></Column>
                    <Column field="type" header="类型"></Column>
                    <Column header="操作">
                        <template #body="slotProps">
                            <div class="flex gap-2">
                            <Button
                                icon="icon-trash-2"
                                severity="danger"
                                @click="onDeleteEvent(slotProps.data.id)"
                            ></Button>
                            <Button
                                icon="icon-pen"
                                @click="
                                        (changeId = slotProps.data.id),
                                        (changeVisible = true)
                                "
                            ></Button></div>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>
    <Skeleton v-else class="w-full min-h-[70vh] !rounded-xl"></Skeleton>
</template>
