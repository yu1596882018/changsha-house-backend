# 脚本目录说明

本目录包含项目的各种工具脚本，主要用于数据采集和系统初始化。

## 📂 脚本列表

### 数据采集脚本

#### 1. houseMain.js - 爬虫主流程
**功能**：完整采集指定楼盘的所有数据

**使用方法**：
```bash
# 通过 npm 脚本运行
npm run crawl

# 或直接运行（需要先获取楼盘ID）
node src/scripts/houseMain.js
```

**采集流程**：
1. 采集楼盘基本信息
2. 采集楼栋列表
3. 采集每个楼栋的房源信息
4. 对失败的楼栋进行重试

**参数**：
- `id` (string) - 楼盘唯一标识

**示例**：
```javascript
const houseMain = require('./houseMain')
await houseMain('abc123def456')
```

---

#### 2. houseInfoList.js - 楼盘信息采集
**功能**：采集楼盘的基本信息（名称、地址、开发商等）

**数据来源**：住建局官网楼盘详情页

**采集字段**：
- 楼盘名称
- 预售证号
- 开发商
- 楼盘地址
- 所属区域
- 楼栋总数
- 房源总数

---

#### 3. houseChildren.js - 楼栋列表采集
**功能**：采集指定楼盘下的所有楼栋信息

**采集字段**：
- 楼栋ID
- 楼栋名称
- 总楼层数
- 总户数
- 已售数量
- 可售数量

---

#### 4. houseChildrenInfo.js - 房源信息采集
**功能**：采集指定楼栋下的所有房源详细信息

**采集字段**：
- 房号
- 楼层
- 建筑面积
- 销售状态（已售/可售/预留）
- 户型结构
- 单价
- 总价
- 朝向
- 装修状态

---

### 系统初始化脚本

#### 5. initEsIndex.js - Elasticsearch索引初始化
**功能**：初始化Elasticsearch日志索引

**使用方法**：
```bash
npm run init:es
# 或
node src/scripts/initEsIndex.js
```

**创建的索引**：
- `changsha_house_logs` - 应用日志索引

---

## 🚀 运行脚本

### 方式一：使用 npm 脚本（推荐）

```bash
# 运行爬虫（需要修改脚本传入楼盘ID）
npm run crawl

# 初始化 Elasticsearch 索引
npm run init:es
```

### 方式二：直接运行

```bash
# 运行爬虫主流程
node src/scripts/houseMain.js

# 初始化 ES 索引
node src/scripts/initEsIndex.js
```

---

## ⚙️ 配置说明

### 爬虫配置

在 `src/config/index.js` 中配置：

```javascript
crawler: {
  baseUrl: 'http://www.cszjxx.net',  // 住建局官网地址
  delay: 1000,                        // 请求延迟（毫秒）
  timeout: 30000,                     // 请求超时时间
  maxRetry: 3,                        // 最大重试次数
}
```

### 注意事项

1. **请求频率**：脚本会自动控制请求频率（默认1秒/次），避免被封IP
2. **错误重试**：单个楼栋采集失败会自动重试，不影响其他楼栋
3. **数据去重**：重复运行脚本会更新已有数据，不会产生重复记录
4. **日志输出**：脚本运行过程会输出详细日志，便于监控进度

---

## 📊 定时任务

### 配置 Cron 定时采集

推荐使用 `node-cron` 或系统 `crontab` 配置定时任务：

```bash
# 编辑 crontab
crontab -e

# 每天凌晨2点运行爬虫
0 2 * * * cd /var/www/changshaHouse && node src/scripts/houseMain.js >> logs/crawler.log 2>&1
```

---

## 🐛 调试建议

### 查看详细日志

```javascript
// 在脚本中添加日志
console.log('Debug:', data)

// 查看网络请求
// 在 request-promise 中添加 debug: true
```

### 常见问题

1. **验证码错误** - 检查验证码识别服务是否正常
2. **超时错误** - 增加 `timeout` 配置
3. **数据不完整** - 检查网页结构是否变化
4. **数据库连接失败** - 检查数据库配置和连接状态

---

## 🔗 相关文档

- [数据库设计](../../docs/ARCHITECTURE.md#数据库设计)
- [爬虫架构](../../docs/ARCHITECTURE.md#爬虫设计)
- [API文档](../../docs/API_DOCUMENTATION.md)

---

最后更新：2021-02-15
