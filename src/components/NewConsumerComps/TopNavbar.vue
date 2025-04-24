<template>
  <header class="top-header">
    <div class="header-left">
      <div class="logo">
        <span class="logo-icon">📊</span>
        <span class="logo-text">蔬果數據可視化平台</span>
      </div>
    </div>
    <div class="header-center">
      <div class="search-container">
        <input type="text" placeholder="輸入關鍵字搜尋，如彩虹蔬菜配方..." />
      </div>
    </div>
    <div class="header-right">
      <button class="menu-btn">菜單</button>
      <button class="login-btn">個人資料</button>
    </div>
  </header>
</template>

<script setup>
// 可以添加按鈕的點擊事件處理邏輯
</script>

<style scoped>
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  color: #3c8e3c;
  font-weight: bold;
}

.logo-icon {
  margin-right: 8px;
  font-size: 20px;
}

.search-container input {
  width: 300px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
}

.menu-btn,
.login-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f5;
  margin-left: 10px;
  cursor: pointer;
}

.login-btn {
  background-color: #4caf50;
  color: white;
}

@media (max-width: 768px) {
  .search-container input {
    width: 200px;
  }

  .header-center {
    flex: 1;
    margin: 0 10px;
  }
}
</style>
