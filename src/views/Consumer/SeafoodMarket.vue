<template>
    <div class="overlay">
        <section role="dialog" aria-modal="true" aria-labelledby="poultryTitle" class="popup-card">
            <!-- LOGO 柔光圈 -->
            <div class="brand-ring">
                <img src="/logo.png" alt="FreshLog" />
            </div>

            <h1 id="poultryTitle" class="main-title">海產行情</h1>
            <div class="subtitle">目前開發中</div>

            <div class="desc">
                此分頁尚在整備中：功能調校與資料串接開發中。<br>
                歡迎提出建議，我們會持續優化。
            </div>

            <div class="btn-row">
                <button class="btn-secondary" @click="close">關閉</button>
                <RouterLink to="/" class="btn-primary">回首頁</RouterLink>
            </div>
        </section>
    </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
const router = useRouter()
function close() {
    if (window.history.length > 1) router.back()
    else router.push('/')
}
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f9f9f9;
    backdrop-filter: blur(2px);

    /* 手機／平板(≤768px)四周留白 + 安全區 */
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-top: max(16px, env(safe-area-inset-top));
    padding-bottom: max(16px, env(safe-area-inset-bottom));
}

/* 彈窗卡片 */
.popup-card {
    position: relative;
    background: #fff;
    text-align: center;
    border-radius: 1.6rem;
    border: 1px solid #eef3ea;
    box-shadow: 0 15px 18px #cccccc;
    padding: 2.4rem 1.7rem 2.1rem 1.7rem;
    width: 100%;

    animation: modalPop .28s cubic-bezier(.2, 1.12, .38, 1.16) both;
    background:
        repeating-linear-gradient(0deg, rgba(108, 236, 215, 0.018) 0 1px, transparent 1px 24px);
}

/* LOGO 柔光圈 */
.brand-ring {
    margin: -46px auto 7px;
    width: 90px;
    height: 90px;
    border-radius: 9999px;
    display: grid;
    place-items: center;
    background: radial-gradient(100% 100% at 50% 50%, rgba(46, 125, 50, 0.25), rgba(46, 125, 50, 0.025) 72%, transparent 95%);
    box-shadow: 0 6px 20px rgba(34, 138, 54, 0.11), inset 0 0 0 2px rgba(137, 202, 114, 0.07);
}

.brand-ring img {
    width: 80px;
    height: 80px;
    object-fit: contain;
}

/* 標題/副標/說明 */
.main-title {
    margin: 6px 0 0.3rem 0;
    font-size: 1.78rem;
    font-weight: 900;
    letter-spacing: .005em;
    color: #1e3827;
}

.subtitle {
    font-size: 1.13rem;
    font-weight: bold;
    color: #177829;
    margin-bottom: 0.9rem;
    letter-spacing: 0.01em;
}

.desc {
    color: #526144;
    font-size: 1.03rem;
    margin-bottom: 1.8rem;
    font-weight: 500;
    line-height: 1.64;
}

/* 按鈕 */
.btn-row {
    display: flex;
    gap: 0.9rem;
    justify-content: center;
    margin-bottom: 0.2rem;
}

.btn-primary {
    min-width: 110px;
    font-size: 1.02rem;
    padding: 0.67em 1.4em;
    border-radius: 2em;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(104deg, #59ba47 78%, #97e06d 100%);
    box-shadow: 0 2px 6px #cccccc;
    border: none;
    transition: opacity .16s;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-primary:hover {
    opacity: 0.90;
}

.btn-secondary {
    min-width: 110px;
    font-size: 1.02rem;
    padding: 0.67em 1.4em;
    border-radius: 2em;
    font-weight: 600;
    color: #228a36;
    background: #fff;
    border: 2px solid #228a36;
    transition: background .15s;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-secondary:hover {
    background: #f2fcf4;
    border-color: #41bc44;
}

@media (min-width: 769px) {
    .overlay {
        padding: 0;
    }

    .popup-card {
        max-width: 470px;
        padding: 2.8rem 2.7rem 2.6rem 2.7rem;
    }

    .brand-ring {
        width: 100px;
        height: 100px;
        margin-top: -56px;
    }

    .brand-ring img {
        width: 90px;
        height: 90px;
    }

    .main-title {
        font-size: 2.05rem;
    }

    .subtitle {
        font-size: 1.21rem;
    }

    .desc {
        font-size: 1.1rem;
    }
}

/* 彈入動畫 */
@keyframes modalPop {
    from {
        opacity: 0;
        transform: scale(.96) translateY(18px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}
</style>
