# 下班回血站

治愈系森林小站：下班倒计时、工资估算、水豚互动、钢琴轻音乐和一分钟呼吸充电。

## 发布到 GitHub Pages

此仓库使用 main 分支根目录发布。

1. 新建 GitHub 仓库（建议名称 `xiaban-recharge`）。GitHub Free 账号请选择公开仓库。
2. 将本目录中的所有文件推送到仓库的 `main` 分支，确保 `index.html` 在仓库根目录，包含 `.github/workflows/pages.yml`。
3. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 在 **Actions → Deploy to GitHub Pages → Run workflow** 手动执行一次，之后推送到 `main` 会自动更新。
5. 部署成功后，在 **Settings → Pages** 或工作流的部署结果中获取网址。

如果使用浏览器手动上传，可不上传 `.github` 文件夹，改为在 Settings → Pages 中选择 **Deploy from a branch → main → /(root)**，保存后等待发布。

官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## 使用

- 点击“我的作息”设置上下班、午休、月薪和计薪天数。默认上班 08:40、下班 17:40、午休 12:00–13:30。
- 默认月薪 10000 元、计薪 21.75 天仅用于演示。工资按有效工时线性估算，不代表实际工资结算；未包含节假日、加班费、调休和税费。
- 设置与金额隐藏偏好仅保存在当前浏览器。
- 默认启用轻音乐。浏览器若限制自动播放，首次点击页面后开启。
- 点击“开始充电”暂停钢琴、播放林间溪流与鸟鸣；暂停或结束充电后从原位置恢复音乐。顶部开关可手动静音。
- 音频存放在仓库根目录，不依赖外部音频接口。素材来源和许可见 CREDITS.txt。

## 原创提示词

制作治愈系下班回血站，含下班倒计时、工资进度、可互动桌宠，画面精美，适配手机。

活动要求使用 Workbuddy；本版本由 Codex 制作，正式参赛请遵守活动工具要求。
