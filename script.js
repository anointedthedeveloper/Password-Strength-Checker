class PasswordStrengthChecker {
    constructor() {
        this.passwordInput = document.getElementById('password');
        this.toggleBtn = document.getElementById('togglePassword');
        this.copyBtn = document.getElementById('copyPassword');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        this.scoreDetails = document.getElementById('scoreDetails');
        this.tipsSection = document.getElementById('tipsSection');
        this.tipsList = document.getElementById('tipsList');
        
        this.init();
    }

    init() {
        // Event listeners
        this.passwordInput.addEventListener('input', () => this.checkStrength());
        this.toggleBtn.addEventListener('click', () => this.togglePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        
        // Initial check
        this.checkStrength();
    }

    togglePassword() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    }

    async copyPassword() {
        if (!this.passwordInput.value) {
            alert('No password to copy!');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.passwordInput.value);
            
            // Visual feedback
            const originalText = this.copyBtn.innerHTML;
            this.copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.copyBtn.innerHTML = originalText;
            }, 1500);
        } catch (err) {
            alert('Failed to copy password');
        }
    }

    calculateScore(password) {
        let score = 0;
        
        if (!password) return 0;
        
        // Length check (0-2 points)
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Character variety checks (0-3 points)
        if (/[A-Z]/.test(password)) score += 1; // Uppercase
        if (/[a-z]/.test(password)) score += 1; // Lowercase
        if (/[0-9]/.test(password)) score += 1; // Number
        if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special character
        
        // Cap at 5
        return Math.min(5, score);
    }

    getStrengthLabel(score) {
        if (score <= 2) return 'Weak';
        if (score <= 4) return 'Medium';
        return 'Strong';
    }

    updateRequirements(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        // Update checklist
        for (const [key, met] of Object.entries(requirements)) {
            const element = document.getElementById(key);
            if (element) {
                const icon = element.querySelector('i');
                if (met) {
                    element.classList.add('met');
                    icon.className = 'fas fa-check-circle';
                } else {
                    element.classList.remove('met');
                    icon.className = 'far fa-circle';
                }
            }
        }

        return requirements;
    }

    generateTips(score, requirements, password) {
        const tips = [];
        
        if (!password) {
            tips.push('Enter a password to see improvement tips');
            return tips;
        }
        
        if (!requirements.length) {
            tips.push('Add more characters (aim for at least 8)');
        } else if (password.length < 12) {
            tips.push('Make it longer (12+ characters is even better)');
        }
        
        if (!requirements.uppercase) {
            tips.push('Add uppercase letters (A, B, C...)');
        }
        
        if (!requirements.lowercase) {
            tips.push('Add lowercase letters (a, b, c...)');
        }
        
        if (!requirements.number) {
            tips.push('Include numbers (0-9)');
        }
        
        if (!requirements.special) {
            tips.push('Add special characters (!@#$%^&*)');
        }
        
        if (score === 5) {
            tips.push('Excellent! Your password is very strong');
        }
        
        return tips;
    }

    updateTips(tips) {
        if (tips.length > 0) {
            this.tipsSection.style.display = 'block';
            this.tipsList.innerHTML = tips.map(tip => 
                `<li><i class="fas fa-chevron-right"></i> ${tip}</li>`
            ).join('');
        } else {
            this.tipsSection.style.display = 'none';
        }
    }

    checkStrength() {
        const password = this.passwordInput.value;
        
        // Calculate score
        const score = this.calculateScore(password);
        const label = this.getStrengthLabel(score);
        
        // Update requirements
        const requirements = this.updateRequirements(password);
        
        // Generate and update tips
        const tips = this.generateTips(score, requirements, password);
        this.updateTips(tips);
        
        // Update UI
        this.strengthBar.className = 'strength-bar ' + label.toLowerCase();
        this.strengthText.textContent = label;
        this.scoreDetails.innerHTML = `<span>Score: ${score}/5</span>`;
        
        // Update strength text color based on label
        switch(label) {
            case 'Weak':
                this.strengthText.style.color = '#dc3545';
                break;
            case 'Medium':
                this.strengthText.style.color = '#ffc107';
                break;
            case 'Strong':
                this.strengthText.style.color = '#28a745';
                break;
            default:
                this.strengthText.style.color = '#333';
        }
    }
}

// Initialize the password checker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordStrengthChecker();
});
