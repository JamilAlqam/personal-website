// معالجة الصور المفقودة
document.addEventListener('DOMContentLoaded', function() {
    // إنشاء صورة بديلة للصور المفقودة
    function createPlaceholderImage(width = 300, height = 200, text = 'صورة غير متوفرة') {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // خلفية رمادية
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, 0, width, height);
        
        // حدود
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width-2, height-2);
        
        // النص
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width/2, height/2);
        
        return canvas.toDataURL();
    }
    
    // فحص جميع الصور في الصفحة
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // إضافة معالج للخطأ
        img.addEventListener('error', function() {
            console.warn('فشل في تحميل الصورة:', this.src);
            
            // إنشاء صورة بديلة
            const placeholder = createPlaceholderImage(
                this.offsetWidth || 300, 
                this.offsetHeight || 200, 
                'صورة غير متوفرة'
            );
            
            this.src = placeholder;
            this.alt = 'صورة غير متوفرة - ' + (this.alt || '');
            
            // إضافة كلاس للتمييز
            this.classList.add('image-placeholder');
        });
        
        // إضافة معالج للتحميل الناجح
        img.addEventListener('load', function() {
            this.classList.remove('image-placeholder');
        });
    });
});

// إضافة أنماط CSS للصور البديلة
const style = document.createElement('style');
style.textContent = `
    .image-placeholder {
        opacity: 0.7;
        filter: grayscale(100%);
        border: 2px dashed #ccc !important;
    }
    
    .image-placeholder:hover {
        opacity: 1;
        filter: none;
    }
`;
document.head.appendChild(style);
