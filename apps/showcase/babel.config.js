module.exports = {
  presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  // plugins: [
  //   [
  //     'module:react-native-dotenv',
  //     {
  //       path: './.env', // Cập nhật đường dẫn đến file .env ở thư mục gốc
  //       moduleName: '@env',
  //       safe: true,
  //       allowUndefined: false,
  //       verbose: true, // Hiển thị log debug để kiểm tra
  //     },
  //   ],
  // ],

  plugins: [
    [
      "module:react-native-dotenv",
      {
        path: "./.env",
        moduleName: "@env",
        safe: true,
        allowUndefined: false,
        verbose: true,
      },
    ],
  ],
};
