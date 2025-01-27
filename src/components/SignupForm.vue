<template>
  <div class="signup-wrapper">
    <!-- 회원가입 페이지 전체 배경 및 가운데 정렬 -->
    <div class="signup-container">
      <!-- 회원가입 컨테이너: 흰색 배경, 라운드 박스 -->

      <div class="text-center">
        <!-- 회원가입 제목 -->
        <div class="project-name">회원가입</div>
      </div>

      <!-- 회원가입 폼 -->
      <v-form @submit.prevent="handleSignUp" class="form-content">
        <!-- 이름 입력 필드 -->
        <v-text-field v-model="name" label="이름" required outlined dense class="input-field" />

        <!-- 이메일 입력 필드 -->
        <v-text-field v-model="email" label="이메일" type="email" required outlined dense class="input-field" />

        <!-- 핸드폰 번호 입력 필드 -->
        <v-text-field v-model="phoneNumber" label="핸드폰 번호" type="tel" required placeholder="010-1234-5678" outlined
          dense class="input-field" />

        <!-- 우편번호 입력 및 검색 버튼 -->
        <v-layout row wrap justify-space-between>
          <!-- 우편번호 필드 (읽기 전용) -->
          <v-text-field v-model="postcode" label="우편번호" readonly outlined dense class="input-field mr-2" />
          <!-- 우편번호 찾기 버튼 -->
          <v-btn color="blue" dark @click="openAddressSearch">우편번호 찾기</v-btn>
        </v-layout>

        <!-- 도로명 주소 입력 필드 (읽기 전용) -->
        <v-text-field v-model="roadAddress" label="도로명 주소" readonly required outlined dense class="input-field" />

        <!-- 지번 주소 입력 필드 (읽기 전용) -->
        <v-text-field v-model="jibunAddress" label="지번 주소" readonly required outlined dense class="input-field" />

        <!-- 상세 주소 및 참고 항목 입력 -->
        <v-layout row wrap justify-space-between>
          <!-- 상세 주소 필드 -->
          <v-text-field v-model="detailAddress" label="상세 주소" required outlined dense class="input-field mr-2" />
          <!-- 참고 항목 필드 (읽기 전용) -->
          <v-text-field v-model="extraAddress" label="참고 항목" readonly outlined dense class="input-field" />
        </v-layout>

        <!-- 비밀번호 입력 필드 -->
        <v-text-field v-model="password" label="비밀번호" type="password" required outlined dense class="input-field" />
        <!-- 비밀번호 안내 문구 -->
        <small class="password-info">
          비밀번호는 8자 이상이며, 대문자, 소문자, 특수문자를 포함해야 합니다.
        </small>

        <!-- 비밀번호 확인 입력 필드 -->
        <v-text-field v-model="confirmPassword" label="비밀번호 확인" type="password" required outlined dense
          class="input-field" />

        <!-- 가입 유형 선택 (구매자/판매자) -->
        <v-radio-group v-model="role" row class="role-selection">
          <v-radio label="구매자" value="BUYER"></v-radio>
          <v-radio label="판매자" value="SELLER"></v-radio>
        </v-radio-group>

        <!-- 회원가입 버튼 -->
        <v-btn type="submit" color="success" block class="signup-btn">회원가입</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { defineEmits } from "vue";

// 부모 컴포넌트로 이벤트 전달
const emit = defineEmits(["handleSignup"]);

// 사용자 입력 데이터 선언
const name = ref("");
const email = ref("");
const phoneNumber = ref("");
const postcode = ref("");
const roadAddress = ref("");
const jibunAddress = ref("");
const detailAddress = ref("");
const extraAddress = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("BUYER");

// 회원가입 처리 함수
const handleSignUp = () => {
  // 비밀번호와 비밀번호 확인이 일치하지 않을 경우 알림
  if (password.value !== confirmPassword.value) {
    alert("비밀번호 확인과 비밀번호가 일치하지 않습니다");
    return;
  }

  // 가입 유형이 선택되지 않았을 경우 알림
  if (!role.value) {
    alert("가입 유형을 선택해주세요!");
    return;
  }

  // 사용자 정보 객체 생성 및 부모 컴포넌트로 전달
  const userInfo = {
    name: name.value,
    email: email.value,
    phoneNumber: phoneNumber.value,
    postcode: postcode.value,
    roadAddress: roadAddress.value,
    detailAddress: detailAddress.value,
    password: password.value,
    role: role.value,
  };
  emit("handleSignup", userInfo);
};

// 우편번호 검색창 열기 함수
const openAddressSearch = () => {
  new daum.Postcode({
    oncomplete: (data) => {
      // 도로명 주소, 지번 주소, 우편번호 데이터 설정
      roadAddress.value = data.roadAddress;
      jibunAddress.value = data.jibunAddress;
      postcode.value = data.zonecode;

      // 참고 항목 데이터 추가 설정
      let extraRoadAddr = "";
      if (data.bname && /[동|로|가]$/g.test(data.bname)) {
        extraRoadAddr += data.bname;
      }
      if (data.buildingName) {
        extraRoadAddr += extraRoadAddr ? `, ${data.buildingName}` : data.buildingName;
      }
      extraAddress.value = extraRoadAddr ? `(${extraRoadAddr})` : "";
    },
  }).open();
};

// 컴포넌트 마운트 시 우편번호 검색 스크립트 추가
onMounted(() => {
  const script = document.createElement("script");
  script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  script.async = true;
  document.head.appendChild(script);
});
</script>

<style scoped>
/* 회원가입 페이지 스타일 */
.signup-wrapper {
  background-color: #e8e8e8;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.signup-container {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 600px;
  height: 90vh;
  overflow-y: auto;
}

.project-name {
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.input-field {
  margin-bottom: 15px;
}

.password-info {
  color: #666;
  font-size: 12px;
  margin-top: -10px;
  margin-bottom: 15px;
  display: block;
}

.role-selection {
  margin-bottom: 15px;
}

.signup-btn {
  background: #4caf50;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
}

.signup-btn:hover {
  background: #45a049;
}
</style>
