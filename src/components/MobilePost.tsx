import React, { useState } from "react";
// import { Post } from "./posts/NormalPost";
import type { PostType } from "../components/posts/index";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import { FaPoll } from "react-icons/fa";
import { RiImage2Fill } from "react-icons/ri";
import { IoSend, IoLink } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";

export const MobilePost: React.FC = () => {
  const [isPostBoxVisible, setIsPostBoxVisible] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPostBoxClosing, setIsPostBoxClosing] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: 1,
      author: "Bob",
      content: "What do you think about the new social media regulations?",
      timestamp: "5 hours ago",
      type: "normal",
    },
  ]);

  const handleMessageClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsMessageVisible(false);
      setIsPostBoxVisible(true);
      setIsAnimating(false);
    }, 300); // Duration of fade-out animation
  };

  const handleClosePostBox = () => {
    setIsPostBoxClosing(true);
    setTimeout(() => {
      setIsPostBoxVisible(false);
      setIsMessageVisible(true);
      setIsPostBoxClosing(false);
    }, 300); // Duration of slide-down animation
  };

  const PostBox = () => {
    const [postText, setPostText] = useState("");
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-50 w-full bg-rixa-dark shadow-lg border-t border-rixa-blue/20 p-4 transition-transform duration-900 ease-in-out ${
        isPostBoxClosing ? 'translate-y-full' : 'translate-y-0 animate-in slide-in-from-bottom-5'
      }`}>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-rixa-cream font-semibold">Nova Rixa</h3>
            <button
              onClick={handleClosePostBox}
              className="text-rixa-cream/60 hover:text-rixa-cream transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="w-full bg-rixa-dark-shadow rounded-lg flex items-center space-x-2 px-4 py-2 mb-4">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              className="w-full p-2 text-rixa-blue font-bold bg-transparent border-none rounded-lg focus:outline-none focus:border-rixa-cream/50 text-lg resize-none min-h-[3rem] max-h-40 overflow-y-auto"
              placeholder="Digite sua rixa"
              rows={2}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
                <FaPoll size={20} />
              </button>
              <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
                <RiImage2Fill size={20} />
              </button>
              <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
                <IoLink size={20} />
              </button>
              <button className="flex items-center gap-2 text-sm text-rixa-cream/60 hover:text-rixa-red transition-colors">
                <HiOutlineEmojiHappy size={20} />
              </button>
            </div>
            <button
              className="bg-rixa-blue text-rixa-cream px-4 py-2 rounded-lg hover:bg-rixa-blue/80 transition-colors flex items-center gap-2"
              onClick={() => {
                if (postText.trim()) {
                  setPosts([
                    {
                      id: posts.length + 1,
                      author: "You",
                      content: postText,
                      timestamp: "Just now",
                      type: "normal",
                    },
                    ...posts,
                  ]);
                  setPostText("");
                  handleClosePostBox();
                }
              }}
            >
              <IoSend size={18} />
              Enviar
            </button>
          </div>
        </div>
      </div>
    );
  };

  //   const RenderPost = ({ post }: { post: PostType }) => {
  //     switch (post.type) {
  //       case "normal":
  //         return (
  //           <Post
  //             key={post.id}
  //             author={post.author}
  //             content={post.content}
  //             timestamp={post.timestamp}
  //           />
  //         );
  //       default:
  //         return null;
  //     }
  //   };

  return (
    <>
      {isMessageVisible && (
        <div 
          className={`bg-rixa-blue p-3 rounded-full flex justify-center items-center shadow-lg cursor-pointer transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleMessageClick}
        >
          <MdOutlineMessage size={30} color="#FCF6F5FF" />
        </div>
      )}
      
      {isPostBoxVisible && <PostBox />}
    </>
  );
};
