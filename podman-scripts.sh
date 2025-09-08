#!/bin/bash

# Podman Scripts for SiteFrame Project
# Usage: ./podman-scripts.sh [command]

set -e

PROJECT_NAME="siteframe"
IMAGE_NAME="siteframe-app"
COMPOSE_FILE="podman-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_usage() {
    echo -e "${BLUE}SiteFrame Podman Management Script${NC}"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  build       - Build the application image"
    echo "  up          - Start all services"
    echo "  down        - Stop all services"
    echo "  restart     - Restart all services"
    echo "  logs        - Show logs for all services"
    echo "  logs-app    - Show logs for the app only"
    echo "  logs-db     - Show logs for the database only"
    echo "  status      - Show status of all containers"
    echo "  shell       - Open shell in the app container"
    echo "  db-shell    - Open PostgreSQL shell"
    echo "  clean       - Remove all containers and volumes"
    echo "  dev         - Start in development mode (with volume mounts)"
    echo "  help        - Show this help message"
}

build_image() {
    echo -e "${YELLOW}Building SiteFrame application image...${NC}"
    podman build -t $IMAGE_NAME .
    echo -e "${GREEN}Build completed successfully!${NC}"
}

start_services() {
    echo -e "${YELLOW}Starting SiteFrame services...${NC}"
    podman-compose -f $COMPOSE_FILE up -d
    echo -e "${GREEN}Services started successfully!${NC}"
    echo -e "${BLUE}Application available at: http://localhost:3000${NC}"
}

stop_services() {
    echo -e "${YELLOW}Stopping SiteFrame services...${NC}"
    podman-compose -f $COMPOSE_FILE down
    echo -e "${GREEN}Services stopped successfully!${NC}"
}

restart_services() {
    echo -e "${YELLOW}Restarting SiteFrame services...${NC}"
    podman-compose -f $COMPOSE_FILE restart
    echo -e "${GREEN}Services restarted successfully!${NC}"
}

show_logs() {
    podman-compose -f $COMPOSE_FILE logs -f
}

show_app_logs() {
    podman-compose -f $COMPOSE_FILE logs -f siteframe-app
}

show_db_logs() {
    podman-compose -f $COMPOSE_FILE logs -f postgres
}

show_status() {
    echo -e "${BLUE}Container Status:${NC}"
    podman-compose -f $COMPOSE_FILE ps
}

open_shell() {
    echo -e "${YELLOW}Opening shell in SiteFrame app container...${NC}"
    podman exec -it siteframe-app /bin/sh
}

open_db_shell() {
    echo -e "${YELLOW}Opening PostgreSQL shell...${NC}"
    podman exec -it siteframe-postgres psql -U postgres -d siteframe_dev
}

clean_all() {
    echo -e "${RED}Warning: This will remove all containers and volumes!${NC}"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cleaning up...${NC}"
        podman-compose -f $COMPOSE_FILE down -v
        podman rmi $IMAGE_NAME 2>/dev/null || true
        echo -e "${GREEN}Cleanup completed!${NC}"
    else
        echo -e "${BLUE}Cleanup cancelled.${NC}"
    fi
}

dev_mode() {
    echo -e "${YELLOW}Starting in development mode...${NC}"
    echo -e "${BLUE}Note: This will mount your local code for live reloading${NC}"
    
    # Create a development compose override
    cat > podman-compose.dev.yml << EOF
version: '3.8'
services:
  siteframe-app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
    command: npm run dev
EOF
    
    podman-compose -f $COMPOSE_FILE -f podman-compose.dev.yml up -d
    echo -e "${GREEN}Development mode started!${NC}"
    echo -e "${BLUE}Application available at: http://localhost:3000${NC}"
}

# Check if podman-compose is available
if ! command -v podman-compose &> /dev/null; then
    echo -e "${RED}Error: podman-compose is not installed!${NC}"
    echo -e "${YELLOW}Install it with: pip install podman-compose${NC}"
    exit 1
fi

# Main script logic
case "$1" in
    build)
        build_image
        ;;
    up)
        start_services
        ;;
    down)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    logs-app)
        show_app_logs
        ;;
    logs-db)
        show_db_logs
        ;;
    status)
        show_status
        ;;
    shell)
        open_shell
        ;;
    db-shell)
        open_db_shell
        ;;
    clean)
        clean_all
        ;;
    dev)
        dev_mode
        ;;
    help|--help|-h)
        print_usage
        ;;
    "")
        print_usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        print_usage
        exit 1
        ;;
esac