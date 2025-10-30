import React from "react";
import { Platform, Image, ImageProps, View, ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

interface SvgIconProps {
  source: any; // SVG 컴포넌트 또는 require로 로드한 이미지
  width: number;
  height: number;
  style?: ViewStyle | ViewStyle[];
  fill?: string;
}

/**
 * 플랫폼별 SVG 아이콘 래퍼
 * - 웹: Image 컴포넌트로 SVG 파일 직접 로드
 * - 네이티브: SVG 컴포넌트 사용
 */
const SvgIcon: React.FC<SvgIconProps> = ({
  source,
  width,
  height,
  style,
  fill,
}) => {
  if (Platform.OS === "web") {
    // 웹에서는 Image로 직접 로드
    if (typeof source === "string" || source?.uri) {
      return (
        <Image
          source={source}
          style={[{ width, height }, style]}
          resizeMode="contain"
        />
      );
    }
    // require로 로드된 경우
    if (source && !source.default) {
      return (
        <Image
          source={source}
          style={[{ width, height }, style]}
          resizeMode="contain"
        />
      );
    }
    // SVG 컴포넌트인 경우 - 웹에서는 그냥 렌더링 시도
    const SvgComponent = source?.default || source;
    if (typeof SvgComponent === "function") {
      return <SvgComponent width={width} height={height} fill={fill} />;
    }
    return null;
  }

  // 네이티브에서는 SVG 컴포넌트 사용
  const SvgComponent = source?.default || source;
  if (typeof SvgComponent === "function") {
    return <SvgComponent width={width} height={height} fill={fill} />;
  }
  return null;
};

export default SvgIcon;

