#!/bin/bash

# FORMA Strategy - Quick Start Script
# Usage: ./start.sh [dev|docker|build]

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Проверка зависимостей
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python is not installed. Please install Python 3.11+"
        exit 1
    fi
    
    if ! command -v yarn &> /dev/null; then
        print_warning "Yarn not found, using npm instead"
        NPM_CMD="npm"
    else
        NPM_CMD="yarn"
    fi
    
    print_status "All dependencies found!"
}

# Настройка Backend
setup_backend() {
    print_status "Setting up Backend..."
    cd backend
    
    # Создание виртуального окружения если не существует
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_status "Virtual environment created"
    fi
    
    # Активация и установка зависимостей
    source venv/bin/activate
    pip install -q -r requirements.txt
    
    # Создание .env если не существует
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_warning "Created .env from example. Please configure it."
    fi
    
    cd ..
    print_status "Backend setup complete!"
}

# Настройка Frontend
setup_frontend() {
    print_status "Setting up Frontend..."
    cd frontend
    
    # Установка зависимостей
    $NPM_CMD install --silent
    
    # Создание .env если не существует
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_warning "Created .env from example. Please configure it."
    fi
    
    cd ..
    print_status "Frontend setup complete!"
}

# Запуск в режиме разработки
start_dev() {
    print_status "Starting development servers..."
    
    # Backend в фоне
    cd backend
    source venv/bin/activate
    uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
    BACKEND_PID=$!
    cd ..
    
    print_status "Backend started on http://localhost:8001"
    
    # Frontend
    cd frontend
    $NPM_CMD start &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Frontend started on http://localhost:3000"
    
    echo ""
    print_status "FORMA Strategy is running!"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend:  http://localhost:8001"
    echo "  - API Docs: http://localhost:8001/docs"
    echo ""
    echo "Press Ctrl+C to stop all servers"
    
    # Ожидание и очистка
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
    wait
}

# Docker запуск
start_docker() {
    print_status "Starting with Docker Compose..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        # Попробуем docker compose (новый синтаксис)
        docker compose up -d --build
    else
        docker-compose up -d --build
    fi
    
    print_status "FORMA Strategy is running in Docker!"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend:  http://localhost:8001"
}

# Сборка для production
build_production() {
    print_status "Building for production..."
    
    cd frontend
    $NPM_CMD run build
    cd ..
    
    print_status "Production build complete!"
    echo "Frontend build is in: frontend/build/"
}

# Main
case "${1:-dev}" in
    dev)
        check_dependencies
        setup_backend
        setup_frontend
        start_dev
        ;;
    docker)
        start_docker
        ;;
    build)
        check_dependencies
        setup_frontend
        build_production
        ;;
    setup)
        check_dependencies
        setup_backend
        setup_frontend
        print_status "Setup complete! Run './start.sh dev' to start"
        ;;
    *)
        echo "FORMA Strategy - Quick Start"
        echo ""
        echo "Usage: ./start.sh [command]"
        echo ""
        echo "Commands:"
        echo "  dev     - Start development servers (default)"
        echo "  docker  - Start with Docker Compose"
        echo "  build   - Build for production"
        echo "  setup   - Setup without starting"
        ;;
esac
