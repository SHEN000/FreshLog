import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home }, // 首頁
  { path: "/select-role", component: () => import("@/views/RoleSelect.vue") }, // 選擇角色頁
  {
    path: "/veggie",
    component: () => import("@/views/Consumer/VeggieInfo.vue"),
  }, // 蔬菜列表
  {
    path: '/veggie',
    redirect: '/veggie/001'
  }, // 蔬菜列表預設
  {
    path: '/veggie/:id',
    name: 'VeggieInfo',
    component: () => import('@/views/Consumer/VeggieInfoPage.vue')
  }, // 蔬菜內頁
  {
    path: "/foodsafety",
    component: () => import("@/views/Consumer/FoodSafetyList.vue"),
  }, // 食安列表
  {
    path: "/foodsafety/:id",
    component: () => import("@/views/Consumer/FoodSafetyDetail.vue"),
  }, // 食安內頁
  {
    path: "/farmer/crop-dashboard",
    component: () => import("@/views/Farmer/CropDashboard.vue"),
  }, // 農作物儀表板
  {
    path: "/member/login",
    component: () => import("@/views/Member/Login.vue"),
  }, // 登入
  {
    path: "/member/register",
    component: () => import("@/views/Member/Register.vue"),
  }, // 註冊
  {
    path: "/member/profile",
    component: () => import("@/views/Member/Profile.vue"),
  }, // 個人資訊
  {
    path: "/member/follows",
    component: () => import("@/views/Member/MyFollows.vue"),
  }, // 我的追蹤
  {
    path: "/member/follow-setting",
    component: () => import("@/views/Member/FollowSetting.vue"),
  }, // 追蹤設定
  {
    path: "/ai-recommendation",
    component: () => import("@/views/Consumer/AiRecommendation.vue"),
  }, // AI 智慧推薦
  {
    path: '/ai-recommendation/:id',
    name: 'RecipeDetail',
    component: () => import('@/views/Consumer/RecipeDetail.vue')
  }, // 食譜內頁
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 需要登入保護的路徑（只有這些才強制登入）
const protectedPaths = [
  "/member/profile",
  "/member/follows",
  "/member/follow-setting",
  "/farmer/crop-dashboard",
];

// 路由守衛
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("userToken");

  const isAuthPage = ["/member/login", "/member/register"].includes(to.path);
  const requiresAuth = protectedPaths.includes(to.path);

  // 果是訪問登入/註冊頁，記錄從哪裡來（但排除自己來自己）
  if (
    isAuthPage &&
    from.path &&
    from.path !== to.path &&
    !from.path.startsWith("/member")
  ) {
    localStorage.setItem("redirectAfterLogin", from.fullPath);
  }

  // 如果是需要登入的頁面，且沒登入 → 強制跳轉 & 記錄來源
  if (!token && requiresAuth) {
    localStorage.setItem("redirectAfterLogin", to.fullPath);
    return next("/member/login");
  }

  next();
});

export default router;
