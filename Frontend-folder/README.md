# Vehicle System

This repository contains the codebase for the Vehicle System application. It's an Angular project which provides secure file transfer capabilities.

## Project Structure

This application follows the Angular framework structure, and includes end-to-end testing, as well as Docker support. The project has the following structure:

```plaintext
Project/
├── e2e/
│   ├── src/
│   │   ├── app.e2e-spec.ts
│   │   ├── app.po.ts
│   │   ├── tsconfig.json
│   │   ├── protractor.conf.js
│   │   ├── environments/
│   │   ├── ...
│   ├── tsconfig.json
├── node_modules/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── core.module.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── data.service.ts
│   │   │   │   ├── error.service.ts
│   │   │   │   ├── ...
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── role.guard.ts
│   │   │   │   ├── ...
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   ├── ...
│   │   ├── models/
│   │   │   ├── user.ts
│   │   │   ├── product.ts
│   │   │   ├── ...
│   │   ├── config/
│   │   │   ├── app-config.ts
│   │   │   ├── ...
│   │   ├── enums/
│   │   │   ├── roles.enum.ts
│   │   │   ├── ...
│   │   ├── utils/
│   │   │   ├── validation.utils.ts
│   │   │   ├── ...
│   │   ├── interfaces/
│   │   │   ├── user.interface.ts
│   │   │   ├── ...
│   │   ├── shared/
│   │   │   ├── shared.module.ts
│   │   │   ├── components/
│   │   │   ├── pipes/
│   │   │   ├── directives/
│   │   │   ├── services/
│   │   │   ├── ...
│   │   ├── modules/
│   │   │   ├── module-1/
│   │   │   │   ├── module-1.module.ts
│   │   │   │   ├── components/
│   │   │   │   ├── pipes/
│   │   │   │   ├── directives/
│   │   │   │   ├── services/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── landing/
│   │   │   │   │   ├── listing/
│   │   │   │   │   ├── ...
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── about/
│   │   │   ├── ...
│   │   ├── app-routing.module.ts
│   │   ├── app.component.html
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── ...
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   ├── ...
│   ├── environments/
│   │   ├── environment.ts


│   │   ├── environment.prod.ts
│   │   ├── ...
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.scss
│   ├── test.ts
│   ├── ...
├── .editorconfig
├── .gitignore
├── angular.json
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tslint.json
└── ...
```

## Setup and Installation

1. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/user/repo.git
   ```

2. Navigate to the project directory.

   ```bash
   cd vehicle-system
   ```

3. Install the necessary dependencies.

   ```bash
   npm install
   ```

4. Start the application in development mode.
   ```bash
   npm start
   ```
   Open [http://localhost:4200](http://localhost:4200) to view it in the browser. The app will automatically reload if you make changes to the code.

## Testing

This project uses Jasmine and Karma for unit testing, and Protractor for end-to-end testing. You can run the tests using the following commands:

1. Unit tests:
   ```bash
   npm run test
   ```
2. End-to-end tests:
   ```bash
   ng e2e
   ```

## Docker Support

This application supports Docker for development, testing, and production. To use Docker, you must have it installed on your machine. If you do, you can build and run the Docker image with the following commands:

```bash
docker build -t vehicle-system .
docker run -p 8080:80 vehicle-system
```

## Progressive Web App (PWA)

This application is also a Progressive Web App (PWA). This means that it can provide a more native-like experience on mobile and other devices, and can be installed on the user's home screen. Additionally, it includes a service worker for offline caching of assets and HTTP data.

## Contribution

We follow strict linting guidelines to maintain code quality. This is enforced with ESLint for TypeScript and Stylelint for SCSS files. When committing, we use Commitizen and commitlint to ensure commit messages follow the Conventional Commits style.

For committing changes:

```bash
npm run commit
```

This command will launch an interactive prompt for generating a properly formatted commit message.

## License

This project is licensed under the terms of the MIT license. For more details, see the [LICENSE](./LICENSE) file.

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

For any issues, please feel free to contact us or open an issue in the repository.
