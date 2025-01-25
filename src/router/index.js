// Vue router 를 가져옴
import { createRouter, createWebHistory } from "vue-router";

//페이지를 import 하는 란
import LoginView from "../views/LoginView.vue"; //로그인 페이지
import SignupView from "../views/SignupView.vue"; //회원가입 페이지
import BuyerMainView from "../views/buyer/BuyerMainView.vue";
import CartView from "../views/buyer/CartView.vue";
import SellerMainView from "../views/seller/SellerMainView.vue";
import SellerMyView from "../views/seller/product/SellerMyView.vue";
import ProductRegistView from "../views/seller/product/ProductRegistView.vue";
import BuyerPayReadyView from "../views/buyer/payment/BuyerPayReadyView.vue";
import PaymentPage from "../views/buyer/payment/PaymentPage.vue";
import SuccessPage from "../views/buyer/payment/SuccessPage.vue"
import FailPage from "../views/buyer/payment/FailPage.vue"
import MyPageView from "../views/buyer/mypage/MyPageView.vue";
import MyOrderView from "../views/buyer/order/MyOrderView.vue";
import MyOrderDetailView from "../views/buyer/order/MyOrderDetailView.vue";
import MyProfilePage from "../views/buyer/mypage/MyProfilePage.vue";
import SurveyView from "../views/buyer/survey/SurveyView.vue";
import SurveyCreateView from "../views/buyer/survey/SurveyCreateView.vue";
import ProductDetailView from "../views/seller/product/ProductDetailView.vue";
import ProductEditView from "../views/seller/product/ProductEditView.vue";
import SellerOrderView from "../views/seller/order/SellerOrderView.vue";
import BuyerProductView from "../views/buyer/product/BuyerProductView.vue";
import AvailableCouponView from "../views/buyer/coupon/AvailableCouponView.vue";
import SurveyRecommendationView from "../views/buyer/survey/SurveyRecommendationView.vue";
import AdminMainView from "../views/admin/AdminMainView.vue";
import AdminCouponView from "../views/admin/AdminCouponView.vue";
import AdminCouponRegistView from "../views/admin/AdminCouponRegistView.vue";

//각 경로와 해당 경로에 대해 연결된 컴포넌트(페이지) 를 정의
//이것을 보고 라우터가 페이지 이동을 하는 것
const routes = [
    { path: '/', redirect: '/login' }, //우선 기본 경로를 로그인 페이지로
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/signup', name: 'Signup', component: SignupView },
    { path: '/buyer', name: 'BuyerMain', component: BuyerMainView },
    { path: '/cart', name: 'Cart', component: CartView },
    { path: '/seller', name: 'Seller', component: SellerMainView },
    { path: '/seller/product', name: 'MySeller', component: SellerMyView },
    { path: '/seller/product/add', name: 'addProduct', component: ProductRegistView },
    { path: '/pay-ready', name: 'BuyerPayReadyView', component: BuyerPayReadyView },
    { path: '/payment', name: 'PaymentPage', component: PaymentPage },
    { path: '/success', name: 'SuccessPage', component: SuccessPage },
    { path: '/fail', name: 'FailPage', component: FailPage },
    { path: '/mypage', name: 'MyPage', component: MyPageView },
    { path: '/myorder', name: 'MyOrderPage', component: MyOrderView },
    { path: '/myorderdetails/:orderId', name: 'MyOrderDetailsPage', component: MyOrderDetailView },
    { path: '/myprofile', name: 'MyProfilePage', component: MyProfilePage },
    { path: '/survey', name: 'SurveyPage', component: SurveyView },
    { path: '/survey/create', name: 'SurveyCreatePage', component: SurveyCreateView },
    { path: '/seller/product/:productId', name: 'ProductDetailPage', component: ProductDetailView },
    { path: '/seller/product/edit/:productId', name: 'ProductEditPage', component: ProductEditView},
    { path: '/seller/order', name: 'SellerOrderPage', component: SellerOrderView},
    { path: '/buyer/product/:productId',name : 'BuyerProductView', component: BuyerProductView},
    { path: '/coupon', name : 'AvailableCouponView', component: AvailableCouponView},
    { path: '/survey/recommendations/:surveyId', name: 'SurveyRecommendationView', component: SurveyRecommendationView},
    { path: '/admin', name:'AdminMainView', component: AdminMainView},
    { path: '/admin/coupon', name: 'AdminCouponView', component: AdminCouponView},
    { path: '/admin/coupon/register', name: 'AdminCouponRegistView', component: AdminCouponRegistView},
]

//Vue router 인스턴스 생성
//브라우저의 히스토리 모드 (뒤로가기, 앞으로가기) 사용
const router = createRouter({
    history: createWebHistory(),
    routes, //위에서 정의한 경로들 설정
});

// 설정된 vue router 를 내보내어 사용할 수 있도록함
export default router;