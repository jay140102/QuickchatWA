// Phone number validation utilities
export const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digits = phone.replace(/\D/g, '');
    // Phone numbers should be between 7 and 15 digits
    return digits.length >= 7 && digits.length <= 15;
};

export const sanitizePhoneNumber = (phone: string): string => {
    // Remove spaces, dashes, parentheses, dots
    return phone.replace(/[\s\-().+]/g, '');
};

export const formatPhoneDisplay = (countryCode: string, phone: string): string => {
    return `${countryCode} ${phone}`;
};

export const buildWhatsAppUrl = (countryCode: string, phone: string, message?: string): string => {
    const cleanCode = countryCode.replace('+', '');
    const cleanPhone = sanitizePhoneNumber(phone);
    const fullNumber = `${cleanCode}${cleanPhone}`;
    const baseUrl = `https://wa.me/${fullNumber}`;
    if (message && message.trim().length > 0) {
        const encodedMsg = encodeURIComponent(message.trim());
        return `${baseUrl}?text=${encodedMsg}`;
    }
    return baseUrl;
};

export const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
};
