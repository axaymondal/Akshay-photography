import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CloudinaryService } from '../services/cloudinary.service';
import { CloudinaryResource } from '../models/cloudinary.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  descriptions: string[] = [
    'Photography is the art of capturing light, moments, and emotions that tell a story beyond words.',
    'Every photograph is a memory frozen in time, preserving the beauty and essence of life\'s fleeting moments.',
    'Through the lens, we discover new perspectives, colors, and the extraordinary in the ordinary.',
    'Let Akshay Photography turn your special moments into timeless works of art, crafted with passion and creativity.'
  ];
  currentSlideIndex = 0;
  private slideInterval: any;
  images: CloudinaryResource[] = [];
  currentImage: CloudinaryResource | null = null;

  constructor(
    private router: Router,
    private cloudinaryService: CloudinaryService
  ) {}

  ngOnInit() {
    this.loadImages();
    this.slideInterval = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.descriptions.length;
      this.updateCurrentImage();
    }, 4000);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  loadImages() {
    this.cloudinaryService.getImagesByFolder('my-folder').subscribe(
      (response) => {
        this.images = response.resources;
        this.updateCurrentImage();
      },
      (error) => {
        console.error('Error loading images:', error);
      }
    );
  }

  updateCurrentImage() {
    if (this.images.length > 0) {
      this.currentImage = this.images[this.currentSlideIndex % this.images.length];
    }
  }

  goToGallery() {
    this.router.navigate(['/gallery']);
  }
} 