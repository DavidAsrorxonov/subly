import { useSignIn } from '@clerk/expo';
import clsx from 'clsx';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async () => {
    if (!signIn) return;
    
    // Attempt standard sign-in
    const { error } = await (signIn as any).password({
      emailAddress,
      password,
    });
    
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === 'complete') {
      await (signIn as any).finalize({
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
    } else if ((signIn as any).status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (factor: any) => factor.strategy === 'email_code'
      );

      if (emailCodeFactor) {
        await (signIn as any).mfa.sendEmailCode();
      }
    } else {
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  const handleVerify = async () => {
    if (!signIn) return;
    await (signIn as any).mfa.verifyEmailCode({ code });

    if (signIn.status === 'complete') {
      await (signIn as any).finalize({
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
      console.error('Sign-in attempt not complete:', signIn);
    }
  };

  // Client Trust mode (MFA / 2FA via Email)
  if ((signIn as any)?.status === 'needs_client_trust') {
    return (
      <View style={{ paddingTop: insets.top }} className="auth-safe-area">
        <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
          <View className="auth-content">
            <View className="auth-brand-block mb-8 mt-4">
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
                    placeholder="Enter code"
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
                    "auth-button",
                    fetchStatus === 'fetching' && "auth-button-disabled"
                  )}
                  onPress={handleVerify}
                  disabled={fetchStatus === 'fetching'}
                  style={({ pressed }) => pressed && { opacity: 0.8 }}
                >
                  <Text className="auth-button-text">Verify Code</Text>
                </Pressable>
                
                <Pressable
                  className="auth-secondary-button"
                  onPress={() => (signIn as any).mfa.sendEmailCode()}
                  style={({ pressed }) => pressed && { opacity: 0.8 }}
                >
                  <Text className="auth-secondary-button-text">Resend Code</Text>
                </Pressable>

                <Pressable
                  className="mt-2 items-center"
                  onPress={() => (signIn as any).reset()}
                  style={({ pressed }) => pressed && { opacity: 0.8 }}
                >
                  <Text className="auth-link-copy">Start over</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Standard Sign-in flow
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
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">Sign in to continue managing your subscriptions</Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={clsx("auth-input", (errors as any)?.fields?.identifier && "auth-input-error")}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#8a775f"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                />
                {(errors as any)?.fields?.identifier && (
                  <Text className="auth-error">{(errors as any).fields.identifier.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={clsx("auth-input", (errors as any)?.fields?.password && "auth-input-error")}
                  value={password}
                  placeholder="Enter your password"
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
                <Text className="auth-button-text">Sign in</Text>
              </Pressable>
            </View>

            <View className="auth-link-row mt-6">
              <Text className="auth-link-copy">New to Subly?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <Pressable>
                  <Text className="auth-link">Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
