# MISO-FAS Research Showcase 📡

[![Deploy to GitHub Pages](https://github.com/weselymachianl/Master-Research-Website/actions/workflows/deploy.yml/badge.svg)](https://github.com/weselymachianl/Master-Research-Website/actions)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)

**Live Demo / 網站預覽:** [https://weselymachianl.github.io/Master-Research-Website/](https://weselymachianl.github.io/Master-Research-Website/)

## 📝 About The Project (關於此專案)

This repository contains the interactive research showcase website for the paper: **"Sum rate maximisation in multi-user miso fluid antenna system via ConvCNP assisted d3qn partial port selection and precoding."**

本專案為該碩士研究論文的專屬互動式展示網頁。透過視覺化的圖表與簡潔的介面，向學術界與產業界展示在多用戶流體天線系統（MISO-FAS）中，結合卷積條件神經過程 (ConvCNP) 與 D3QN 演算法的總速率最大化突破。

## ✨ Key Features (核心功能)

* 📊 **Interactive Data Visualization:** 內建互動式圖表 (Recharts)，可動態切換並比較不同 DRL 演算法（如 DQN, D3QN, ConvCNP-D3QN）在不同變數下（探測步數、天線尺寸、用戶數量）的效能表現。
* 🌐 **Bilingual Support (雙語支援):** 完整支援英文與繁體中文 (EN/ZH) 的即時語系切換。
* 📱 **Responsive Design:** 採用 Tailwind CSS 打造，完美適配桌機、平板與手機等各式裝置的閱讀體驗。
* ⚡ **Automated Deployment:** 透過 GitHub Actions 自動打包並部署至 GitHub Pages。

## 🛠️ Tech Stack (技術堆疊)

* **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Data Visualization:** [Recharts](https://recharts.org/)
* **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Local Development (本地端開發指南)

若您希望在本地端運行或修改此專案，請參考以下步驟：

1. **Clone the repository (複製專案)**
   ```bash
   git clone [https://github.com/weselymachianl/Master-Research-Website.git](https://github.com/weselymachianl/Master-Research-Website.git)
   cd Master-Research-Website
Install dependencies (安裝套件)

Bash
npm install
Start the development server (啟動開發伺服器)

Bash
npm run dev
預設會運行在 http://localhost:3000

## 📦 Deployment (部署方式)
本專案已設定 GitHub Actions。每當有新的 commit 推播 (push) 至 main 分支時，系統便會自動觸發打包流程，並將更新部署至 GitHub Pages。相關設定請參考 .github/workflows/deploy.yml。

👨‍🔬 Author (作者)
[Your Name / 您的名字]

GitHub: @weselymachianl

連絡信箱: [您的 Email 或是可以先留空]
