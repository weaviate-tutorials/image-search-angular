# WeaviateImageSearch

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

# Weaviate Deployment

You need to Docker to deploy an instance of the database and the CLIP ML model for image processing.

To deploy, run:

```
docker-compose up -d
```

By default the database should run on [http://localhost:8080/v1](http://localhost:8080/v1)

To take it down, run:
```
docker-compose down
```

## Learn more

* [Weaviate docs](https://weaviate.io/developers/weaviate)
* [CLIP Module](https://weaviate.io/developers/weaviate/modules/retriever-vectorizer-modules/multi2vec-clip)
* [Weaviate Search](https://weaviate.io/developers/weaviate/search)
