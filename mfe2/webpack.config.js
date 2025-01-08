const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

const Mfe2ModuleFederationConfigPlugin = withModuleFederationPlugin({

  name: 'mfe2',

  exposes: {
    './MainMfe2Module': './src/app/main-mfe2/main-mfe2.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});

Mfe2ModuleFederationConfigPlugin.output.publicPath = 'http://localhost:4202/'
module.exports = Mfe2ModuleFederationConfigPlugin;
