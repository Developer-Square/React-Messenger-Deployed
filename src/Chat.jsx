import React, { useState, useEffect } from "react";
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
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import PageLoader from "./page-loader/PageLoader";

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

  if (loading) return <PageLoader />;
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
            <div className="message-slicer">
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

const MessagePopover = (props) => {
  let currentTarget = document.querySelector(`.${props.target}`)
  return (
    <Overlay
      show={props.show}
      target={currentTarget}
      placement="bottom"
      container={currentTarget}
      containerPadding={20}
    >
    <Popover id="popover-contained">
        <Popover.Title as="h3" className="text-dark" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }} onClick={props.onHide}>
            {props.title} 
            <span className="iconify" style={{ fontSize: '22px' }} data-icon="carbon:close" data-inline="false"></span>
        </Popover.Title>
        <Popover.Content>
            {props.content}
        </Popover.Content>
    </Popover>
  </Overlay>
  )
}

const Chat = () => {
  const [state, setState] = useState({
    user: "Ryan",
    content: "",
  });
  const [show, setShow] = useState(false)
  const [messagePopover, setMessagePopover] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

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

  const onHide = () => {
    setShow(false)
    setMessagePopover(!messagePopover)
  }

  return (
    <Container style={{ marginBottom: "2em", marginTop: "2em" }}>
      <div className="message-container">
        <MessagePopover show={messagePopover} title='Chat' content='Now tell a friend to do the same and start chating. You can also click your messages to delete them.' onHide={onHide} target='message-container'/>
        <Messages user={state.user} />
        <Row className="mx-auto" style={{ marginTop: "1rem" }}>
            <Col xs={2} style={{ padding: 0 }}>
              <div className="name-field">
                <MessagePopover title='Username' content='Add your name in this field.' show={show} target='name-field' onHide={onHide}/>
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
              </div>
            </Col>
          <Col xs={8} className="message-input">
            <div className="message-field">
              <MessagePopover title='Message' content='Add your message in this field and then click send.' show={show} target='message-field' onHide={onHide}/>
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
            </div>
          </Col>
          <Col xs={2} style={{ padding: 0 }}>
            <Button onClick={() => onSend()} className="send-btn">
              Send
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default () => (
  <ApolloProvider client={client}>
    <Chat />
  </ApolloProvider>
);
