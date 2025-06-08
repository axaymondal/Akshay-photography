import { Component, OnInit } from '@angular/core';
import { CloudinaryService } from '../services/cloudinary.service';
import { CloudinaryResource } from '../models/cloudinary.model';

interface GalleryImage {
  src: string;
  category: string;
  alt: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  selectedCategory: string = 'all';
  categories: string[] = ['all', 'nature', 'food'];
  showLightbox: boolean = false;
  selectedImage: GalleryImage | null = null;
  currentImageIndex: number = 0;
  images: GalleryImage[] = [];

  constructor(private cloudinaryService: CloudinaryService) {}

  ngOnInit() {
    this.cloudinaryService.getImagesByFolder('my-folder').subscribe(
      (response) => {
        this.images = response.resources.map((img: CloudinaryResource) => ({
          src: img.secure_url,
          category: this.getCategoryFromPublicId(img.public_id),
          alt: img.public_id,
          title: this.getTitleFromPublicId(img.public_id),
          description: this.getDescriptionFromPublicId(img.public_id)
        }));
      },
      (error) => {
        console.error('Error loading gallery images:', error);
      }
    );
  }

  get filteredImages(): GalleryImage[] {
    if (this.selectedCategory === 'all') {
      return this.images;
    }
    return this.images.filter(image => image.category === this.selectedCategory);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  openLightbox(image: GalleryImage): void {
    this.selectedImage = image;
    this.currentImageIndex = this.filteredImages.findIndex(img => img.src === image.src);
    this.showLightbox = true;
  }

  closeLightbox(): void {
    this.showLightbox = false;
    this.selectedImage = null;
  }

  navigateToImage(index: number): void {
    this.currentImageIndex = index;
    this.selectedImage = this.filteredImages[index];
  }

  // Helper methods to extract category, title, and description from public_id or metadata
  getCategoryFromPublicId(publicId: string): string {
    if (publicId.toLowerCase().includes('food')) return 'food';
    return 'nature';
  }

  getTitleFromPublicId(publicId: string): string {
    // You can customize this logic as needed
    return publicId.split('/').pop() || 'Photo';
  }

  getDescriptionFromPublicId(publicId: string): string {
    // You can customize this logic as needed
    return 'Akshay Photography image';
  }
} 