# Interceptors Folder

This directory contains all the HTTP interceptors used within the Vehicle System application.

## Structure

The structure of the folder is as follows:

```plaintext
interceptors/
│   ├── auth.interceptor.ts
│   ├── error.interceptor.ts
│   ├── ...
```

## Interceptors Overview

- `auth.interceptor.ts`: This interceptor is used to add authentication tokens to all HTTP requests made by the application. It retrieves the token from the authentication service and adds it to the `Authorization` header of the HTTP request.

- `error.interceptor.ts`: This interceptor is used to globally catch and handle any HTTP errors returned by the server. It can be used to display user-friendly error messages, log errors for debugging purposes, or redirect the user to an error page.

## Usage

To use these interceptors, import them in your `app.module.ts` or `core.module.ts` and add them to the `providers` array.

In your `core.module.ts`:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  //...
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //...
  ],
  //...
})
export class CoreModule { }
```

This will ensure that the interceptors are used for all HTTP requests made within the application.

## Extending and Customizing

Interceptors provide a powerful way to extend and customize the behavior of HTTP requests. If you need to create a new interceptor, create a new service in this folder that implements the `HttpInterceptor` interface from `@angular/common/http`.

Please adhere to the established code styles and conventions when adding new interceptors. Add tests for your interceptors to ensure their correct functioning.
