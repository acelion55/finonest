// Mobile optimization
document.addEventListener('touchmove', function(event) {
    if (event.target.closest('input')) {
        return; // Allow scrolling on inputs
    }
}, { passive: true });

// Prevent zoom on double tap for form elements
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Prevent pinch zoom
document.addEventListener('touchmove', function(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

// Set viewport scale on load
function setViewportScale() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no');
    }
}
setViewportScale();

// Improve input focus for mobile
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        // Scroll into view with padding
        setTimeout(() => {
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    });

    // Better input styling on mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        input.style.fontSize = '16px'; // Prevents zoom on iOS
    }
});

const authWrapper = document.querySelector('.auth-wrapper');
const loginTrigger = document.querySelector('.login-trigger');
const registerTrigger = document.querySelector('.register-trigger');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyOtpBtn = document.getElementById('verify-otp-btn');
const otpField = document.getElementById('otp-field');
const phoneInput = document.getElementById('signup-phone');
const otpInput = document.getElementById('otp-input');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');

let generatedOtp = '';
let otpVerified = false;

registerTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.add('toggled');
    // Scroll to top on mobile
    if (window.innerWidth <= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

loginTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    authWrapper.classList.remove('toggled');
    resetSignup();
    // Scroll to top on mobile
    if (window.innerWidth <= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

if (sendOtpBtn) {
    sendOtpBtn.addEventListener('click', async () => {
        const phone = phoneInput.value;
        if (phone.length !== 10) {
            showMessage('signup', 'error', 'Enter valid 10-digit number');
            return;
        }

        sendOtpBtn.disabled = true;
        generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

        try {
            const response = await fetch('http://localhost:5000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: phone, otp: generatedOtp })
            });

            const data = await response.json();
            if (data.success) {
                showMessage('signup', 'success', 'OTP sent!');
                otpField.style.display = 'flex';
                sendOtpBtn.textContent = 'Resend';
            } else {
                showMessage('signup', 'error', 'Failed to send OTP');
            }
        } catch (error) {
            showMessage('signup', 'error', 'Failed to send OTP');
        }
        sendOtpBtn.disabled = false;
    });
}

if (verifyOtpBtn) {
    verifyOtpBtn.addEventListener('click', () => {
        if (otpInput.value === generatedOtp) {
            otpVerified = true;
            showMessage('signup', 'success', 'Phone verified!');
            otpField.style.display = 'none';
            phoneInput.disabled = true;
            sendOtpBtn.style.display = 'none';
        } else {
            showMessage('signup', 'error', 'Invalid OTP');
        }
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!otpVerified) {
            showMessage('signup', 'error', 'Verify phone first');
            return;
        }

        const formData = {
            email: document.getElementById('signup-email').value,
            password: document.getElementById('signup-password').value,
            confirmPassword: document.getElementById('signup-password').value,
            fullName: document.getElementById('signup-username').value,
            phoneNumber: phoneInput.value
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Device-Id': getDeviceId() },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                showMessage('signup', 'success', 'Account created! Redirecting...');
                localStorage.setItem('token', data.token);
                setTimeout(() => window.location.href = '/', 1500);
            } else {
                showMessage('signup', 'error', data.message);
            }
        } catch (error) {
            showMessage('signup', 'error', 'Signup failed');
        }
    });
}

if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            email: document.getElementById('signin-username').value,
            password: document.getElementById('signin-password').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-Device-Id': getDeviceId() },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                showMessage('signin', 'success', 'Login successful!');
                localStorage.setItem('token', data.token);
                setTimeout(() => window.location.href = '/', 1500);
            } else {
                showMessage('signin', 'error', data.message);
            }
        } catch (error) {
            showMessage('signin', 'error', 'Login failed');
        }
    });
}

function showMessage(form, type, text) {
    const msgEl = document.getElementById(`${form}-message`);
    if (msgEl) {
        msgEl.textContent = text;
        msgEl.className = `message-banner ${type}`;
        msgEl.style.display = 'block';
        setTimeout(() => msgEl.style.display = 'none', 3000);
    }
}

function resetSignup() {
    otpVerified = false;
    if (otpField) otpField.style.display = 'none';
    if (phoneInput) phoneInput.disabled = false;
    if (sendOtpBtn) {
        sendOtpBtn.style.display = 'block';
        sendOtpBtn.textContent = 'Send OTP';
    }
    if (otpInput) otpInput.value = '';
}

function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}