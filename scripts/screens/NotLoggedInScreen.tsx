/* 
  NotLoggedInScreen.tsx
  The entry point for the application. Allows users to either continue as guest, log in or create a new email account. 
  This is all handled through firebase. Even if the user chooses to remain anon we can still validate requests on the API side
  as they will still have a firebase uid and auth token.
*/

import React from "react";
import { Button, Input, Text, Tile } from "react-native-elements";
import { AppHeader } from "../components/nav/AppHeader";
import { DrawerScreens } from "../types/nav/DrawerScreens";
import { Routes } from "../types/nav/Routes";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { View } from "react-native";
import useSetState from "react-use/lib/useSetState";
import {
  EmailIsValid,
  ErrorMessages,
  PasswordIsValid,
} from "../utils/Validation";
import { Container } from "../styles/Container";
import {
  createEmailAccount,
  signInAnon,
  signInWithEmailPassword,
} from "../services/firebase/Firebase";
import { AppColour } from "../styles/Colours";
import { AppContainer } from "../state/AppState";
import { LogInScreenImage } from "../utils/Constants";

type NotLoggedInNavigationProp = DrawerNavigationProp<
  DrawerScreens,
  Routes.Unauthenticated
>;

type NotLoggedInScreenProps = {
  navigation: NotLoggedInNavigationProp;
};

interface LoginScreenState {
  emailErrorMessage: string;
  emailAddress: string;
  password: string;
  passwordErrorMessage: string;
  confirmPassword: string;
  confirmPasswordErrorMessage: string;
  isCreatingAccount: boolean;
}

export const NotLoggedInScreen = (
  props: NotLoggedInScreenProps
): JSX.Element => {
  const [state, setState] = useSetState<LoginScreenState>();
  const { setAppState } = AppContainer.useContainer();

  const OnEmailAddressChange = (input: string) =>
    EmailIsValid(input)
      ? setState({ emailAddress: input, emailErrorMessage: undefined })
      : setState({
          emailErrorMessage: ErrorMessages.EmailValidation,
          emailAddress: undefined,
        });

  const onPasswordChange = (input: string) => {
    const result = PasswordIsValid(input);
    if (result !== true) {
      setState({ passwordErrorMessage: result, password: undefined });
    } else {
      setState({ password: input, passwordErrorMessage: undefined });
    }
  };

  const onConfirmPasswordChange = (input: string) => {
    const result = PasswordIsValid(input);
    if (result !== true) {
      setState({
        confirmPasswordErrorMessage: result,
        confirmPassword: undefined,
      });
    } else {
      setState({ confirmPassword: input, passwordErrorMessage: undefined });
    }
  };

  const onCreateAccountConfirmPress = async () => {
    if (state.password !== state.confirmPassword) {
      setState({
        confirmPasswordErrorMessage: ErrorMessages.PasswordsDontMatch,
      });
      return;
    }
    if (state.password.length === 0 || state.confirmPassword.length === 0) {
      setState({ confirmPasswordErrorMessage: ErrorMessages.PasswordTooShort });
      return;
    }
    var createResult = await createEmailAccount(
      state.emailAddress,
      state.password
    );
    setAppState({ user: createResult.user ?? undefined });
    props.navigation.navigate(Routes.Home);
  };

  return (
    <>
      <AppHeader
        centerComponent={
          <Text style={{ color: "white" }}>Sign In or Create an Account</Text>
        }
        hideLeftComponent={true}
      />
      <Tile
        imageSrc={LogInScreenImage}
        title="Sign up to track your findings and compete with your friends!"
      />
      <View style={Container}>
        <Input
          placeholder="Email Address"
          onChangeText={(text) => OnEmailAddressChange(text)}
          errorStyle={{ color: "red" }}
          errorMessage={state.emailErrorMessage}
        />
        <Input
          placeholder="Password"
          onChangeText={(text) => onPasswordChange(text)}
          errorStyle={{ color: "red" }}
          errorMessage={state.passwordErrorMessage}
          secureTextEntry={true}
        />
        {state.isCreatingAccount && (
          <Input
            placeholder="Confirm Password"
            onChangeText={(text) => onConfirmPasswordChange(text)}
            errorStyle={{ color: "red" }}
            errorMessage={state.confirmPasswordErrorMessage}
            secureTextEntry={true}
          />
        )}
        <View style={{ flexDirection: "row", flex: 1, maxHeight: 50 }}>
          {!state.isCreatingAccount && (
            <>
              <Button
                title="Sign In"
                buttonStyle={{ backgroundColor: AppColour, marginRight: 5 }}
                onPress={async () => {
                  if (
                    state.emailAddress !== undefined &&
                    state.password !== undefined
                  ) {
                    var result = await signInWithEmailPassword(
                      state.emailAddress,
                      state.password
                    );
                    setAppState({ user: result.user ?? undefined });
                    props.navigation.navigate(Routes.Home);
                  } else {
                    console.log("Invalid Credential");
                  }
                }}
              />
            </>
          )}
          <Button
            title="Create Account"
            buttonStyle={{ backgroundColor: AppColour, marginRight: 5 }}
            onPress={() => {
              if (!state.isCreatingAccount) {
                setState({ isCreatingAccount: true });
              } else {
                onCreateAccountConfirmPress();
              }
            }}
          />
          {state.isCreatingAccount && (
            <Button
              title="Back"
              buttonStyle={{ backgroundColor: AppColour }}
              onPress={() => {
                setState({ isCreatingAccount: undefined });
              }}
            />
          )}
        </View>
        {!state.isCreatingAccount && (
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Button
              title="Continue As Guest"
              buttonStyle={{ backgroundColor: AppColour, marginRight: 5 }}
              onPress={async () => {
                var result = await signInAnon();
                setAppState({ user: result.user ?? undefined });
                props.navigation.navigate(Routes.Home);
              }}
            />
          </View>
        )}
      </View>
    </>
  );
};
