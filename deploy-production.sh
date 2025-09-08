#!/bin/bash

# ===========================================
# SiteFrame 生产环境部署脚本
# ===========================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
APP_NAME="siteframe"
COMPOSE_FILE="podman-compose.production.yml"
ENV_FILE=".env.production"
BACKUP_DIR="/var/backups/siteframe"
LOG_DIR="/var/log/siteframe"

# 函数：打印带颜色的消息
print_message() {
    echo -e "${2}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_info() { print_message "$1" "$BLUE"; }
print_success() { print_message "$1" "$GREEN"; }
print_warning() { print_message "$1" "$YELLOW"; }
print_error() { print_message "$1" "$RED"; }

# 函数：检查依赖
check_dependencies() {
    print_info "检查系统依赖..."
    
    if ! command -v podman &> /dev/null; then
        print_error "Podman 未安装，请先安装 Podman"
        exit 1
    fi
    
    if ! command -v podman-compose &> /dev/null; then
        print_error "podman-compose 未安装，请先安装 podman-compose"
        exit 1
    fi
    
    print_success "依赖检查完成"
}

# 函数：检查环境配置
check_environment() {
    print_info "检查环境配置..."
    
    if [ ! -f "$ENV_FILE" ]; then
        print_error "环境配置文件 $ENV_FILE 不存在"
        print_info "请复制 .env.production 并配置相应的环境变量"
        exit 1
    fi
    
    # 检查关键环境变量
    source "$ENV_FILE"
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL 未配置"
        exit 1
    fi
    
    if [ -z "$NEXTAUTH_SECRET" ]; then
        print_error "NEXTAUTH_SECRET 未配置"
        exit 1
    fi
    
    print_success "环境配置检查完成"
}

# 函数：创建必要的目录
setup_directories() {
    print_info "创建必要的目录..."
    
    sudo mkdir -p /var/lib/siteframe/{uploads,redis}
    sudo mkdir -p /var/log/siteframe
    sudo mkdir -p "$BACKUP_DIR"
    
    # 设置权限
    sudo chown -R 1001:1001 /var/lib/siteframe
    sudo chown -R 999:999 /var/lib/siteframe/redis
    
    print_success "目录创建完成"
}

# 注意：SSL 证书由宿主机 Caddy 管理，无需在容器中配置

# 函数：构建应用
build_app() {
    print_info "构建应用镜像..."
    
    podman-compose -f "$COMPOSE_FILE" build --no-cache
    
    print_success "应用构建完成"
}

# 函数：部署应用
deploy() {
    print_info "部署应用..."
    
    # 停止旧容器
    podman-compose -f "$COMPOSE_FILE" down || true
    
    # 启动新容器
    podman-compose -f "$COMPOSE_FILE" up -d
    
    # 等待服务启动
    print_info "等待服务启动..."
    sleep 30
    
    # 检查服务状态
    if check_health; then
        print_success "应用部署成功"
    else
        print_error "应用部署失败"
        show_logs
        exit 1
    fi
}

# 函数：健康检查
check_health() {
    print_info "执行健康检查..."
    
    # 检查容器状态
    if ! podman-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        print_error "容器未正常运行"
        return 1
    fi
    
    # 检查应用响应
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        print_success "应用健康检查通过"
        return 0
    else
        print_error "应用健康检查失败"
        return 1
    fi
}

# 函数：显示日志
show_logs() {
    print_info "显示应用日志..."
    podman-compose -f "$COMPOSE_FILE" logs --tail=50
}

# 函数：备份数据
backup_data() {
    print_info "备份应用数据..."
    
    BACKUP_FILE="$BACKUP_DIR/siteframe-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    tar -czf "$BACKUP_FILE" \
        /var/lib/siteframe/uploads \
        /var/lib/siteframe/redis \
        "$ENV_FILE" \
        2>/dev/null || true
    
    print_success "数据备份完成: $BACKUP_FILE"
    
    # 清理旧备份（保留最近7天）
    find "$BACKUP_DIR" -name "siteframe-backup-*.tar.gz" -mtime +7 -delete 2>/dev/null || true
}

# 函数：恢复数据
restore_data() {
    if [ -z "$1" ]; then
        print_error "请指定备份文件路径"
        exit 1
    fi
    
    print_info "恢复数据从: $1"
    
    # 停止服务
    podman-compose -f "$COMPOSE_FILE" down
    
    # 恢复数据
    tar -xzf "$1" -C / 2>/dev/null || true
    
    # 重启服务
    podman-compose -f "$COMPOSE_FILE" up -d
    
    print_success "数据恢复完成"
}

# 函数：更新应用
update() {
    print_info "更新应用..."
    
    # 备份当前数据
    backup_data
    
    # 拉取最新代码（如果使用 Git）
    if [ -d ".git" ]; then
        git pull origin main
    fi
    
    # 重新构建和部署
    build_app
    deploy
    
    print_success "应用更新完成"
}

# 函数：监控状态
monitor() {
    print_info "监控应用状态..."
    
    while true; do
        clear
        echo "=== SiteFrame 生产环境监控 ==="
        echo "时间: $(date)"
        echo ""
        
        echo "=== 容器状态 ==="
        podman-compose -f "$COMPOSE_FILE" ps
        echo ""
        
        echo "=== 资源使用 ==="
        podman stats --no-stream
        echo ""
        
        echo "=== 磁盘使用 ==="
        df -h /var/lib/siteframe
        echo ""
        
        echo "按 Ctrl+C 退出监控"
        sleep 10
    done
}

# 函数：显示帮助
show_help() {
    echo "SiteFrame 生产环境部署脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  setup     - 初始化生产环境"
    echo "  build     - 构建应用镜像"
    echo "  deploy    - 部署应用"
    echo "  update    - 更新应用"
    echo "  start     - 启动服务"
    echo "  stop      - 停止服务"
    echo "  restart   - 重启服务"
    echo "  status    - 查看服务状态"
    echo "  logs      - 查看日志"
    echo "  health    - 健康检查"
    echo "  backup    - 备份数据"
    echo "  restore   - 恢复数据 [备份文件]"
    echo "  monitor   - 监控状态"
    echo "  help      - 显示帮助"
}

# 主函数
main() {
    case "$1" in
        setup)
            check_dependencies
            check_environment
            setup_directories
            build_app
            deploy
            ;;
        build)
            check_dependencies
            build_app
            ;;
        deploy)
            check_dependencies
            check_environment
            deploy
            ;;
        update)
            check_dependencies
            check_environment
            update
            ;;
        start)
            podman-compose -f "$COMPOSE_FILE" up -d
            ;;
        stop)
            podman-compose -f "$COMPOSE_FILE" down
            ;;
        restart)
            podman-compose -f "$COMPOSE_FILE" restart
            ;;
        status)
            podman-compose -f "$COMPOSE_FILE" ps
            ;;
        logs)
            show_logs
            ;;
        health)
            check_health
            ;;
        backup)
            backup_data
            ;;
        restore)
            restore_data "$2"
            ;;
        monitor)
            monitor
            ;;
        help|--help|-h)
            show_help
            ;;
        "")
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"