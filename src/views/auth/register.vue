<script setup lang="ts">

import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useRegister } from "@/composables/auth/useRegister";

interface ValidationErrors {
    [key: string]: string[];
}

const router = useRouter();

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");

const errors = reactive<ValidationErrors>({});

const { mutate, isPending } = useRegister();

const handleRegister = (e: Event) => {
    e.preventDefault();

    mutate(
        {
            name: name.value,
            email: email.value,
            password: password.value,
        },
        {
            onSuccess: () => {
                router.push("/login");
            },
            onError: (error: any) => {
                const response = error.response?.data;
                const status = error.response?.status;

                Object.keys(errors).forEach((key) => delete errors[key]);

                if (status === 422 && response?.errors) {
                    Object.assign(errors, response.errors);
                    return;
                }

                if (status === 409) {
                    errors.email = [response?.message || "Email sudah terdaftar."];
                    return;
                }

                errors.general = [
                    response?.message || "Gagal register. Cek koneksi atau endpoint backend.",
                ];
            },
        }
    );
};

</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="card border-0 rounded-4 shadow-sm">
                <div class="card-body">
                    <h4 class="fw-bold text-center">REGISTER</h4>
                    <hr />
                    <form @submit.prevent="handleRegister">

                        <div v-if="errors.general" class="alert alert-danger rounded-4">
                            {{ errors.general[0] }}
                        </div>

                        <div class="form-group mb-3">
                            <label class="mb-1 fw-bold">Full Name</label>
                            <input v-model="name" type="text" class="form-control" placeholder="Full Name" />
                            <div v-if="errors.name" class="alert alert-danger mt-2 rounded-4">
                                {{ errors.name[0] }}
                            </div>
                        </div>

                        <div class="form-group mb-3">
                            <label class="mb-1 fw-bold">Email address</label>
                            <input v-model="email" type="email" class="form-control" placeholder="Email Address" />
                            <div v-if="errors.email" class="alert alert-danger mt-2 rounded-4">
                                {{ errors.email[0] }}
                            </div>
                        </div>

                        <div class="form-group mb-3">
                            <label class="mb-1 fw-bold">Password</label>
                            <input v-model="password" type="password" class="form-control" placeholder="Password" />
                            <div v-if="errors.password" class="alert alert-danger mt-2 rounded-4">
                                {{ errors.password[0] }}
                            </div>
                        </div>


                        <button type="submit" class="btn btn-primary w-100 rounded-4" :disabled="isPending">
                            {{ isPending ? 'Loading...' : 'REGISTER' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>