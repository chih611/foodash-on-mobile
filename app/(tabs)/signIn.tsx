import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/Button";
import { auth } from "@/firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Breadcrumb from "@/components/Breadcrumb";
import SearchComponent from "@/components/Search";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInScreen() {
  const router = useRouter();
  const { control, handleSubmit, reset } = useForm<SignInFormData>();
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "341923236114-55jiqfl4crq4r8336tqmdv28h0r8epud.apps.googleusercontent.com",
    webClientId:
      "341923236114-t6so2g2sjhg363ln9kh9qgk286mss9le.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@kevintran3011/foodash",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert("Success", "Signed in with Google!");
          router.replace("/");
        })
        .catch((err) => Alert.alert("Google Sign-In Failed", err.message));
    }
  }, [response]);

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      alert(`${data.email} ${data.password}`);
      Alert.alert("Success", "Signed in successfully!");
      reset(); // optionally reset the form
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb
          breadcrumbs={["Auth", "Sign In"]}
          onPress={(index: number) =>
            console.log(`Breadcrumb ${index} clicked`)
          }
        />
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Account"
              style={styles.input}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Text style={styles.link}>Forgot password?</Text>

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>

        <Text style={styles.linkText}>
          Don’t have an account?{" "}
          <Text
            style={styles.linkOrange}
            onPress={() => router.push("/(tabs)/signUp")}
          >
            Sign up
          </Text>
        </Text>

        <Text style={styles.divider}>Sign In with</Text>
        <View style={styles.socialButtons}>
          <Button
            label="Sign in with Google"
            theme="google"
            onPress={() => promptAsync()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { flex: 1 / 6, width: "100%" },
  breadcrumbContainer: { flex: 1 / 8, width: "100%", paddingHorizontal: 20 },
  formContainer: { flex: 1, alignItems: "center", paddingHorizontal: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#F38B3C",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  link: { color: "#F38B3C", alignSelf: "flex-end", marginBottom: 20 },
  button: {
    backgroundColor: "#F38B3C",
    width: "100%",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff" },
  linkText: { marginTop: 20 },
  linkOrange: { color: "#F38B3C" },
  divider: { marginVertical: 20 },
  socialButtons: { flexDirection: "row", gap: 20 },
});
