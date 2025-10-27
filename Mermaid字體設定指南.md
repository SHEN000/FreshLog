# Mermaid 字體設定指南

## 快速設定

在 Mermaid 圖表開頭加入以下設定即可調整字體大小：

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px', 'fontFamily':'Arial'}}}%%
graph TB
    A[節點 A] --> B[節點 B]
```

## 常用字體大小

| 字體大小 | 適用場景 |
|---------|---------|
| `14px` | 預設大小（較小，不建議） |
| `16px` | 標準大小 |
| `18px` | **推薦大小**（本專案使用） |
| `20px` | 簡報用 |
| `22px` | 投影片用 |

## 繁體中文字體設定

```mermaid
%%{init: {
  'theme':'base',
  'themeVariables': {
    'fontSize':'18px',
    'fontFamily':'Microsoft JhengHei, Noto Sans TC, Arial, sans-serif'
  }
}}%%
graph TB
    A[繁體中文] --> B[測試節點]
```

## 完整範例

### 基本設定（英文）

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px', 'fontFamily':'Arial'}}}%%
graph TB
    A[Start] --> B[Process]
    B --> C[End]
```

### 繁體中文設定

```mermaid
%%{init: {
  'theme':'base',
  'themeVariables': {
    'fontSize':'18px',
    'fontFamily':'Microsoft JhengHei, sans-serif'
  }
}}%%
graph TB
    A[開始] --> B[處理]
    B --> C[結束]
```

### 自訂顏色 + 字體

```mermaid
%%{init: {
  'theme':'base',
  'themeVariables': {
    'fontSize':'20px',
    'fontFamily':'Arial',
    'primaryColor':'#E8F5E9',
    'primaryTextColor':'#000',
    'primaryBorderColor':'#4CAF50',
    'lineColor':'#4CAF50'
  }
}}%%
graph TB
    A[節點 A] --> B[節點 B]
    B --> C[節點 C]
```

## 進階技巧

### 針對特定節點調整字體

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}}}%%
graph TB
    A[標題]:::large --> B[內容]:::normal

    classDef large font-size:24px,font-weight:bold,fill:#E8F5E9
    classDef normal font-size:16px,fill:#E3F2FD
```

### 不同區塊使用不同樣式

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px'}}}%%
graph TB
    subgraph 重要區塊
        A[重要節點]:::important
    end

    subgraph 次要區塊
        B[次要節點]:::secondary
    end

    A --> B

    classDef important font-size:22px,font-weight:bold,fill:#FFE0B2,stroke:#FF9800
    classDef secondary font-size:16px,fill:#E0F2F1,stroke:#009688
```

## 線上測試工具

1. **Mermaid Live Editor**：https://mermaid.live/
   - 即時預覽
   - 可匯出 PNG/SVG

2. **VS Code 插件**：Markdown Preview Mermaid Support
   - 在編輯器中直接預覽

## 常見問題

### Q1：字體沒有變大？

**原因**：
- `%%{init: {...}}%%` 必須在圖表第一行
- 語法錯誤（缺少引號或逗號）
- Mermaid 版本過舊（需 v8.6.0+）

**解決方法**：
```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'20px'}}}%%
graph TB
    A --> B
```

### Q2：繁體中文顯示為方塊？

**解決方法**：
```mermaid
%%{init: {
  'theme':'base',
  'themeVariables': {
    'fontSize':'18px',
    'fontFamily':'Microsoft JhengHei, sans-serif'
  }
}}%%
graph TB
    A[中文] --> B[測試]
```

### Q3：想要更大的字體？

直接修改 `fontSize` 參數：

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'24px'}}}%%
graph TB
    A[超大字體] --> B[測試]
```

## 本專案使用的設定

**7-2_套件說明.md** 和 **7-3_元件說明.md** 中的 Mermaid 圖表統一使用：

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize':'18px', 'fontFamily':'Arial'}}}%%
```

如需調整，只需修改 `fontSize` 值即可（例如改為 `'20px'` 或 `'22px'`）。

---

**建議設定**：
- **一般文件**：`fontSize: '18px'`
- **簡報投影**：`fontSize: '20px'` - `'24px'`
- **列印輸出**：`fontSize: '16px'` - `'18px'`

**字體選擇**：
- **英文**：`'Arial'` 或 `'Helvetica'`
- **繁體中文**：`'Microsoft JhengHei, Noto Sans TC, sans-serif'`
- **跨平台**：`'sans-serif'`（使用系統預設字體）
