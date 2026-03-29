import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { usePostHog } from "posthog-react-native";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("subscription_details_viewed", { subscription_id: id });
  }, [id]);

  return (
    <View>
      <Text>Subscriptio Details: {id}</Text>
      <Link href={"/"}>HomePage </Link>
    </View>
  );
};

export default SubscriptionDetails;
