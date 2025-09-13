import { ViewStyle, TextStyle } from "react-native";

export interface ButtonViewProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export interface MainScreenProps {
  // MainScreen 컴포넌트의 props가 필요하면 여기에 추가
}
