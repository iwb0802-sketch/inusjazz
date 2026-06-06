// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "music.note": "music-note",
  "chart.bar.fill": "bar-chart",
  "list.bullet": "list",
  "gearshape.fill": "settings",
  "mic.fill": "mic",
  "mic.slash.fill": "mic-off",
  "arrow.uturn.backward": "undo",
  "square.and.arrow.up": "share",
  "doc.fill": "description",
  "photo.fill": "image",
  "plus": "add",
  "trash.fill": "delete",
  "pencil": "edit",
  "xmark": "close",
  "checkmark": "check",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "play.fill": "play-arrow",
  "stop.fill": "stop",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
