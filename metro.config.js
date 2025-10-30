// Expo SDK 54용 react-native-svg-transformer 설정
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// SVG는 컴포넌트로 변환 (네이티브와 웹 모두)
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

// 웹에서도 SVG가 제대로 처리되도록 설정
if (!config.transformer.getTransformOptions) {
  config.transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  });
}

module.exports = config;
