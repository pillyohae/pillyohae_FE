<template>
    <v-app>
        <admin-navigation-bar />

        <v-main>
            <v-container>
                <!-- 페이지 제목 -->
                <v-row justify="center">
                    <v-col cols="12" class="text-center">
                        <h2 class="admin-title">관리자 메인 - 영양성분 관리</h2>
                    </v-col>
                </v-row>

                <!-- 영양성분 관리 컴포넌트 -->
                <admin-main-form />
            </v-container>
        </v-main>
    </v-app>

</template>

<script setup>
import AdminNavigationBar from './AdminNavigationBar.vue';
import AdminMainForm from '../../components/admin/AdminMainForm.vue';
</script>

<style></style>