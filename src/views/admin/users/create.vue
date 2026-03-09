<script lang="ts" setup>

import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

import SidebarMenu from '@/components/SidebarMenu.vue';
import { useUserCreate } from '@/composables/user/useUserCreate';
import Swal from 'sweetalert2';

interface ValidationErrors {
    [key: string]: string[];
}

const router = useRouter();

const name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

const errors = reactive<ValidationErrors>({});

const { mutate, isPending } = useUserCreate();

const storeUser = (e: Event) => {
    e.preventDefault();

    mutate(
        {
            name: name.value,
            email: email.value,
            password: password.value,
        },
        {
            onSuccess: () => {
                router.push('/admin/users');
            },
            onError: (error: any) => {
                const response = error.response?.data;
                const status = error.response?.status;

                Object.keys(errors).forEach(key => delete errors[key]);

                if (status === 422 && response?.errors) {
                    Object.assign(errors, response.errors);
                    Swal.fire({
                        icon: 'error',
                        title: 'Validation Error',
                        text: 'Please fix the errors in the form.',
                    });
                }

                if (status === 409 && response?.message) {
                    errors.email = [response.message];
                    Swal.fire({
                        icon: 'error',
                        title: 'Conflict Error',
                        text: response.message,
                    });
                    return;
                }

                errors.general = [
                    response?.message || 'Gagal menyimpan user. Cek token, endpoint, atau koneksi backend.',
                ];
                Swal.fire({
                    icon: 'error',
                    title: 'Create User Failed',
                    text: errors.general[0],
                });
            },
        }
    );
}

</script>
<template>
    <div class="container mt-5 mb-5">
        <div class="row">
            <div class="col-md-3">
                <SidebarMenu />
            </div>
            <div class="col-md-9">
                <div class="card border-0 rounded-4 shadow-sm">
                    <div class="card-header">
                        ADD USER
                    </div>
                    <div class="card-body">
                        <form @submit="storeUser">
                            <div v-if="errors.general" class="alert alert-danger rounded-4">
                                {{ errors.general[0] }}
                            </div>

                            <div class="form-group mb-3">
                                <label class="mb-1 fw-bold">Full Name</label>
                                <input type="text" v-model="name" class="form-control" placeholder="Full Name" />
                                <div v-if="errors.name" class="alert alert-danger mt-2 rounded-4">
                                    {{ errors.name[0] }}
                                </div>
                            </div>

                            <div class="form-group mb-3">
                                <label class="mb-1 fw-bold">Email address</label>
                                <input type="email" v-model="email" class="form-control" placeholder="Email Address" />
                                <div v-if="errors.email" class="alert alert-danger mt-2 rounded-4">
                                    {{ errors.email[0] }}
                                </div>
                            </div>

                            <div class="form-group mb-3">
                                <label class="mb-1 fw-bold">Password</label>
                                <input type="password" v-model="password" class="form-control" placeholder="Password" />
                                <div v-if="errors.password" class="alert alert-danger mt-2 rounded-4">
                                    {{ errors.password[0] }}
                                </div>
                            </div>

                            <button type="submit" class="btn btn-md btn-primary rounded-4 shadow-sm border-0"
                                :disabled="isPending">
                                {{ isPending ? 'Saving...' : 'Save' }}
                            </button>

                            <router-link to="/admin/users"
                                class="btn btn-md btn-secondary rounded-4 shadow-sm border-0 ms-2">
                                Cancel
                            </router-link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>