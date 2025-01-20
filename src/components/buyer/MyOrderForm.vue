<template>
  <v-container>
    <!-- 날짜 선택 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-bind="props"
              label="시작 날짜"
              v-model="startAtFormatted"
              readonly
            />
          </template>
          <v-date-picker
            v-model="localStartAt"
            @change="closeStartDatePicker"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4">
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
      <v-btn color="primary" @click="emitDateRange">주문내역 조회</v-btn>
    </v-row>

    <!-- 주문 목록 -->
    <v-row>
      <v-col v-for="order in orders" :key="order.orderId" cols="12" md="6" @click="router.push(`/myorderdetails/${order.orderId}`)" style="cursor: pointer">
        <v-card>
          <v-img :src="order.imageUrl" height="200px" />
          <v-card-title>{{ order.orderName }}</v-card-title>
          <v-card-text>
            {{ formatDate(order.paidAt) }} - {{ order.orderPrice.toLocaleString() }}원
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 페이지네이션 -->
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @input="emitPageChange"
    ></v-pagination>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import router from "../../router";

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  startAt: {
    type: String,
    default: null,
  },
  endAt: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['changePage', 'changeDateRange']);

const currentPage = ref(1);
const startDateMenu = ref(false);
const endDateMenu = ref(false);

const localStartAt = ref(props.startAt ? new Date(props.startAt) : new Date());
const localEndAt = ref(props.endAt ? new Date(props.endAt) : new Date());

// 화면 표시용 포맷
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

// 날짜 선택 창 닫기
const closeStartDatePicker = () => {
  startDateMenu.value = false;
};
const closeEndDatePicker = () => {
  endDateMenu.value = false;
};

// 서버에 맞는 날짜 형식으로 변환
const formatDateToServer = (date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 19); // 초 단위 제외
};

// 날짜 범위 전달
const emitDateRange = () => {
  emit('changeDateRange', {
    startAt: formatDateToServer(localStartAt.value), // 서버에 맞는 시작 날짜
    endAt: formatDateToServer(localEndAt.value),   // 서버에 맞는 종료 날짜
  });
};

// 페이지 변경 전달
const emitPageChange = (page) => {
  emit('changePage', page);
};

// 주문 시간 포맷
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// props 변화 감지 및 로컬 데이터 업데이트
watch([() => props.startAt, () => props.endAt], ([newStart, newEnd]) => {
  localStartAt.value = newStart ? new Date(newStart) : new Date();
  localEndAt.value = newEnd ? new Date(newEnd) : new Date();
});
</script>
