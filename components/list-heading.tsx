import React from "react";
import { Text, View } from "react-native";

const ListHeading = ({ title }: { title: string }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

export default ListHeading;
