#!/bin/bash

# SpeakEz Server Deployment Script
# This script handles deployment of the SpeakEz server application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="speakez-server"
DEPLOY_PATH="/opt/speakez/server"
BACKUP_DIR="/opt/speakez/backups"
LOG_DIR="/opt/speakez/logs"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Create backup
create_backup() {
    log_info "Creating backup of current deployment..."

    if [ -d "$DEPLOY_PATH" ]; then
        local backup_name="server.backup.$(date +%Y%m%d_%H%M%S)"
        sudo cp -r "$DEPLOY_PATH" "$BACKUP_DIR/$backup_name"
        log_success "Backup created: $backup_name"

        # Keep only last 10 backups
        sudo find "$BACKUP_DIR" -name "server.backup.*" -type d | sort | head -n -10 | xargs -r sudo rm -rf
    else
        log_warning "No existing deployment found, skipping backup"
    fi
}

# Stop application
stop_app() {
    log_info "Stopping application..."

    # Try systemd first
    if sudo systemctl is-active --quiet "$APP_NAME" 2>/dev/null; then
        sudo systemctl stop "$APP_NAME"
        log_success "Application stopped via systemd"
        return
    fi

    # Try PM2
    if command -v pm2 &> /dev/null; then
        pm2 stop "$APP_NAME" 2>/dev/null || true
        pm2 delete "$APP_NAME" 2>/dev/null || true
        log_success "Application stopped via PM2"
        return
    fi

    # Try killing process on port 5000
    local pid=$(sudo lsof -t -i:5000 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        sudo kill -TERM "$pid" 2>/dev/null || true
        sleep 5
        sudo kill -KILL "$pid" 2>/dev/null || true
        log_success "Application stopped by killing process"
        return
    fi

    log_warning "Could not find running application to stop"
}

# Deploy application
deploy_app() {
    log_info "Deploying application..."

    # Create deployment directory
    sudo mkdir -p "$DEPLOY_PATH"
    sudo mkdir -p "$LOG_DIR"

    # Copy application files
    sudo cp -r . "$DEPLOY_PATH/"

    # Set proper permissions
    sudo chown -R www-data:www-data "$DEPLOY_PATH"
    sudo chmod -R 755 "$DEPLOY_PATH"

    # Install dependencies
    cd "$DEPLOY_PATH"
    sudo npm ci --only=production

    log_success "Application deployed successfully"
}

# Start application
start_app() {
    log_info "Starting application..."

    cd "$DEPLOY_PATH"

    # Try systemd first
    if sudo systemctl is-enabled "$APP_NAME" 2>/dev/null; then
        sudo systemctl daemon-reload
        sudo systemctl start "$APP_NAME"
        log_success "Application started via systemd"
        return
    fi

    # Try PM2
    if command -v pm2 &> /dev/null; then
        pm2 start ecosystem.config.js
        pm2 save
        log_success "Application started via PM2"
        return
    fi

    # Fallback to direct start
    log_warning "No process manager found, starting directly (not recommended for production)"
    sudo -u www-data npm start &
    log_success "Application started directly"
}

# Health check
health_check() {
    log_info "Performing health check..."

    local max_attempts=12
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        log_info "Health check attempt $attempt/$max_attempts"

        if curl -f http://localhost:5000/health >/dev/null 2>&1; then
            log_success "Health check passed!"
            return 0
        fi

        sleep 5
        ((attempt++))
    done

    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Main deployment function
main() {
    log_info "Starting SpeakEz Server deployment..."

    # Pre-deployment checks
    check_root

    # Create necessary directories
    sudo mkdir -p "$BACKUP_DIR"
    sudo mkdir -p "$LOG_DIR"

    # Deployment steps
    create_backup
    stop_app
    deploy_app
    start_app

    # Post-deployment checks
    if health_check; then
        log_success "🎉 Deployment completed successfully!"
        log_info "Application is running and healthy"
    else
        log_error "❌ Deployment completed but health check failed"
        log_info "Check logs at $LOG_DIR for more information"
        exit 1
    fi
}

# Handle command line arguments
case "${1:-}" in
    "backup")
        create_backup
        ;;
    "stop")
        stop_app
        ;;
    "start")
        start_app
        ;;
    "restart")
        stop_app
        sleep 2
        start_app
        ;;
    "status")
        if curl -f http://localhost:5000/health >/dev/null 2>&1; then
            log_success "Application is healthy"
        else
            log_error "Application is not responding"
        fi
        ;;
    "logs")
        if command -v journalctl &> /dev/null; then
            sudo journalctl -u "$APP_NAME" -f
        elif command -v pm2 &> /dev/null; then
            pm2 logs "$APP_NAME"
        else
            log_error "No log viewer available"
        fi
        ;;
    *)
        main
        ;;
esac
