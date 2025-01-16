<template>
    <v-form @submit.prevent="handleSignUp">
        <!-- 이름 입력 -->
        <v-text-field v-model="name" label="이름" required />
        <!-- 이메일 입력 -->
        <v-text-field v-model="email" label="이메일" type="email" required />

        <!-- 핸드폰 번호 입력 -->
        <v-text-field 
            v-model="phoneNumber" 
            label="핸드폰 번호" 
            type="tel" 
            required 
            placeholder="010-1234-5678"
        />

        <!-- 우편번호 입력 -->
        <v-layout align-center>
            <v-text-field
                v-model="postcode"
                label="우편번호"
                readonly
                class="mr-2"
                required
            />
            <v-btn color="blue" dark @click="openAddressSearch">
                우편번호 찾기
            </v-btn>
        </v-layout>

        <!-- 도로명 주소 입력 -->
        <v-text-field
            v-model="roadAddress"
            label="도로명 주소"
            readonly
            required
        />
        <!-- 지번 주소 입력 -->
        <v-text-field
            v-model="jibunAddress"
            label="지번 주소"
            readonly
            required
        />
        <!-- 상세 주소 입력 -->
        <v-text-field v-model="detailAddress" label="상세 주소" required />
        <!-- 참고 항목 입력 -->
        <v-text-field v-model="extraAddress" label="참고 항목" readonly />

        <!-- 비밀번호 입력 -->
        <v-text-field v-model="password" label="비밀번호" type="password" required />
        <!-- 비밀번호 확인 -->
        <v-text-field
            v-model="confirmPassword"
            label="비밀번호 확인"
            type="password"
            required
        />

        <!-- 역할 선택 (구매자 or 판매자) -->
        <v-radio-group v-model="role" row>
            <v-radio label="구매자" value="BUYER"></v-radio>
            <v-radio label="판매자" value="SELLER"></v-radio>
        </v-radio-group>

        <!-- 회원가입 버튼 -->
        <v-btn type="submit" color="green" block class="mt-4">회원가입</v-btn>
    </v-form>
</template>

<script>
export default { // Vue 컴포넌트의 기본 구조
    data() { // 컴포넌트 내부에서 사용하는 데이터 정의
        return { // Vue의 반응형 데이터 속성
            name: '', // 사용자 이름
            email: '', // 이메일 주소
            phoneNumber: '', // 핸드폰 번호
            postcode: '', // 우편번호
            roadAddress: '', // 도로명 주소
            detailAddress: '', // 상세 주소
            password: '', // 사용자 비밀번호
            confirmPassword: '', // 비밀번호 확인
            role: 'BUYER', // 가입 유형 기본값 설정
        };
    },
    
    mounted() { // Vue의 생명주기 메서드, 컴포넌트가 DOM에 마운트될 때 실행
        // 카카오 주소 API 스크립트를 동적으로 로드
        const script = document.createElement('script'); // HTML 문서에 새로운 <script> 태그 생성
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'; // 카카오 주소 검색 API URL
        script.async = true; // 비동기 로드 설정, 페이지 로딩 지연 방지
        document.head.appendChild(script); // <head> 태그에 <script> 추가
    },

    methods: { // Vue 컴포넌트 내부에서 사용할 메서드 정의
        handleSignUp() { // 회원가입 버튼 클릭 시 호출
            if (this.password !== this.confirmPassword) { // 비밀번호와 비밀번호 확인 값이 다른 경우
                alert('비밀번호가 일치하지 않습니다.'); // 경고 메시지 표시
                return; // 함수 종료
            }

            if (!this.role) { // 가입 유형이 선택되지 않은 경우
                alert('가입 유형을 선택해주세요.'); // 경고 메시지 표시
                return; // 함수 종료
            }

            // 부모 컴포넌트로 회원가입 데이터 전달
            this.$emit('signup', { // 이벤트 emit
                name: this.name,
                email: this.email,
                phoneNumber: this.phoneNumber, // 핸드폰 번호 포함
                postcode: this.postcode,
                roadAddress: this.roadAddress,
                detailAddress: this.detailAddress,
                password: this.password,
                role: this.role,
            });
        },
        openAddressSearch() { // 카카오 주소 검색 API 호출
            new daum.Postcode({ // 카카오 Postcode 객체 생성
                oncomplete: (data) => { // 주소 검색 완료 시 호출
                    // 도로명 주소 및 지번 주소를 Vue 데이터에 저장
                    this.roadAddress = data.roadAddress; // 도로명 주소
                    this.jibunAddress = data.jibunAddress; // 지번 주소
                    this.postcode = data.zonecode; // 우편번호

                    // 추가 주소 정보 설정
                    let extraRoadAddr = '';
                    if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) { // 법정동, 도로, 가로 끝나는 주소 확인
                        extraRoadAddr += data.bname; // 추가 주소에 법정동 추가
                    }
                    if (data.buildingName !== '') { // 건물 이름이 있고, 아파트인 경우
                        extraRoadAddr +=
                            extraRoadAddr !== ''
                                ? ', ' + data.buildingName // 추가 정보가 있다면 쉼표로 구분
                                : data.buildingName;
                    }
                    this.extraAddress = extraRoadAddr ? `(${extraRoadAddr})` : ''; // 추가 주소 설정
                },
            }).open(); // 주소 검색 창 열기
        },
    },
};

</script>

<style scoped>
/* 스타일 필요 시 추가 */
</style>
