import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import NavBar from "../components/NavBar"; 

export default function Index() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (e) => {
    const re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}$/;
    return re.test(e.trim());
  };

  const validatePassword = (p) => {
    return typeof p === "string" && p.length >= 8;
  };

  const onChangeEmail = (text) => {
    setEmail(text);
    if (!text) {
      setEmailError("Email is required.");
    } else if (!validateEmail(text)) {
      setEmailError("Invalid email format. Example: example@test.com");
    } else {
      setEmailError("");
    }
  };

  const onChangePassword = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError("Password is required.");
    } else if (!validatePassword(text)) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = () => {
    let ok = true;
    if (!validateEmail(email)) {
      setEmailError("Invalid email format. Example: example@test.com");
      ok = false;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      ok = false;
    }

    if (!ok) return;

    Alert.alert("Success", "Login successful!", [
      { text: "Continue", onPress: () => router.push("/home") },
    ]);
  };

  const isFormValid = validateEmail(email) && validatePassword(password);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.title}>Artisane</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.loginTitle}>Log In</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="example@test.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={onChangeEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="********"
              secureTextEntry
              placeholderTextColor="#999"
              value={password}
              onChangeText={onChangePassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            <TouchableOpacity>
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.signupLink}> Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <NavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EADFC4",
  },

  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#EADFC4",
  },

  welcome: {
    fontSize: 18,
    color: "#000",
  },

  title: {
    fontSize: 32,
    color: "#79AC78",
    fontWeight: "bold",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#365E32",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 80,
  },

  loginTitle: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  label: {
    color: "#fff",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#EADFC4",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: "#333",
  },

  errorText: {
    color: "#FFCCCC",
    marginTop: 5,
    marginLeft: 8,
    fontSize: 13,
  },

  forgot: {
    color: "#EADFC4",
    textAlign: "right",
    marginTop: 10,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#79AC78",
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  signupText: {
    color: "#EADFC4",
  },
  
  signupLink: {
    color: "#EADFC4",
    fontWeight: "bold",
  },
});
