<template>
   <v-app>
    <v-container class="pb-16"> <!-- 하단 버튼 공간 확보 -->
    
    <!-- 상품 이미지 캐러셀 -->
    <!-- v-carousel: 상품 이미지를 슬라이드 형태로 보여주는 Vuetify 컴포넌트 -->
    <v-row justify="center" class="mb-6">
      <v-carousel hide-delimiters>
        <!-- v-for: 상품의 이미지 배열(sortedImages)을 반복 렌더링 -->
        <!-- :src: 각 이미지의 URL -->
        <v-carousel-item
          v-for="(image, index) in sortedImages"
          :key="index"
          :src="image.imageUrl"
        ></v-carousel-item>
      </v-carousel>
    </v-row>

    <!-- 상품 정보 -->
    <!-- 상품 이름, 회사명, 가격 표시 -->
    <v-row class="product-info mb-6">
      <v-col cols="12">
        <h2 class="font-weight-bold product-name">{{ product.productName }}</h2> <!-- 상품 이름 -->
        <h4 class="grey--text product-company">{{ product.companyName }}</h4> <!-- 회사명 -->
        <h3 class="font-weight-bold green--text product-price">
          {{ formatPrice(product.price) }} <!-- 가격 (포맷팅된 값) -->
        </h3>
      </v-col>
    </v-row>

    <!-- 수량 선택 -->
    <!-- 수량 증가/감소 버튼과 현재 선택된 수량 표시 -->
    <v-row justify="center" align-center class="quantity-selector mb-6">
      <!-- 수량 감소 버튼 -->
      <v-btn icon @click="decrementQuantity">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <!-- 현재 수량 -->
      <span class="mx-4 quantity-value">{{ quantity }}</span>
      <!-- 수량 증가 버튼 -->
      <v-btn icon @click="incrementQuantity">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>

    <!-- 상세정보 탭 -->
    <v-row justify="center" class="my-4">
      <v-col cols="12" md="8">
        <v-tabs v-model="tab" color="green">
          <v-tab :value="0">상품 설명</v-tab>
          <v-tab :value="1">카테고리</v-tab>
          <v-tab :value="2">영양 성분</v-tab>
        </v-tabs>

        <!-- 탭 클릭 시 해당 내용만 보이도록 설정 -->
        <div v-if="tab === 0">
          <h3 class="section-title">상품 설명</h3>
          <p class="product-description">{{ product.description }}</p>
        </div>

        <div v-if="tab === 1">
          <h3 class="section-title">카테고리</h3>
          <p>{{ product.category?.name || '정보 없음' }}</p>
        </div>

        <div v-if="tab === 2">
          <h3 class="section-title">영양 성분</h3>
          <p>{{ product.nutrient?.name || '정보 없음' }}</p>
          <p class="nutrient-description">{{ product.nutrient?.description || '' }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>

    <!-- 하단 고정 버튼 -->
    <v-footer class="footer-container" app>
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-btn color="green" block @click="handlePurchase">구매하기</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn color="primary" block @click="addToCart">장바구니 담기</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
   </v-app>
</template>

<script setup>
import { ref, computed } from "vue"; // Vue Composition API
import api from "../../../api/axios"; // 서버와 통신을 위한 Axios
import { useRouter } from "vue-router"; // 페이지 이동을 위한 Vue Router

// Vue Router 인스턴스 생성
const router = useRouter();
const tab = ref(0); // 선택된 탭 값 (기본값: 상품 설명 탭)

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
  product: {
    type: Object, // 상품 상세 정보를 담은 객체
    required: true, // 필수 값
  },
});

// 상품 이미지 정렬
// - 상품의 이미지 배열을 'position' 값 순서대로 정렬
const sortedImages = computed(() => {
  return [...props.product.images].sort((a, b) => a.position - b.position);
});

// 수량 상태
const quantity = ref(1); // 초기값은 1

// 가격 포맷팅 함수
// - 가격 데이터를 "₩1,000,000" 형식으로 변환
const formatPrice = (price) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(price);
};

// 수량 증가 함수
const incrementQuantity = () => {
  quantity.value++; // 수량 1 증가
};

// 수량 감소 함수
// - 최소 수량은 1로 제한
const decrementQuantity = () => {
  if (quantity.value > 1) quantity.value--;
};

// 장바구니에 상품 추가 함수
const addToCart = async () => {
  try {
    // 요청 데이터 생성
    const payload = {
      productId: props.product.productId, // 상품 ID
      quantity: quantity.value, // 선택된 수량
    };

    // POST 요청으로 장바구니에 추가
    await api.post("/carts", payload);

    // 성공 메시지 출력
    alert("장바구니에 추가되었습니다.");
  } catch (error) {
    // 에러 처리
    console.error("장바구니 추가 실패:", error.response?.data || error.message);
    alert("장바구니 추가에 실패했습니다.");
  }
};

// 구매하기 함수
// - 선택된 상품 데이터를 결제 준비 페이지로 전달
const handlePurchase = () => {
  const totalPriceValue = quantity.value * props.product.price; // 총 금액 계산

  const selectedProduct = {
    productId: props.product.productId, // 상품 ID
    productName: props.product.productName, // 상품 이름
    price: props.product.price, // 상품 가격
    quantity: quantity.value, // 선택된 수량
  };

  // Vue Router를 사용해 결제 준비 페이지로 이동
  router.push({
    name: "BuyerPayReadyView", // 결제 준비 페이지 라우트 이름
    query: {
      products: JSON.stringify([selectedProduct]), // 선택된 상품을 JSON 형식으로 전달
      totalPrice: totalPriceValue, // 총 금액
    },
  });
};
</script>

<style scoped>
/* 상품 정보 스타일 */
.product-info {
  text-align: center;
}

.product-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-company {
  color: #666;
  margin-bottom: 10px;
}

.product-price {
  font-size: 20px;
  font-weight: bold;
  color: #4caf50;
}

/* 수량 선택 스타일 */
.quantity-selector {
  text-align: center;
}

.quantity-value {
  font-size: 18px;
  font-weight: bold;
}

/* 상품 상세 정보 및 카테고리 스타일 */
.product-description {
  font-size: 16px;
  margin-bottom: 10px;
}

.category-title {
  font-weight: bold;
  margin-top: 20px;
}

/* 버튼 영역 스타일 */
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: white;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}
</style>
