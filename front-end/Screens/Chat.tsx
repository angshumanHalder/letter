import React, { useCallback, useState, useEffect } from "react";
import { View } from "react-native";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../CustomProperties/Theme";
import { ChatScreenRouteProp } from "../types/navigationtypes";
import { CHATS, ME } from "../utils/constants";
import { getValueFor, save } from "../utils/secureStorage";

interface ChatProps {
  route: ChatScreenRouteProp;
}

export const Chat: React.FC<ChatProps> = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState("");

  useEffect(() => {
    (async function () {
      const storedMyId = await getValueFor(ME);
      setMyId(storedMyId as string);
      const storedMessages = await getValueFor(
        `${CHATS}${route.params.userId}${storedMyId}`
      );
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        setMessages(parsedMessages);
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      (async () => {
        await save(
          `${CHATS}${route.params.userId}${myId}`,
          JSON.stringify(messages)
        );
      })();
    };
  });

  const onSend = useCallback((messages = []) => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, messages));
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
    />
  );
};
