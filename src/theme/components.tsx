import React from "react";
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
} from "react-native";
import { tokens } from "./tokens";

export function Button({
  title,
  style,
  textStyle,
  ...props
}: { title: string; textStyle?: any } & TouchableOpacityProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function TextInput({ style, ...props }: RNTextInputProps) {
  return <RNTextInput style={[styles.input, style]} {...props} />;
}

export function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: tokens.color.primary,
    paddingVertical: tokens.space(1.5),
    paddingHorizontal: tokens.space(2),
    borderRadius: tokens.radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: tokens.color.surface,
    fontWeight: "600",
  },
  input: {
    borderColor: tokens.color.text,
    borderWidth: 1,
    borderRadius: tokens.radius.sm,
    padding: tokens.space(1),
  },
  card: {
    backgroundColor: tokens.color.surface,
    borderColor: tokens.color.surfaceAlt,
    borderWidth: 1,
    borderRadius: tokens.radius.md,
    padding: tokens.space(1.5),
  },
});
