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
      <v-col
        v-for="order in orders"
        :key="order.orderId"
        cols="12"
        md="6"
        @click="$router.push(`/myorderdetails/${order.orderId}`)"
        style="cursor: pointer"
      >
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
    :model-value="currentPage"
                :length="totalPages"
                @update:model-value="$emit('changePage', $event)"
    ></v-pagination>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';

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
    required: true,
  },
  endAt: {
    type: String,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['changePage', 'changeDateRange']);

const startDateMenu = ref(false);
const endDateMenu = ref(false);

const localStartAt = ref(new Date(props.startAt));
const localEndAt = ref(new Date(props.endAt));

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
const closeStartDatePicker = () => (startDateMenu.value = false);
const closeEndDatePicker = () => (endDateMenu.value = false);

const emitDateRange = () => {
  // 시작 날짜: 00:00:00
  const startAtFormatted = new Date(localStartAt.value);
  startAtFormatted.setHours(0, 0, 0, 0);

  // 종료 날짜: 23:59:59
  const endAtFormatted = new Date(localEndAt.value);
  endAtFormatted.setHours(23, 59, 59, 999);

  // LocalDateTime 형식으로 변환
  const toLocalDateTime = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  emit('changeDateRange', {
    startAt: toLocalDateTime(startAtFormatted),
    endAt: toLocalDateTime(endAtFormatted),
  });
};



// 날짜 형식 변환
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
</script>
