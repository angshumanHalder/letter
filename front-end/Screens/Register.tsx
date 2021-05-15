import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import RegisterStyles from "../styles/Register";
import { TextInput } from "react-native-paper";

type RegisterState = {
  username: string;
  phone: string;
};

enum InputKeys {
  Username = "username",
  Phone = "phone",
}

export const Register: React.FC<{}> = () => {
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

  return (
    <SafeAreaView style={RegisterStyles.registerContainer}>
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
      />
    </SafeAreaView>
  );
};
