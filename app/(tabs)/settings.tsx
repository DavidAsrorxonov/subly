import { useAuth } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Text, Pressable } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const posthog = usePostHog();

  const handleSignOut = async () => {
    posthog?.capture("user_signed_out");
    posthog?.reset();
    await signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-5 text-2xl font-sans-bold text-primary">Settings</Text>

      <Pressable
        className="mt-6 items-center rounded-2xl border border-destructive/20 bg-destructive/10 py-4"
        onPress={handleSignOut}
        style={({ pressed }) => pressed && { opacity: 0.8 }}
      >
        <Text className="text-base font-sans-bold text-destructive">Sign Out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
