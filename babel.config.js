module.exports = (api) => {
  const isTest = api.env("test");

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          useBuiltIns: "usage",
          corejs: 3,
          modules: isTest ? "commonjs" : false,
        },
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
        },
      ],
      "@babel/preset-typescript",
    ],
  };
};

