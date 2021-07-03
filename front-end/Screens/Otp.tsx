import React, { useEffect, useState } from "react";
import { View, SafeAreaView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { verifyOtp } from "../actions/register";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import OtpStyles from "../styles/Otp";
import { OtpNavigationProp } from "../types/navigationtypes";
import { showToast } from "../utils/toast";

interface OtpProps {
  navigation: OtpNavigationProp;
}

type OtpState = string;

export const Otp: React.FC<OtpProps> = ({ navigation }) => {
  const {
    verificationSuccess,
    verificationFailed,
    otpRequestSuccess,
    otpRequestFailed,
  } = useAppSelector((state) => ({
    verificationSuccess: state.register.verificationSuccess,
    verificationFailed: state.register.verificationFailed,
    otpRequestSuccess: state.register.otpRequestSuccess,
    otpRequestFailed: state.register.otpRequestFailed,
  }));
  const dispatch = useAppDispatch();

  const [otp, setOtp] = useState<OtpState>("");

  const onVerifyOtpHandler = () => {
    dispatch(verifyOtp({ otp }));
  };

  useEffect(() => {
    if (verificationSuccess || otpRequestSuccess) {
      navigation.replace("ChatAndUserFeed");
    }
  }, [verificationSuccess, otpRequestSuccess]);

  useEffect(() => {
    if (verificationFailed || otpRequestFailed) {
      console.log(verificationFailed);
      showToast(verificationFailed);
    }
  }, [verificationFailed, otpRequestFailed]);

  return (
    <SafeAreaView style={OtpStyles.otpContainer}>
      <View>
        <TextInput
          label="phone"
          onChangeText={(val) => setOtp(val)}
          value={otp}
          style={OtpStyles.input}
          mode="flat"
          keyboardType="numeric"
        />
        <Button
          style={OtpStyles.button}
          onPress={onVerifyOtpHandler}
          mode="contained"
        >
          Register
        </Button>
      </View>
    </SafeAreaView>
  );
};
