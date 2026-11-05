import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";

import CourseListScreen from "../screens/Courses/CourseListScreen";
import CourseDetailScreen from "../screens/Courses/CourseDetailScreen";

import BlogListScreen from "../screens/Blog/BlogListScreen";
import BlogDetailScreen from "../screens/Blog/BlogDetailScreen";

import DoctorListScreen from "../screens/Consultation/DoctorListScreen";
import BookConsultationScreen from "../screens/Consultation/BookConsultationScreen";
import MyConsultationsScreen from "../screens/Consultation/MyConsultationsScreen";

import MyPrescriptionsScreen from "../screens/Prescription/MyPrescriptionsScreen";
import CreatePrescriptionScreen from "../screens/Prescription/CreatePrescriptionScreen";
import PrescriptionViewScreen from "../screens/Prescription/PrescriptionViewScreen";

import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CoursesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CourseList" component={CourseListScreen} options={{ title: "Courses" }} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} options={{ title: "Course" }} />
    </Stack.Navigator>
  );
}

function BlogStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BlogList" component={BlogListScreen} options={{ title: "Blog" }} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} options={{ title: "Post" }} />
    </Stack.Navigator>
  );
}

function ConsultationStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DoctorList" component={DoctorListScreen} options={{ title: "Doctors" }} />
      <Stack.Screen
        name="BookConsultation"
        component={BookConsultationScreen}
        options={{ title: "Book Consultation" }}
      />
      <Stack.Screen
        name="MyConsultations"
        component={MyConsultationsScreen}
        options={{ title: "My Consultations" }}
      />
    </Stack.Navigator>
  );
}

function PrescriptionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyPrescriptions"
        component={MyPrescriptionsScreen}
        options={{ title: "Prescriptions" }}
      />
      <Stack.Screen
        name="CreatePrescription"
        component={CreatePrescriptionScreen}
        options={{ title: "New Prescription" }}
      />
      <Stack.Screen
        name="PrescriptionView"
        component={PrescriptionViewScreen}
        options={{ title: "View Prescription" }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: "Profile" }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
    </Stack.Navigator>
  );
}

function tabIcon(emoji) {
  return () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="CoursesTab"
        component={CoursesStack}
        options={{ title: "Courses", tabBarIcon: tabIcon("📚") }}
      />
      <Tab.Screen
        name="BlogTab"
        component={BlogStack}
        options={{ title: "Blog", tabBarIcon: tabIcon("📝") }}
      />
      <Tab.Screen
        name="ConsultTab"
        component={ConsultationStack}
        options={{ title: "Consult", tabBarIcon: tabIcon("👨‍⚕️") }}
      />
      <Tab.Screen
        name="PrescriptionTab"
        component={PrescriptionStack}
        options={{ title: "Rx", tabBarIcon: tabIcon("💊") }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: "Profile", tabBarIcon: tabIcon("👤") }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { loading } = useAuth();

  if (loading) return null; // could show a splash/loading screen here

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
