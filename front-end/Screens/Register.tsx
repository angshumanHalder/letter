import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import RegisterStyles from "../styles/Register";
import { TextInput, Button, Text } from "react-native-paper";
import { registerUser } from "../actions/register";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { showToast } from "../utils/toast";
import { RegisterNavigationProp } from "../types/navigationtypes";

type RegisterState = {
  username: string;
  phone: string;
};

enum InputKeys {
  Username = "username",
  Phone = "phone",
}

interface RegisterProps {
  navigation: RegisterNavigationProp;
}

export const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const registerSuccess = useAppSelector((state) => state.register.success);
  const registerError = useAppSelector((state) => state.register.registerError);
  const dispatch = useAppDispatch();

  const anim = useRef(new Animated.Value(0)).current;
  const [inputs, setInputs] = useState<RegisterState>({
    username: "",
    phone: "",
  });

  const onChangeHandler = (key: InputKeys, value: string) => {
    setInputs({
      ...inputs,
      [key]: value,
    });
  };

  const onRegisterHandler = () => {
    dispatch(registerUser(inputs));
  };

  useEffect(() => {
    if (registerSuccess) {
      navigation.replace("OTP");
    }
  }, [registerSuccess]);

  useEffect(() => {
    if (registerError) {
      showToast(registerError);
    }
  }, [registerError]);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }, [anim]);

  return (
    <SafeAreaView style={RegisterStyles.registerContainer}>
      <Animated.View style={{ opacity: anim }}>
        <Text style={RegisterStyles.logo}>LETTER</Text>
      </Animated.View>
      <View style={RegisterStyles.subContainer}>
        <TextInput
          label="username"
          onChangeText={(val) => onChangeHandler(InputKeys.Username, val)}
          value={inputs.username}
          style={RegisterStyles.input}
          mode="flat"
        />
        <TextInput
          label="phone"
          onChangeText={(val) => onChangeHandler(InputKeys.Phone, val)}
          value={inputs.phone}
          style={RegisterStyles.input}
          mode="flat"
          keyboardType="numeric"
        />
        <Button
          style={RegisterStyles.button}
          onPress={onRegisterHandler}
          mode="contained"
        >
          Register
        </Button>
        <Text style={RegisterStyles.loginText} onPress={}>
          or login
        </Text>
      </View>
    </SafeAreaView>
  );
};
