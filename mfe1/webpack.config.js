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
