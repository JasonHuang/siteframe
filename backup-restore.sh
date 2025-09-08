#!/bin/bash

# ===========================================
# SiteFrame 生产环境备份恢复脚本
# ===========================================
# 用途：数据库备份、文件备份、自动化恢复
# 作者：SiteFrame Team
# 版本：1.0.0
# ===========================================

set -euo pipefail

# ===========================================
# 配置变量
# ===========================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/backups"
LOG_FILE="${SCRIPT_DIR}/logs/backup.log"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30

# 从环境变量文件加载配置
if [[ -f "${SCRIPT_DIR}/.env.production" ]]; then
    source "${SCRIPT_DIR}/.env.production"
else
    echo "错误：找不到 .env.production 文件"
    exit 1
fi

# ===========================================
# 日志函数
# ===========================================
log() {
    local level=$1
    shift
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$LOG_FILE"
}

log_info() { log "INFO" "$@"; }
log_warn() { log "WARN" "$@"; }
log_error() { log "ERROR" "$@"; }

# ===========================================
# 初始化函数
# ===========================================
init_backup() {
    log_info "初始化备份环境..."
    
    # 创建必要目录
    mkdir -p "$BACKUP_DIR"/{database,files,logs}
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # 检查必要工具
    local tools=("pg_dump" "tar" "gzip" "podman")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "缺少必要工具: $tool"
            exit 1
        fi
    done
    
    log_info "备份环境初始化完成"
}

# ===========================================
# 数据库备份函数
# ===========================================
backup_database() {
    log_info "开始数据库备份..."
    
    local backup_file="${BACKUP_DIR}/database/siteframe_db_${DATE}.sql.gz"
    
    # 使用 pg_dump 备份数据库
    if PGPASSWORD="$SUPABASE_DB_PASSWORD" pg_dump \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        --verbose \
        --no-owner \
        --no-privileges \
        --clean \
        --if-exists | gzip > "$backup_file"; then
        
        log_info "数据库备份成功: $backup_file"
        
        # 验证备份文件
        if [[ -s "$backup_file" ]]; then
            local size=$(du -h "$backup_file" | cut -f1)
            log_info "备份文件大小: $size"
        else
            log_error "备份文件为空或不存在"
            return 1
        fi
    else
        log_error "数据库备份失败"
        return 1
    fi
}

# ===========================================
# 文件备份函数
# ===========================================
backup_files() {
    log_info "开始文件备份..."
    
    local backup_file="${BACKUP_DIR}/files/siteframe_files_${DATE}.tar.gz"
    
    # 备份上传文件和配置文件
    local files_to_backup=(
        "uploads"
        ".env.production"
        "podman-compose.production.yml"
        "nginx/nginx.conf"
        "redis.conf"
        "ssl"
    )
    
    local existing_files=()
    for file in "${files_to_backup[@]}"; do
        if [[ -e "${SCRIPT_DIR}/$file" ]]; then
            existing_files+=("$file")
        fi
    done
    
    if [[ ${#existing_files[@]} -gt 0 ]]; then
        if tar -czf "$backup_file" -C "$SCRIPT_DIR" "${existing_files[@]}" 2>/dev/null; then
            log_info "文件备份成功: $backup_file"
            
            local size=$(du -h "$backup_file" | cut -f1)
            log_info "备份文件大小: $size"
        else
            log_error "文件备份失败"
            return 1
        fi
    else
        log_warn "没有找到需要备份的文件"
    fi
}

# ===========================================
# 容器数据备份函数
# ===========================================
backup_volumes() {
    log_info "开始容器数据卷备份..."
    
    local backup_file="${BACKUP_DIR}/files/siteframe_volumes_${DATE}.tar.gz"
    
    # 备份 Redis 数据
    if podman volume exists siteframe_redis_data; then
        if podman run --rm \
            -v siteframe_redis_data:/data:ro \
            -v "${BACKUP_DIR}/files:/backup" \
            alpine:latest \
            tar -czf "/backup/redis_data_${DATE}.tar.gz" -C /data .; then
            
            log_info "Redis 数据备份成功"
        else
            log_warn "Redis 数据备份失败"
        fi
    fi
    
    # 备份应用数据
    if podman volume exists siteframe_app_data; then
        if podman run --rm \
            -v siteframe_app_data:/data:ro \
            -v "${BACKUP_DIR}/files:/backup" \
            alpine:latest \
            tar -czf "/backup/app_data_${DATE}.tar.gz" -C /data .; then
            
            log_info "应用数据备份成功"
        else
            log_warn "应用数据备份失败"
        fi
    fi
}

# ===========================================
# 清理旧备份函数
# ===========================================
cleanup_old_backups() {
    log_info "清理 $RETENTION_DAYS 天前的备份文件..."
    
    local deleted_count=0
    
    # 清理数据库备份
    while IFS= read -r -d '' file; do
        rm "$file"
        ((deleted_count++))
        log_info "删除旧备份: $(basename "$file")"
    done < <(find "${BACKUP_DIR}/database" -name "*.sql.gz" -mtime +$RETENTION_DAYS -print0 2>/dev/null || true)
    
    # 清理文件备份
    while IFS= read -r -d '' file; do
        rm "$file"
        ((deleted_count++))
        log_info "删除旧备份: $(basename "$file")"
    done < <(find "${BACKUP_DIR}/files" -name "*.tar.gz" -mtime +$RETENTION_DAYS -print0 2>/dev/null || true)
    
    if [[ $deleted_count -eq 0 ]]; then
        log_info "没有需要清理的旧备份文件"
    else
        log_info "共清理了 $deleted_count 个旧备份文件"
    fi
}

# ===========================================
# 数据库恢复函数
# ===========================================
restore_database() {
    local backup_file="$1"
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "备份文件不存在: $backup_file"
        return 1
    fi
    
    log_info "开始恢复数据库: $backup_file"
    
    # 确认操作
    echo "警告：此操作将覆盖现有数据库！"
    read -p "确认继续？(yes/no): " confirm
    if [[ "$confirm" != "yes" ]]; then
        log_info "用户取消恢复操作"
        return 0
    fi
    
    # 恢复数据库
    if zcat "$backup_file" | PGPASSWORD="$SUPABASE_DB_PASSWORD" psql \
        -h "$SUPABASE_DB_HOST" \
        -p "$SUPABASE_DB_PORT" \
        -U "$SUPABASE_DB_USER" \
        -d "$SUPABASE_DB_NAME" \
        --quiet; then
        
        log_info "数据库恢复成功"
    else
        log_error "数据库恢复失败"
        return 1
    fi
}

# ===========================================
# 文件恢复函数
# ===========================================
restore_files() {
    local backup_file="$1"
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "备份文件不存在: $backup_file"
        return 1
    fi
    
    log_info "开始恢复文件: $backup_file"
    
    # 确认操作
    echo "警告：此操作将覆盖现有文件！"
    read -p "确认继续？(yes/no): " confirm
    if [[ "$confirm" != "yes" ]]; then
        log_info "用户取消恢复操作"
        return 0
    fi
    
    # 恢复文件
    if tar -xzf "$backup_file" -C "$SCRIPT_DIR"; then
        log_info "文件恢复成功"
    else
        log_error "文件恢复失败"
        return 1
    fi
}

# ===========================================
# 列出备份函数
# ===========================================
list_backups() {
    log_info "可用的备份文件:"
    
    echo "数据库备份:"
    find "${BACKUP_DIR}/database" -name "*.sql.gz" -type f -exec ls -lh {} \; 2>/dev/null | \
        awk '{print $9, "(" $5 ", " $6 " " $7 ")"}' || echo "  无数据库备份"
    
    echo
    echo "文件备份:"
    find "${BACKUP_DIR}/files" -name "*.tar.gz" -type f -exec ls -lh {} \; 2>/dev/null | \
        awk '{print $9, "(" $5 ", " $6 " " $7 ")"}' || echo "  无文件备份"
}

# ===========================================
# 备份状态检查函数
# ===========================================
check_backup_status() {
    log_info "检查备份状态..."
    
    # 检查最近的备份
    local latest_db_backup=$(find "${BACKUP_DIR}/database" -name "*.sql.gz" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
    local latest_file_backup=$(find "${BACKUP_DIR}/files" -name "*.tar.gz" -type f -printf '%T@ %p\n' 2>/dev/null | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [[ -n "$latest_db_backup" ]]; then
        local db_age=$(( ($(date +%s) - $(stat -c %Y "$latest_db_backup")) / 86400 ))
        log_info "最新数据库备份: $(basename "$latest_db_backup") ($db_age 天前)"
    else
        log_warn "没有找到数据库备份"
    fi
    
    if [[ -n "$latest_file_backup" ]]; then
        local file_age=$(( ($(date +%s) - $(stat -c %Y "$latest_file_backup")) / 86400 ))
        log_info "最新文件备份: $(basename "$latest_file_backup") ($file_age 天前)"
    else
        log_warn "没有找到文件备份"
    fi
    
    # 检查磁盘空间
    local backup_size=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1 || echo "0")
    log_info "备份目录大小: $backup_size"
    
    local available_space=$(df -h "$BACKUP_DIR" | awk 'NR==2 {print $4}')
    log_info "可用磁盘空间: $available_space"
}

# ===========================================
# 主函数
# ===========================================
main() {
    case "${1:-}" in
        "backup")
            init_backup
            backup_database
            backup_files
            backup_volumes
            cleanup_old_backups
            log_info "备份完成"
            ;;
        "restore-db")
            if [[ -z "${2:-}" ]]; then
                echo "用法: $0 restore-db <备份文件路径>"
                exit 1
            fi
            restore_database "$2"
            ;;
        "restore-files")
            if [[ -z "${2:-}" ]]; then
                echo "用法: $0 restore-files <备份文件路径>"
                exit 1
            fi
            restore_files "$2"
            ;;
        "list")
            list_backups
            ;;
        "status")
            check_backup_status
            ;;
        "cleanup")
            cleanup_old_backups
            ;;
        "help"|"--help"|"-h")
            echo "SiteFrame 备份恢复脚本"
            echo
            echo "用法: $0 <命令> [参数]"
            echo
            echo "命令:"
            echo "  backup              执行完整备份（数据库 + 文件）"
            echo "  restore-db <file>   恢复数据库备份"
            echo "  restore-files <file> 恢复文件备份"
            echo "  list                列出所有备份文件"
            echo "  status              检查备份状态"
            echo "  cleanup             清理旧备份文件"
            echo "  help                显示此帮助信息"
            echo
            echo "示例:"
            echo "  $0 backup"
            echo "  $0 restore-db backups/database/siteframe_db_20240101_120000.sql.gz"
            echo "  $0 list"
            ;;
        *)
            echo "错误：未知命令 '${1:-}'"
            echo "使用 '$0 help' 查看帮助信息"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"