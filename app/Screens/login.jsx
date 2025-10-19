import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

export default function LoginScreen() {
  const navigation = useNavigation();
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

    navigation.navigate('Home');
  };

  const isFormValid = validateEmail(email) && validatePassword(password);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.title}>Artisané </Text>
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
              secureTextEntry={true}
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
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signupLink}> Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
    paddingVertical: 25,
    backgroundColor: "#EADFC4",
    paddingHorizontal: 20,
  },

  welcome: {
    fontSize: 20,
    color: "#2E5E2D",
    fontWeight: "500",
    marginBottom: 5,
  },

  title: {
    fontSize: 36,
    color: "#79AC78",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#2E5E2D",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },

  loginTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  label: {
    color: "#fff",
    marginBottom: 8,
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#EADFC4",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: "#333",
    fontSize: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  errorText: {
    color: "#FFB3B3",
    marginTop: 8,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
  },

  forgot: {
    color: "#EADFC4",
    textAlign: "right",
    marginTop: 15,
    marginBottom: 25,
    fontSize: 16,
    fontWeight: "500",
  },

  button: {
    backgroundColor: "#79AC78",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
    alignItems: "center",
  },

  signupText: {
    color: "#EADFC4",
    fontSize: 16,
    fontWeight: "500",
  },
  
  signupLink: {
    color: "#79AC78",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
