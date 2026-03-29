import { styled } from "nativewind";
import React, { useState } from "react";
import { Text, View, TextInput, FlatList } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import SubscriptionCard from "@/components/subscription-card";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-4 text-2xl font-sans-bold text-primary">All Subscriptions</Text>
      
      <TextInput
        className="mb-6 rounded-2xl border border-border bg-card px-4 py-4 text-base font-sans-medium text-primary"
        placeholder="Search subscriptions..."
        placeholderTextColor="#8a775f"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="py-4 text-center text-sm font-sans-medium text-black/60">
            No subscriptions found.
          </Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
