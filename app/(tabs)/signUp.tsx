import React from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import Breadcrumb from "@/components/Breadcrumb";
import SearchComponent from "@/components/Search";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";

type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const handleBreadcrumbPress = (index: number) =>
    console.log(`Breadcrumb ${index} clicked`);

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      Alert.alert("Success", "Account created successfully!");
      reset();
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <SearchComponent />
      </View>
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb
          breadcrumbs={["Auth", "Sign Up"]}
          onPress={handleBreadcrumbPress}
        />
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="fullName"
          rules={{ required: "Full Name is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Email"
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

        <Controller
          control={control}
          name="confirmPassword"
          rules={{ required: "Confirm your password" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>

        <Text style={styles.linkText}>
          Already have an account?{" "}
          <Text
            style={styles.linkOrange}
            onPress={() => router.push("/signIn")}
          >
            Sign in
          </Text>
        </Text>

        <Text style={styles.divider}>Sign In with</Text>
        <View style={styles.socialButtons}>
          <Pressable>
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
  button: {
    backgroundColor: "#F38B3C",
    width: "100%",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: { color: "#fff" },
  linkText: { marginTop: 20 },
  linkOrange: { color: "#F38B3C" },
  divider: { marginVertical: 20 },
  socialButtons: { flexDirection: "row", gap: 20 },
});
