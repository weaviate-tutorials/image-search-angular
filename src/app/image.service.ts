import { Injectable } from '@angular/core';
import weaviate, { WeaviateClient } from 'weaviate-ts-client';
import { Base64Service } from './base64.service';
import { speakers, celebrities } from './data';


@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private client: WeaviateClient;

  constructor(private base64: Base64Service) {
    this.client = weaviate.client({
      scheme: 'http',
      host: 'localhost:8080',
    });
  }

  async prepareCollection(collectionName: string) {
    const collection = {
      'class': collectionName,
      'vectorizer': 'multi2vec-clip',
      'moduleConfig': {
        'multi2vec-clip': {
          'imageFields': [ 'image' ]
        }
      },
      'properties': [
        { 'name': 'name',  'dataType': ['text'] },
        { 'name': 'url',   'dataType': ['text'] },
        { 'name': 'image', 'dataType': ['blob'] }
      ],
    }

    await this.deleteCollection(collectionName);
    
    await this.client.schema
      .classCreator().withClass(collection).do();
  }

  private async deleteCollection(collectionName: string) {
    const schema = await this.client.schema.getter().do()

    // delete the collection if it already exists
    if(schema.classes?.some(item => item.class == collectionName)) {
      console.log(`Deleting ${collectionName}`);
      await this.client.schema
        .classDeleter().withClassName(collectionName).do();
    }
  }

  public async importImages(collectionName: string, images: any[]) {
    await this.prepareCollection(collectionName);

    for(const image of images) {
      const item = {
        name: image.name,
        url: image.url,
        image: await this.base64.toBase64FromUrl(image.url),
      }

      console.log(`Adding ${image.name}`)
      await this.client.data.creator()
        .withClassName(collectionName)
        .withProperties(item)
        .do()
    }

    console.log('Import Complete');
  }

  public async importCelebrities() {
    this.importImages('Celebrities', celebrities);
  }

  public async importSpeakers() {
    this.importImages('Speakers', speakers);
  }

  async search(file: File, collectionName: string) {
    const base64 = await this.base64.toBase64FromFile(file);

    const response = await this.client.graphql
      .get()
      .withClassName(collectionName)
      .withFields('url name')
      .withNearImage({image: base64})
      .withLimit(2)
      .do()
      
    return response.data.Get[collectionName];
  }
}
