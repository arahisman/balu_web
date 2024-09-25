module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.(tsx|ts|js|mjs|jsx)$/,
    exclude:
    /node_modules[/\\](?!react-native-calendar-picker|react-native-gifted-chat|react-native-lightbox|react-native-parsed-text|react-native-typing-animation|react-native-collapsible-view-faq)/,
    use: {
      loader: "babel-loader",
      options: {
        babelrc: false,
        configFile: false,
        presets: [
          ["@babel/preset-env", { useBuiltIns: "usage" }],
          "@babel/preset-react","@babel/typescript"
        ],
        plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-syntax-jsx"],
      },
    },
  });

  return config;
};