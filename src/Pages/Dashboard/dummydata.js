export const posts = [
  {
    id: 1,
    user: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "Just finished building my first full-stack project! 🚀 #React #NodeJS",
    likes: 10,
    comments: [
      { user: "Alice", text: "Awesome! Can you share the link?" },
      { user: "Bob", text: "Great job! 🔥" },
    ],
    likedBy:["John","Sirish"]
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "Struggling with Redux state management 😩. Any tips?",
    likes: 5,
    comments: [],
    likedBy:["John","Sirish"]
  },
];
