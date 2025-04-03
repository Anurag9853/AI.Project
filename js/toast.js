
class ToastManager {
  constructor() {
    this.container = document.getElementById('toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = document.createElement('div');
    icon.className = 'float-left mr-3';
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    
    icon.innerHTML = `<i data-feather="${iconName}"></i>`;
    
    const content = document.createElement('div');
    content.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(content);
    this.container.appendChild(toast);
    
    // Render the icon
    feather.replace();
    
    // Show animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        this.container.removeChild(toast);
      }, 300);
    }, duration);
  }
  
  success(message, duration) {
    this.show(message, 'success', duration);
  }
  
  error(message, duration) {
    this.show(message, 'error', duration);
  }
  
  info(message, duration) {
    this.show(message, 'info', duration);
  }
  
  warning(message, duration) {
    this.show(message, 'warning', duration);
  }
}

const toast = new ToastManager();
