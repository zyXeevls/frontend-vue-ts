<script setup lang="ts">

import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useLogin } from "@/composables/auth/useLogin";
import Cookies from "js-cookie";

interface ValidationErrors {
    [key: string]: string[];
}

const router = useRouter();

const email = ref<string>("");
const password = ref<string>("");

const errors = reactive<ValidationErrors>({});

const { mutate, isPending } = useLogin();

const handleLogin = (e: Event) => {
    e.preventDefault();

    mutate(
        {
            email: email.value,
            password: password.value,
        },
        {
            onSuccess: (data: any) => {
                const token = data?.token || data?.access_token || data?.data?.token;
                const user = data?.user || data?.data?.user;

                if (token) {
                    Cookies.set("token", token);
                }

                if (user) {
                    Cookies.set("user", JSON.stringify(user));
                }

                router.push("/admin/dashboard");
            },
            onError: (error: any) => {
                const response = error.response?.data;
                const status = error.response?.status;

                Object.keys(errors).forEach((key) => delete errors[key]);

                if (status === 422 && response?.errors) {
                    Object.assign(errors, response.errors);
                    return;
                }

                if (status === 401) {
                    errors.general = [response?.message || "Email atau password salah."];
                    return;
                }

                errors.general = [
                    response?.message || "Gagal login. Cek koneksi atau endpoint backend.",
                ];
            },
        }
    );
};

</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card border-0 rounded-4 shadow-sm ">
                <div class="card-body p-4">
                    <h3 class="card-title mb-4 text-center">Login</h3>
                    <form @submit="handleLogin">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" id="email" v-model="email" class="form-control"
                                placeholder="Masukan Email" :class="{ 'is-invalid': errors.email }" />
                            <div v-if="errors.email" class="invalid-feedback">
                                {{ errors.email[0] }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" id="password" v-model="password" class="form-control"
                                placeholder="Masukan Password" :class="{ 'is-invalid': errors.password }" />
                            <div v-if="errors.password" class="invalid-feedback">
                                {{ errors.password[0] }}
                            </div>
                        </div>
                        <div v-if="errors.general" class="alert alert-danger">
                            {{ errors.general[0] }}
                        </div>
                        <button type="submit" class="btn btn-primary w-100" :disabled="isPending">
                            {{ isPending ? "Logging in..." : "Login" }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>