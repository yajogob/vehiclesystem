# Guards Folder

This directory contains all the route guard services used within the Vehicle System application.

## Structure

The structure of the folder is as follows:

```plaintext
guards/
│   ├── auth.guard.ts
│   ├── role.guard.ts
│   ├── ...
```

## Guards Overview

- `auth.guard.ts`: This is an authentication guard. It's used to prevent unauthenticated users from accessing certain routes. If an unauthenticated user tries to access a guarded route, they will be redirected to the login page.

- `role.guard.ts`: This is a role-based guard. It's used to restrict access to routes based on user roles. If a user does not have the necessary role to access a guarded route, they will be redirected to an appropriate error page.

## Usage

To use these guards, simply import them in the module where you are defining your routes and add them as providers.

In your routing module:

```typescript
import { AuthGuard } from "./core/guards/auth.guard";
import { RoleGuard } from "./core/guards/role.guard";

const routes: Routes = [{ path: "admin", component: AdminComponent, canActivate: [AuthGuard, RoleGuard], data: { role: "admin" } }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, RoleGuard],
})
export class AppRoutingModule {}
```

This will make the `admin` route only accessible to authenticated users who have an 'admin' role.

## Extending and Customizing

The guards provided are designed to be easily extended and customized. If you need to create a new guard, you can do so by creating a new service in this folder that implements the `CanActivate` interface from `@angular/router`.

Please ensure to adhere to the established code styles and conventions when adding new guards. Add tests for your guards to ensure their correct functioning.
