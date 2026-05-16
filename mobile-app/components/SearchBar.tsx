import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
};

export default function SearchBar({
  placeholder = "Search",
  value,
  onChangeText,
  onFilterPress,
  showFilter = false,
}: SearchBarProps) {
  return (
    <View style={styles.searchBox}>
      <Feather name="search" size={20} color={COLORS.textMuted} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
      />
      {showFilter && (
        <TouchableOpacity onPress={onFilterPress}>
          <Ionicons name="options-outline" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});
