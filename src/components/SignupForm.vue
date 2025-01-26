<template>
    <div class="signup-wrapper">
      <div class="signup-container">
        <div class="text-center">
          <div class="project-name">회원가입</div>
        </div>
  
        <v-form @submit.prevent="handleSignUp" class="form-content">
          <v-text-field v-model="name" label="이름" required outlined dense class="input-field" />
          <v-text-field v-model="email" label="이메일" type="email" required outlined dense class="input-field" />
          <v-text-field
            v-model="phoneNumber"
            label="핸드폰 번호"
            type="tel"
            required
            placeholder="010-1234-5678"
            outlined
            dense
            class="input-field"
          />
  
          <v-layout row wrap justify-space-between>
            <v-text-field
              v-model="postcode"
              label="우편번호"
              readonly
              outlined
              dense
              class="input-field mr-2"
            />
            <v-btn color="blue" dark @click="openAddressSearch">우편번호 찾기</v-btn>
          </v-layout>
  
          <v-text-field v-model="roadAddress" label="도로명 주소" readonly required outlined dense class="input-field" />
          <v-text-field v-model="jibunAddress" label="지번 주소" readonly required outlined dense class="input-field" />
  
          <v-layout row wrap justify-space-between>
            <v-text-field
              v-model="detailAddress"
              label="상세 주소"
              required
              outlined
              dense
              class="input-field mr-2"
            />
            <v-text-field
              v-model="extraAddress"
              label="참고 항목"
              readonly
              outlined
              dense
              class="input-field"
            />
          </v-layout>
  
          <v-text-field v-model="password" label="비밀번호" type="password" required outlined dense class="input-field" />
          <small class="password-info">
            비밀번호는 8자 이상이며, 대문자, 소문자, 특수문자를 포함해야 합니다.
          </small>
  
          <v-text-field
            v-model="confirmPassword"
            label="비밀번호 확인"
            type="password"
            required
            outlined
            dense
            class="input-field"
          />
  
          <v-radio-group v-model="role" row class="role-selection">
            <v-radio label="구매자" value="BUYER"></v-radio>
            <v-radio label="판매자" value="SELLER"></v-radio>
          </v-radio-group>
  
          <v-btn type="submit" color="success" block class="signup-btn">회원가입</v-btn>
        </v-form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { defineEmits } from "vue";
  
  const emit = defineEmits(["handleSignup"]);
  
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
  
  const handleSignUp = () => {
    if (password.value !== confirmPassword.value) {
      alert("비밀번호 확인과 비밀번호가 일치하지 않습니다");
      return;
    }
  
    if (!role.value) {
      alert("가입 유형을 선택해주세요!");
      return;
    }
  
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
  
  const openAddressSearch = () => {
    new daum.Postcode({
      oncomplete: (data) => {
        roadAddress.value = data.roadAddress;
        jibunAddress.value = data.jibunAddress;
        postcode.value = data.zonecode;
  
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
  
  onMounted(() => {
    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);
  });
  </script>
  
  <style scoped>
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
  