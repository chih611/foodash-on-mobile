import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Breadcrumb from "@/components/Breadcrumb";
import SearchComponent from "@/components/Search";
import { useRouter } from "expo-router";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { registerUser } from "@/authService";

interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await registerUser(data.email, data.password, data.fullName);
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
      reset();
    } catch (error: any) {
      let errorMessage = error.message;

      if (errorMessage.includes("email-already-in-use")) {
        errorMessage = "This email is already registered.";
      } else if (errorMessage.includes("weak-password")) {
        errorMessage = "Password must be at least 6 characters.";
      } else if (errorMessage.includes("invalid-email")) {
        errorMessage = "Invalid email address.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (field: keyof SignUpFormData) => {
    const error = errors[field];
    return error ? <Text style={styles.errorText}>{error.message}</Text> : null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb breadcrumbs={["Auth", "Sign Up"]} onPress={() => {}} />
      </View>

      <View style={styles.formContainer}>
        <Controller
          control={control}
          name="fullName"
          rules={{ required: "Full Name is required" }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
              {renderFieldError("fullName")}
            </View>
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                style={styles.input}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {renderFieldError("email")}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
              {renderFieldError("password")}
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirm your password",
            validate: (value, formValues) =>
              value === formValues.password || "Passwords don't match",
          }}
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                style={styles.input}
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
              {renderFieldError("confirmPassword")}
            </View>
          )}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign up</Text>
          )}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { flex: 1 / 6, width: "100%" },
  breadcrumbContainer: { flex: 1 / 8, width: "100%", paddingHorizontal: 20 },
  formContainer: { flex: 1, alignItems: "center", paddingHorizontal: 20 },
  inputContainer: { width: "100%", marginBottom: 15 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#F38B3C",
    padding: 10,
    borderRadius: 5,
  },
  errorText: { color: "red", fontSize: 12, marginTop: 5 },
  button: {
    backgroundColor: "#F38B3C",
    width: "100%",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonDisabled: { backgroundColor: "#F38B3C80" },
  buttonText: { color: "#fff", fontWeight: "500" },
  linkText: { marginTop: 20 },
  linkOrange: { color: "#F38B3C" },
});
