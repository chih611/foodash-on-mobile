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
import { auth } from "@/firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Breadcrumb from "@/components/Breadcrumb";
import SearchComponent from "@/components/Search";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
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

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Signed in successfully!");
      router.replace("/");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const handleBreadcrumbPress = (index: number) =>
    console.log(`Breadcrumb ${index} clicked`);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SearchComponent />
      </View>
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb
          breadcrumbs={["Auth", "Sign In"]}
          onPress={handleBreadcrumbPress}
        />
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Account"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.link}>Forgot password?</Text>
        <Pressable style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>

        <Text style={styles.linkText}>
          Don’t have an account?{" "}
          <Text
            style={styles.linkOrange}
            onPress={() => router.push("/signUp")}
          >
            Sign up
          </Text>
        </Text>

        <Text style={styles.divider}>Sign In with</Text>
        <View style={styles.socialButtons}>
          <Pressable style={styles.googleButton} onPress={() => promptAsync()}>
            <Text style={styles.buttonText}>Google</Text>
          </Pressable>
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

  googleButton: {
    backgroundColor: "#000000",
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
