import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, List, Spin, Typography, Button, message, Row, Col } from "antd";
import {
  fetchUserCollection,
  fetchAnswersByIds,
} from "../../redux/userCollectionSlice";
import { fetchPosts, fetchQuestions } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Collection = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

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

  const [fetchedAnswers, setFetchedAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [errorAnswers, setErrorAnswers] = useState(null);
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [guestSavedPosts, setGuestSavedPosts] = useState([]);
  const [guestSavedAnswers, setGuestSavedAnswers] = useState([]);

  useEffect(() => {
    if (loggedInUser === "Guest") {
      const savedPostIds =
        JSON.parse(localStorage.getItem("guestSavedPosts")) || [];
      const savedAnswerIds =
        JSON.parse(localStorage.getItem("guestSavedAnswers")) || [];

      setGuestSavedPosts(
        posts?.filter((post) => savedPostIds.includes(post._id))
      );

      if (savedAnswerIds.length > 0) {
        setLoadingAnswers(true);
        dispatch(fetchAnswersByIds(savedAnswerIds))
          .unwrap()
          .then((answers) => setGuestSavedAnswers(answers))
          .catch((error) => setErrorAnswers(error))
          .finally(() => setLoadingAnswers(false));
      } else {
        setGuestSavedAnswers([]);
      }
    }
  }, [loggedInUser, posts, dispatch]);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchUserCollection(loggedInUser));
      dispatch(fetchPosts());
      dispatch(fetchQuestions());
    }
  }, [dispatch, loggedInUser]);

  useEffect(() => {
    if (myAnswers && myAnswers.length > 0) {
      setLoadingAnswers(true);
      dispatch(fetchAnswersByIds(myAnswers))
        .unwrap()
        .then(setFetchedAnswers)
        .catch(setErrorAnswers)
        .finally(() => setLoadingAnswers(false));
    } else {
      setFetchedAnswers([]);
    }
  }, [dispatch, myAnswers]);

  const myFilteredPosts = posts?.filter((post) => myPosts?.includes(post._id));
  const myFilteredQuestions = questions?.filter((question) =>
    myQuestions?.includes(question._id)
  );

  if (postsLoading || questionsLoading || collectionLoading || loadingAnswers) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (postsError || questionsError || collectionError || errorAnswers) {
    return (
      <Paragraph>Error loading content. Please try again later.</Paragraph>
    );
  }
  // If the user is a guest, use guestSavedPosts and guestSavedAnswers instead of savedPosts, savedAnswers
  const displayedSavedPosts =
    loggedInUser === "Guest" ? guestSavedPosts : savedPosts;

  const displayedSavedAnswers =
    loggedInUser === "Guest" ? guestSavedAnswers : savedAnswers;

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]}>
        {/* Saved Posts */}
        {/* Saved Posts */}
        <Col xs={24}>
          <Card
            title={
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--primary-color)",
                }}
              >
                Saved Posts
              </span>
            }
            style={{ marginTop: "10vh", background: "var(--card-bg-color)" }}
          >
            {displayedSavedPosts?.length > 0 ? (
              <List
                dataSource={displayedSavedPosts}
                renderItem={(post) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => navigate(`/main/post/${post._id}`)}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "var(--primary-color)",
                          }}
                        >
                          View Post
                        </span>
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >{`Saved from @${post?.user}`}</span>
                      }
                      description={
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "black",
                            fontWeight: "350",
                          }}
                        >{`${post?.content?.substring(0, 100)}...`}</span>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph
                style={{
                  color: "black",
                  fontWeight: "350",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                No saved posts yet.
              </Paragraph>
            )}
          </Card>
        </Col>

        {/* Saved Answers */}
        <Col xs={24}>
          <Card
            title={
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--primary-color)",
                }}
              >
                Saved Answers
              </span>
            }
            style={{ background: "var(--card-bg-color)" }}
          >
            {displayedSavedAnswers?.length > 0 ? (
              <List
                dataSource={displayedSavedAnswers}
                renderItem={(answer) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => navigate(`/main/post/${answer._id}`)}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "var(--primary-color)",
                          }}
                        >
                          View Answer
                        </span>
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >{`Saved from @${answer?.user}`}</span>
                      }
                      description={
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: "350",
                            color: "black",
                          }}
                        >{`${answer?.content?.substring(0, 100)}...`}</span>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph
                style={{
                  color: "black",
                  fontWeight: "350",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                No saved answers yet.
              </Paragraph>
            )}
          </Card>
        </Col>
        {/* My Posts */}
        <Col xs={24}>
          <Card
            title={
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--primary-color)",
                }}
              >
                My Posts
              </span>
            }
            style={{ background: "var(--card-bg-color)" }}
          >
            {myFilteredPosts?.length > 0 ? (
              <List
                dataSource={myFilteredPosts}
                renderItem={(post) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => navigate(`/main/post/${post._id}`)}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "var(--primary-color)",
                          }}
                        >
                          View Post
                        </span>
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >{`Posted by @${post.user}`}</span>
                      }
                      description={
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "black",
                            fontWeight: "350",
                          }}
                        >{`${post.content.substring(0, 100)}...`}</span>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph
                style={{
                  color: "black",
                  fontWeight: "350",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                You haven’t created any posts yet.
              </Paragraph>
            )}
          </Card>
        </Col>

        {/* My Questions */}
        <Col xs={24}>
          <Card
            title={
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--primary-color)",
                }}
              >
                My Questions
              </span>
            }
            style={{ background: "var(--card-bg-color)" }}
          >
            {myFilteredQuestions?.length > 0 ? (
              <List
                dataSource={myFilteredQuestions}
                renderItem={(question) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        onClick={() => navigate(`/main/post/${question._id}`)}
                      >
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "var(--primary-color)",
                          }}
                        >
                          View Question
                        </span>
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >{`Asked by @${question.user}`}</span>
                      }
                      description={
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            color: "black",
                            fontWeight: "350",
                          }}
                        >{`${question.content.substring(0, 100)}...`}</span>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph
                style={{
                  color: "black",
                  fontWeight: "350",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                You haven’t created any questions yet.
              </Paragraph>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Collection;
