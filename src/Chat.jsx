import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Container, Row, Col, FormInput, Button } from "shards-react";

const link = new WebSocketLink({
  uri: `wss://react-messenger-backend-4.herokuapp.com/`,
  // uri: `ws:localhost:4000/`,
  options: {
    reconnect: true,
  },
});

const client = new ApolloClient({
  link,
  uri: "https://react-messenger-backend-4.herokuapp.com/",
  // uri: `http:localhost:4000/`,
  cache: new InMemoryCache(),
});

const POST_MESSAGES = gql`
  mutation($user: String!, $content: String!) {
    postMessage(user: $user, content: $content)
  }
`;

const DELETE_MESSAGE = gql`
  mutation($id: String!) {
    deleteMessage(id: $id)
  }
`;

const GET_MESSAGES = gql`
  subscription {
    messages {
      id
      content
      user
    }
  }
`;

const Messages = ({ user }) => {
  const { data, loading, error } = useSubscription(GET_MESSAGES);
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  if (loading) return <p>Loading....</p>;
  if (error) return <p>Error!</p>;
  if (!data) {
    return null;
  }

  const showButton = (e) => {
    let button = document.querySelectorAll(".delete");
    button.forEach((btn) => {
      btn.classList.toggle("show");
    });
  };

  const handleDelete = (id) => {
    deleteMessage({
      variables: { id },
    });
  };

  return (
    <>
      {data.messages.map(({ id, user: messageUser, content }) => (
        <div
          key={id}
          style={{
            display: "flex",
            justifyContent: user === messageUser ? "flex-end" : "flex-start",
            paddingBottom: "1em",
            paddingTop: "0.5em",
          }}
        >
          {user !== messageUser && (
            <div
              style={{
                height: 50,
                width: 50,
                marginRight: "0.5em",
                border: "2px solid #f4bb00",
                borderRadius: 25,
                textAlign: "center",
                fontSize: "18pt",
                paddingTop: 5,
              }}
            >
              {messageUser.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div
            key={id}
            onClick={user === messageUser ? (e) => showButton(e) : null}
            style={{
              background: user === messageUser ? "#58bf56" : "#e5e6ea",
              color: user === messageUser ? "white" : "black",
              padding: "1em",
              borderRadius: "1em",
              maxWidth: "56%",
            }}
          >
            {content}
          </div>
          {user === messageUser ? (
            <div className="delete" onClick={() => handleDelete(id)}>
              <div className="delete-btn">
                <span className="x-button">x</span>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};

const Chat = () => {
  const [state, setState] = React.useState({
    user: "Ryan",
    content: "",
  });

  const [postMessage] = useMutation(POST_MESSAGES);

  const onSend = () => {
    if (state.content.length > 0) {
      postMessage({
        variables: state,
      });
    }

    setState({
      ...state,
      content: "",
    });
  };

  return (
    <Container style={{ marginBottom: "2em" }}>
      <Messages user={state.user} />
      <Row className="mx-auto">
        <Col xs={2} style={{ padding: 0 }}>
          <FormInput
            label="User"
            value={state.user}
            onChange={(evt) =>
              setState({
                ...state,
                user: evt.target.value,
              })
            }
          />
        </Col>
        <Col xs={8}>
          <FormInput
            label="User"
            value={state.content}
            onChange={(evt) =>
              setState({
                ...state,
                content: evt.target.value,
              })
            }
            onKeyUp={(evt) => {
              if (evt.keyCode === 13) {
                onSend();
              }
            }}
          />
        </Col>
        <Col xs={2} style={{ padding: 0 }}>
          <Button onClick={() => onSend()} style={{ width: "100%" }}>
            Send
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
