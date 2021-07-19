import cloneDeep from "clone-deep";
import React, { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { chatCleanUpOnUnMount, sendMessage } from "../actions/chat";
import { theme } from "../CustomProperties/Theme";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { ME } from "../utils/constants";
import { getValueFor } from "../utils/secureStorage";

interface ChatProps {}

export const Chat: React.FC<ChatProps> = () => {
  const activeChat: ActiveChatMessages | null = useAppSelector(
    (state) => state.chat.activeChat
  );
  const activeChatUserId: string | null = useAppSelector(
    (state) => state.chat.activeChatUserId
  );
  const dispatch = useAppDispatch();

  const [messages, setMessages] = useState<any[]>([]);
  const [myId, setMyId] = useState<string>("");

  useEffect(() => {
    if (activeChat && activeChat.messages) {
      setMessages(cloneDeep(activeChat.messages));
    }
  }, [activeChat]);

  useEffect(() => {
    (async () => {
      const storedMyId = await getValueFor(ME);
      setMyId(storedMyId as string);
    })();
  }, []);

  const onSend = useCallback((messages = []) => {
    if (activeChatUserId && messages.length) {
      messages[0].createdAt = messages[0].createdAt.toString();
      dispatch(sendMessage(activeChatUserId, messages));
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(chatCleanUpOnUnMount());
    };
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.colors.primary,
          },
          left: {
            backgroundColor: theme.colors.greyDark,
          },
        }}
        textStyle={{
          right: {
            color: theme.colors.white,
          },
          left: {
            color: theme.colors.white,
          },
        }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome
        name="angle-double-down"
        size={22}
        color={theme.colors.greyDark}
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color={theme.colors.primary}
          />
        </View>
      </Send>
    );
  };

  return (
    <GiftedChat
      user={{
        _id: myId,
      }}
      messages={messages}
      alwaysShowSend
      onSend={(messages) => onSend(messages)}
      renderSend={renderSend}
      renderBubble={renderBubble}
      scrollToBottom
      scrollToBottomComponent={scrollToBottomComponent}
      wrapInSafeArea
      renderAvatar={() => null}
      timeTextStyle={{
        left: { color: theme.colors.white },
        right: { color: theme.colors.white },
      }}
    />
  );
};
