<template>
  <!-- 頁腳區域 -->
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3>蔬果數據可視化平台</h3>
        <p>提供即時、準確的蔬果價格與資訊，讓消費者做出明智的購買決策。</p>
      </div>

      <div class="footer-section">
        <h3>快速連結</h3>
        <ul class="footer-links">
          <li><a href="#">關於我們</a></li>
          <li><a href="#">蔬果體驗活動</a></li>
          <li><a href="#">會員中心</a></li>
          <li><a href="#">聯絡我們</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>訂閱價格通知</h3>
        <div class="subscribe-form">
          <input type="email" placeholder="您的電子郵件" />
          <button type="submit">訂閱</button>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 蔬果數據可視化平台. 保留所有權利。</p>
    </div>
  </footer>
</template>

<style scoped>
/* footer樣式 */
.site-footer {
  background-color: #222;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  padding: 0 20px;
}

.footer-section h3 {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 500;
}

.footer-section p {
  font-size: 14px;
  line-height: 1.6;
  color: #aaa;
  margin: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: #aaa;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
}

.subscribe-form {
  display: flex;
  margin-top: 10px;
}

.subscribe-form input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.subscribe-form button {
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  padding: 10px 15px;
  cursor: pointer;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding-top: 20px;
  margin-top: 30px;
  border-top: 1px solid #444;
  font-size: 12px;
  color: #888;
}

/* 手機版適配 */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
