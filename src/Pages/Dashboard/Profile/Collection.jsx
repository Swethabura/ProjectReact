import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  List,
  Spin,
  Typography,
  Button,
  message,
} from "antd";
import {
  fetchUserCollection,
  unsaveAnswer,
  unsavePost,
  fetchAnswersByIds,
} from "../../redux/userCollectionSlice";
import { fetchPosts, fetchQuestions } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Collection = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  // Redux state for collections
  const collection = useSelector((state) => state.userCollection);
  const {
    collectionLoading,
    collectionError,
    savedPosts,
    savedAnswers,
    myPosts,
    myAnswers,
    myQuestions,
  } = collection;

  // Redux state for posts and questions
  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);

  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
  } = useSelector((state) => state.questions);

  // Local state for fetched answers
  const [fetchedAnswers, setFetchedAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [errorAnswers, setErrorAnswers] = useState(null);

  const loggedInUser = localStorage.getItem("LoggedInUser");

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchUserCollection(loggedInUser)); // Fetch saved posts & my posts
      dispatch(fetchPosts()); // Fetch all posts
      dispatch(fetchQuestions()); // Fetch all questions
    }
  }, [dispatch, loggedInUser]);

  // Fetch answers when `myAnswers` is available
  useEffect(() => {
    if (myAnswers && myAnswers.length > 0) {
      setLoadingAnswers(true);
      setErrorAnswers(null);

      dispatch(fetchAnswersByIds(myAnswers))
        .unwrap()
        .then((answers) => {
          setFetchedAnswers(answers); // Store fetched answers in local state
        })
        .catch((err) => {
          setErrorAnswers(err); // Handle errors
        })
        .finally(() => {
          setLoadingAnswers(false); // Stop loading
        });
    } else {
      setFetchedAnswers([]); // Clear answers if no IDs are available
    }
  }, [dispatch, myAnswers]);

  // Filter myPosts and myQuestions
  const myFilteredPosts = posts?.filter((post) => myPosts?.includes(post._id));
  const myFilteredQuestions = questions?.filter((question) =>
    myQuestions?.includes(question._id)
  );

  // Handle loading and error states
  if (postsLoading || questionsLoading || collectionLoading || loadingAnswers) {
    return <Spin size="large" />;
  }

  if (postsError || questionsError || collectionError || errorAnswers) {
    return (
      <div>
        Error:{" "}
        {postsError?.message ||
          questionsError?.message ||
          collectionError?.message ||
          errorAnswers?.message}
      </div>
    );
  }

  // Handle unsave post
  const handleUnsave = (postId) => {
    dispatch(unsavePost({ accountUsername: loggedInUser, postId }))
      .unwrap()
      .then(() => {
        messageApi.success("Post removed from saved posts.");
      })
      .catch((error) => {
        messageApi.error(error || "Failed to remove post.");
      });
  };

  // Handle unsave answers
  const handleUnsaveAnswer = (answerId) => {
    dispatch(unsaveAnswer({ accountUsername: loggedInUser, answerId }))
      .unwrap()
      .then(() => {
        messageApi.success("Answer removed from saved answers.");
      })
      .catch((error) => {
        messageApi.error(error || "Failed to remove answer.");
      });
  };

  return (
    <div>
      {contextHolder}

      {/* Display Saved Posts */}
      <Card title="Saved Posts">
        {savedPosts && savedPosts.length > 0 ? (
          <List
            dataSource={savedPosts}
            renderItem={(post) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => navigate(`/main/post/${post._id}`)}
                  >
                    View Post
                  </Button>,
                  <Button type="link" onClick={() => handleUnsave(post._id)}>
                    Unsave
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`Saved from @${post?.user}`}
                  description={`${post?.content?.substring(0, 100)}...`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>No saved posts yet.</Paragraph>
        )}
      </Card>

      {/* Display Saved Answers */}
      <Card title="Saved Answers">
        {savedAnswers && savedAnswers.length > 0 ? (
          <List
            dataSource={savedAnswers}
            renderItem={(answer) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => navigate(`/main/post/${answer._id}`)}
                  >
                    View Answer
                  </Button>,
                  <Button
                    type="link"
                    onClick={() => handleUnsaveAnswer(answer._id)}
                  >
                    Unsave
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`Saved from @${answer?.user}`}
                  description={`${answer?.content?.substring(0, 100)}...`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>No saved answers yet.</Paragraph>
        )}
      </Card>

      {/* Display My Posts */}
      <Card title="My Posts">
        {myFilteredPosts && myFilteredPosts.length > 0 ? (
          <List
            dataSource={myFilteredPosts}
            renderItem={(post) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => navigate(`/main/post/${post._id}`)}
                  >
                    View Post
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`Posted by @${post.user}`}
                  description={`${post.content.substring(0, 100)}...`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>You haven’t created any posts yet.</Paragraph>
        )}
      </Card>

      {/* Display My Questions */}
      <Card title="My Questions">
        {myFilteredQuestions && myFilteredQuestions.length > 0 ? (
          <List
            dataSource={myFilteredQuestions}
            renderItem={(question) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => navigate(`/main/post/${question._id}`)}
                  >
                    View Question
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`Asked by @${question.user}`}
                  description={`${question.content.substring(0, 100)}...`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>You haven’t created any questions yet.</Paragraph>
        )}
      </Card>

      {/* Display My Answers */}
      <Card title="My Answers">
        {fetchedAnswers && fetchedAnswers.length > 0 ? (
          <List
            dataSource={fetchedAnswers}
            renderItem={(answer) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    onClick={() => navigate(`/main/post/${answer._id}`)}
                  >
                    View Question
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`Answered by @${answer.user}`}
                  description={`${answer.content.substring(0, 100)}...`}
                />
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>You haven’t answered any questions yet.</Paragraph>
        )}
      </Card>
    </div>
  );
};

export default Collection;