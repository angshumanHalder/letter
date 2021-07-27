import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { registerUser, requestOtp } from "../actions/register";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import RegisterStyles from "../styles/Register";
import { RegisterNavigationProp } from "../types/navigationtypes";
import { TOKEN } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";
import { showToast } from "../utils/toast";

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
  const { registerSuccess, registerError, requestOtpSuccess, requestOtpFailed } = useAppSelector((state) => ({
    registerSuccess: state.register.success,
    registerError: state.register.registerError,
    requestOtpSuccess: state.register.otpRequestSuccess,
    requestOtpFailed: state.register.otpRequestFailed,
  }));
  const dispatch = useAppDispatch();

  const anim = useRef(new Animated.Value(0)).current;
  const [inputs, setInputs] = useState<RegisterState>({
    username: "",
    phone: "",
  });
  const [isRegister, setIsRegister] = useState(true);

  const onChangeHandler = (key: InputKeys, value: string) => {
    setInputs({
      ...inputs,
      [key]: value,
    });
  };

  const onRegisterOrLoginHandler = () => {
    if (isRegister) {
      dispatch(registerUser(inputs));
    } else {
      dispatch(
        requestOtp({
          phone: inputs.phone,
        })
      );
    }
  };

  useEffect(() => {
    if (registerSuccess || requestOtpSuccess) {
      navigation.replace("OTP");
    }
  }, [registerSuccess, requestOtpSuccess]);

  useEffect(() => {
    if (registerError) {
      showToast(registerError);
    } else if (requestOtpFailed) {
      showToast(requestOtpFailed);
    }
  }, [registerError, requestOtpFailed]);

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
        {isRegister && (
          <TextInput
            label="username"
            onChangeText={(val) => onChangeHandler(InputKeys.Username, val)}
            value={inputs.username}
            style={RegisterStyles.input}
            mode="flat"
          />
        )}
        <TextInput
          label="phone"
          onChangeText={(val) => onChangeHandler(InputKeys.Phone, val)}
          value={inputs.phone}
          style={RegisterStyles.input}
          mode="flat"
          keyboardType="numeric"
        />
        <Button style={RegisterStyles.button} onPress={onRegisterOrLoginHandler} mode="contained">
          {isRegister ? "Register" : "Login"}
        </Button>
        <Text
          style={RegisterStyles.loginText}
          onPress={() => {
            setIsRegister(!isRegister);
          }}
        >
          or <Text style={RegisterStyles.linkText}>{isRegister ? "login" : "register"}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};
