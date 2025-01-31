<template>
  <v-container>
    <!-- 날짜 선택 영역 -->
    <v-row>
      <v-col cols="12" md="4">
        <!-- 시작 날짜 선택 (Vuetify의 v-menu + v-date-picker 활용) -->
        <!-- v-menu: 날짜 선택 캘린더 메뉴 -->
        <!-- v-model="startDateMenu": v-menu의 활성화 상태를 관리 -->
        <!-- :close-on-content-click="false": 캘린더 선택 시 자동으로 닫히지 않도록 설정 -->
        <!-- transition="scale-transition": 열릴 때 부드러운 애니메이션 적용 -->
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <!-- v-slot:activator="{ props }"을 이용하여 v-text-field를 클릭하면 v-menu가 열리도록 연결 -->
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              label="시작 날짜"
              v-model="startAtFormatted"  
              readonly  
            />
          </template>

          <!-- 날짜 선택 캘린더 -->
          <!-- v-model="localStartAt": 선택한 날짜 값을 저장 -->
          <!-- @change="closeStartDatePicker": 날짜 선택 시 캘린더를 닫는 이벤트 호출 -->
          <v-date-picker
            v-model="localStartAt"
            @change="closeStartDatePicker"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="4">
        <!-- 종료 날짜 선택 (시작 날짜와 동일한 구조) -->
        <v-menu
          v-model="endDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              label="종료 날짜"
              v-model="endAtFormatted"
              readonly
            />
          </template>
          <v-date-picker
            v-model="localEndAt"
            @change="closeEndDatePicker"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <!-- 주문내역 조회 버튼 -->
      <!-- 클릭 시 emitDateRange() 실행하여 부모 컴포넌트로 선택한 날짜 전달 -->
      <v-btn color="primary" @click="emitDateRange">주문내역 조회</v-btn>
    </v-row>

    <!-- 주문 목록 -->
    <v-row>
      <!-- 주문 정보를 반복 렌더링 -->
      <!-- v-for="order in orders": 주문 리스트를 반복하여 각 주문 정보를 출력 -->
      <!-- :key="order.orderId": Vue가 각 주문을 구별할 수 있도록 key 할당 -->
      <v-col
        v-for="order in orders"
        :key="order.orderId"
        cols="12"
        md="6"
        @click="$router.push(`/myorderdetails/${order.orderId}`)" 
        style="cursor: pointer"  
      >
        <v-card>
          <!-- 주문 상품 이미지 -->
          <!-- v-img: 상품 이미지 표시 -->
          <!-- :src="order.imageUrl": 서버에서 제공한 상품 이미지 URL을 사용 -->
          <!-- height="200px": 이미지 높이 고정 -->
          <v-img :src="order.imageUrl" height="200px" />

          <!-- 주문 제목 -->
          <!-- 주문한 제품 또는 주문서 이름을 표시 -->
          <v-card-title>{{ order.orderName }}</v-card-title>

          <!-- 주문 날짜 및 결제 금액 -->
          <!-- formatDate(order.paidAt): 날짜를 한국식 (YYYY.MM.DD)으로 변환 -->
          <!-- order.orderPrice.toLocaleString(): 1000단위마다 쉼표(,)를 추가하여 가독성을 높임 -->
          <v-card-text>
            {{ formatDate(order.paidAt) }} - {{ order.orderPrice.toLocaleString() }}원
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 페이지네이션 -->
    <!-- 현재 페이지 및 전체 페이지 수를 기반으로 페이지 이동을 처리 -->
    <v-pagination
      :model-value="currentPage"  
      :length="totalPages" 
      @update:model-value="$emit('changePage', $event)" 
    ></v-pagination>
  </v-container>
</template>


<script setup>
import { ref, computed } from 'vue';

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
  orders: { // 주문 목록 배열
    type: Array,
    required: true,
  },
  totalPages: { // 총 페이지 수
    type: Number,
    required: true,
  },
  startAt: { // 시작 날짜
    type: String,
    required: true,
  },
  endAt: { // 종료 날짜
    type: String,
    required: true,
  },
  currentPage: { // 현재 페이지
    type: Number,
    required: true,
  },
});

// 부모 컴포넌트로 이벤트 전송 정의
const emit = defineEmits(['changePage', 'changeDateRange']);

// 날짜 선택 메뉴 상태
const startDateMenu = ref(false);
const endDateMenu = ref(false);

// 로컬에서 관리할 시작 및 종료 날짜
const localStartAt = ref(new Date(props.startAt));
const localEndAt = ref(new Date(props.endAt));

// 날짜 형식 변환 (YYYY.MM.DD)
const startAtFormatted = computed(() =>
  localStartAt.value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
);

const endAtFormatted = computed(() =>
  localEndAt.value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
);

// 날짜 선택 창 닫기 함수
const closeStartDatePicker = () => (startDateMenu.value = false);
const closeEndDatePicker = () => (endDateMenu.value = false);

// 날짜 변경 이벤트 전송
const emitDateRange = () => {
  // 시작 날짜: 00:00:00 설정
  const startAtFormatted = new Date(localStartAt.value);
  startAtFormatted.setHours(0, 0, 0, 0);

  // 종료 날짜: 23:59:59 설정
  const endAtFormatted = new Date(localEndAt.value);
  endAtFormatted.setHours(23, 59, 59, 999);

  // LocalDateTime 형식으로 변환 (YYYY-MM-DDTHH:MM:SS)
  const toLocalDateTime = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  // 변경된 날짜 범위를 부모 컴포넌트로 전송
  emit('changeDateRange', {
    startAt: toLocalDateTime(startAtFormatted),
    endAt: toLocalDateTime(endAtFormatted),
  });
};

// 날짜를 YYYY.MM.DD 형식으로 변환하는 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
</script>
