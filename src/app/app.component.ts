import { Component } from '@angular/core';
import { ImageService } from './image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'weaviate-image-search';
  // images: any[] = [{ url: '/assets/image/brad-pitt.jpeg' }];
  images: any[] = [{ name: "Brad Pitt", url: 'assets/celebrities/Brad Pitt.jpeg' }];

  constructor(public imageService: ImageService) {}

  async searchCelebrities($event: any) {
    const file: File = $event.target.files[0];

    this.images = await this.imageService.search(file, 'Celebrities');
  }

  async searchSpeakers($event: any) {
    const file: File = $event.target.files[0];

    this.images = await this.imageService.search(file, 'Speakers');
  }
}
