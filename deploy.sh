#!/bin/bash

# AI Journey 部署脚本
# 用于部署到阿里云

set -e  # 遇到错误立即退出

echo "🚀 开始部署 AI Journey..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. 构建前端
echo -e "${BLUE}📦 步骤 1/3: 构建前端...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 前端构建成功${NC}"
else
    echo -e "${RED}❌ 前端构建失败${NC}"
    exit 1
fi

# 2. 显示构建大小
echo -e "${BLUE}📊 构建文件大小:${NC}"
du -sh dist/
echo ""

# 3. 检查 dist 文件夹
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ dist 文件夹不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 部署准备完成${NC}"
echo ""
echo "📁 需要部署的文件:"
echo "   - dist/ (前端静态文件)"
echo "   - backend/ (后端服务)"
echo ""
echo "💡 部署提示:"
echo "   1. 前端: 上传 dist/ 到 OSS"
echo "   2. 后端: 上传 backend/ 到 ECS"
echo "   3. 不要上传: .git/, node_modules/, src/, public/"
echo ""
echo "🎯 实际部署大小: ~456 MB (不含 .git 和 node_modules)"
echo ""

# 可选: 自动上传到 OSS (需要配置 ossutil)
read -p "是否要上传到 OSS? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v ossutil &> /dev/null; then
        echo -e "${BLUE}📤 上传到 OSS...${NC}"
        # 替换为你的 OSS bucket 名称
        # ossutil cp -r dist/ oss://your-bucket-name/
        echo -e "${RED}⚠️  请先配置 OSS bucket 名称${NC}"
    else
        echo -e "${RED}❌ ossutil 未安装${NC}"
        echo "   安装方法: https://help.aliyun.com/document_detail/120075.html"
    fi
fi

echo -e "${GREEN}🎉 部署脚本执行完成${NC}"
