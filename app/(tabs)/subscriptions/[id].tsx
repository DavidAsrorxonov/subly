import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>Subscriptio Details: {id}</Text>
      <Link href={"/"}>HomePage </Link>
    </View>
  );
};

export default SubscriptionDetails;
