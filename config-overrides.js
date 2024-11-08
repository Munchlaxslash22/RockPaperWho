/* config-overrides.js */

module.exports = {
    webpack: function(config, env) {

        return config;
    },

    // Extend/override the dev server configuration used by CRA
    // See: https://github.com/timarney/react-app-rewired#extended-configuration-options
    devServer: function(configFunction) {
        return function(proxy, allowedHost) {
            // Create the default config by calling configFunction with the proxy/allowedHost parameters
            // Default config: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpackDevServer.config.js
            const config = configFunction(proxy, allowedHost);
            // Set X-Frame-Options header
            config.headers = {
                "Access-Control-Allow-Origin": "http://localhost:8888/*",
                'X-Frame-Options': 'deny'
            }
            return config;
        };
    },
};