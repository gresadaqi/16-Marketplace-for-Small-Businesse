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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

export default function SignUp() {
  const navigation = useNavigation();
  const [role, setRole] = useState("Client");

  const [name, setName] = useState("");
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
      setEmailError("Email required.");
    } else if (!validateEmail(text)) {
      setEmailError("Invalid email. Should be: example@test.com");
    } else {
      setEmailError("");
    }
  };

  const onChangePassword = (text) => {
    setPassword(text);
    if (!text) {
      setPasswordError("Password required.");
    } else if (!validatePassword(text)) {
      setPasswordError("Password should be at least 8 characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleNext = () => {
    let ok = true;
    if (!validateEmail(email)) {
      setEmailError("Invalid email. Should be: example@test.com");
      ok = false;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password should be at least 8 characters.");
      ok = false;
    }
    if (!ok) return;

    Alert.alert("OK", `Të dhënat janë valide.\nRoli: ${role}`, [
      { text: "OK", onPress: () => router.push("/next") },
    ]);
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
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.signupTitle}>Sign Up</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name Surname"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

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

            <Text style={styles.label}>Role</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "Client" && styles.roleButtonSelected,
                ]}
                onPress={() => setRole("Client")}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "Client" && styles.roleTextSelected,
                  ]}
                >
                  Client
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "Business" && styles.roleButtonSelected,
                ]}
                onPress={() => setRole("Business")}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === "Business" && styles.roleTextSelected,
                  ]}
                >
                  Business
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              onPress={handleNext}
              disabled={!isFormValid}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>

            <View style={styles.signinContainer}>
              <Text style={styles.signinText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.signupLink}> Log In </Text>
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

  signupTitle: {
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

  button: {
    backgroundColor: "#79AC78",
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },

  signinText: {
    color: "#EADFC4",
  },

  signupLink: {
    color: "#EADFC4",
    fontWeight: "bold",
  },

  errorText: {
    color: "#FFCCCC",
    marginTop: 6,
    marginBottom: 2,
    marginLeft: 6,
    fontSize: 13,
  },

    roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  roleButton: {
    flex: 1,
    backgroundColor: "#EADFC4",
    borderRadius: 25,
    paddingVertical: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },

  roleButtonSelected: {
    backgroundColor: "#79AC78",
  },

  roleText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  
  roleTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});
