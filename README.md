# Angular-17-Microfrontend-Architecture
Angular 17 Microfrontend Architecture

Microfrontend architecture is a design pattern that extends the principles of microservices to the frontend.
It allows large web applications to be broken down into smaller, more manageable pieces, with each piece 
being developed, deployed and maintained independently.

In contrast to monolithic front-end architecture, micro frontends have advantages such as independent development
and deployment, as mentioned above, enhances scalability and maintainability, technology flexibility, and improved team
collaboration and autonomy.

This example serves as a proof of concept for implementing a microfrontend architecture using Angular 17 and
[Webpack Module Federation](https://webpack.js.org/concepts/module-federation/). Webpack Module Federation is a feature
introduced in Webpack 5 that allows multiple, independently built and deployed Javascript applications to share code at
runtime. This is useful for a microfrontend architecture, where different parts of the UI are developed and deployed separately,
but still need to be integrated together at runtime.

With **Module Federation**, different parts of an application (or different applications altogether) can expose certain
modules to be consumed by other applications at runtime, without the need to reload or duplicate code. Two primary key
concepts of module federation include **host** and **remote**.

1. **Host (or Container)**: The host is the main application that loads and consumes modules exposed by one or more remotes. It can access these modules dynamically at runtime. The host application serves as the main entry point and is responsible for stitching together different modules or microfrontends into a cohesive application.  
   - The host application specifies which remote modules it wants to consume. 
   - It also controls the routing, layout, and structure of the application but may rely on remote components or modules for certain parts of the UI.


2. **Remotes**: Remotes are separate applications or modules that expose functionality (like components or utilities) that can be used by the host or other remotes. They are built and deployed independently and can contain any part of the UI or business logic.
    - A remote application "exposes" certain modules or components to be consumed by other applications. These modules are made available for import by the host at runtime.
    - Remotes don't need to be part of the host's source code but can be dynamically loaded and integrated into the host when needed.


The project setup includes a primary Angular application, referred to as the host, along with two additional Angular
applications, known as remotes. This setup serves as a basic skeleton for a microfrontend architecture that allows
the host application to import Angular modules from the remote applications.

----
## Running the Application

----
## Step-by-step tutorial

The projects were created using:

- Angular 17.3.11
- Node 20.18.1
- `@angular-architects/module-federation` with Webpack


### Creating the projects

Start by creating a folder for each Angular application: `shell`, `mfe1`, and `mfe2`.

The `shell` project will serve as the host in our microfrontend architecture, and is responsible for loading and
displaying the modules from the remote projects. Create the shell application using the following command:

```angular2html
ng new shell --no-standalone --routing
```

The other two projects, `mfe1` and `mfe2` will be created with similar commands:

```angular2html
ng new mfe1 --no-standalone --routing
ng new mfe2 --no-standalone --routing
```

### Setting up Module Federation

Since these are independent, stand-alone projects, the Module Federation library needs to be installed in all of them.
This library will help configure Webpack to facilitate communication between applications, import and export of modules and components.

```angular2html
npm i @angular-architects/module-federation
```

We start by adding module federation to our host - the shell application. In the root directory of the `shell` project,
run the following command:

```angular2html
ng add @angular-architects/module-federation --project shell --port 4200 --type host
```

The command will generate an initial Webpack configuration. It will configure the `shell` project as the host application,
and have it run on port 4200.

`mfe1` and `mfe2` projects are going to be remote applications. In order to configure Webpack for each, run the following commands:

```angular2html
ng add @angular-architects/module-federation --project mfe1 --port 4201 --type remote
ng add @angular-architects/module-federation --project mfe2 --port 4202 --type remote
```

### Webpack configuration

We will first start by editing the Webpack configuration of the host application (`shell/webpack.config.js`):

```angular2html
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const HostConfigModuleFederationPlugin = withModuleFederationPlugin({

  remotes: {
    "mfe1": "http://localhost:4201/remoteEntry.js",
    "mfe2": "http://localhost:4202/remoteEntry.js",
  },

        shared: {
                ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
                },

});
HostConfigModuleFederationPlugin.output.publicPath = 'http://localhost:4200/';
module.exports = HostConfigModuleFederationPlugin;
```

In the `remotes` configuration, we defined the remote modules to be consumed.
The remote applications are specified by their URLs and exposed entry points (i.e., remoteEntry.js).
http://localhost:4201/remoteEntry.js and http://localhost:4202/remoteEntry.js are the URLs where the remote
applications' entry files (remoteEntry.js) are served. These files expose the modules to be consumed by the host.
The `shared` configuration specifies which dependencies should be shared between the host and remotes. The `shareAll`
function is used to share all dependencies automatically.

The two microfrontend projects, `mfe1` and `mfe2`, will both be configured in a similar manner. Each microfrontend needs
to have defined a module, which will be exposed via the remote's webpack configuration.

Example steps for `mfe1`:

```angular2html
ng generate module main-mfe1
```

And add it in the routing module of the project:

```angular2html
const routes: Routes = [
   {
      path: '',
      loadChildren: () => import('./main-mfe1/main-mfe1.module').then(m => m.MainMfe1Module), // Route to LoginModule
   },
];
```

The Webpack remote configuration will look like this:

```angular2html
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const Mfe1ModuleFederationConfigPlugin = withModuleFederationPlugin({

  name: 'mfe1',

        exposes: {
                './MainMfe1Module': './src/app/main-mfe1/main-mfe1.module.ts',
                },

shared: {
...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
},

});

Mfe1ModuleFederationConfigPlugin.output.publicPath = 'http://localhost:4201/'
module.exports = Mfe1ModuleFederationConfigPlugin;
```

In the configuration above we have defined the name of the module as `MainMfe1Module`, as previously generated.
There is also a new argument, `Exposures`, which exposes `MainMfe1Module` so that other applications can use it.

Proceed in a similar manner for the other microfrontend, `mfe2`.

Getting back to the host application, we will import both modules, `mfe1` and `mfe2`.
This will happen in the host routing module:
```angular2html
const routes: Routes = [
{
        path:'main-mfe1',
        loadChildren: () =>
          loadRemoteModule({
            remoteEntry: 'http://localhost:4201/remoteEntry.js',
            exposedModule: './MainMfe1Module',
            type: 'module',
          })
            .then((m) => m.MainMfe1Module)
            .catch((err) => {
              console.error('Error loading MainMfe1Module:', err);
            }),
        },
{
        path:'main-mfe2',
        loadChildren: () =>
          loadRemoteModule({
            remoteEntry: 'http://localhost:4202/remoteEntry.js',
            exposedModule: './MainMfe2Module',
            type: 'module',
          })
            .then((m) => m.MainMfe2Module)
            .catch((err) => {
              console.error('Error loading MainMfe2Module:', err);
            }),
        },

];
```
----
## Demo

For practical purposes, the `shell` application contains a `navbar` component which handles the navigation between the
two microfrontends.

- Main Page (host application)

- Microfrontend 1 remote component displayed in host

- Microfrontend 2 remote component displayed in host