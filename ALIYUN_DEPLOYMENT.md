# 阿里云部署指南

## 📋 系统架构

```
前端 (Vite + React)  →  后端 API (Node.js + Express)  →  MongoDB 数据库
     阿里云 OSS/CDN          阿里云 ECS 服务器              阿里云 MongoDB
```

## 🚀 部署步骤

### 1. 准备阿里云资源

#### 1.1 ECS 服务器（已有）
- 确保已安装 Node.js (v18+)
- 确保已安装 MongoDB 或使用阿里云 MongoDB 服务

#### 1.2 MongoDB 数据库
两种选择：

**选项 A: 阿里云 MongoDB（推荐）**
1. 登录阿里云控制台
2. 搜索 "云数据库 MongoDB"
3. 创建实例（选择最小规格即可）
4. 获取连接字符串

**选项 B: 自建 MongoDB**
```bash
# 在 ECS 上安装 MongoDB
sudo apt-get update
sudo apt-get install -y mongodb

# 启动 MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 2. 部署后端 API

#### 2.1 上传代码到服务器

```bash
# 在本地打包后端代码
cd backend
tar -czf backend.tar.gz *

# 上传到服务器（替换为你的服务器IP）
scp backend.tar.gz root@your-server-ip:/var/www/ai-journey-backend/

# SSH 登录服务器
ssh root@your-server-ip

# 解压
cd /var/www/ai-journey-backend
tar -xzf backend.tar.gz
```

#### 2.2 安装依赖

```bash
cd /var/www/ai-journey-backend
npm install --production
```

#### 2.3 配置环境变量

```bash
# 创建 .env 文件
nano .env
```

添加以下内容：

```env
PORT=3001

# 如果使用阿里云 MongoDB
MONGODB_URI=mongodb://username:password@dds-xxxxx.mongodb.rds.aliyuncs.com:3717/ai-journey

# 如果使用本地 MongoDB
# MONGODB_URI=mongodb://localhost:27017/ai-journey
```

#### 2.4 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name ai-journey-api

# 设置开机自启
pm2 startup
pm2 save

# 查看日志
pm2 logs ai-journey-api

# 查看状态
pm2 status
```

#### 2.5 配置 Nginx 反向代理

```bash
# 安装 Nginx
sudo apt-get install nginx

# 编辑配置
sudo nano /etc/nginx/sites-available/ai-journey-api
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name api.your-domain.com;  # 替换为你的域名

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/ai-journey-api /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 2.6 配置 HTTPS（可选但推荐）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d api.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 3. 部署前端

#### 3.1 配置前端环境变量

在本地项目的 `.env` 文件中添加：

```env
# Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key

# Backend API URL（替换为你的实际域名或IP）
VITE_API_BASE_URL=https://api.your-domain.com/api
# 或者使用 IP: VITE_API_BASE_URL=http://your-server-ip:3001/api
```

#### 3.2 构建前端

```bash
# 在本地构建
npm run build

# 会生成 dist 目录
```

#### 3.3 上传到服务器

**选项 A: 使用 Nginx 托管**

```bash
# 上传 dist 目录
scp -r dist root@your-server-ip:/var/www/ai-journey/

# 配置 Nginx
sudo nano /etc/nginx/sites-available/ai-journey
```

添加配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名

    root /var/www/ai-journey/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/ai-journey /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**选项 B: 使用阿里云 OSS + CDN（推荐）**

1. 创建 OSS Bucket
2. 上传 dist 目录内容到 OSS
3. 配置 CDN 加速
4. 设置静态网站托管

### 4. 测试部署

#### 4.1 测试后端 API

```bash
# 健康检查
curl http://your-server-ip:3001/api/health

# 或使用域名
curl https://api.your-domain.com/api/health

# 应该返回: {"status":"ok","message":"AI Journey API is running"}
```

#### 4.2 测试前端

访问: `http://your-domain.com` 或 `http://your-server-ip`

#### 4.3 测试完整流程

1. 注册/登录用户
2. 完成 Glacier Step4
3. 访问管理员面板查看数据

### 5. 监控和维护

#### 5.1 查看后端日志

```bash
# PM2 日志
pm2 logs ai-journey-api

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### 5.2 MongoDB 备份

```bash
# 备份数据库
mongodump --uri="mongodb://localhost:27017/ai-journey" --out=/backup/$(date +%Y%m%d)

# 恢复数据库
mongorestore --uri="mongodb://localhost:27017/ai-journey" /backup/20240115
```

#### 5.3 更新应用

```bash
# 后端更新
cd /var/www/ai-journey-backend
git pull  # 如果使用 Git
npm install
pm2 restart ai-journey-api

# 前端更新
# 本地构建后上传新的 dist 目录
```

## 🔒 安全建议

1. **防火墙配置**
```bash
# 只开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

2. **MongoDB 安全**
- 启用认证
- 限制访问 IP
- 定期备份

3. **API 安全**
- 添加 rate limiting
- 添加 API 认证（JWT）
- 使用 HTTPS

4. **环境变量**
- 不要提交 .env 文件到 Git
- 使用强密码

## 📊 性能优化

1. **启用 Gzip 压缩**（Nginx）
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **启用 HTTP/2**
```nginx
listen 443 ssl http2;
```

3. **CDN 加速**
- 使用阿里云 CDN 加速静态资源

4. **数据库索引**
```javascript
// 在 MongoDB 中创建索引
db.users.createIndex({ userId: 1 })
db.users.createIndex({ email: 1 })
```

## 🐛 常见问题

### Q: API 无法连接
A: 检查防火墙、Nginx 配置、PM2 状态

### Q: MongoDB 连接失败
A: 检查连接字符串、网络配置、认证信息

### Q: 前端无法调用 API
A: 检查 CORS 配置、API_BASE_URL 环境变量

### Q: 静态资源 404
A: 检查 Nginx root 路径、文件权限

## 📞 支持

如有问题，请检查：
- PM2 日志: `pm2 logs`
- Nginx 日志: `/var/log/nginx/`
- MongoDB 日志: `/var/log/mongodb/`

## ✅ 部署检查清单

- [ ] ECS 服务器准备就绪
- [ ] MongoDB 安装并运行
- [ ] 后端代码上传
- [ ] 后端依赖安装
- [ ] 环境变量配置
- [ ] PM2 启动后端
- [ ] Nginx 配置反向代理
- [ ] SSL 证书配置（可选）
- [ ] 前端构建
- [ ] 前端部署
- [ ] API 测试通过
- [ ] 前端访问正常
- [ ] 数据库连接正常
- [ ] 备份策略设置

祝部署顺利！🎉
