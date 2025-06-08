import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent {
  @Input() imageSrc: string = '';
  @Input() imageAlt: string = '';
  @Input() currentIndex: number = 0;
  @Input() totalImages: number = 0;
  @Input() imageTitle: string = '';
  @Input() imageDescription: string = '';
  @Output() closeLightbox = new EventEmitter<void>();
  @Output() navigate = new EventEmitter<number>();

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowLeft':
        this.previousImage(event);
        break;
      case 'ArrowRight':
        this.nextImage(event);
        break;
      case 'Escape':
        this.close();
        break;
    }
  }

  close() {
    this.closeLightbox.emit();
  }

  previousImage(event: Event) {
    event.stopPropagation();
    const newIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages;
    this.navigate.emit(newIndex);
  }

  nextImage(event: Event) {
    event.stopPropagation();
    const newIndex = (this.currentIndex + 1) % this.totalImages;
    this.navigate.emit(newIndex);
  }

  private async addWatermark(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject('Could not get canvas context');
          return;
        }

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the original image
        ctx.drawImage(img, 0, 0);

        // Add watermark
        ctx.save();
        
        // Create gradient for fancy text
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(0.5, '#4ECDC4');
        gradient.addColorStop(1, '#45B7D1');

        // Set text style with Midnight Signature font
        const fontSize = 50; // Increased font size to 50px
        ctx.font = `${fontSize}px 'Midnight Signature', cursive`;
        ctx.fillStyle = gradient;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 12; // Increased shadow blur for larger text
        ctx.shadowOffsetX = 3; // Increased shadow offset for larger text
        ctx.shadowOffsetY = 3; // Increased shadow offset for larger text

        // Calculate position with padding
        const padding = {
          x: 40, // Increased horizontal padding
          y: 50  // Increased vertical padding and moved up
        };
        const text = "Akshay's Photography";
        const textWidth = ctx.measureText(text).width;
        const x = canvas.width - textWidth/2 - padding.x;
        const y = canvas.height - padding.y - 20; // Added 20px to move it up

        // Draw the text
        ctx.fillText(text, x, y);

        // Add a subtle stroke
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5; // Increased stroke width for larger text
        ctx.strokeText(text, x, y);

        ctx.restore();

        // Convert to blob and create URL
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve(url);
          } else {
            reject('Could not create blob');
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = () => {
        reject('Could not load image');
      };

      img.src = imageUrl;
    });
  }

  async downloadImage(event: Event) {
    event.stopPropagation();
    
    try {
      // Show loading state
      const downloadBtn = event.target as HTMLElement;
      const originalContent = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<span class="loading">Processing...</span>';
      
      // Add watermark and get the new image URL
      const watermarkedImageUrl = await this.addWatermark(this.imageSrc);
      
      // Create download link
      const link = document.createElement('a');
      link.href = watermarkedImageUrl;
      
      // Extract filename and add watermark suffix
      const originalFilename = this.imageSrc.split('/').pop() || 'image';
      const filename = originalFilename.replace(/\.[^/.]+$/, '') + '_watermarked.jpg';
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(watermarkedImageUrl);
      
      // Restore button content
      downloadBtn.innerHTML = originalContent;
    } catch (error) {
      console.error('Error adding watermark:', error);
      // Fallback to original image if watermarking fails
      const link = document.createElement('a');
      link.href = this.imageSrc;
      const filename = this.imageSrc.split('/').pop() || 'image';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
} 