<template>
    <v-container>
      <v-row>
        <!-- 영양성분 목록 영역 -->
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title class="headline">영양성분 목록</v-card-title>
            <!-- v-data-table을 고정 높이 div로 감싸서 스크롤 가능하도록 -->
            <div class="table-container">
              <v-data-table
                :headers="headers"
                :items="nutrients"
                class="elevation-1"
                :items-per-page="50"
                hide-default-footer
              >
                <template #item.description="{ item }">
                  <span>{{ item.description }}</span>
                </template>
              </v-data-table>
            </div>
          </v-card>
        </v-col>
  
        <!-- 새 영양성분 등록 영역 -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title class="headline">새 영양성분 등록</v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="newNutrient.name"
                  label="영양성분 이름"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="newNutrient.description"
                  label="설명"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!valid"
                color="success"
                class="next-btn"
                @click="submitNutrient"
              >
                등록
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '../../api/axios'; // axios 인스턴스 경로에 맞게 수정하세요.
  
  const nutrients = ref([]);
  const headers = [
    { text: '이름', value: 'name' },
    { text: '설명', value: 'description' }
  ];
  
  const newNutrient = ref({
    name: '',
    description: ''
  });
  
  const valid = ref(false);
  const form = ref(null);
  
  const rules = {
    required: value => !!value || '필수 항목입니다.'
  };
  
  // GET /products/nutrients 엔드포인트로 영양성분 목록 조회 및 정렬
  const fetchNutrients = async () => {
    try {
      const response = await api.get('/products/nutrients');
      // 받은 데이터를 이름 기준(한국어 locale)으로 정렬합니다.
      nutrients.value = response.data.sort((a, b) =>
        a.name.localeCompare(b.name, 'ko')
      );
    } catch (error) {
      console.error('영양성분 목록 조회 실패:', error);
    }
  };
  
  // POST /products/nutrients 엔드포인트로 새 영양성분 등록
  const submitNutrient = async () => {
    if (form.value.validate()) {
      try {
        await api.post('/products/nutrients', newNutrient.value);
        alert('영양성분이 등록되었습니다.');
        // 폼 리셋
        newNutrient.value.name = '';
        newNutrient.value.description = '';
        form.value.resetValidation();
        // 최신 목록 갱신
        await fetchNutrients();
      } catch (error) {
        console.error('영양성분 등록 실패:', error);
        alert('영양성분 등록에 실패했습니다.');
      }
    }
  };
  
  onMounted(() => {
    fetchNutrients();
  });
  </script>
  
  <style scoped>
  .table-container {
    max-height: 500px; /* 원하는 높이로 조정 */
    overflow-y: auto;
  }
  
  .v-data-table {
    font-size: 14px;
  }
  
  .v-card {
    padding: 16px;
  }
  
  .next-btn {
    width: 100%;
    height: 50px;
    border-radius: 25px;
  }
  </style>
  