import { useAuth, useSignUp } from '@clerk/expo';
import clsx from 'clsx';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    if (!signUp) return;
    
    const { error } = await (signUp as any).password({
      emailAddress,
      password,
    });
    
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await (signUp as any).verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    if (!signUp) return;
    
    await (signUp as any).verifications.verifyEmailCode({
      code,
    });
    
    if (signUp.status === 'complete') {
      await (signUp as any).finalize({
        navigate: ({ session, decorateUrl }: any) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl('/');
          if (url.startsWith('http')) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error('Sign-up attempt not complete:', signUp);
    }
  };

  if ((signUp as any)?.status === 'complete' || isSignedIn) {
    return null;
  }

  // Verification Mode
  if (
    (signUp as any)?.status === 'missing_requirements' &&
    (signUp as any).unverifiedFields.includes('email_address') &&
    (signUp as any).missingFields.length === 0
  ) {
    return (
      <View style={{ paddingTop: insets.top }} className="auth-safe-area">
        <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
          <View className="auth-content mt-12">
            <View className="auth-brand-block mb-8">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">S</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Subly</Text>
                  <Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
                </View>
              </View>
              <Text className="auth-title">Verify your account</Text>
              <Text className="auth-subtitle">We sent a verification code to your email</Text>
            </View>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Verification Code</Text>
                  <TextInput
                    className={clsx("auth-input", (errors as any)?.fields?.code && "auth-input-error")}
                    value={code}
                    placeholder="Enter verification code"
                    placeholderTextColor="#8a775f"
                    onChangeText={setCode}
                    keyboardType="numeric"
                  />
                  {(errors as any)?.fields?.code && (
                    <Text className="auth-error">{(errors as any).fields.code.message}</Text>
                  )}
                </View>

                <Pressable
                  className={clsx(
                    "auth-button mt-2",
                    fetchStatus === 'fetching' && "auth-button-disabled"
                  )}
                  onPress={handleVerify}
                  disabled={fetchStatus === 'fetching'}
                  style={({ pressed }) => pressed && { opacity: 0.8 }}
                >
                  <Text className="auth-button-text">Verify Account</Text>
                </Pressable>
                
                <Pressable
                  className="auth-secondary-button mt-2"
                  onPress={() => (signUp as any).verifications.sendEmailCode()}
                  style={({ pressed }) => pressed && { opacity: 0.8 }}
                >
                  <Text className="auth-secondary-button-text">Resend Code</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Standard Sign-up flow
  return (
    <View style={{ paddingTop: insets.top }} className="auth-safe-area">
      <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
        <View className="auth-content mt-12">
          
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">S</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Subly</Text>
                <Text className="auth-wordmark-sub">SMART BILLING</Text>
              </View>
            </View>
            <Text className="auth-title">Sign Up</Text>
            <Text className="auth-subtitle">Create a new account to easily manage your subscriptions</Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={clsx("auth-input", (errors as any)?.fields?.emailAddress && "auth-input-error")}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter email"
                  placeholderTextColor="#8a775f"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
                {(errors as any)?.fields?.emailAddress && (
                  <Text className="auth-error">{(errors as any).fields.emailAddress.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={clsx("auth-input", (errors as any)?.fields?.password && "auth-input-error")}
                  value={password}
                  placeholder="Create a password"
                  placeholderTextColor="#8a775f"
                  secureTextEntry
                  onChangeText={setPassword}
                />
                {(errors as any)?.fields?.password && (
                  <Text className="auth-error">{(errors as any).fields.password.message}</Text>
                )}
              </View>

              <Pressable
                className={clsx(
                  "auth-button mt-4",
                  (!emailAddress || !password || fetchStatus === 'fetching') && "auth-button-disabled"
                )}
                onPress={handleSubmit}
                disabled={!emailAddress || !password || fetchStatus === 'fetching'}
                style={({ pressed }) => pressed && { opacity: 0.8 }}
              >
                <Text className="auth-button-text">Create Account</Text>
              </Pressable>
            </View>

            <View style={{ display: 'none' }} nativeID="clerk-captcha" />

            <View className="auth-link-row mt-6">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in" asChild>
                <Pressable>
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
