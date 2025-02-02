<template>
    <v-app>
        <main-navigation-bar />

        <v-main class="main-background">
            <!-- 검색창 -->
            <v-container class="search-container mt-4">
                <v-row align-center justify="space-between">
                    <v-col cols="6" md="2">
                        <v-select v-model="searchType" :items="searchOptions" label="검색 조건" outlined dense
                            hide-details />
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="searchQuery" label="검색어를 입력하세요" outlined dense hide-details />
                    </v-col>

                    <v-col cols="6" md="1">
                        <v-btn color="green" block @click="onSearch">검색</v-btn>
                    </v-col>

                    <v-col cols="6" md="2">
                        <v-select v-model="selectedSort" :items="sortOptions" item-title="label" item-value="value"
                            label="정렬 조건" outlined dense hide-details />
                    </v-col>
                </v-row>
            </v-container>

            <!-- 상품 목록 -->
            <v-container class="buyer-main-view mt-4">
                <seller-main-form  :products="filteredProducts"></seller-main-form>
            </v-container>

            <!-- 페이지네이션 -->
            <v-pagination :model-value="currentPage" :length="totalPages" @update:model-value="updatePage"
                class="mt-4" />
        </v-main>
    </v-app>
</template>

<script setup>
import MainNavigationBar from './MainNavigationBar.vue';
import SellerMainForm from '../components/seller/SellerMainForm.vue';
import { onMounted } from 'vue';
import { useProducts } from './composable/useProducts';
const {
    searchType,
    searchQuery,
    selectedSort,
    sortOptions,
    searchOptions,
    filteredProducts,
    currentPage,
    totalPages,
    updatePage,
    onSearch,
    fetchProducts,
} = useProducts();

onMounted(fetchProducts);
</script>