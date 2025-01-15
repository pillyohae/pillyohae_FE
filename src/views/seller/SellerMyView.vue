<template>
  <v-app>
    <!-- 내비게이션 바 -->
    <v-app-bar app>
      <v-toolbar-title>Pill요해?</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/seller">홈</v-btn>
      <v-btn text to="/seller/product" color="green">내 상품 보기</v-btn>
      <v-btn text to="#">요청 주문 내역</v-btn>
      <v-btn text to="#">마이페이지</v-btn>
      <v-btn text color="red" @click="logout">로그아웃</v-btn>
    </v-app-bar>

    <!-- 상품 리스트 -->
    <v-main>
      <seller-my-form
        :products="filteredProducts"
        :filters="filters"
        @filter="applyFilter"
        @viewProduct="viewProductDetail"
        @deleteProduct="deleteProduct"
        @addProduct="goToAddProduct"
      />
    </v-main>
  </v-app>
</template>

<script>
import api from "../../api/axios";
import SellerMyForm from "../../components/seller/SellerMyForm.vue";

export default {
  components: { SellerMyForm },
  data() {
    return {
      products: [], // 전체 상품 데이터
      filters: [
        { name: "all", label: "전체", active: true },
        { name: "selling", label: "판매 중", active: false },
        { name: "outOfStock", label: "품절", active: false },
        { name: "deleted", label: "삭제된 상품", active: false },
      ],
      currentFilter: "all", // 현재 선택된 필터
    };
  },
  computed: {
    filteredProducts() {
      // 선택된 필터에 따라 상품 필터링
      switch (this.currentFilter) {
        case "selling":
          return this.products.filter(
            (product) => product.status === "판매중"
          );
        case "outOfStock":
          return this.products.filter((product) => product.status === "품절");
        case "deleted":
          return this.products.filter(
            (product) => product.status === "삭제됨"
          );
        default:
          return this.products; // 전체 상품
      }
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await api.get("/users/sellers/products");
        this.products = response.data.content.map((product) => ({
          ...product,
          status: "판매중", // 기본 상태 설정
          salesCount: 50, // 판매량 예시 값
        }));
      } catch (error) {
        console.error("상품 목록 불러오기 실패:", error.response?.data || error.message);
        alert("상품 목록을 불러올 수 없습니다.");
      }
    },
    applyFilter(filterName) {
      // 필터 변경
      this.filters.forEach((filter) => {
        filter.active = filter.name === filterName;
      });
      this.currentFilter = filterName;
    },
    viewProductDetail(productId) {
      // 상품 상세보기로 이동
      this.$router.push(`/seller/product/${productId}`);
    },
    deleteProduct(productId) {
      // 상품 삭제 (삭제 로직 추가 필요)
      alert(`${productId}번 상품을 삭제합니다.`);
    },
    goToAddProduct() {
      // 상품 등록 페이지로 이동
      this.$router.push("/seller/product/add");
    },
    async logout() {
            console.log("로그아웃 버튼 클릭됨"); // 버튼 클릭 여부 확인

            try {
                // 로그아웃 API 호출
                await api.post('/users/logout', {}, {
                    withCredentials: true, // 쿠키 전송 허용
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}` // 액세스 토큰 추가
                    }
                });

                // 성공적으로 로그아웃하면 로그인 페이지로 이동
                this.$router.push('/login');
                alert('로그아웃 되었습니다.');
            } catch (error) {
                console.error("로그아웃 중 에러:", error.response?.data || error.message);
                alert('로그아웃 실패: 서버 오류');
            }
        }
  },
  mounted() {
    this.fetchProducts(); // 컴포넌트가 마운트되면 상품 데이터를 가져옵니다.
  },
};
</script>

