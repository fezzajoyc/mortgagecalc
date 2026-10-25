# MortgageCalc · 房贷计算器(大流量关键词站)

"mortgage calculator" 系列月百万级搜索、金融 RPM 最高档。主计算器 ×1 + **州页 ×51**(州中位房价+有效房产税率预填,"mortgage calculator texas" 长尾)。59 静态页。

三个不掺假的事(站群纪律):

- 月供公式是标准等额本息数学 P×r(1+r)ⁿ÷((1+r)ⁿ−1),纯计算非估算,公式印在页面上;测试锚定 $300k@6.5%/30y=$1,896.20 标准参照值。
- 各州税率是真实统计:有效税率=中位实缴÷中位房价(Census ACS 2024,StateTakeHome.com 数据集 CC BY 4.0,Zenodo 存档),NJ 2.23% 最高/HI 0.38% 最低有测试锚点。
- 口径如实:是"估算非贷款要约"、escrow 可能含 PMI/HOA,页脚和 FAQ 反复注明。

## 站点结构

| 路径 | 内容 | SEO 角色 |
|---|---|---|
| `/` | 主计算器 | "mortgage calculator" 大词 |
| `/mortgage-calculator/[state]` | 州页 ×51(预填州中位房价+税率) | "mortgage calculator texas" 长尾 |
| `/states` | 州目录 | 枢纽 |
| `/api/state` | JSON(CORS 全开) | agent 数据口 |

## 质量

`npm test`(7 项:月供参照值/0% 利率边界/首年利息本金拆分/NJ-HI 锚点/税率数学)。纯客户端计算(免 Cookie 卖点);Vercel 导入零配置;每日 CI 体检开 issue;广告位已埋(金融 RPM 档)。
