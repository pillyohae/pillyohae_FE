
### 실행환경 (Setup Instructions)

GitHub에서 프로젝트를 pull 받아 로컬에서 실행 가능한 환경을 구성하는 과정을 아래에 정리

---

#### 1. 사전 준비
- **Node.js** 설치  
  프로젝트는 최신 Node.js 버전에서 실행됨. [Node.js 공식 사이트](https://nodejs.org)에서 LTS 버전 설치.

- **패키지 매니저**  
  npm은 Node.js와 함께 설치되므로 별도로 설치할 필요 없음.

---

#### 2. 프로젝트 클론
GitHub에서 프로젝트를 로컬로 클론:
```bash
git clone <저장소 URL>
```
클론한 디렉토리로 이동:
```bash
cd pillyohae_FE
```

---

#### 3. 의존성 설치
프로젝트 실행에 필요한 패키지를 설치:
```bash
npm install
```

---

#### 4. 개발 서버 실행
로컬 개발 환경을 실행:
```bash
npm run dev
```
브라우저에서 [http://localhost:5173](http://localhost:5173)로 접속.

---

#### 5. 빌드 및 미리보기 (선택 사항)
- **프로덕션 빌드**:
  ```bash
  npm run build
  ```
  `dist` 폴더에 빌드된 파일 생성.

- **미리보기 서버 실행**:
  ```bash
  npm run preview
  ```
  브라우저에서 로컬 서버로 접속하여 빌드 결과 확인.

---

#### 6. 주요 의존성
- **운영 환경**:
  - `vue`: ^3.5.13
  - `vue-router`: ^4.5.0
  - `vuetify`: ^3.7.0-beta.1
  - `axios`: ^1.7.9
  - 기타: `@mdi/font`, `@tosspayments/tosspayments-sdk`, `vuedraggable`

- **개발 환경**:
  - `@vitejs/plugin-vue`: ^5.2.1
  - `vite`: ^6.0.5

---

위 단계를 따라 하면 로컬에서 프로젝트 실행 가능
