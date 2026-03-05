<script setup lang="ts">
import { useLogout } from '@/composables/auth/useLogout';
import Swal from 'sweetalert2';

const { logout } = useLogout();
const handleLogout = () => {
    Swal.fire({
        title: 'Kamu yakin?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, logout!'
    }).then((result) => {
        if (result.isConfirmed) {
            logout();
        }
    });
};

</script>

<template>
    <div class="card border-0 rounded-4 shadow-sm">
        <div class="card-header">
            MAIN MENU
        </div>
        <div class="card-body">
            <div class="list-group">
                <router-link to="/admin/dashboard" class="list-group-item list-group-item-action">
                    Dashboard
                </router-link>
                <router-link to="/admin/users" class="list-group-item list-group-item-action">
                    Users
                </router-link>
                <a href="#" class="list-group-item list-group-item-action" @click="handleLogout">
                    Logout
                </a>
            </div>
        </div>
    </div>

</template>