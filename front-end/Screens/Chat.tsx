import React, { useCallback, useState, useEffect } from "react";
import { View } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { sendMessage } from "../actions/chat";
import { theme } from "../CustomProperties/Theme";
import { useAppDispatch, useAppSelector } from "../hooks/reducerHooks";
import { ChatScreenRouteProp } from "../types/navigationtypes";
import { CHATS, ME } from "../utils/constants";
import { getValueFor, save } from "../utils/secureStorage";

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
      setMessages(activeChat.messages);
    }
  }, [activeChat]);

  useEffect(() => {
    (async () => {
      const storedMyId = await getValueFor(ME);
      setMyId(storedMyId as string);
    })();
  }, []);

  // useEffect(() => {
  //   return () => {
  //     (async () => {
  //       await save(
  //         `${CHATS}${route.params.userId}${myId}`,
  //         JSON.stringify(messages)
  //       );
  //     })();
  //   };
  // });

  const onSend = useCallback((messages = []) => {
    GiftedChat.append;
    if (activeChatUserId && messages.length) {
      messages[0].createdAt = messages[0].createdAt.toString();
      dispatch(sendMessage(activeChatUserId, messages));
    }
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.colors.blue,
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
            color={theme.colors.blue}
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
    />
  );
};
